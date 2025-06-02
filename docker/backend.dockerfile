# docker/backend.Dockerfile

FROM python:3.12-slim

WORKDIR /app

# Install only the wheel
COPY ../backend/dist/*.whl ./backend.whl
RUN pip install backend.whl

EXPOSE 5000
CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]
