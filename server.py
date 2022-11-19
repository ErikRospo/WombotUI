#!/usr/bin/python3
import base64
import json
import os
import random
import sys
import threading
from http.client import NO_CONTENT, NOT_FOUND, OK
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

if len(sys.argv)>1:
    serverPort=int(sys.argv[1])
else:
    serverPort=8080
hostName = "localhost"
current_file=()
more=None
MAX_TRASH_ITEMS=10
def lookupstyle(num):
    s={}
    with open("./styles.json","rt") as f:
        s=json.load(f)
    for n in range(len(s)):
        if s[n]["id"]==num:
            return s[n]["name"]
def createMoreImages():
    os.system("node multirun.js > /dev/null")       
class ReqHandler(BaseHTTPRequestHandler):
    
    def do_GET(self):
        global current_file

        if self.path=="/new":
            self.send_response(OK)
            self.send_header("Content-type", "image/png")
            self.send_header("Cache-control","no-store")
        elif self.path.startswith("/current"):
            self.send_response(OK)
            self.send_header("Content-type", "text/plain")
            self.send_header("Cache-control","no-store")
        elif self.path=="/accept":
            self.send_response(NO_CONTENT)
            self.send_header("Cache-control","no-store")
        elif self.path=="/reject":
            self.send_response(NO_CONTENT)
            self.send_header("Cache-control","no-store")
            
        elif self.path=="/getleft":
            self.send_response(OK)
            self.send_header("Content-type", "text/plain")
            self.send_header("Cache-control","no-store")
            
        elif self.path=="/genmore":
            self.send_response(OK)
            self.send_header("Cache-control","no-store")
        elif self.path.startswith("/style/"):
            self.send_response(OK)
            self.send_header("Content-type", "text/plain")
        else:
            self.send_response(NOT_FOUND,"Page not found")
            self.send_header("Content-type","text/html")
        self.send_header("Access-Control-Allow-Origin","*")

        self.end_headers()
        if self.path=="/new":
        
            fp=""
            # TODO: whenever we try to read an image, and find that it doesn't exist, we want to call a function that will recalculate paths.txt
            # it will go through each line, and for each path, see if it exists. if it does, we keep it. if it doesn't, we discard it.
            with open("./generated/paths.txt","rt") as f:
                lines=f.readlines()
                fp=random.choice(lines).split(":")
            current_file=fp
            try:
                with open("./generated/unread/"+fp[0].removesuffix(" "),"rb") as f:
                    self.wfile.write(f.read())
            except:
                with open("./generated/paths.txt","rt") as f:
                    lines=f.readlines()
                lines.remove(current_file[0]+":"+current_file[1])
                with open("./generated/paths.txt","wt") as f:
                    f.writelines(lines)
                # TODO: catch infinite loop when there are no images left.
                with open("./generated/paths.txt","rt") as f:
                    lines=f.readlines()
                    fp=random.choice(lines).split(":")
                current_file=fp
                with open("./generated/unread/"+fp[0].removesuffix(" "),"rb") as f:
                    self.wfile.write(f.read())
        elif self.path=="/current/id":
            self.wfile.write(bytes(current_file[1],encoding="utf-8"))
        elif self.path=="/current/path":
            self.wfile.write(bytes(current_file[0],encoding="utf-8"))
        elif self.path=="/getleft":
            with open("./generated/paths.txt","rt") as f:
                lines=f.readlines()
            self.wfile.write(bytes(str(len(lines)),encoding="utf-8"))
        elif self.path=="/accept":
            if current_file!=None:
                fp=current_file[0]

                vals=json.loads(base64.decodebytes(current_file[1].encode("utf-8")).decode("utf-8"))
                newfp="./generated/accepted/"+lookupstyle(vals[1]).replace(" ","_").replace(".","")+"/"+vals[0].replace(" ","_").replace(".","").replace(",","-")+"/"
                os.makedirs(newfp,exist_ok=True)
                with open("./generated/paths.txt","rt") as f:
                    lines=f.readlines()
                    lines.remove(current_file[0]+":"+current_file[1])
                with open("./generated/paths.txt","wt") as f:
                    f.writelines(lines)
                with open(newfp+fp.removesuffix(" "),"wb") as f:
                    with open("./generated/unread/"+fp.removesuffix(" "),"rb") as last_one:
                        f.write(last_one.read())
                os.remove("./generated/unread/"+fp.removesuffix(" "))
        elif self.path=="/reject":
            if current_file!=None:
                fp=current_file[0]

                vals=json.loads(base64.decodebytes(current_file[1].encode("utf-8")).decode("utf-8"))
                newfp="./generated/rejected/"
                os.makedirs(newfp,exist_ok=True)
                with open("./generated/paths.txt","rt") as f:
                    lines=f.readlines()
                    lines.remove(current_file[0]+":"+current_file[1])
                with open("./generated/paths.txt","wt") as f:
                    f.writelines(lines)
                with open(newfp+fp.removesuffix(" "),"wb") as f:
                    with open("./generated/unread/"+fp.removesuffix(" "),"rb") as last_one:
                        f.write(last_one.read())
                os.remove("./generated/unread/"+fp.removesuffix(" "))
                if len(os.listdir("./generated/rejected/"))>MAX_TRASH_ITEMS:
                    print("Too many items, cleaning")
                    max_so_far=[os.stat(newfp+fp.removesuffix(" ")),newfp+fp.removesuffix(" ")]
                    for x in os.scandir("./generated/rejected/"):
                        if x.stat().st_ctime<max_so_far[0].st_ctime:
                            max_so_far=[x.stat(),x.path]
                    os.remove(x.path)

        elif self.path=="/genmore":
            global more
            if more!=None:
                if not more.is_alive():
                    more=threading.Thread(target=createMoreImages,daemon=True)
                    more.start()
                    self.wfile.write(b"Task started")
                else:
                    self.wfile.write(b"Task already in progress")
            else:                    
                more=threading.Thread(target=createMoreImages,daemon=True)
                more.start()
                self.wfile.write(b"Task started")
        elif self.path.startswith("/style/"):
            stylenum=int(self.path.split("/")[2])
            self.wfile.write(bytes(str(lookupstyle(stylenum)),encoding="utf-8"))

if __name__ == "__main__":        
    webServer = ThreadingHTTPServer((hostName, serverPort), ReqHandler)
    print("Server started http://%s:%s" % (hostName, serverPort))
    try:
        webServer.serve_forever()
    except KeyboardInterrupt:
        pass

    webServer.server_close()
    print("Server stopped.")
