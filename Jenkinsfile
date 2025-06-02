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
                    // *** THIS IS THE CRUCIAL CHANGE FOR SONARCLOUD ***
                    // It uses the SonarCloud Plugin to set up the environment
                    // 'credentialsId' refers to the ID of your Secret Text credential in Jenkins
                    withSonarCloudEnv(ab4e731bceb3e9232ae31a3ad717bad0081601c1: 'sonar-bookapi') { // <--- CHANGE THIS LINE
                        // Just run 'sonar-scanner' here. Jenkins will find it (if configured in Global Tool Config)
                        // and the 'withSonarCloudEnv' will set up SONAR_HOST_URL, SONAR_LOGIN, etc.
                        sh 'sonar-scanner' // <--- CHANGE THIS LINE
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