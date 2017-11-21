"""
Homie Monitor server
Provides a Web UI to administrate all your Homie devices.
"""
import atexit
import ConfigParser
import logging
import os
import signal
import sys
import time
from uuid import getnode as get_mac
import json

import paho.mqtt.client as mqtt
from bottle import route, run, static_file, abort, request

from firmwares import scan_firmwares, scan_firmware, compute_firmware_size
from localdb import LocalDB

# Names
APPNAME = os.path.splitext(os.path.basename(__file__))[0]
CONFIGFILE = os.path.join("src", "config.json")
DEVICEFILE = os.getenv('DEVICEFILE', "devices.json")
NODEFILE = os.getenv("NODEFILE", "nodes.json")
FIRMWAREFILE = os.getenv("FIRMWAREFILE", "firmwares.json")
SENTINEL_ID = "{:02x}".format(get_mac())

# Read the config file
CONFIG = json.load(open(CONFIGFILE, 'r'))

# Use ConfigParser to pick out the settings
DEBUG = CONFIG.get("global").get("debug")


def default_config(section, option, default):
    """Provide confing value with default"""
    if not CONFIG.has_key(section):
        return default
    elif not CONFIG.get(section).has_key(option):
        return default
    return CONFIG.get(section).get(option)


HOST = default_config("global", "host", "0.0.0.0")
PORT = default_config("global", "port", "8080")

MQTT_HOST = default_config("mqtt", "mqtt_host", "localhost")
MQTT_PORT = int(default_config("mqtt", "mqtt_port", 1883))
MQTT_KEEPALIVE = int(default_config("mqtt", "mqtt_keepalive", 60))
MQTT_USERNAME = default_config("mqtt", "mqtt_username", None)
MQTT_PASSWORD = default_config("mqtt", "mqtt_password", None)

SENSOR_PREFIX = default_config("homie", "device_prefix", "homie")
FIRMWARES_FOLDER = default_config("homie", "firmware_folder", "firmwares")

# Initialise logging
LOGFORMAT = '%(asctime)-15s %(levelname)-5s %(message)s'

if DEBUG:
    logging.basicConfig(level=logging.DEBUG, format=LOGFORMAT)
else:
    logging.basicConfig(level=logging.INFO, format=LOGFORMAT)

logging.info("Starting %s, ID: %s", APPNAME, SENTINEL_ID)
logging.debug("CONFIGFILE = %s", CONFIGFILE)

# MQTT client
mqtt_client = mqtt.Client("homie-%s-%s" % (APPNAME, SENTINEL_ID),
                          clean_session=True, userdata=None, protocol=mqtt.MQTTv311)

# Persisted inventory store
devices = LocalDB(os.path.join(".", DEVICEFILE))
nodes = LocalDB(os.path.join(".", NODEFILE))
firmwares = LocalDB(os.path.join(".", FIRMWAREFILE))


def exitus():
    """Managing proper exitint strategies"""
    logging.debug("Gracefuly shutting down MQTT connection...")
    mqtt_client.loop_stop()
    mqtt_client.disconnect()
    devices.close()
    nodes.close()
    firmwares.close()


atexit.register(exitus)
signal.signal(signal.SIGTERM, lambda number, stack: exitus())
signal.signal(signal.SIGHUP, lambda number, stack: exitus())


def on_connect(mosq, userdata, flags, result_code):
    """Called when the broker responds to our connection"""
    logging.info("Connected to MQTT broker at %s:%s", MQTT_HOST, MQTT_PORT)
    mqtt_client.subscribe("%s/+/+" % (SENSOR_PREFIX), 0)
    mqtt_client.subscribe("%s/+/+/+" % (SENSOR_PREFIX), 0)


def on_disconnect(mosq, userdata, result_code):
    """Called when disconnected from the broker"""
    reasons = {
        "0": "Connection Accepted",
        "1": "Connection Refused: unacceptable protocol version",
        "2": "Connection Refused: identifier rejected",
        "3": "Connection Refused: server unavailable",
        "4": "Connection Refused: bad user name or password",
        "5": "Connection Refused: not authorized",
    }
    if userdata:
        logging.debug("Userdata: %s", str(userdata))
    reason = reasons.get(result_code, "code={0}".format(result_code))
    logging.debug("Disconnected: %s", reason)


def on_message(mosq, userdata, message):
    """Called when a message has been received on a topic we have subscribed to"""
    logging.debug("MESSAGE %s: %s", str(message.topic), str(message.payload))

    payload = str(message.payload)
    if payload is "":
        return

    try:
        topic = str(message.topic)[len(SENSOR_PREFIX) + 1:]
        device_id, key = topic.split("/")
        if key.startswith("$"):                 # if key starts with '$'
            key = key[1:]                       # remove '$'

        device = devices[device_id] if device_id in devices else {}
        devices[device_id] = device

        if payload == "true" or payload == "false":
            payload = True if payload == "true" else False

        device[key] = payload

    except Exception as e:
        logging.error("Cannot extract data: for %s: %s",
                      str(message.topic), str(e))


def on_sensor(mosq, userdata, message):
    """Called for any property update on sensor attached to a device"""
    logging.debug("SENSOR %s: %s", str(message.topic), str(message.payload))

    payload = str(message.payload)
    if payload is "":
        return

    try:
        topic = str(message.topic)[len(SENSOR_PREFIX) + 1:]
        device_id, key, subkey = topic.split("/")
        device = devices[device_id]

        if key == "$fw":
            if subkey == "name":
                device["fwname"] = payload
            if subkey == "version":
                device["fwversion"] = payload
            return

        # Version of the Homie convention the device conforms to
        if key == "$homie":
            device["homie"] = payload

        if key == "$stats":
            if subkey == "signal":
                device["signal"] = int(payload)
            if subkey == "uptime":
                device["uptime"] = int(payload)
            return

        if device_id not in nodes:
            nodes[device_id] = {}

        subtopic = "{0}/{1}".format(key, subkey)
        nodes[device_id][subtopic] = payload

    except Exception as e:
        logging.error("Cannot extract data: for %s: %s",
                      str(message.topic), str(e))


def on_log(mosq, userdata, level, string):
    """Called for each message received when logging is activated"""
    logging.debug("%s: %s", level, string)


@route("/api")
def api_index():
    """API entry point"""
    return "200 OK"


@route("/api/devices")
def api_device_list():
    """Return the list of registered devices"""
    return devices


@route("/api/devices/<deviceid>", method="DELETE")
def api_device_delete(deviceid):
    """Delete a given device from registered one"""
    device = delete_device(deviceid)
    return {"devices": devices, "device": device}


@route("/api/nodes")
def api_nodes_list():
    """Return the list of nodes associated to registered devices"""
    return nodes


@route("/api/devices/<deviceid>/nodes")
def api_device_nodes_list(deviceid):
    """Return the list of nodes associated to a specific device"""
    return nodes[deviceid]


@route("/api/firmwares")
def api_firmware_list():
    """Return the list of firmwares available locally in the OTA server"""
    scan_firmwares(FIRMWARES_FOLDER, firmwares)
    firmwares.sync()
    return firmwares


@route("/api/firmwares", method="POST")
def api_upload_firmware():
    """Upload a firmware file to the firmwares folder"""
    upload = request.files.get('firmware')
    if not upload:
        return abort(500, {"ok": False, "error": "Upload error: mising firmware file from request"})

    name, ext = os.path.splitext(upload.filename)
    if ext not in ('.bin', '.zip'):
        return {"ok": False, "error": "Upload error: file extension '%s' not allowed." % ext}

    temp_filename = "%s-%s%s" % (name, time.time(), ext)
    upload.filename = temp_filename
    upload.save(FIRMWARES_FOLDER)

    firmware_info = {}
    scan_firmware(firmware_info, FIRMWARES_FOLDER, upload.filename, name, ext)

    if firmware_info.has_key("version") and firmware_info.has_key("name"):
        filename = upload.filename = "%s-%s%s" % (
            firmware_info["name"], firmware_info["version"], ext)

        if filename in firmwares:
            os.remove(os.path.join(FIRMWARES_FOLDER, temp_filename))
            return {"ok": False, "error": 'Upload error: firmware already exist.'}

        os.rename(os.path.join(FIRMWARES_FOLDER, temp_filename),
                  os.path.join(FIRMWARES_FOLDER, filename))

        firmware_info["filename"] = filename
        firmwares[filename] = firmware_info
        firmwares.sync()
        return {"ok": True, "firmwares": firmwares, "firmware": firmware_info}

    else:
        os.remove(os.path.join(FIRMWARES_FOLDER, temp_filename))
        return {"ok": False, "error": 'Upload error: missing version or name from firmware'}


@route("/api/firmwares/<firmware_name>", method="DELETE")
def api_delete_firmware(firmware_name):
    """Delete the corresponding firmware file"""
    for name, firmware in firmwares.iteritems():
        if name == firmware_name:
            os.remove(os.path.join(FIRMWARES_FOLDER, firmware['filename']))
            del firmwares[name]
            firmwares.sync()
            return {"ok": True, "firmwares": firmwares}

    return abort(404, {"ok": False, "error": "Firmware Not Found"})


@route("/api/firmwares/<firmware_filename>")
def api_download_firmware(firmware_filename):
    """Download the corresponding firmware file"""
    if firmware_filename not in firmwares:
        return abort(404, "Firmware Not Found")

    firmware = firmwares[firmware_filename]
    return static_file(firmware['filename'], root=FIRMWARES_FOLDER, download=firmware['filename'])


def delete_device(device_id):
    """Delete a device from MQTT retained messages"""
    mapping_keys = {
        "name": r"$name",
        "online": r"$online",
        "localip": r"$localip",
        "mac": r"$mac",
        "homie": r"$homie",
        "fwname": r"$fw/name",
        "fwversion": r"$fw/version",
        "implementation": r"$implementation",
        "signal": r"$stats/signal",
        "uptime": r"$stats/uptime",
    }
    for key in devices[device_id]:
        topic = "{0}/{1}/{2}".format(SENSOR_PREFIX,
                                     device_id, mapping_keys[key])
        mqtt_client.publish(topic, None, 1, True)

    for key in nodes[device_id]:
        topic = "{0}/{1}/{2}".format(SENSOR_PREFIX, device_id, key)
        mqtt_client.publish(topic, None, 1, True)

    remaining_keys = (r"$stats/interval", r"$stats/interval",
                      r"$fw/checksum", r"$implementation/ota/enabled")
    for key in remaining_keys:
        topic = "{0}/{1}/{2}".format(SENSOR_PREFIX, device_id, key)
        mqtt_client.publish(topic, None, 1, True)

    device = devices.pop(device_id, None)
    nodes.pop(device_id)
    devices.sync()
    nodes.sync()
    return device


def main():
    """Main function"""
    mqtt_client.on_connect = on_connect
    mqtt_client.on_disconnect = on_disconnect
    if DEBUG:
        mqtt_client.on_log = on_log

    mqtt_client.on_message = on_message
    mqtt_client.message_callback_add("%s/+/+/+" % (SENSOR_PREFIX), on_sensor)

    if MQTT_USERNAME:
        mqtt_client.username_pw_set(MQTT_USERNAME, MQTT_PASSWORD)

    logging.debug("Attempting connection to MQTT broker at {0}:{1:d}...".format(
        MQTT_HOST, MQTT_PORT))

    mqtt_client.connect_async(MQTT_HOST, MQTT_PORT, MQTT_KEEPALIVE)
    mqtt_client.loop_start()

    try:
        run(host=HOST, port=PORT, quiet=True)
    except:
        logging.info("Quitting due to unhandled execption...")
        raise


if __name__ == "__main__":
    try:
        main()
    except (KeyboardInterrupt, SystemExit):
        logging.info("ctrl-c quitting...")
        sys.exit(0)
