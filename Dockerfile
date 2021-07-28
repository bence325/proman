FROM python:3.8-slim-buster
ENV PYTHONUNBUFFERED=1
ENV FLASK_APP=main
ENV PSQL_USER_NAME=postgres
ENV PSQL_PASSWORD=postgres
ENV PSQL_HOST=0.0.0.0
ENV PSQL_DB_NAME=postgres
WORKDIR /app
COPY requirements.txt /app/
RUN apt-get update \
    && apt-get -y install libpq-dev gcc \
    && pip install psycopg2
RUN pip3 install -r requirements.txt
COPY . /app/
EXPOSE 5000
CMD [ "flask", "run", "-h", "0.0.0.0"]