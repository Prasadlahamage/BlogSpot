pipeline {
    agent any

    environment {
        IMAGE_NAME = "next-blog"
    }

    stages {
        stage('Checkout') {
            steps {
                // Pull latest code from your repo
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install --legacy-peer-deps'
            }
        }

        stage('Build Application') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Build Docker Image') {
            steps {
                // Build Docker image using your Dockerfile
                sh "docker build -t ${IMAGE_NAME} ."
            }
        }

        stage('Test Docker Container') {
            steps {
                // Optional: run the container for testing locally
                sh "docker run -d -p 3000:3000 ${IMAGE_NAME}"
            }
        }
    }

    post {
        always {
            echo 'Build finished'
        }
    }
}
