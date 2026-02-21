pipeline {
    agent any

    environment {
        // Define a versão do Node.js configurada no Jenkins (Global Tool Configuration)
        NODE_JS_HOME = tool 'node-22.12.0'
        PATH = "${NODE_JS_HOME}/bin:${PATH}"

        // Endpoint interno do MinIO dentro da rede Docker
        MINIO_ENDPOINT = "http://minio:9000"

        // Nome do bucket onde os builds serão armazenados
        BUCKET_NAME = "accio-invest-front"
    }

    stages {

        stage('Ambiente') {
            steps {
                echo 'Verificando versões do ambiente...'
                sh 'node -v'
                sh 'npm -v'
                sh 'aws --version'
            }
        }

        stage('Instalar Dependências') {
            steps {
                echo 'Instalando dependências do projeto...'
                // Usa npm ci para garantir instalação limpa e reproduzível em ambiente CI
                sh 'npm ci'
            }
        }

        // stage('Lint & Testes') {
        //     steps {
        //         echo 'Executando Lint...'
        //         sh 'npm run lint'
        //
        //         echo 'Executando Testes Unitários...'
        //         // --watch=false evita que o Jenkins fique aguardando interação
        //         // Ajuste flags conforme sua stack (Angular/React/etc.)
        //         sh 'npm test -- --watch=false'
        //     }
        // }

        stage('Build para Produção') {
            steps {
                echo 'Gerando build de produção...'
                // Gera os arquivos finais na pasta dist/
                sh 'npm run build'
            }
        }

      // ESTA SUBINDO PARA O MINIO, ENTÃO NÃO É NECESSÁRIO ARQUIVAR NO JENKINS
        // stage('Arquivar Artefatos') {
        //     steps {
        //         // Salva a pasta dist dentro do Jenkins
        //         // Permite download manual do artefato se necessário
        //         archiveArtifacts artifacts: 'dist/**', allowEmptyArchive: false
        //         echo 'Artefatos arquivados com sucesso no Jenkins.'
        //     }
        // }

        stage('Upload para MinIO') {
          steps {
              echo 'Enviando build versionado para o MinIO...'

              withCredentials([usernamePassword(
                  credentialsId: 'minio-s3',
                  usernameVariable: 'AWS_ACCESS_KEY_ID',
                  passwordVariable: 'AWS_SECRET_ACCESS_KEY'
              )]) {

                  sh '''
                  BUILD_FOLDER=build-${BUILD_NUMBER}

                  aws s3 cp dist/ s3://${BUCKET_NAME}/$BUILD_FOLDER/ \
                    --recursive \
                    --endpoint-url ${MINIO_ENDPOINT}
                  '''
              }

              echo 'Upload concluído com sucesso.'
          }
      }
    }

    post {
        always {
            // Limpa workspace após execução para economizar espaço
            cleanWs()
        }
        success {
            echo 'Pipeline finalizado com sucesso!'
        }
        failure {
            echo 'Falha no pipeline. Verifique os logs para análise.'
        }
    }
}
