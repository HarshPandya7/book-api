// Jenkinsfile

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
                sh 'npx mocha --timeout 60000 --exit' // Mocha timeout handles the tests themselves
            }
        }
        stage('Code Quality') {
            steps {
                script {
                    // Use the NAME of the SonarQube server configuration you set up in Jenkins
                    // This name should match what you configured in Jenkins -> Manage Jenkins -> Configure System -> SonarQube servers
                    // (e.g., 'LocalSonarQube' if you named it that, or 'SonarQube' if you used the default)
                    withSonarQubeEnv('SonarQube') { // <--- Ensure this name matches your Jenkins config
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
                // Ensure Snyk is installed on your Jenkins agent or available via a tool config
                sh 'snyk test || true' // '|| true' makes the step pass even if Snyk finds vulnerabilities
            }
        }
        stage('Deploy') {
            steps {
                // Ensure docker and docker-compose are available on your Jenkins agent
                sh 'docker-compose up -d --build'
            }
        }
        stage('Release') {
            steps {
                echo 'Release stage placeholder - tag or push image here'
                // Example: sh 'docker tag my-image:latest my-registry/my-image:${BUILD_NUMBER}'
                // Example: sh 'docker push my-registry/my-image:${BUILD_NUMBER}'
            }
        }
        stage('Monitoring') {
            steps {
                echo 'Monitoring stage placeholder - integrate with Datadog or Prometheus'
            }
        }
    }
}
