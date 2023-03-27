pipeline {
  agent any 
  stages {

      
stage('Build new image') {
	steps{
	sh "docker build -t firaschikhaoui/test-front:latest ."    	              
         }
         }

stage('Push new image') {
	steps{
	withDockerRegistry([credentialsId: "docker-credentials", url: ""]) {
  	sh "docker push firaschikhaoui/test-front:latest"
	}
	}
	}
      
  }
}
