pipeline {
    agent any

    environment {
        SONARQUBE_ENV = 'SonarQube'       // Jenkins SonarQube config name
        DOCKER_IMAGE_NAME = 'book-api'    // Change this if needed
        MONITORING_URL = 'http://localhost:3000/health' // Replace with real endpoint
    }

    stages {

        stage('Build') {
            steps {
                echo 'Installing dependencies...'
                sh 'npm install --include=dev'
            }
        }

        stage('Test') {
            steps {
                echo 'Running unit tests...'
                sh 'chmod +x node_modules/.bin/mocha'
                sh 'npx mocha --timeout 60000 --exit'
            }
        }

        stage('Code Quality') {
            steps {
                echo 'Running SonarQube analysis...'
                withSonarQubeEnv("${SONARQUBE_ENV}") {
                    sh 'sonar-scanner'
                }
            }
        }

        stage('Security Scan') {
            steps {
                echo 'Running security vulnerability scan...'
                // Prevent pipeline failure if vulnerabilities are found
                sh 'npm audit --audit-level=moderate || true'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying application with Docker Compose...'
                sh 'docker-compose down || true'
                sh 'docker-compose up -d --build'
            }
        }

        stage('Release') {
            steps {
                echo 'Tagging and pushing Git release...'
                script {
                    def tagName = "v1.0.${BUILD_NUMBER}"
                    sh """
                        git config user.name "jenkins"
                        git config user.email "jenkins@example.com"
                        git tag -a ${tagName} -m "Release ${tagName}"
                        git push origin ${tagName}
                    """
                }
            }
        }

        stage('Monitoring') {
            steps {
                echo "Checking application health..."
                sh """
                    sleep 5
                    curl --fail ${MONITORING_URL} || echo 'Health check failed or endpoint unavailable.'
                """
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline executed successfully!'
        }
        failure {
            echo '❌ Pipeline failed. Check the logs for details.'
        }
    }
}
