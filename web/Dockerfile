FROM python:3.13-alpine
RUN pip install gunicorn

COPY requirements.txt /opt/app/requirements.txt
WORKDIR /opt/app
RUN pip install -r requirements.txt

COPY . .
RUN pip install .

EXPOSE 5000

CMD ["gunicorn", "--config", "gunicorn_config.py", "app:app"]
