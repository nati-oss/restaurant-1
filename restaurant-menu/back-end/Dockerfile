FROM python:3.12-slim

LABEL maintainer="hise.dev.com"

ENV PYTHONUNBUFFERED=1

WORKDIR /app

EXPOSE 8000

# Install dependencies
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY requirements.txt /app/
RUN pip install --upgrade pip && \
    pip install -r /app/requirements.txt

# Create user
RUN adduser --disabled-password --no-create-home django-user

# Copy project
COPY . /app

# Fix permissions
RUN chown -R django-user:django-user /app

CMD ["python", "app/manage.py", "runserver", "0.0.0.0:8000"]

USER django-user