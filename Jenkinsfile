@Library("sharedlibrary") _
def commitId
pipeline {
    agent none
    environment {
        REPO = 'http://tfs.cybersoft4u.com.tw:8080/tfs/SDD/TIS/_git/CyberSoft.MiniTis.Web/commit/'

		ROBOT_RESULTS_PATH = "%WORKSPACE%\\robot_results"

		POSTGRES_CRED = credentials('4b4150c8-557e-477a-8402-6563b69e0fd5')
		DATA_SERVER = credentials('DATA_SERVER')

        DATA_UNC = '\\\\192.168.96.32\\Data' //UNC path of Data Server's share folder
        DATA_UNC_VPN = '\\\\10.8.0.7\\Data'
        ENABLE_NOTIFY = true //Set this flag to enable notification
        NOTIFY_SUCCESS_BRANCHES = 'master;develop' //Add branch names here to send success notification to Slack
        APPNAME = "CyberSoft.MiniTis.Web"
        APPPATH = "C:\\00_TIS\\01_Deploy"
    }
    stages {
        stage('DEV - Decide whether to execute Regression Test Critical Section'){
            when {
                not {
                    anyOf {
                        branch 'staging'
                        branch 'develop'
                    }
                }
            }
            stages {
                stage('DEV Regression Test Critical Section') {
                    options{
                        lock ('Regression_Test_MiniTIS_DEV')
                    }
                    stages {
                        stage('Deploy To AP_DEV_MiniTIS') {
                            agent {
                                label 'AP_DEV_MiniTIS'
                            }
                            steps {
                                // stop and remove pm2 service
                                bat "pm2 stop MiniTISWeb"
                                bat "pm2 delete MiniTISWeb"

                                // copy file to deploy path "${env.APPPATH}\\CyberSoft.MiniTis.Web"
                                bat """
                                xcopy CyberSoft.MiniTis.Web ${env.APPPATH}\\CyberSoft.MiniTis.Web /s /e /y
                                """

                                // modify config for dev env
                                ConfigForDevEnv();


                                // npm ci
                                bat """
                                cd ${env.APPPATH}\\CyberSoft.MiniTis.Web
                                npm install
                                """

                                // start pm2 service
                                bat """
                                cd ${env.APPPATH}\\CyberSoft.MiniTis.Web
                                pm2 start "C:\\Program Files\\nodejs\\node_modules\\npm\\bin\\npm-cli.js" --name MiniTISWeb -- run dev
                                """
                            }
                            post {
                                always {
                                    script{
                                        if(IsNotifySuccessBranch(env.BRANCH_NAME)){
                                            MiniTISNotifyMessage(commitId)
                                        }
                                    }
                                    cleanWs()
                                }
                            }
                        }
                        stage('Deploy FakeBackEndServer To AP_DEV_MiniTIS') {
                            agent {
                                label 'AP_DEV_MiniTIS'
                            }
                            options {
                                skipDefaultCheckout true
                            }
                            steps {
                                script {
                                    try {
                                        git poll: false, changelog: false, branch: env.BRANCH_NAME , credentialsId: '0e41ffcb-9560-4c8b-9208-cd2f59bc3486', url: 'http://tfs.cybersoft4u.com.tw:8080/tfs/SDD/TIS/_git/FakeBackEndServer'
                                    } catch (e) {
                                        echo "Branch ${env.BRANCH_NAME} does not exist in FakeBackEndServer, checkout branch develop"
                                        git poll: false, changelog: false, branch: "develop" , credentialsId: '0e41ffcb-9560-4c8b-9208-cd2f59bc3486', url: 'http://tfs.cybersoft4u.com.tw:8080/tfs/SDD/TIS/_git/FakeBackEndServer'
                                    }
                                }
                                // See the readme.md under app folder to see how to deploy it on IIS
                                bat """
                                rmdir /s /q %userprofile%\\fake_backend_server
                                xcopy /E /I /Y /H %WORKSPACE% %userprofile%\\fake_backend_server
                                py "Z:\\tools\\scripts\\cmp_two_dirs.py" "%WORKSPACE%" "%userprofile%\\fake_backend_server"
                                """
                            }
                        }
                        stage('Make MiniTIS FrontEnd Connect To FakeBackEndServer') {
                            agent {
                                label 'AP_DEV_MiniTIS'
                            }
                            options {
                                skipDefaultCheckout true
                            }
                            steps {
                                bat "%windir%\\system32\\inetsrv\\appcmd stop site CyberSoft.MiniTis.WebApi || exit 0"
                                bat "%windir%\\system32\\inetsrv\\appcmd start site FakeBackEndServer || exit 0"
                            }
                        }
                        stage('DEV Test Machine - New Feature Web Test') {
                            agent {
                                label 'CLOUD_TIS_DEV_TEST'
                            }
                            options {
                                skipDefaultCheckout true
                            }
                            steps {
                                script {
                                    try {
                                        git poll: false, changelog: false, branch: env.BRANCH_NAME , credentialsId: '0e41ffcb-9560-4c8b-9208-cd2f59bc3486', url: 'http://tfs.cybersoft4u.com.tw:8080/tfs/SDD/TIS/_git/CyberSoft.MiniTis.Testing'
                                    } catch (e) {
                                        echo "Branch ${env.BRANCH_NAME} does not exist in CyberSoft.MiniTis.Testing, checkout branch develop"
                                        git poll: false, changelog: false, branch: "develop" , credentialsId: '0e41ffcb-9560-4c8b-9208-cd2f59bc3486', url: 'http://tfs.cybersoft4u.com.tw:8080/tfs/SDD/TIS/_git/CyberSoft.MiniTis.Testing'
                                    }
                                    RunWebTest("dev", "Windows", ["Chrome"], "robotSample", "newFeature")
                                }
                            }
                        }
                        stage('Make MiniTIS FrontEnd Connect To RealBackEndServer') {
                            agent {
                                label 'AP_DEV_MiniTIS'
                            }
                            options {
                                skipDefaultCheckout true
                            }
                            steps {
                                bat "%windir%\\system32\\inetsrv\\appcmd stop site FakeBackEndServer || exit 0"
                                bat "%windir%\\system32\\inetsrv\\appcmd start site CyberSoft.MiniTis.WebApi || exit 0"
                            }
                        }
                        stage('DEV Test Machine - Stable Feature Web Test') {
                            agent {
                                label 'CLOUD_TIS_DEV_TEST'
                            }
                            options {
                                skipDefaultCheckout true
                            }
                            steps {
                                script {
                                    try {
                                        git poll: false, changelog: false, branch: env.BRANCH_NAME , credentialsId: '0e41ffcb-9560-4c8b-9208-cd2f59bc3486', url: 'http://tfs.cybersoft4u.com.tw:8080/tfs/SDD/TIS/_git/CyberSoft.MiniTis.Testing'
                                    } catch (e) {
                                        echo "Branch ${env.BRANCH_NAME} does not exist in CyberSoft.MiniTis.Testing, checkout branch develop"
                                        git poll: false, changelog: false, branch: "develop" , credentialsId: '0e41ffcb-9560-4c8b-9208-cd2f59bc3486', url: 'http://tfs.cybersoft4u.com.tw:8080/tfs/SDD/TIS/_git/CyberSoft.MiniTis.Testing'
                                    }
                                    RunWebTest("dev", "Windows", ["Chrome"], "robotSample")
                                }
                            }
                            post {
                                always {
                                    script {
                                        if (env.BRANCH_NAME != 'develop' && env.BRANCH_NAME != 'master') {
                                            MergeRobotOutput("$ROBOT_RESULTS_PATH\\new_feature_web_output.xml", "$ROBOT_RESULTS_PATH\\web_output.xml", "$ROBOT_RESULTS_PATH\\merged_output.xml")
                                            PostRobotResult("merged_output.xml")
                                            cleanWs()
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        stage('Build for Windows') {
            agent {
                label 'BUILD_SERVER'
            }
            when {
                anyOf {
                    branch 'develop'
                    branch 'master'
                    branch 'staging'
                }
            }
            steps {
                script {
                    commitId = bat(returnStdout: true, script: '@git rev-parse HEAD')//Get commit hash
                }
                bat """
                cd CyberSoft.MiniTis.Web
                C:\\Progra~1\\nodejs\\npm ci
                """
                bat """
                cd CyberSoft.MiniTis.Web
                C:\\Progra~1\\nodejs\\npm run build -- --mode sit --dest publish/sit
                """
                bat """
                cd CyberSoft.MiniTis.Web
                C:\\Progra~1\\nodejs\\npm run build -- --mode staging --dest publish/staging
                """
                bat """
                cd CyberSoft.MiniTis.Web
                C:\\Progra~1\\nodejs\\npm run copy-webconfig-ci
                """

            }
            post {
                failure {
                    script {
                        MiniTISNotifyMessage(commitId)
                    }
                }
            }
        }
        stage('Build for Docker') {
            agent {
                label 'BUILD_SERVER'
            }
            when {
                anyOf {
                    branch 'develop'
                    branch 'master'
                    branch 'staging'
                }
            }
            steps {
                script {
                    commitId = bat(returnStdout: true, script: '@git rev-parse HEAD')//Get commit hash
                }
                bat """
                cd CyberSoft.MiniTis.Web
                C:\\Progra~1\\nodejs\\npm ci
                """
                bat """
                cd CyberSoft.MiniTis.Web
                C:\\Progra~1\\nodejs\\npm run build -- --mode docker --dest publish/docker
                """
                bat """
                cd CyberSoft.MiniTis.Web
                C:\\Progra~1\\nodejs\\npm run copy-webconfig-ci-docker
                """

            }
            post {
                failure {
                    script {
                        MiniTISNotifyMessage(commitId)
                    }
                }
            }
        }
        stage('Publish for Windows') {
            agent {
                label 'BUILD_SERVER'
            }
            when {
                anyOf {
                    branch 'develop'
                    branch 'master'
                    branch 'staging'
                }
            }
            options {
                skipDefaultCheckout true
            }
            steps {
                script {
                    cifsPublisher(publishers: [[
						configName: 'DataCenter',
						transfers: [[
						cleanRemote: false,
						excludes: '',
						flatten: false,
						makeEmptyDirs: false,
						noDefaultExcludes: false,
						patternSeparator: '[, ]+',
						remoteDirectory: 'TIS/CyberSoft.MiniTis.Web/publish/$BRANCH_NAME/$BUILD_NUMBER/Windows',
						remoteDirectorySDF: false,
						removePrefix: 'CyberSoft.MiniTis.Web/publish',
						sourceFiles: 'CyberSoft.MiniTis.Web/publish/**']],
						usePromotionTimestamp: false,
						useWorkspaceInPromotion: false,
						verbose: false]])
				}

			}
			post {
				failure {
					script {
						MiniTISNotifyMessage(commitId)
					}
				}
			}
		}
		stage('Publish for Docker'){
			agent {
				label 'BUILD_SERVER'
			}
			when {
                anyOf {
                    branch 'develop'
                    branch 'master'
                    branch 'staging'
                }
            }
			options {
    			skipDefaultCheckout true
  			}
			steps {
				PackDockerFileStruct()
				cifsPublisher(publishers: [[
						configName: 'DataCenter',
						transfers: [[
						cleanRemote: false,
						excludes: '',
						flatten: false,
						makeEmptyDirs: false,
						noDefaultExcludes: false,
						patternSeparator: '[, ]+',
						remoteDirectory: 'TIS/CyberSoft.MiniTis.Web/publish/$BRANCH_NAME/$BUILD_NUMBER/Docker',
						remoteDirectorySDF: false,
						removePrefix: 'CyberSoft.MiniTis.Web.Docker',
						sourceFiles: 'CyberSoft.MiniTis.Web.Docker/**']],
						usePromotionTimestamp: false,
						useWorkspaceInPromotion: false,
						verbose: false]])
			}
			post {
				failure {
					script {
						MiniTISNotifyMessage(commitId)
					}
				}
			}
		}
        stage('SIT - Decide whether to execute Regression Test Critical Section'){
            when {
                anyOf {
                    branch 'master'
                    branch 'develop'
                }
            }
            stages {
                stage('SIT Regression Test Critical Section') {
                    options{
                        lock ('Regression_Test_MiniTIS_SIT')
                    }
                    stages {
                        stage('Deploy To AP_SIT_MiniTIS') {
                            agent {
                                label 'AP_SIT_MiniTIS'
                            }
                            options {
                                skipDefaultCheckout true
                            }
                            steps {
                                DeployToIIS("Z:\\TIS\\${env.APPNAME}\\publish\\%BRANCH_NAME%\\%BUILD_NUMBER%\\Windows\\sit", "${env.APPPATH}\\CyberSoft.MiniTis.Web")
                            }
                            post {
                                always {
                                    script{
                                        if(IsNotifySuccessBranch(env.BRANCH_NAME)){
                                            MiniTISNotifyMessage(commitId)
                                        }
                                    }
                                }
                            }
                        }
                        stage('SIT Test Machine - Web Test') {
                            agent {
                                label 'CLOUD_TIS_SIT_TEST'
                            }
                            options {
                                skipDefaultCheckout true
                            }
                            steps {
                                script {
                                    try {
                                        git poll: false, changelog: false, branch: env.BRANCH_NAME , credentialsId: '0e41ffcb-9560-4c8b-9208-cd2f59bc3486', url: 'http://tfs.cybersoft4u.com.tw:8080/tfs/SDD/TIS/_git/CyberSoft.MiniTis.Testing'
                                    } catch (e) {
                                        echo "Branch ${env.BRANCH_NAME} does not exist in CyberSoft.MiniTis.Testing, checkout branch develop"
                                        git poll: false, changelog: false, branch: "develop" , credentialsId: '0e41ffcb-9560-4c8b-9208-cd2f59bc3486', url: 'http://tfs.cybersoft4u.com.tw:8080/tfs/SDD/TIS/_git/CyberSoft.MiniTis.Testing'
                                    }
                                    RunWebTest("sit", "Windows", ["Chrome"], "robotSample")
                                }
                            }
                            post {
                                always {
                                    script {
                                        PostRobotResult("web_output.xml")
                                        cleanWs()
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        stage('Staging - Decide whether to execute Regression Test Critical Section'){
            when {
                anyOf {
                    branch 'staging'
                }
            }
            stages {
                stage('Staging Regression Test Critical Section') {
                    options{
                        lock ('Regression_Test_Staging')
                    }
                    stages {
                        stage('Deploy To Staging MiniTIS') {
                            agent {
                                label 'GCP_MiniTIS'
                            }
                            options {
                                skipDefaultCheckout true
                            }
                            steps {
                                DeployToIIS("Z:\\TIS\\${env.APPNAME}\\publish\\%BRANCH_NAME%\\%BUILD_NUMBER%\\Windows\\staging", "${env.APPPATH}\\CyberSoft.MiniTis.Web")
                            }
                            post {
                                always {
                                    script{
                                        if(IsNotifySuccessBranch(env.BRANCH_NAME)){
                                            MiniTISNotifyMessage(commitId)
                                        }
                                    }
                                }
                            }
                        }
                        stage('Staging Test Machine - Web Test') {
                            agent {
                                label 'GCP_Testing'
                            }
                            options {
                                skipDefaultCheckout true
                            }
                            steps {
                                script {
                                    git poll: false, changelog: false, branch: "staging" , credentialsId: '0e41ffcb-9560-4c8b-9208-cd2f59bc3486', url: 'http://tfs.cybersoft4u.com.tw:8080/tfs/SDD/TIS/_git/CyberSoft.MiniTis.Testing'
                                    RunWebTest("staging", "Windows", ["Chrome"], "robotSample")
                                }
                            }
                            post {
                                always {
                                    script {
                                        PostRobotResult("web_output.xml")
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        stage('Deploy To AP_Docker_DEV_MiniTIS') {
            agent {
                label 'AP_Docker_DEV_MiniTIS'
            }
            when {
                anyOf {
                    branch 'master'
                    branch 'develop'
                }
            }
            options {
                skipDefaultCheckout true
            }
            steps {
                sh """ #!/bin/bash
                mount -a
                """

                // Start docker
                sh """ #!/bin/bash
                cd /root/Deploy/CyberSoft.MiniTIS.Web
                rm -rf ./Docker
                cp -R /root/DataServer/TIS/${env.APPNAME}/publish/${env.BRANCH_NAME}/${env.BUILD_NUMBER}/Docker .
                cd Docker
                docker-compose build
                docker-compose up -d
                """
                
            }
            post {
                always {
                    script{
                        if(IsNotifySuccessBranch(env.BRANCH_NAME)){
                            MiniTISNotifyMessage(commitId)
                        }
                    }
                }
            }
        }
        stage('Clean Workspace') {
            agent {
                label 'BUILD_SERVER'
            }
            options {
                skipDefaultCheckout true
            }
            steps {
                cleanWs()
            }
        }
    }
}

def ConfigForDevEnv(){
    bat """
    xcopy ${env.DATA_UNC}\\TIS\\CyberSoft.MiniTis.Web\\hotReloadDEV ${env.APPPATH}\\CyberSoft.MiniTis.Web /s /e /y
    cd ${env.APPPATH}\\CyberSoft.MiniTis.Web\\public
    powershell -Command "(gc index.html) -replace '(.*)MiniTIS(.*?)', \'\$1%BRANCH_NAME%\$2\' | Out-File -encoding UTF8 index.html"
    """
}

def CreateDbIfNotExistForce(String dbserver, String port, String dbname, String create_sql_filepath){
    def pg_path = "C:\\Progra~1\\PostgreSQL\\11\\bin\\psql"
    bat """
    @echo off
    SET PGPASSWORD=%POSTGRES_CRED_PSW%
    "$pg_path" -h $dbserver -p $port -U %POSTGRES_CRED_USR% -f "$create_sql_filepath"
    del /s /q "$create_sql_filepath"
    set PGPASSWORD=
    """
}

// Do not use this method for now
def CreateDbIfNotExist(String dbserver, String port, String dbname, String create_sql_filepath) {
    def pg_path = "C:\\Progra~1\\PostgreSQL\\11\\bin\\psql"
    def check_db_exist_cmd =  pg_path + " -h " + dbserver + " -p " + port + " -U %POSTGRES_CRED_USR% -tc \"SELECT 1 FROM pg_database WHERE datname = \'" + dbname + "\'\""
    println check_db_exist_cmd

    bat """
        IF EXIST "$create_sql_filepath" (
            @echo off
            SET PGPASSWORD=%POSTGRES_CRED_PSW%
            SETLOCAL EnableDelayedExpansion
            echo === Disconnect database ===
 
            "$pg_path" -h $dbserver -p $port -U %POSTGRES_CRED_USR% -c "REVOKE CONNECT ON DATABASE ""$dbname"" FROM public, %POSTGRES_CRED_USR%;" template1 || IF !errorlevel! neq 0 goto :error
            "$pg_path" -h $dbserver -p $port -U %POSTGRES_CRED_USR% -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '$dbname';" template1 || IF !errorlevel! neq 0 goto :error
            
            SET isDatabaseExist="0"
            SET isDatabaseExistCmd=$pg_path -h $dbserver -p $port -U %POSTGRES_CRED_USR% -tc "SELECT 1 FROM pg_database WHERE datname = '$dbname'"
            FOR /F "delims="  %%a IN ('$check_db_exist_cmd') DO SET isDatabaseExist=%%a
            echo %isDatabaseExistLazy%
            IF "%isDatabaseExist: =%" EQU "1" (
               echo === Databse exists and wont create again ===
            ) ELSE (
                echo === Create new database ===
                "$pg_path" -h $dbserver -p $port -U %POSTGRES_CRED_USR% -f "$create_sql_filepath" template1 || IF !errorlevel! neq 0 goto :error
            )
            echo === Create database if not exist: finished ===
            SET isDatabaseExist=
            SET PGPASSWORD=
            ENDLOCAL
            exit /b 0
        ) ELSE (
            echo === Cannot find create database sql ===
            exit /b 1
        )
        :error
        echo === Create database if not exist: failed ===
        exit /b 1
        """
}

def MigrateDb(String dbserver, String port, String dbname, String migrate_sql_filepath){
    def pg_path = "C:\\Progra~1\\PostgreSQL\\11\\bin\\psql"
    bat """
    set PGPASSWORD=%POSTGRES_CRED_PSW%
     "$pg_path" -h $dbserver -p $port -U %POSTGRES_CRED_USR% -d "$dbname" -f "$migrate_sql_filepath"
    set PGPASSWORD=
    del /s /q "$migrate_sql_filepath"
    """
}

def MiniTISNotifyMessage(String commitId,String extraMsg='') {

  buildStatus = currentBuild.currentResult //Get current build status

    // Default values
    def colorCode = '#FF0000'
    def msg = "${env.JOB_NAME}[${env.BUILD_NUMBER}][${env.STAGE_NAME}] - ${currentBuild.currentResult} - \
        \nURL: ${env.BUILD_URL} with this repo: ${env.REPO}${commitId}"

    // Append extra msg
    if (extraMsg?.trim()) {
        msg = "${msg} \n${extraMsg}"
    }

    //
    if (buildStatus == 'SUCCESS') {
        colorCode = '#7FFF00'
    }
    else if(buildStatus == 'ABORTED') {
        colorCode = '#FFAA05'
    }
    else {
        colorCode = '#FF0000'
    }

    echo "Post result: ${currentBuild.result}"
    echo "Post currentResult: ${currentBuild.currentResult}"

    // Send notifications
    if(env.ENABLE_NOTIFY){
        slackSend (color: colorCode, message: msg)
        office365ConnectorSend(color: colorCode, message: msg, webhookUrl:"https://outlook.office.com/webhook/1cee8eb1-7bce-403d-9618-7e57ccf6bab8@9c5df620-ac96-4343-883d-e2fac493dcc0/JenkinsCI/ac055bfb5bb2483d89a2fc65be838f07/28011a10-51a8-49c2-90dc-c263fb8302ee")
    }
}

def PackDockerFileStruct(){
    bat """
        IF EXIST CyberSoft.MiniTis.Web.Docker rmdir CyberSoft.MiniTis.Web.Docker /q /s

        mkdir CyberSoft.MiniTis.Web.Docker
        xcopy .env CyberSoft.MiniTis.Web.Docker
        xcopy docker-compose.yml CyberSoft.MiniTis.Web.Docker

        mkdir CyberSoft.MiniTis.Web.Docker\\CyberSoft.MiniTis.Web\\publish\\docker
        xcopy CyberSoft.MiniTis.Web\\Dockerfile CyberSoft.MiniTis.Web.Docker\\CyberSoft.MiniTis.Web\\
        xcopy CyberSoft.MiniTis.Web\\publish\\docker CyberSoft.MiniTis.Web.Docker\\CyberSoft.MiniTis.Web\\publish\\docker /E
    """
}
