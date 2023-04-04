pipeline {
  agent any
environment {
    KUBECONFIG = "/home/sbm/.kube/kubeconfig"
    DOCKER_HUB_USERNAME= "firaschikhaoui"
    DOCKER_IMAGE_NAME = "test-front"
    DOCKER_IMAGE_TAG = "v7"
    //KUBERNETES_CA_CERTIFICATE = credentials('kube-certif')
  }
   stages {
    stage('Build Docker Image') {
      steps {
        script {
          docker.build("${DOCKER_HUB_USERNAME}/${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}")
        }
      }
    }  
   stage('Push Docker Image') {
      steps {
        script {
            withDockerRegistry([credentialsId: "docker-credentials", url: ""]) {
            sh "docker push ${DOCKER_HUB_USERNAME}/${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}"
            }
        }
      }
    }   
    stage('Deploy to Kubernetes') {
                    steps {
                    withCredentials([file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG')]){
                    //sh "cp $KUBERNETES_CA_CERTIFICATE /usr/local/share/ca-certificates/kube-ca.crt && update-ca-certificates"
                    sh "kubectl delete deployment front --kubeconfig=$KUBECONFIG"    
                    sh "kubectl apply -f deployment-service.yml --kubeconfig=$KUBECONFIG"  
        }     
        }
    }

  }
 }