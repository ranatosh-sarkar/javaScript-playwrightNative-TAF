pipeline {
  agent any

  options {
    timestamps()
    disableConcurrentBuilds()
    buildDiscarder(logRotator(numToKeepStr: '15'))
    timeout(time: 30, unit: 'MINUTES')
  }

  parameters {
    string(name: 'GREP',    defaultValue: '',  description: 'Playwright grep (e.g., "Sanity")')
    choice(name: 'PROJECT', choices: ['Chromium','Firefox'], description: 'Playwright project')
    booleanParam(name: 'HEADED', defaultValue: false, description: 'Run headed')
    string(name: 'ENV',     defaultValue: 'QA', description: 'Framework ENV value')
    string(name: 'WORKERS', defaultValue: '4',  description: 'Parallel workers')
  }

  environment {
    ENV        = "${params.ENV}"
    PW_GREP    = "${params.GREP}"
    PW_PROJECT = "${params.PROJECT}"
    PW_HEADED  = "${params.HEADED}"
    PW_WORKERS = "${params.WORKERS}"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout([
          $class: 'GitSCM',
          branches: [[name: '*/master']],
          userRemoteConfigs: [[url: 'https://github.com/ranatosh-sarkar/javaScript-playwrightNative-TAF.git']]
        ])
      }
    }

    stage('Node setup & deps') {
      steps {
        // If you installed Node via the NodeJS plugin, wrap commands like:
        // nodejs('Node18') { bat 'node -v & npm -v' ; bat 'npm ci' }

        bat 'node -v & npm -v'
        bat 'npm ci'

        // Windows: DO NOT use --with-deps (Linux-only)
        bat 'npx playwright install'
      }
    }

    stage('Run tests') {
  steps {
    script {
      // Read from env/params (declarative)
      def headedFlag = (env.PW_HEADED?.toBoolean()) ? '--headed' : ''
      def grepTxt    = env.PW_GREP?.trim()
      def grepFlag   = grepTxt ? "--grep \"${grepTxt}\"" : ''

      bat """
        npx cross-env ENV=${env.ENV} ^
        npx playwright test ${grepFlag} ^
          --project=${params.PROJECT} ^
          --workers=${params.WORKERS} ^
          ${headedFlag} ^
          --reporter=line,html,allure-playwright
      """
    }
  }
  post {
    always {
      archiveArtifacts artifacts: 'test-results/**',        allowEmptyArchive: true
      archiveArtifacts artifacts: 'reports/html-report/**', allowEmptyArchive: true
      archiveArtifacts artifacts: 'allure-results/**',      allowEmptyArchive: true
    }
  }
}

    stage('Publish HTML Report') {
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
        script {
          try {
            allure includeProperties: false, jdk: '', results: [[path: 'allure-results']]
          } catch (e) {
            echo "Allure Jenkins plugin missing or misconfigured: ${e}"
          }
        }
      }
    }
  }

  post {
    always   { echo 'Build completed.' }
    success  { echo '✅ Tests passed.' }
    failure  { echo '❌ Tests failed.' }
  }
}
