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
                    withSonarQubeEnv('SonarQube') {
                        sh """
                        docker run --rm \\
                          -e SONAR_HOST_URL=http://localhost:9000 \\
                          -e SONAR_LOGIN=ab4e731bceb3e9232ae31a3ad717bad0081601c1 \\
                          -v \$WORKSPACE:/usr/src \\
                          sonarsource/sonar-scanner-cli
                        """
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
