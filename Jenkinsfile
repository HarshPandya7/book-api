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
                    // Use the NAME of the SonarQube server configuration you set up in Jenkins
                    // (e.g., 'LocalSonarQube' or 'SonarQube' if that's what you named it)
                    withSonarQubeEnv('SonarQube') { // <--- ENSURE THIS NAME MATCHES YOUR JENKINS CONFIG
                        // This 'sh 'sonar-scanner'' command will now work because:
                        // 1. withSonarQubeEnv sets up SONAR_HOST_URL and SONAR_LOGIN.
                        // 2. Global Tool Configuration ensures 'sonar-scanner' binary is on PATH.
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
