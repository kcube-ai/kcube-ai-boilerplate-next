FROM python:3.11

# Install required dependencies
RUN apt-get update && apt-get install -y curl ca-certificates gnupg
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install -y nodejs
RUN npm install -g pnpm

WORKDIR /code

# Copy files
COPY . .

# Install backend requirements
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Build frontend
WORKDIR /code/frontend
RUN pnpm install
RUN pnpm build

# Expose port
EXPOSE 8000

# Run the backend server
WORKDIR /code
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
