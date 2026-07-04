#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Lokális fejlesztői szerver — a Vercel cleanUrls viselkedését utánozza,
így a /emlektabla-keszites típusú linkek lokálisan is működnek.

Használat:  python local-server.py
Ezután:     http://localhost:8000
"""
import http.server
import os
import socketserver

PORT = 8000
ROOT = os.path.dirname(os.path.abspath(__file__))


class CleanURLHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def do_GET(self):
        path = self.path.split("?")[0].split("#")[0]
        fs_path = os.path.join(ROOT, path.lstrip("/"))
        # /valami -> /valami.html ha létezik
        if not os.path.exists(fs_path) and not path.endswith("/"):
            if os.path.exists(fs_path + ".html"):
                self.path = path + ".html"
        super().do_GET()


if __name__ == "__main__":
    with socketserver.TCPServer(("", PORT), CleanURLHandler) as httpd:
        print(f"Emlektabla.net lokális szerver: http://localhost:{PORT}")
        print("Leállítás: Ctrl+C")
        httpd.serve_forever()
