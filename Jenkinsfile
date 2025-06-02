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
                // Change this line
                sh 'npm run test' // <-- Use npm run test
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