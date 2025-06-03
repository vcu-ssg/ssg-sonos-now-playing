# docker/backend.Dockerfile

FROM python:3.12-slim

WORKDIR /app

# Install only the wheel
COPY ../backend/dist/ ./dist/
RUN pip install ./dist/*.whl

ENV FLASK_APP=backend.app
EXPOSE 5000
CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]
