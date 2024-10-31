# Universal KYC

## Prerequisites

- Install [Docker](https://docs.docker.com/get-docker/)

## Setup

1. **Clone the Repository**

   ```bash
      git clone https://github.com/sameer-cnetric-space/universal-kyc.git
      cd universal-kyc
   ```

2. **Build Docker Image**

   ```bash
      docker build -t your-app-name .
   ```

3. **Run Docker Container**

   ```bash
      docker run -p 3005:3005 your-app-name
   ```

## Access the Application

- Go to `http://localhost:3005` to view the app.

## Environment Variables

- Configure environment variables in `.env` file as needed.

## Usage

- This setup includes all dependencies and configurations necessary for running the application in Docker.
