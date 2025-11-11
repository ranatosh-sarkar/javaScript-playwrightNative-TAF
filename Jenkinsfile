pipeline {
  agent any

  options {
    timestamps()
    disableConcurrentBuilds()
    buildDiscarder(logRotator(numToKeepStr: '15'))
    timeout(time: 30, unit: 'MINUTES')
  }

  parameters {
    string(name: 'GREP', defaultValue: '', description: 'Playwright grep')
    choice(name: 'PROJECT', choices: ['Chromium','Firefox'], description: 'Playwright project')
    booleanParam(name: 'HEADED', defaultValue: false, description: 'Run headed')
    string(name: 'ENV', defaultValue: 'QA', description: 'Framework ENV value')
    string(name: 'WORKERS', defaultValue: '4', description: 'Parallel workers')
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
        checkout([$class: 'GitSCM',
          branches: [[name: '*/master']],
          userRemoteConfigs: [[url: 'https://github.com/ranatosh-sarkar/javaScript-playwrightNative-TAF.git']]
        ])
      }
    }

    stage('Node setup & deps') {
      steps {
        bat 'node -v & npm -v'
        bat 'npm ci'
        bat 'npx playwright install'
        bat 'npm ls allure-commandline || npm i -D allure-commandline'
      }
    }

    stage('Run tests') {
      steps {
        script {
          def headedFlag  = (env.PW_HEADED?.toBoolean()) ? '--headed' : ''
          def workersFlag = "--workers=${params.WORKERS}"
          def projFlag    = "--project=${params.PROJECT}"
          def grepFlag    = env.PW_GREP?.trim() ? "--grep \"${env.PW_GREP}\"" : ''

          // Do NOT throw on non-zero — keep build SUCCESS even if tests fail.
          int code = bat returnStatus: true, label: 'Playwright',
            script: """
              npx cross-env ENV=${env.ENV} ^
              npx playwright test ${grepFlag} ^
                ${projFlag} ^
                ${workersFlag} ^
                ${headedFlag} ^
                --reporter=line,html,allure-playwright
            """
          if (code != 0) {
            echo "Playwright exited with ${code}. Tests failed, but build will remain SUCCESS so reports can publish."
          }
        }
      }
    }

    stage('Allure (plugin)') {
      steps {
        // Point the plugin to raw results; it will generate the HTML.
        allure includeProperties: false,
               jdk: '',
               results: [[path: "${env.WORKSPACE}/allure-results"]]
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: 'test-results/**',      allowEmptyArchive: true
      archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
      archiveArtifacts artifacts: 'allure-results/**',    allowEmptyArchive: true
      archiveArtifacts artifacts: 'allure-report/**',     allowEmptyArchive: true

      publishHTML(target: [
        reportDir: 'playwright-report',
        reportFiles: 'index.html',
        reportName: 'Playwright HTML Report',
        keepAll: true, alwaysLinkToLastBuild: true, allowMissing: true
      ])
    }
    success { echo '✅ Pipeline SUCCESS (some tests may have failed; see reports).' }
  }
}
