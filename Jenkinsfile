pipeline {
    agent any

    environment {
        // Define a versão do Node.js (certifique-se de que coincide com o seu projeto)
        NODE_JS_HOME = tool 'node-22.12.0' // Nome configurado em Global Tool Configuration
        PATH = "${NODE_JS_HOME}/bin:${PATH}"
    }

    stages {
        stage('Ambiente') {
            steps {
                echo 'Verificando versões...'
                sh 'node -v'
                sh 'npm -v'
            }
        }

        stage('Instalar Dependências') {
            steps {
                echo 'Instalando node_modules...'
                // Usa 'npm ci' em vez de 'npm install' para ambientes de CI (mais rápido e limpo)
                sh 'npm ci'
            }
        }

        // stage('Lint & Testes') {
        //     steps {
        //         echo 'Rodando Lint...'
        //         sh 'npm run lint'

        //         echo 'Rodando Testes Unitários...'
        //         // --watch=false é crucial para o Jenkins não travar esperando interação
        //         // --no-sandbox é necessário se rodar dentro de containers/linux sem interface gráfica
        //         sh 'npm test -- --watch=false --browsers=ChromeHeadless'
        //     }
        // }

        stage('Build para Produção') {
            steps {
                echo 'Gerando build de produção...'
                sh 'npm run build -- --configuration=production'
            }
        }

        stage('Arquivar Artefatos') {
            steps {
                // Salva a pasta 'dist' no Jenkins para que você possa baixá-la depois
                archiveArtifacts artifacts: 'dist/**', allowEmptyArchive: false
                echo 'Build concluído com sucesso!'
            }
        }

        stage('Deploy (Opcional)') {
            steps {
                echo 'Caminho do deploy aqui...'
                // Exemplo: copiar para a pasta do Nginx local
                // sh 'sudo cp -R dist/nome-do-seu-projeto/* /var/www/html/'
            }
        }
    }

    post {
        always {
            cleanWs() // Limpa o workspace para não ocupar espaço no servidor
        }
        success {
            echo 'Pipeline finalizado com sucesso!'
        }
        failure {
            echo 'Opa! Algo deu errado no Pipeline. Verifique os logs.'
        }
    }
}
