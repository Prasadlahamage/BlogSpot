pipeline {
    agent any

    environment {
        IMAGE_NAME = "Blogpost"
    }

    stages {
        stage('Checkout') {
            steps {
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
                // Call WSL to run Docker commands
                bat 'wsl docker build -t blogpost .'
            }
        }

        stage('Test Docker Container') {
            steps {
                // Run container in WSL
                bat 'wsl docker run -d -p 3000:3000 blogpost'
            }
        }
    }

    post {
        always {
            echo 'Build finished'
        }
    }
}
