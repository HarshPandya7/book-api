pipeline {
    agent any

    environment {
        SONARQUBE_ENV = 'SonarQube'
        DOCKER_IMAGE_NAME = 'book-api'
        MONITORING_URL = 'http://localhost:3000/health'
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
                echo 'Running unit tests and generating JUnit report...'
                sh 'chmod +x ./node_modules/.bin/mocha'
                sh 'npm test'
            }
        }

        stage('Publish Test Report') {
            steps {
                echo 'Publishing JUnit test report...'
                junit 'test-results/results.xml'
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
