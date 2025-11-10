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
          // Skip the three flaky specs by title
          def skipRegex   = '(E2E Booking #1|E2E Booking #2|E2E Booking #3)'
          def invertFlag  = "--grep-invert \"${skipRegex}\""
          def headedFlag  = (env.PW_HEADED?.toBoolean()) ? '--headed' : ''
          def workersFlag = "--workers=${params.WORKERS}"
          def projFlag    = "--project=${params.PROJECT}"

          catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
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

    stage('Node setup & deps') {
  steps {
    bat 'node -v & npm -v'
    bat 'npm ci'
    bat 'npx playwright install'
    // Ensure Allure CLI is available for npx
    bat 'npm ls allure-commandline || npm i -D allure-commandline'
  }
}

stage('Build Allure HTML (npx)') {
  steps {
    script {
      // Don't let a reporting hiccup fail the pipeline
      catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
        // Use the npm package’s binary (works on Windows):
        bat 'npx allure-commandline generate allure-results --clean -o allure-report'
      }
    }
  }
}
  }

post {
  always {
    archiveArtifacts artifacts: 'test-results/**',      allowEmptyArchive: true
    archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
    archiveArtifacts artifacts: 'allure-results/**',    allowEmptyArchive: true
    archiveArtifacts artifacts: 'allure-report/**',     allowEmptyArchive: true

    // Playwright’s built-in HTML
    publishHTML(target: [
      reportDir: 'playwright-report',
      reportFiles: 'index.html',
      reportName: 'Playwright HTML Report',
      keepAll: true, alwaysLinkToLastBuild: true, allowMissing: true
    ])

    // Allure HTML (the generated site)
    publishHTML(target: [
      reportDir: 'allure-report',
      reportFiles: 'index.html',
      reportName: 'Allure Report',
      keepAll: true, alwaysLinkToLastBuild: true, allowMissing: true
    ])
  }
  success { echo '✅ Tests passed.' }
  failure { echo '❌ Tests failed.' }
}
}
