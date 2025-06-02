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
                sh 'chmod +x node_modules/.bin/mocha'
                sh 'npx mocha --timeout 60000 --exit'
            }
        }
        stage('Code Quality') {
            steps {
                script {
                    // Use 'withSonarCloudEnv' for SonarCloud
                    // The 'credentialsId' must match the ID you gave your SonarCloud token in Jenkins Credentials
                    withSonarCloudEnv(ab4e731bceb3e9232ae31a3ad717bad0081601c1: 'sonarcloud-token') { // <--- IMPORTANT CHANGE
                        sh 'sonar-scanner'
                    }
                }
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