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
      }
    }

    stage('Run tests') {
      steps {
        script {
          // Skip the known flaky titles
          def skipRegex   = '(E2E Booking #1|E2E Booking #2|E2E Booking #3|Verify Core UI elements)'
          def invertFlag  = "--grep-invert \"${skipRegex}\""
          def headedFlag  = (env.PW_HEADED?.toBoolean()) ? '--headed' : ''
          def workersFlag = "--workers=${params.WORKERS}"
          def projFlag    = "--project=${params.PROJECT}"

          // Do not fail the whole build; mark UNSTABLE so post steps run
          catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
            bat """
              npx cross-env ENV=${env.ENV} ^
              npx playwright test ${invertFlag} ^
                ${projFlag} ^
                ${workersFlag} ^
                ${headedFlag} ^
                --reporter=line,html,allure-playwright
            """
          }
        }
      }
    }
  }

  post {
    always {
      // Keep artifacts
      archiveArtifacts artifacts: 'test-results/**',      allowEmptyArchive: true
      archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
      archiveArtifacts artifacts: 'allure-results/**',    allowEmptyArchive: true

      // 1) Playwright’s built-in HTML
      publishHTML(target: [
        reportDir: 'playwright-report',
        reportFiles: 'index.html',
        reportName: 'Playwright HTML Report',
        keepAll: true, alwaysLinkToLastBuild: true, allowMissing: true
      ])

      // 2) Allure via Jenkins plugin (uses Manage Jenkins → Tools name: allure-2)
      allure(
        includeProperties: false,
        jdk: '',
        commandline: 'allure-2',
        results: [[path: 'allure-results']]
      )
    }
    success { echo '✅ Tests passed.' }
    unstable { echo '⚠️ Some tests failed, reports published.' }
    failure { echo '❌ Hard failure, check logs.' }
  }
}
