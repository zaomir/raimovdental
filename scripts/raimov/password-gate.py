#!/usr/bin/env python3
"""Minimal password-only session gate for private RAIMOV strategy routes.

Secrets are supplied by systemd EnvironmentFile and never stored in Git.
"""
from __future__ import annotations

import hmac
import html
import os
from http import HTTPStatus
from http.cookies import SimpleCookie
from urllib.parse import parse_qs, quote, urlparse
from wsgiref.simple_server import make_server

PASSWORD = os.environ["RAIMOV_PASSWORD"]
SESSION_TOKEN = os.environ["RAIMOV_SESSION_TOKEN"]
COOKIE_NAME = "raimov_strategy_session"


def safe_next(raw: str | None) -> str:
    value = raw or "/ru/"
    return value if value.startswith("/ru/") else "/ru/"


def page(error: bool, next_path: str) -> bytes:
    message = '<p class="error">Неверный пароль</p>' if error else ""
    return f"""<!doctype html><html lang=\"ru\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><meta name=\"robots\" content=\"noindex,nofollow,noarchive,nosnippet\"><title>Доступ к стратегии RAIMOV DENTAL</title><style>html{{color-scheme:light}}*{{box-sizing:border-box}}body{{margin:0;min-height:100vh;display:grid;place-items:center;background:#f3f0e8;color:#132126;font-family:Inter,system-ui,sans-serif}}main{{width:min(92vw,420px);padding:32px;border:1px solid rgba(19,33,38,.16);border-radius:24px;background:#fffdf8;box-shadow:0 18px 54px rgba(31,45,49,.08)}}p{{color:#637077}}label{{display:block;font-weight:800;margin:24px 0 8px}}input{{width:100%;font:inherit;padding:14px 16px;border:1px solid rgba(19,33,38,.24);border-radius:12px}}button{{width:100%;margin-top:14px;padding:14px 16px;border:0;border-radius:12px;background:#132126;color:white;font:800 1rem Inter,system-ui,sans-serif;cursor:pointer}}.error{{color:#a7443d;font-weight:800}}</style></head><body><main><strong>RAIMOV DENTAL</strong><h1>Карта стратегии</h1><p>Введите пароль для доступа.</p>{message}<form method=\"post\" action=\"/_raimov_login\"><input type=\"hidden\" name=\"next\" value=\"{html.escape(next_path, quote=True)}\"><label for=\"password\">Пароль</label><input id=\"password\" name=\"password\" type=\"password\" inputmode=\"numeric\" autocomplete=\"current-password\" required autofocus><button type=\"submit\">Открыть стратегию</button></form></main></body></html>""".encode()


def app(environ, start_response):
    path = environ.get("PATH_INFO", "/")
    method = environ.get("REQUEST_METHOD", "GET")
    if path == "/check":
        cookie = SimpleCookie(environ.get("HTTP_COOKIE", ""))
        supplied = cookie.get(COOKIE_NAME)
        ok = bool(supplied and hmac.compare_digest(supplied.value, SESSION_TOKEN))
        status = HTTPStatus.NO_CONTENT if ok else HTTPStatus.UNAUTHORIZED
        start_response(f"{status.value} {status.phrase}", [("Cache-Control", "no-store")])
        return [b""]

    if path == "/login" and method == "GET":
        query = parse_qs(environ.get("QUERY_STRING", ""))
        target = safe_next(query.get("next", ["/ru/"])[0])
        body = page(query.get("error", ["0"])[0] == "1", target)
        start_response("200 OK", [("Content-Type", "text/html; charset=utf-8"), ("Cache-Control", "no-store")])
        return [body]

    if path == "/login" and method == "POST":
        size = min(int(environ.get("CONTENT_LENGTH") or 0), 4096)
        form = parse_qs(environ["wsgi.input"].read(size).decode("utf-8", "replace"))
        target = safe_next(form.get("next", ["/ru/"])[0])
        supplied = form.get("password", [""])[0]
        if hmac.compare_digest(supplied, PASSWORD):
            headers = [
                ("Location", target),
                ("Set-Cookie", f"{COOKIE_NAME}={SESSION_TOKEN}; Path=/; Max-Age=2592000; HttpOnly; Secure; SameSite=Strict"),
                ("Cache-Control", "no-store"),
            ]
            start_response("303 See Other", headers)
        else:
            start_response("303 See Other", [("Location", f"/_raimov_login?error=1&next={quote(target)}"), ("Cache-Control", "no-store")])
        return [b""]

    start_response("404 Not Found", [("Cache-Control", "no-store")])
    return [b"Not found"]


if __name__ == "__main__":
    with make_server("127.0.0.1", 8765, app) as server:
        server.serve_forever()
