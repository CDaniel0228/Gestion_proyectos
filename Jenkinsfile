pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'gdp:latest'
        CONTAINER_NAME = 'gdp-contenedor'
    }

    stages {
        stage('Preparar') {
            steps {
                echo 'Preparando...'
                checkout scm
            }
        }
        stage('Construir Imagen') {
            steps {
                echo 'Construyendo la imagen Docker...'
                script {
                    docker.build("$DOCKER_IMAGE")
                }
            }
        }
        stage('Verificar Imagen') {
            steps {
                echo 'Verificando la imagen Docker...'
                script {
                    // Ejecutar la imagen en un contenedor
                    sh "docker run -d --name $CONTAINER_NAME $DOCKER_IMAGE"
                }
            }
        }
        stage('Parar Ejecución') {
            steps {
                echo 'Parando la ejecución del contenedor...'
                script {
                    sh "docker stop $CONTAINER_NAME"
                    sh "docker rm $CONTAINER_NAME"
                }
            }
        }
    }

    post {
        always {
            echo 'Limpieza...'
            //sh "docker rmi $DOCKER_IMAGE"
        }
        success {
            echo 'Pipeline ejecutado con éxito!'
        }
        failure {
            echo 'La ejecución del pipeline falló.'
        }
    }
}
