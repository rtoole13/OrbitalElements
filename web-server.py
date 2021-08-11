import http.server
import socketserver

PORT = 8000

handler = http.server.SimpleHTTPRequestHandler
handler.extensions_map.update({
    ".js": "application/javascript",
})

with socketserver.TCPServer(("", PORT), handler) as httpd:
    print("Serving at port: {port}".format(port=PORT))
    print(handler.extensions_map[".js"])
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
            print("WARNING: Web server terminated by keyboard interrupt")
