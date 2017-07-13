import json, os, shutil

class LocalDB(dict):
    """Persistent dictionary as a local JSON file

    The dict is kept in memory, so the dictionary operations run as fast as
    a regular dictionary.

    Write to disk is delayed until close or sync using atomic updates.
    """

    def __init__(self, filename, flag='c', mode=None, *args, **kwds):
        self.flag = flag                    # r=readonly, c=create, or n=new
        self.mode = mode                    # None or an octal triple like 0644
        self.filename = filename
        if flag != 'n' and os.access(filename, os.R_OK):
            fileobj = open(filename, "r")
            with fileobj:
                self.load(fileobj)
        dict.__init__(self, *args, **kwds)

    def sync(self):
        """"Write dict to disk"""
        if self.flag == 'r':
            return
        filename = self.filename
        tempname = filename + '.tmp'
        fileobj = open(tempname, "w")
        try:
            self.dump(fileobj)
        except Exception:
            os.remove(tempname)
            raise
        finally:
            fileobj.close()
        shutil.move(tempname, self.filename)    # atomic commit
        if self.mode is not None:
            os.chmod(self.filename, self.mode)

    def close(self):
        self.sync()

    def __enter__(self):
        return self

    def __exit__(self, *exc_info):
        self.close()

    def dump(self, fileobj):
        json.dump(self, fileobj, separators=(",", ":"), indent=2)

    def load(self, fileobj):
        fileobj.seek(0)
        try:
            return self.update(json.load(fileobj))
        except Exception:
            raise ValueError("File not in a supported format")


if __name__ == '__main__':
    pass