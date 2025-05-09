FROM python:3.13-alpine AS builder
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

COPY requirements.txt /requirements.txt
RUN uv pip install --system --no-cache-dir --upgrade -r requirements.txt

ADD . /source
WORKDIR /source
RUN mkdir public
RUN python build.py

FROM nginx:alpine
COPY --from=builder /source/public /usr/share/nginx/html
COPY static/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
