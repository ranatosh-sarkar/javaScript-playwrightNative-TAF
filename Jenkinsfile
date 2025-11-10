pipeline {
  agent any

  options {
    // keep logs tidy and fail fast if a stage fails
    timestamps()
    disableConcurrentBuilds()
    buildDiscarder(logRotator(numToKeepStr: '15'))
    timeout(time: 30, unit: 'MINUTES')
  }

  parameters {
    string(name: 'GREP', defaultValue: '', description: 'Playwright grep (e.g., "Sanity")')
    choice(name: 'PROJECT', choices: ['Chromium', 'Firefox'], description: 'Playwright project')
    booleanParam(name: 'HEADED', defaultValue: false, description: 'Run headed')
    string(name: 'ENV', defaultValue: 'QA', description: 'Framework ENV value')
    string(name: 'WORKERS', defaultValue: '4', description: 'Parallel workers')
  }

  environment {
    // expose to your framework (ConfigManager reads ENV)
    ENV = "${params.ENV}"
    PW_GREP = "${params.GREP}"
    PW_PROJECT = "${params.PROJECT}"
    PW_HEADED = "${params.HEADED}"
    PW_WORKERS = "${params.WORKERS}"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout([
          $class: 'GitSCM',
          branches: [[name: '*/master']],
          userRemoteConfigs: [[
            url: 'https://github.com/ranatosh-sarkar/javaScript-playwrightNative-TAF.git'
            // , credentialsId: 'github-creds-id'  // if private
          ]]
        ])
      }
    }

    stage('Set up Node & deps') {
      steps {
        // If you installed Node via NodeJS plugin, uncomment:
        // tool name must match "Node 18" you configured in Global Tools
        // nodejs('Node 18') {
        //   sh 'node -v && npm -v'
        //   sh 'npm ci'
        // }

        // Generic (Node already on PATH):
        sh 'node -v && npm -v'
        sh 'npm ci'

        // Install Playwright browsers (first time or if cache is fresh)
        sh 'npx playwright install --with-deps'
      }
    }

    stage('Test') {
      steps {
        script {
          def headedFlag = PW_HEADED.toBoolean() ? '--headed' : ''
          def grepFlag   = PW_GREP?.trim() ? "--grep '${PW_GREP}'" : ''
          sh """
            npx cross-env ENV=${ENV} \
              npx playwright test \
                ${grepFlag} \
                --project=${PW_PROJECT} \
                --workers=${PW_WORKERS} \
                ${headedFlag}
          """
        }
      }
      post {
        always {
          // Keep raw Playwright outputs
          archiveArtifacts artifacts: 'test-results/**', allowEmptyArchive: true
          archiveArtifacts artifacts: 'reports/html-report/**', allowEmptyArchive: true
          archiveArtifacts artifacts: 'allure-results/**', allowEmptyArchive: true
        }
      }
    }

    stage('Publish HTML report') {
      steps {
        publishHTML(target: [
          reportDir: 'reports/html-report',
          reportFiles: 'index.html',
          reportName: 'Playwright HTML Report',
          keepAll: true,
          alwaysLinkToLastBuild: true,
          allowMissing: true
        ])
      }
    }

    stage('Publish Allure') {
      steps {
        allure includeProperties: false,
               jdk: '',
               results: [[path: 'allure-results']]
      }
    }
  }

  post {
    always {
      echo 'Build completed (success/fail).'
    }
    success {
      echo '✅ Tests passed.'
    }
    unstable {
      echo '⚠️ Marked unstable.'
    }
    failure {
      echo '❌ Tests failed.'
    }
  }
}
