pipeline {
  agent any 
  stages {

      
stage('Build new image') {
	steps{
	sh "docker build -t firaschikhaoui/test-frontv3:latest ."    	              
         }
         }

stage('Push new image') {
	steps{
	withDockerRegistry([credentialsId: "docker-credentials", url: ""]) {
  	sh "docker push firaschikhaoui/test-frontv3:latest"
	}
	}
	}
stage('Deployment') {
	steps{  
        sh 'k apply -f deployment-service.yml' 
    }
}
  }
}
