from http.server import BaseHTTPRequestHandler, HTTPServer
from http.client import OK,NO_CONTENT,NOT_FOUND
import json
import os,random,base64
hostName = "localhost"
serverPort = 8080
current_file=()
def lookupstyle(num):
    s={}
    with open("./styles.json","rt") as f:
        s=json.load(f)
    for n in range(len(s)):
        if s[n].get("id")==num:
            return s[n].get("name")
            
class Server(BaseHTTPRequestHandler):
    def do_GET(self):
        global current_file

        if self.path=="/new":
            self.send_response(OK)
            self.send_header("Content-type", "image/png")
        elif self.path.startswith("/current"):
            self.send_response(OK)
            self.send_header("Content-type", "text/plain")
        elif self.path=="/accept":
            self.send_response(NO_CONTENT)
        elif self.path=="/reject":
            self.send_response(NO_CONTENT)
        elif self.path=="/getleft":
            self.send_response(OK)
            self.send_header("Content-type", "text/plain")
        else:
            self.send_response(NOT_FOUND,"Page not found")
            self.send_header("Content-type","text/html")
        self.send_header("Access-Control-Allow-Origin","*")

        self.end_headers()
        if self.path=="/new":
            fp=""
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
                with open("./generated/paths.txt","rt") as f:
                    lines=f.readlines()
                    lines.remove(current_file[0]+":"+current_file[1])
                with open("./generated/paths.txt","wt") as f:
                    f.writelines(lines)
                os.remove("./generated/unread/"+fp.removesuffix(" "))
    
if __name__ == "__main__":        
    webServer = HTTPServer((hostName, serverPort), Server)
    print("Server started http://%s:%s" % (hostName, serverPort))

    try:
        webServer.serve_forever()
    except KeyboardInterrupt:
        pass

    webServer.server_close()
    print("Server stopped.")