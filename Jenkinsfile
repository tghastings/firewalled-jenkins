properties(
  [buildDiscarder(
    logRotator(
      artifactDaysToKeepStr: '',
      artifactNumToKeepStr : '',
      daysToKeepStr        : '',
      numToKeepStr         : '5')
  ),
  [$class        : 'RebuildSettings',
  autoRebuild    : false,
  rebuildDisabled: false],
  pipelineTriggers([pollSCM('@annually')])]
)

node () {
  ansiColor('xterm') {
    stage ('checkout'){
      paGitCheckout('.','ssh://git@stash.issinc.com:7999/it/firewalled-jenkins.git','*/master')
    }

    stage ('build') {
      sh '''
        git checkout master
        npm install
        ./node_modules/grunt/bin/grunt bump-only:patch build
      '''
    }

    stage ('publish'){
      sh '''
        PACKAGE_VERSION = $(grep -m1 version package.json | awk -F: '{ print $2 }' | sed 's/[", ]//g')
        # check in bumped version number
        git add package.json
        git commit -m "Jenkins build: ${PACKAGE_VERSION}"
        git push origin master
        #check in app to release branch
        mkdir ../stage
        mv * ../stage
        mv .tmp ../stage
        git stash
        git checkout release
        rm -rf * .tmp
        mv ../stage/* .
        mv ../stage/.tmp .
        git add -A
        git commit -m "Jenkins: ${BUILD_URL}"
        git push origin release
        git tag ${PACKAGE_VERSION} release
        git push origin ${PACKAGE_VERSION}
      '''
    }
  }
}