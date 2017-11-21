"""Scan local folders for firmwares"""
import logging
import os
import re
import zipfile
import hashlib
import json
import time

REGEX_HOMIE = re.compile(
    b"\x25\x48\x4f\x4d\x49\x45\x5f\x45\x53\x50\x38\x32\x36\x36\x5f\x46\x57\x25")
REGEX_NAME = re.compile(b"\xbf\x84\xe4\x13\x54(.+)\x93\x44\x6b\xa7\x75")
REGEX_VERSION = re.compile(b"\x6a\x3f\x3e\x0e\xe1(.+)\xb0\x30\x48\xd4\x1a")
REGEX_BRAND = re.compile(b"\xfb\x2a\xf5\x68\xc0(.+)\x6e\x2f\x0f\xeb\x2d")

REGEX_PYTHON_VERSION = r"^__version__ = ['\"]([^'\"]*)['\"]"
REGEX_PYTHON_DESC = r"^\"\"\"([^(?:\"\"\")]*)\"\"\""

REGEX_FILENAME_VERSION = re.compile(r"(.*)\-(\d+\.\d+\.\d+)")


def sizeof_fmt(num, suffix="B"):
    """Format file size in a human readable way"""
    for unit in ["", "K", "M", "G", "T", "P", "E", "Z"]:
        if abs(num) < 1024.0:
            return "%3.1f %s%s" % (num, unit, suffix)
        num /= 1024.0
    return "%.1f %s%s" % (num, "Y", suffix)


BUFFER_SIZE = 4096


def file_md5(path):
    """Calculate MD5 hash for a given file"""
    hash_md5 = hashlib.md5()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(BUFFER_SIZE), b""):
            hash_md5.update(chunk)
    return hash_md5.hexdigest()


def scan_esp_firmware(db, path, fw_file, fw_file_name, fw_file_ext, update=False):
    """Detect ESP compatible firmwares"""
    logging.debug("Scanning arduino compatible firmware %s", fw_file)
    db["type"] = "esp8266"

    with open(os.path.join(path, fw_file), "rb") as firmware_file:
        firmware_binary = firmware_file.read()
        regex_name_result = REGEX_NAME.search(firmware_binary)
        regex_version_result = REGEX_VERSION.search(firmware_binary)
        regex_brand_result = REGEX_BRAND.search(firmware_binary)
        if regex_name_result:
            db["name"] = regex_name_result.group(1).decode()
        if regex_version_result:
            db["version"] = regex_version_result.group(1).decode()
        if regex_brand_result:
            db["brand"] = regex_brand_result.group(1).decode()

    fw_file_name = os.path.splitext(fw_file)[0]
    fw_desc_path = os.path.join(path, "%s.txt" % fw_file_name)
    if os.path.isfile(fw_desc_path):
        with open(fw_desc_path, "r") as desc:
            db["description"] = desc.read()


def scan_bundle_firmware(db, path, fw_file, fw_file_name, fw_file_ext, update=False):
    """Scan desktop bundle compatible firmwares (python, javascript)"""
    logging.debug("Scanning bundle compatible firmware %s", fw_file)
    fw_path = os.path.join(path, fw_file)
    if not zipfile.is_zipfile(fw_path):
        logging.error("Invalid bundle zip file %s, skipping", fw_file)
        return
    with zipfile.ZipFile(fw_path, "r") as bundle:
        try:
            bundle.getinfo("main.py")
            # version detection
            main_as_text = bundle.read("main.py")
            version_result = re.search(
                REGEX_PYTHON_VERSION, main_as_text, re.M)
            if version_result:
                db["version"] = version_result.group(1)

            # description extraction
            description_result = re.search(
                REGEX_PYTHON_DESC, main_as_text, re.M)
            if description_result:
                db["description"] = description_result.group(1)
        except Exception:
            pass
        else:
            db["type"] = "python"

        try:
            bundle.getinfo("package.json")
            package = json.loads(bundle.read('package.json'))
            db["description"] = package["description"]
            db["version"] = package["version"]
        except Exception:
            pass
        else:
            db["type"] = "javascript"


FW_TYPES = {".bin": scan_esp_firmware,
            ".zip": scan_bundle_firmware
            }


def compute_firmware_size(db, path, fw_file):
    """Get firmware file size"""
    fw_path = os.path.join(path, fw_file)
    stat = os.stat(fw_path)
    db["human_size"] = sizeof_fmt(stat.st_size)
    db["checksum"] = file_md5(fw_path)


def scan_firmware(db, path, fw_file, file_name, file_ext, update=False):
    """Scan a given firmware file"""

    db["filename"] = fw_file
    if not update:
        db["uploaded_at"] = time.time()

    FW_TYPES[file_ext](db, path, fw_file,
                       file_name, file_ext, update)

    compute_firmware_size(db, path, fw_file)

    if "name" not in db:
        name_results = REGEX_FILENAME_VERSION.search(file_name)
        if name_results:
            db["name"] = name_results.group(1)
        else:
            db["name"] = file_name

    return db


def scan_firmwares(path, db):
    """Scan local firmware files"""

    for fw_file in os.listdir(path):
        fw_path = os.path.join(path, fw_file)
        if not os.path.isfile(fw_path):
            continue

        fw_file_name, fw_file_ext = os.path.splitext(fw_file)
        if fw_file_ext not in [".bin", ".zip"]:
            continue

        update = False
        if fw_file in db:
            firmware_info = db[fw_file]
            update = True
        else:
            firmware_info = {}

        scan_firmware(firmware_info, path, fw_file,
                      fw_file_name, fw_file_ext, update)

        if "version" in firmware_info or "name" in firmware_info:
            db[fw_file] = firmware_info
        else:
            logging.error(
                "Missing version or name for firmware file '%s'", fw_file)
