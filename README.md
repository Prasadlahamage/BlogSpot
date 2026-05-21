# BlogSpot 🚀

BlogSpot is a cloud-native blogging platform built with **Next.js**, **AWS DynamoDB**, **JWT Authentication**, **Docker**, and **Jenkins CI/CD**.

The application allows users to securely register, authenticate, create blog posts with images, browse content from other users, and manage their own posts. The primary goal of this project was to gain hands-on experience with AWS services, authentication mechanisms, containerization, and automated deployment pipelines.

---

## Features

- User Registration & Login
- JWT-Based Authentication
- Secure Password Hashing with bcrypt
- Create and Publish Blog Posts
- Image Upload Support
- View and Browse Posts
- Author-Based Post Deletion
- Responsive User Interface
- Automated CI/CD Pipeline using Jenkins
- Dockerized Deployment

---

## Tech Stack

| Layer | Technology |
|---------|------------|
| Frontend | Next.js, React |
| Backend | Next.js API Routes |
| Authentication | JWT, bcrypt |
| Database | AWS DynamoDB |
| Cloud | AWS IAM, DynamoDB |
| CI/CD | Jenkins |
| Containerization | Docker |
| Version Control | GitHub |

---

## Architecture

```text
Users
   │
   ▼
Next.js Application
   │
   ├── JWT Authentication
   ├── Blog APIs
   │
   ▼
AWS DynamoDB
(Users & Blogs)

GitHub
   │
   ▼
Jenkins Pipeline
   │
   ▼
Docker Build & Deployment
```

---

## AWS Services Used

### DynamoDB
- Stores user accounts
- Stores blog posts
- Provides scalable NoSQL persistence

### IAM
- Manages secure access to AWS resources
- Controls application permissions

---

## DevOps Highlights

- Dockerized application deployment
- Jenkins CI/CD pipeline automation
- Dependency validation and build verification
- Automated image creation and deployment workflow
- Environment-based configuration management

---

## Security

- JWT-based authentication
- Password hashing using bcrypt
- Protected API routes
- Author ownership validation before deletion
- Secure environment variable configuration

---

## Learning Outcomes

Through this project I gained practical experience with:

- AWS DynamoDB
- AWS IAM
- JWT Authentication
- Secure API Development
- Docker Containerization
- Jenkins CI/CD Pipelines
- Cloud-Based Application Deployment
- Full-Stack Development

---

## Future Improvements

- Post editing functionality
- User profiles
- Comment system
- AWS S3 image storage
- Terraform Infrastructure as Code
- CloudWatch monitoring
- Refresh token implementation

---

## Author

**Prasad Lahamage**

GitHub: https://github.com/Prasadlahamage