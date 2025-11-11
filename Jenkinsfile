pipeline {
  agent any

  options {
    timestamps()
    disableConcurrentBuilds()
    buildDiscarder(logRotator(numToKeepStr: '15'))
    timeout(time: 30, unit: 'MINUTES')
  }

  parameters {
    string(name: 'GREP', defaultValue: '', description: 'Playwright grep (optional)')
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
        // ensure Allure CLI exists for local dev if ever used from npm
        bat 'npm ls allure-commandline || npm i -D allure-commandline'
      }
    }

    stage('Run tests') {
      steps {
        script {
          // Build flags (no skipping — we want to see failures too)
          def grepFlag    = env.PW_GREP?.trim() ? "--grep=\"${env.PW_GREP}\"" : ""
          def headedFlag  = (env.PW_HEADED?.toBoolean()) ? '--headed' : ''
          def workersFlag = "--workers=${params.WORKERS}"
          def projFlag    = "--project=${params.PROJECT}"

          // Do NOT fail the whole build on test failures
          catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
            bat """
              npx cross-env ENV=${env.ENV} ^
              npx playwright test ${grepFlag} ^
                ${projFlag} ^
                ${workersFlag} ^
                ${headedFlag} ^
                --reporter=line,html,allure-playwright
            """
          }
        }
      }
    }

    stage('Allure (plugin)') {
      steps {
        // Tell the plugin where raw allure-results are
        allure includeProperties: false,
               jdk: '',
               results: [[path: "${env.WORKSPACE}/allure-results"]]
      }
    }
  }

  post {
    always {
      // Keep artifacts for debugging
      archiveArtifacts artifacts: 'test-results/**',      allowEmptyArchive: true
      archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
      archiveArtifacts artifacts: 'allure-results/**',    allowEmptyArchive: true

      // Playwright’s built-in HTML (served by Jenkins HTML Publisher)
      publishHTML(target: [
        reportDir: 'playwright-report',
        reportFiles: 'index.html',
        reportName: 'Playwright HTML Report',
        keepAll: true, alwaysLinkToLastBuild: true, allowMissing: true
      ])
    }
    success { echo '✅ Pipeline finished (tests may contain failures – see reports).' }
    failure { echo '❌ Pipeline failed (see console + reports).' }
  }
}
