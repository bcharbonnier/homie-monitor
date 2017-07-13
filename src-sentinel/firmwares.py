"""Scan local folders for firmwares"""
import logging
import os
import re
import zipfile
import hashlib

def sizeof_fmt(num, suffix="B"):
    """Format file size in a human readable way"""
    for unit in ["","K","M","G","T","P","E","Z"]:
        if abs(num) < 1024.0:
            return "%3.1f%s%s" % (num, unit, suffix)
        num /= 1024.0
    return "%.1f%s%s" % (num, "Y", suffix)

BUFFER_SIZE = 4096
def file_md5(path):
    """Calculate MD5 hash for a given file"""
    hash_md5 = hashlib.md5()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(BUFFER_SIZE), b""):
            hash_md5.update(chunk)
    return hash_md5.hexdigest()


def scan_esp_firmware(path, fw_file, db):
    """Detect ESP compatible firmwares"""
    logging.debug("Scanning arduino compatible firmware %s", fw_file)
    db["type"] = "esp8266"
    fw_file_name = os.path.splitext(fw_file)[0]
    fw_desc_path = os.path.join(path, "%s.txt" % fw_file_name)
    if os.path.isfile(fw_desc_path):
        with open(fw_desc_path, "r") as desc:
            db["description"] = desc.read()


def scan_bundle_firmware(path, fw_file, db):
    """Scan desktop bundle compatible firmwares (python, javascript)"""
    logging.debug("Scanning bundle compatible firmware %s", fw_file)
    fw_path = os.path.join(path, fw_file)
    if not zipfile.is_zipfile(fw_path):
        logging.error("Invalid bundle zip file %s, skipping", fw_file)
        return
    with zipfile.ZipFile(fw_path, "r") as bundle:
        try:
            bundle.getinfo("main.py")
        except Exception:
            pass
        else:
            db["type"] = "python"

        try:
            bundle.getinfo("package.json")
        except Exception:
            pass
        else:
            db["type"] = "javascript"


def scan_firmwares(path, db):
    """Scan local firmware files"""
    fw_types = {".bin": scan_esp_firmware,
                ".zip": scan_bundle_firmware
               }

    for fw_file in os.listdir(path):
        fw_path = os.path.join(path, fw_file)
        if not os.path.isfile(fw_path):
            continue

        fw_file_name, fw_file_ext = os.path.splitext(fw_file)
        if fw_file_ext not in [".bin", ".zip"]:
            continue

        regex = re.compile(r"(.*)\-(\d+\.\d+\.\d+)")
        regex_result = regex.search(fw_file_name)

        if not regex_result:
            logging.debug("Could not parse firmware details from %s, skipping", fw_file)
            continue

        firmware_info = db[fw_file] = {}

        firmware_info["filename"] = fw_file

        firmware = regex_result.group(1)
        version = regex_result.group(2)
        firmware_info["firmware"] = firmware
        firmware_info["version"] = version

        stat = os.stat(fw_path)
        firmware_info["human_size"] = sizeof_fmt(stat.st_size)

        firmware_info["checksum"] = file_md5(fw_path)

        fw_types[fw_file_ext](path, fw_file, firmware_info)
