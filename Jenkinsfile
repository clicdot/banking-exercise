pipeline {
    agent any
    
    environment {

        GITCOMMIT="${sh(returnStdout: true, script: 'git rev-parse --short HEAD')}"
    }

   stages {
        stage("Build Application Docker image") {

             
            steps {
                
                 sh 'echo "Building Docker image..."'                  
                 sh 'echo "Git commit Hash tag is: ${GITCOMMIT}"'
                 sh 'sudo docker login --username AWS -p $(aws ecr get-login-password --region us-east-1 ) https://462590291649.dkr.ecr.us-east-1.amazonaws.com'
                 sh 'sudo docker system prune -af'
                 sh 'sudo docker build -f ./docker/Dockerfile -t visaidemiaapi .'
                 sh 'sudo docker tag visaidemiaapi:latest 462590291649.dkr.ecr.us-east-1.amazonaws.com/visaidemiaapi:$GITCOMMIT'
                 sh 'sudo docker image push 462590291649.dkr.ecr.us-east-1.amazonaws.com/visaidemiaapi:$GITCOMMIT'
                 sh ' echo " Docker image build successfully complete..."'

            }
        }

        stage("Deploy Application") {

             
             

            steps {
                sh 'echo " Starting terraform-cloud pipeline trigger"'
                build job: 'VISA/terraform-cloud-deploy/visa-identity-dev-module_vpc', parameters: [string(name: 'git_commit_hash', value: "${GITCOMMIT}")]
                sh 'echo "Terraform-cloud pipeline trigger successfully complete"'
            }
        }
          

    }
    post { 
        always { 
            cleanWs()
        }
        success {
            sh ' echo "post: success" '
        }
        failure {
            sh ' echo " post: failure"'
        }
    }
}

