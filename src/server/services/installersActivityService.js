const dbService = require('./dbService')
const requester = require('../requester')
let querystring = require('querystring')

async function getInstallsSchedule() {
    // console.log("get teams start")
    //const installSchedule = await dbService.query('SELECT  Installer__c, Name, Install_Date__c, Final_System_Size__c, Ground_Mount__c, Pending_Cancellation__c, Project_Cancelled__c, install_scheduled.RepName FROM install_schedule LEFT JOIN install_scheduled ON install_schedule.Id = install_scheduled.Id ORDER BY Install_Date__c ASC ') //TODO: select greater than today
    const installSchedule = await dbService.query("SELECT  CONCAT(Street_Address__c, ', ', City__c,', ', State__c,', ', Zip__c ) as address, install_schedule.Id, Installer__c, Name, Upgrade_Needed__c, Email_Address__c, Mobile_Phone__c, Battery_Back_Up_Type__c, Install_Date__c, Final_System_Size__c, Ground_Mount__c, Pending_Cancellation__c, Project_Cancelled__c, install_scheduled.RepName FROM install_schedule LEFT JOIN install_scheduled ON install_schedule.Id = install_scheduled.Id ORDER BY Install_Date__c ASC ") //TODO: select greater than today

    // console.log("team const ", installSchedule)
    return installSchedule
}

async function getInstallers() {
    const installers = await dbService.query('SELECT * FROM installer')
    return installers
}

async function updateInstallerComment({installerId, installerComment}) {
    // console.log("updateInstallerComment ", installerId, installerComment)
    let updateInstaller = await dbService.query('UPDATE installer SET Instructions = ? WHERE Id = ?', [installerComment, installerId])
    if (updateInstaller) {
        return installerId
    } else {
        throw new Error('Something went wrong')
    }
}

async function updateInstallerBlockDates({installerId, startBlockDate, endBlockDate}) {
    // console.log("updateInstallerBlockDates ", installerId, startBlockDate, endBlockDate)
    let currentBlockedDates = await dbService.query('SELECT Blocked_Dates FROM installer WHERE Id = ?', [installerId])
    console.log("currentBlockedDates ", currentBlockedDates[0])
    if (currentBlockedDates[0].Blocked_Dates !== null) {
        let parsedBlockedDates = JSON.parse(currentBlockedDates[0].Blocked_Dates)
        console.log("parsedBlockedDates ", parsedBlockedDates)
        // let newBlockedDates = []
        // parsedBlockedDates.map((date) => {
        parsedBlockedDates.push(
            {EndDate: endBlockDate, StartDate: startBlockDate}
        )
        await dbService.query('UPDATE installer SET Blocked_Dates = ? WHERE Id = ?', [JSON.stringify(parsedBlockedDates), installerId])
        // console.log("newBlockedDates ", parsedBlockedDates)
        // })
        return installerId
    } else {
        let newBlockedDates = [{EndDate: endBlockDate, StartDate: startBlockDate}]
        await dbService.query('UPDATE installer SET Blocked_Dates = ? WHERE Id = ?', [JSON.stringify(newBlockedDates), installerId])
        return installerId
    }
    // let updateBlockedDates = await dbService.query('UPDATE installer SET Comments = ? WHERE Id = ?', [installerComment, installerId])
    // if(updateInstaller){
    //     return installerId
    // }else{
    //     throw new Error('Something went wrong')
    // }
}

async function refreshInstallsSchedule() {
    console.log('ATTEMPTING TO REFRESH INSTALLS SCHEDULE')
    const credentialsUrl = 'https://login.salesforce.com/services/oauth2/token'
    let data = {
        grant_type: 'password',
        client_id: '3MVG9mclR62wycM2QCvilyDrGjq8DvpGohXz.nJsA8n7MAA2ntKXGwqv2jOXapE3dHIbaxIe2vix7M5emxMj1',
        client_secret: 'E4B116D1D3BC3A56259361F17EB4395748D96F5B95CCDE496198C85C83BD6B94',
        username: 'horizonpwr.salesforce@gmail.com',
        password: '$Horizon$2022'
    }
    data = querystring.stringify(data)
    const authHeaders = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': "*/*",
        'Connection': 'keep-alive'
    }
    const {access_token, instance_url} = await requester.post(credentialsUrl, data, {authHeaders})
    const queryHeaders = {headers: {Authorization: 'Bearer ' + access_token, 'Content-Type': 'application/json'}}
    const queryUrl = instance_url + '/services/data/v47.0/query/?q='

    // const residentialProjectUrl = queryUrl + 'SELECT Site_Audit_Date__c, Account__c, Field_Marketer__c, Field_Marketer1__c, Install_Complete__c, Install_Complete_Date_Time__c, Site_Audit_Notice_Sent_Date_Time__c, Install_Scheduled_Date_Time__c, Id, Name, Installer__c, Install_Date__c, Finance_Partner__c, Final_System_Size__c, Ground_Mount__c, Pending_Cancellation__c, Project_Cancelled__c FROM Residential_Projects__c WHERE Site_Audit_Date__c !=null'
    const residentialProjectUrl = queryUrl + 'SELECT Site_Audit_Date__c, Street_Address__c, City__c, State__c, Zip__c, Upgrade_Needed__c, Email_Address__c, Mobile_Phone__c, Battery_Back_Up_Type__c, Account__c, Field_Marketer1__c, Install_Complete__c, Install_Complete_Date_Time__c, Site_Audit_Notice_Sent_Date_Time__c, Install_Scheduled_Date_Time__c, Id, Name, Installer__c, Install_Date__c, Finance_Partner__c, Final_System_Size__c, Ground_Mount__c, Pending_Cancellation__c, Project_Cancelled__c,  X1st_Funding_Payment_Amount__c, X1st_Funding_Payment_Received__c, X2nd_Funding_Payment_Amount__c, X1st_Funding_Received_Date2__c, X2nd_Funding_Payment_Received__c, Loan_Docs_Signed_Date_Time__c, Funding_Updates__c, Loan_Approved_Date_Time__c, Signing_Updates__c, Completion_Certificate_Signed_Date_Time__c, COC_sent_to_GCU__c, GCU_COC_Signed__c, Substantial_Completion_Submitted__c, PTO_Approved__c FROM Residential_Projects__c WHERE Site_Audit_Date__c != null AND Install_Date__c >= LAST_QUARTER '
    // console.log("residential "+residentialProjectUrl)Install_Scheduled_Date_Time__c
    const residentialProjects = await requester.get(residentialProjectUrl, queryHeaders).catch(err => {
        console.log(err);
    })

    //get installers starts
    const installersUrl = queryUrl + "SELECT Id, Name FROM Installer__c WHERE LastReferencedDate > 2020-01-01T00:00:00Z AND Name != 'test installer' AND IsDeleted = false "
    const installers = await requester.get(installersUrl, queryHeaders).catch(err => {
        console.log(err);
    })
    //get installers ends

    // const onboardersUpdatesURL = queryUrl +  "SELECT Onboarding_Complete_Percent__c FROM Account WHERE Status__c = 'Onboarding'   "
    // const onboarders = await requester.get(onboardersUpdatesURL, queryHeaders)
    // let date = new Date()

    //TEMP CONTEST AUTO POPULATE USER TABLE ACCORDING TO DATE RANGE
    let contestStartDate = new Date('2020-05-25')
    let contestEndDate = new Date('2020-06-30')

    for (let i = 0; i < residentialProjects.records.length; i++) {

        if(residentialProjects.records[i].Id === 'a003m00001gPgiNAAS'){
            console.log("HERE0 ", residentialProjects.records[i].Street_Address__c);
        }


        let ecAccountId = residentialProjects.records[i].Account__c === '0013m00002HBuM5AAL' ? '0013m0000210l6eAAA' : residentialProjects.records[i].Account__c === '0013m00002HBuMPAA1' ? '0011N00001sZUeBQAW' : residentialProjects.records[i].Account__c === '0013m00002DQ1MrAAL' || residentialProjects.records[i].Account__c === '0013m00002HBuBMAA1' ? '0013m000029RCXmAAO' : residentialProjects.records[i].Account__c === '0013m00002DQ1N1AAL' ? '0013m000024eOxtAAE' : residentialProjects.records[i].Account__c === '0013m00002K26g9AAB' ? '0013m00002Fh9KjAAJ' : residentialProjects.records[i].Account__c === '0013m00002K2IgrAAF' ? '0013m00002HEMENAA5' : residentialProjects.records[i].Account__c === '0013m00002K1moBAAR' ? '0013m00002EbFXPAA3' : residentialProjects.records[i].Account__c
        //get EC name
        let Energy_Consultant__c = await dbService.query('SELECT Name FROM account WHERE Id = ?', [ecAccountId])

        if (residentialProjects.records[i].Id === 'a003m00002HffsaAAB') {
            console.log('FM', residentialProjects.records[i].Field_Marketer1__c, 'EC', Energy_Consultant__c)
        }


        if (Energy_Consultant__c.length !== 0) {
            Energy_Consultant__c = Energy_Consultant__c[0].Name
            //closes
            if (residentialProjects.records[i].Site_Audit_Notice_Sent_Date_Time__c !== null) {
                //update begin
                //get local close record
                let localCloses = await dbService.query("SELECT Site_Audit_Scheduled_Date_Time__c, Energy_Consultant__c FROM _close WHERE  Id = ? AND Site_Audit_Scheduled_Date_Time__c IS NOT NULL", [residentialProjects.records[i].Id])
                //update name
                if (localCloses.length !== 0) {
                    if (localCloses[0].Energy_Consultant__c !== Energy_Consultant__c) {
                        await dbService.query('UPDATE _close SET Energy_Consultant__c =  ? WHERE Id = ?', [Energy_Consultant__c, residentialProjects.records[i].Id])
                        // console.log("close name local vs sf ", localCloses[0].Energy_Consultant__c, Energy_Consultant__c, residentialProjects.records[i].Id)
                    }
                }
                //update ends
                await dbService.query('INSERT IGNORE INTO _close (Id, Site_Audit_Scheduled_Date_Time__c, Energy_Consultant__c) VALUES (?, ?, ?)', [residentialProjects.records[i].Id, residentialProjects.records[i].Site_Audit_Notice_Sent_Date_Time__c, Energy_Consultant__c])
                //add fms assisted close
                if (residentialProjects.records[i].Field_Marketer1__c !== null) {
                    let getUserName = await dbService.query('SELECT Name FROM account WHERE Id = ?', [residentialProjects.records[i].Field_Marketer1__c])
                    if (getUserName.length !== 0) {
                        await dbService.query('INSERT IGNORE INTO assisted_close (Id, Site_Audit_Scheduled_Date_Time__c, Field_Marketer__c) VALUES (?, ?, ?)', [residentialProjects.records[i].Id, residentialProjects.records[i].Site_Audit_Notice_Sent_Date_Time__c, getUserName[0].Name])
                    }
                } else if (residentialProjects.records[i].Field_Marketer__c !== null) {
                    await dbService.query('INSERT IGNORE INTO assisted_close (Id, Site_Audit_Scheduled_Date_Time__c, Field_Marketer__c) VALUES (?, ?, ?)', [residentialProjects.records[i].Id, residentialProjects.records[i].Site_Audit_Notice_Sent_Date_Time__c, residentialProjects.records[i].Field_Marketer__c])
                }
            }
            //shedule installs
            if (residentialProjects.records[i].Install_Scheduled_Date_Time__c !== null) {

                // if (residentialProjects.records[i].Id === "a001N00001UVdXTQA1") {
                // console.log("loogin for test2 ", residentialProjects.records[i].Name, residentialProjects.records[i].X1st_Funding_Payment_Amount__c)
                // }
                //update begin
                let localScheduled = await dbService.query("SELECT  Install_Scheduled_Date_Time__c, RepName FROM install_scheduled WHERE  Id = ? AND Install_Scheduled_Date_Time__c IS NOT NULL", [residentialProjects.records[i].Id])
                //record is not blank or undefined
                if (localScheduled.length !== 0) {
                    if (localScheduled[0].RepName !== Energy_Consultant__c) {
                        console.log("scheduled name local vs sf ", localScheduled[0].RepName, Energy_Consultant__c, residentialProjects.records[i].Id)
                        // await dbService.query('UPDATE install_scheduled SET Energy_Consultant__c =  ? WHERE Id = ?', [Energy_Consultant__c, residentialProjects.records[i].Id])
                    }
                    //update schedule installs time
                    let startDateApplied = new Date("2020-04-01")
                    let accLoopDateString = residentialProjects.records[i].Install_Scheduled_Date_Time__c.split("T")
                    let localDateInstSche = localScheduled[0].Install_Scheduled_Date_Time__c.toISOString()
                    let localDateInstScheSplit = localDateInstSche.split("T")
                    // console.log(localDateInstScheSplit[0])
                    if (startDateApplied < localScheduled[0].Install_Scheduled_Date_Time__c) {
                        // if(localDateInstScheSplit[0] !== accLoopDateString[0]){
                        //     console.log("not same time schedule ", Energy_Consultant__c,localDateInstScheSplit[0], accLoopDateString[0])
                        // }
                        let accountInstallScheduleDateTime = residentialProjects.records[i].Install_Scheduled_Date_Time__c
                        accountInstallScheduleDateTime = new Date(accountInstallScheduleDateTime)
                        accountInstallScheduleDateTime.setHours(accountInstallScheduleDateTime.getHours() + 1)
                        // let secondInstallDate =  accountInstallScheduleDateTime.setHours(accountInstallScheduleDateTime.getHours() + 5)

                        if (localScheduled[0].Install_Scheduled_Date_Time__c > accountInstallScheduleDateTime || localScheduled[0].Install_Scheduled_Date_Time__c < accountInstallScheduleDateTime) {
                            // console.log("not same time schedule ", Energy_Consultant__c, localScheduled[0].Install_Scheduled_Date_Time__c, accountInstallScheduleDateTime)
                            await dbService.query('UPDATE install_scheduled SET Install_Scheduled_Date_Time__c =  ? WHERE Id = ?', [accountInstallScheduleDateTime, residentialProjects.records[i].Id])
                        }
                    }

                }
                //update ends

                await dbService.query('INSERT IGNORE INTO install_scheduled (Id, Install_Scheduled_Date_Time__c, RepName) VALUES (?, ?, ?)', [residentialProjects.records[i].Id, residentialProjects.records[i].Install_Scheduled_Date_Time__c, Energy_Consultant__c])

                if (residentialProjects.records[i].Installer__c !== null) {

                    let today = new Date();
                    today.setHours(today.getHours() - 6)
                    let todayString = today.toISOString()
                    let todayFormatted = todayString.split("T")
                    if (residentialProjects.records[i].Install_Date__c >= '2020-01-01') {
                        // console.log("residentialProjects.records[i].Id ", residentialProjects.records[i].Installer__c)
                        await dbService.query('INSERT IGNORE INTO install_schedule (Id, Installer__c, Name, Install_Date__c, Final_System_Size__c, Ground_Mount__c, Pending_Cancellation__c, Project_Cancelled__c, Install_Complete__c, Street_Address__c, City__c, State__c, Zip__c, Upgrade_Needed__c, Email_Address__c, Mobile_Phone__c, Battery_Back_Up_Type__c ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ? , ?, ?, ?, ?, ?, ?, ?, ?)', [residentialProjects.records[i].Id, residentialProjects.records[i].Installer__c, residentialProjects.records[i].Name, residentialProjects.records[i].Install_Date__c, residentialProjects.records[i].Final_System_Size__c, residentialProjects.records[i].Ground_Mount__c, residentialProjects.records[i].Pending_Cancellation__c, residentialProjects.records[i].Project_Cancelled__c, residentialProjects.records[i].Install_Complete__c, residentialProjects.records[i].Street_Address__c, residentialProjects.records[i].City__c, residentialProjects.records[i].State__c, residentialProjects.records[i].Zip__c, residentialProjects.records[i].Upgrade_Needed__c, residentialProjects.records[i].Email_Address__c, residentialProjects.records[i].Mobile_Phone__c, residentialProjects.records[i].Battery_Back_Up_Type__c])

                        let localInstallsSchedule = await dbService.query('SELECT * FROM install_schedule WHERE Id = ?', [residentialProjects.records[i].Id])
                        // console.log("localInstallsSchedule.length ", localInstallsSchedule.length)
                        if (localInstallsSchedule.length !== 0) {

                             if(residentialProjects.records[i].Id === 'a003m00001gPgiNAAS'){
                                console.log("HERE ", residentialProjects.records[i].Street_Address__c);
                            }

                            // console.log("pending canel and name ", residentialProjects.records[i].Pending_Cancellation__c, localInstallsSchedule[0].Pending_Cancellation__c, residentialProjects.records[i].Name)
                            if (localInstallsSchedule[0].Name !== residentialProjects.records[i].Name) {
                                // console.log("Name not same ", localInstallsSchedule[0].Installer__c, residentialProjects.records[i].Installer__c)
                                await dbService.query('UPDATE install_schedule SET Name = ? WHERE Id = ?', [residentialProjects.records[i].Name, residentialProjects.records[i].Id])
                            }

                            if (localInstallsSchedule[0].Installer__c !== residentialProjects.records[i].Installer__c) {
                                // console.log("Installer__c not same ", localInstallsSchedule[0].Installer__c, residentialProjects.records[i].Installer__c)
                                await dbService.query('UPDATE install_schedule SET Installer__c = ? WHERE Id = ?', [residentialProjects.records[i].Installer__c, residentialProjects.records[i].Id])
                            }
                            if (localInstallsSchedule[0].Install_Date__c !== residentialProjects.records[i].Install_Date__c) {
                                // console.log("Install_Date__c not same")
                                await dbService.query('UPDATE install_schedule SET Install_Date__c = ? WHERE Id = ?', [residentialProjects.records[i].Install_Date__c, residentialProjects.records[i].Id])
                            }
                            if (localInstallsSchedule[0].Install_Complete__c !== residentialProjects.records[i].Install_Complete__c) {
                                // console.log("Install_Date__c not same")
                                await dbService.query('UPDATE install_schedule SET Install_Complete__c = ? WHERE Id = ?', [residentialProjects.records[i].Install_Complete__c, residentialProjects.records[i].Id])
                            }
                            if (localInstallsSchedule[0].Final_System_Size__c !== residentialProjects.records[i].Final_System_Size__c) {
                                // console.log("Final_System_Size__c not same")
                                await dbService.query('UPDATE install_schedule SET Final_System_Size__c = ? WHERE Id = ?', [residentialProjects.records[i].Final_System_Size__c, residentialProjects.records[i].Id])
                            }
                            if (localInstallsSchedule[0].Ground_Mount__c !== residentialProjects.records[i].Ground_Mount__c) {
                                await dbService.query('UPDATE install_schedule SET Ground_Mount__c = ? WHERE Id = ?', [residentialProjects.records[i].Ground_Mount__c, residentialProjects.records[i].Id])
                                // console.log("Ground_Mount__c not same")
                            }
                            if (localInstallsSchedule[0].Pending_Cancellation__c !== residentialProjects.records[i].Pending_Cancellation__c) {
                                // console.log("pending canel and name ", residentialProjects.records[i].Pending_Cancellation__c, residentialProjects.records[i].Name)
                                await dbService.query('UPDATE install_schedule SET Pending_Cancellation__c = ? WHERE Id = ?', [residentialProjects.records[i].Pending_Cancellation__c, residentialProjects.records[i].Id])
                                // console.log("Pending_Cancellation__c not same")
                            }
                            if (localInstallsSchedule[0].Project_Cancelled__c !== residentialProjects.records[i].Project_Cancelled__c) {
                                await dbService.query('UPDATE install_schedule SET Project_Cancelled__c = ? WHERE Id = ?', [residentialProjects.records[i].Project_Cancelled__c, residentialProjects.records[i].Id])
                                // console.log("Project_Cancelled__c not same")
                            }
                            // Street_Address__c, City__c, State__c, Zip__c, Upgrade_Needed__c, Email_Address__c, Mobile_Phone__c, Battery_Back_Up_Type__c
                            if (localInstallsSchedule[0].Street_Address__c !== residentialProjects.records[i].Street_Address__c) {
                                console.log("scheduled name local vs sf ", localScheduled[0].RepName, Energy_Consultant__c, residentialProjects.records[i].Id)
                                await dbService.query('UPDATE install_schedule SET Street_Address__c = ? WHERE Id = ?', [residentialProjects.records[i].Street_Address__c, residentialProjects.records[i].Id])
                                // console.log("Project_Cancelled__c not same")
                            }
                            if (localInstallsSchedule[0].City__c !== residentialProjects.records[i].City__c) {
                                await dbService.query('UPDATE install_schedule SET City__c = ? WHERE Id = ?', [residentialProjects.records[i].City__c, residentialProjects.records[i].Id])
                                // console.log("Project_Cancelled__c not same")
                            }
                            if (localInstallsSchedule[0].State__c !== residentialProjects.records[i].State__c) {
                                await dbService.query('UPDATE install_schedule SET State__c = ? WHERE Id = ?', [residentialProjects.records[i].State__c, residentialProjects.records[i].Id])
                                // console.log("Project_Cancelled__c not same")
                            }
                            if (localInstallsSchedule[0].Zip__c !== residentialProjects.records[i].Zip__c) {
                                await dbService.query('UPDATE install_schedule SET Zip__c = ? WHERE Id = ?', [residentialProjects.records[i].Zip__c, residentialProjects.records[i].Id])
                                // console.log("Project_Cancelled__c not same")
                            }
                            if (localInstallsSchedule[0].Upgrade_Needed__c !== residentialProjects.records[i].Upgrade_Needed__c) {
                                await dbService.query('UPDATE install_schedule SET Upgrade_Needed__c = ? WHERE Id = ?', [residentialProjects.records[i].Upgrade_Needed__c, residentialProjects.records[i].Id])
                                // console.log("Project_Cancelled__c not same")
                            }
                            if (localInstallsSchedule[0].Email_Address__c !== residentialProjects.records[i].Email_Address__c) {
                                await dbService.query('UPDATE install_schedule SET Email_Address__c = ? WHERE Id = ?', [residentialProjects.records[i].Email_Address__c, residentialProjects.records[i].Id])
                                // console.log("Project_Cancelled__c not same")
                            }
                            if (localInstallsSchedule[0].Mobile_Phone__c !== residentialProjects.records[i].Mobile_Phone__c) {
                                // console.log()
                                let mobilePhone = String(residentialProjects.records[i].Mobile_Phone__c)
                                // await dbService.query('UPDATE install_schedule SET Mobile_Phone__c = ? WHERE Id = ?', [residentialProjects.records[i].Mobile_Phone__c, residentialProjects.records[i].Id])
                                await dbService.query('UPDATE install_schedule SET Mobile_Phone__c = ? WHERE Id = ?', [mobilePhone, residentialProjects.records[i].Id])
                                // console.log("Project_Cancelled__c not same")
                            }
                            if (localInstallsSchedule[0].Battery_Back_Up_Type__c !== residentialProjects.records[i].Battery_Back_Up_Type__c) {
                                await dbService.query('UPDATE install_schedule SET Battery_Back_Up_Type__c = ? WHERE Id = ?', [residentialProjects.records[i].Battery_Back_Up_Type__c, residentialProjects.records[i].Id])
                                // console.log("Project_Cancelled__c not same")
                            }
                        }
                    }
                }
            }
            //install complete
            if (residentialProjects.records[i].Install_Complete__c === true) {
                //update begin

                //update ends
                //add EC into self gen install tabel
                await dbService.query('INSERT IGNORE INTO self_gen_install (Id, Install_Complete_Date_Time__c, Energy_Consultant__c) VALUES (?, ?, ?)', [residentialProjects.records[i].Id, residentialProjects.records[i].Install_Complete_Date_Time__c, Energy_Consultant__c])
                //add fms assisted install
                if (residentialProjects.records[i].Field_Marketer1__c !== null) {
                    let getUserName = await dbService.query('SELECT Name FROM account WHERE Id = ?', [residentialProjects.records[i].Field_Marketer1__c])
                    if (getUserName.length !== 0) {
                        await dbService.query('INSERT IGNORE INTO assisted_install (Id, Install_Complete_Date_Time__c, _Name) VALUES (?, ?, ?)', [residentialProjects.records[i].Id, residentialProjects.records[i].Install_Complete_Date_Time__c, getUserName[0].Name])
                    }
                } else if (residentialProjects.records[i].Field_Marketer__c !== null) {
                    await dbService.query('INSERT IGNORE INTO assisted_install (Id, Install_Complete_Date_Time__c, _Name) VALUES (?, ?, ?)', [residentialProjects.records[i].Id, residentialProjects.records[i].Install_Complete_Date_Time__c, residentialProjects.records[i].Field_Marketer__c])
                }
            }
        }
    }
    //iterate through installers insert and update
    for (let i = 0; i < installers.records.length; i++) {
        await dbService.query('INSERT IGNORE INTO installer (Id, Name, IsDeleted) VALUES (?, ?, ?)', [installers.records[i].Id, installers.records[i].Name, installers.records[i].IsDeleted])
        //TODO: Add updated statements
    }

}

module.exports = {
    getInstallsSchedule,
    getInstallers,
    updateInstallerComment,
    updateInstallerBlockDates,
    refreshInstallsSchedule
}
