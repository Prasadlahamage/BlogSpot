pipeline {
    agent any

    environment {
        IMAGE_NAME = "Blogpost/myblog"
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
                bat 'npm install --legacy-peer-deps'
            }
        }

        stage('Build Application') {
            steps {
                bat 'npm run build'
            }
        }

        stage('Build Docker Image') {
            steps {
                // Build Docker image using your Dockerfile
                sh "docker build -t "Blogpost" ."
            }
        }

        stage('Test Docker Container') {
            steps {
                // Optional: run the container for testing locally
                bat "docker run -d -p 3000:3000 "Blogpost""
            }
        }
    }

    post {
        always {
            echo 'Build finished'
        }
    }
}
