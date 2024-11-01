# Universal-KYC: Feature Overview

## Table of Contents

1. [Introduction](#introduction)
2. [User Management](#user-management)
3. [KYC Management](#kyc-management)
4. [Moderation Services](#moderation-services)
5. [Admin Management](#admin-management)
6. [Image Quality and Format Support](#image-quality-and-format-support)
7. [Rate Limiting](#rate-limiting)
8. [Metrics and Dashboard](#metrics-and-dashboard)
9. [Setup and Deployment](#setup-and-deployment)

---

## Introduction

Universal-KYC is a scalable, feature-rich KYC application designed for secure and efficient identity verification. This app utilizes a robust system for handling users, KYC data, image quality checks, and moderation algorithms, with a special focus on admin roles for management and auditing.

## User Management

- **Registration & Login**: Users can register and log in, receiving a JWT token for authentication.
- **User Profiles**: Users have a profile consisting of first name, last name, username, email, and gender.
- **Rate-Limited API Access**: Users have rate-limited API access (20 requests per 15 minutes, with a cooldown of 5 minutes).

## KYC Management

- **KYC Data Storage**: Each KYC entry includes details such as nationality, date of birth, ID type (e.g., Aadhaar, Passport), ID issue date, ID expiry date, address information, and document images.
- **KYC Submission with Joi Validation**: All KYC entries are validated using Joi to ensure data consistency.
- **File Upload and Storage**:
  - **Image Upload**: Users upload `selfie` and `document` images. These images are stored securely, with support for various formats (JPEG, PNG, WebP, HEIC).
  - **Image Format Handling**: JPG files are automatically converted to JPEG to prevent compatibility issues.
- **Single KYC Entry Retrieval**: Users can retrieve their KYC details.
- **KYC Pagination**: Users and admins can retrieve paginated KYC entries.
- **Status Updates**: Admins can update the KYC status (e.g., Verified, Pending, Rejected).

## Moderation Services

- **Face Recognition and Liveness Check**: The app integrates with an external Python service to ensure the uploaded selfie matches the document photo and passes liveness tests.
- **OCR Integration**: The document OCR service validates text data in the KYC document against the provided KYC data.
- **Automated Moderation Triggers**: Moderation checks are automatically triggered post-KYC submission and results are stored.
- **Moderation Details in Admin View**: Admins can view moderation details for each KYC, which helps ensure KYC compliance.

## Admin Management

- **Role-Based Access Control (RBAC)**: Admins are classified as `Super Admin`, `Moderator`, or `Viewer`, with permissions to manage KYC, view reports, and approve/reject KYC entries.
- **Admin Rate Limiting**: Admins have higher rate limits (100 requests per 15 minutes, with a 5-minute cooldown).
- **Comprehensive KYC Viewing**: Admins can view all KYC entries, including detailed moderation results and documents.
- **JWT-Based Authentication**: Admins receive JWT tokens on login, and their role and permissions are validated on every request.

## Image Quality and Format Support

- **Image Quality Check**: Integrated quality checks ensure the uploaded document and selfie images meet acceptable quality standards.
- **Supported Formats**: JPEG, JPG, PNG, WebP, and HEIC formats are supported, with auto-conversion for JPG files.

## Rate Limiting

- **User Rate Limiting**: 20 requests per 15 minutes with a 5-minute cooldown.
- **Admin Rate Limiting**: 100 requests per 15 minutes with a 5-minute cooldown.
- **Customizable Limits**: Rate limits can be adjusted for specific roles as the application scales.

## Metrics and Dashboard

- **Real-Time Metrics API**: A metrics API provides real-time data on total KYC submissions, approved KYC count, and rejected KYC count.
- **Dashboard Support**: The metrics API is designed for integration with a frontend dashboard to offer admins insights into KYC processing performance.

---

## Additional Information

- **API Documentation**: All endpoints are documented with request and response structures for easy integration.
- **Docker Support**: The app includes a Dockerfile for simplified deployment.
- **Scalability**: The app is designed for scalability, with modularized services for user, admin, and KYC management, making it easy to add new features and integrate additional services

## Setup and Deployment

## Prerequisites

- Install [Docker](https://docs.docker.com/get-docker/)

## Follow these steps

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

- Configure environment variables in `.env` file as needed. Refer `example.env` file for env sturcture.

## Usage

- This setup includes all dependencies and configurations necessary for running the application in Docker.
