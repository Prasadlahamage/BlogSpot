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

        stage('NPM Audit') {
            steps {
                script {
                    def status = bat(script: 'npm audit --audit-level=high', returnStatus: true)

                    if (status != 0) {
                        def userInput = input(
                            message: "Vulnerabilities detected! Do you want to continue the build?",
                            parameters: [choice(name: 'CONTINUE', choices: 'Yes\nNo', description: 'Continue?')]
                        )

                        if (userInput == 'No') {
                            error("Build aborted due to vulnerabilities")
                        } else {
                            echo "User chose to continue despite vulnerabilities."
                        }
                    } else {
                        echo "No high severity vulnerabilities found."
                    }
                }
            }
        }

        stage('Build Application') {
            steps {
                bat 'npm run build'
            }
        }

        stage('Build Docker Image') {
            steps {
                bat 'wsl docker build -t blogpost .'
            }
        }

        stage('Test Docker Container') {
            steps {
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
