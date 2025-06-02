pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                sh 'npm install'
            }
        }
        stage('Test') {
            steps {
                // Add this line to ensure execute permissions for mocha
                sh 'chmod +x node_modules/.bin/mocha'
                sh 'npx mocha --timeout 10000 --exit'
            }
        }
        stage('Code Quality') {
            steps {
                sh 'sonar-scanner'
            }
        }
        stage('Security') {
            steps {
                sh 'snyk test || true'
            }
        }
        stage('Deploy') {
            steps {
                sh 'docker-compose up -d --build'
            }
        }
        stage('Release') {
            steps {
                echo 'Release stage placeholder - tag or push image here'
            }
        }
        stage('Monitoring') {
            steps {
                echo 'Monitoring stage placeholder - integrate with Datadog or Prometheus'
            }
        }
    }
}