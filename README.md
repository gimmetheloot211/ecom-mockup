# Ecommerce Mockup
This project is an ecommerce mockup web application built with a microservices architecture.

## Technologies used
- **Backend:** Node.js, Express.js, Typescript, MongoDB, Mongoose
- **Frontend:** React.js, Typescript, SCSS
- **Infrastructure:** Docker and Docker Compose for containerization and multi-service orchestration

## Installation
### Requirements
- Docker and Docker Compose installed
- Node.js (for development)

### Steps
1. Clone the repository
```bash
git clone https://github.com/gimmetheloot211/ecom-mockup.git
```
2. Set up .env files according to .env.example's
3. Build and start the application using Docker Compose:
```bash
docker-compose up --build
```
4. Access the application
- **Frontend:** http://localhost:3000
- **Gateway API:** http://localhost:8000
