const requester = require('../requester')
const dbService = require('./dbService')
const userService = require('./userService')
const teamService = require('./teamService')
const roleService = require('./roleService')
let querystring = require('querystring')
const cryptoService = require('./cryptoService')

async function updateStats() {
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

    // let opportunityUrl = queryUrl + 'SELECT Name, Proposal_Requested_Date_Time__c, AccountId, Field_Marketer1__c,  Sat__c, Appointment_Date__c, FM_Expected_Pay_Date__c, FM_Commission__c, Id, Sat_Date__c, Proposal_Due_Date__c, Proposal_Completed__c, Proposal_QC_s_Date_Time__c, Reason_Proposal_Incomplete__c, Need_Usage__c, Designer__c, Proposal_QC_d_By__c FROM Opportunity WHERE Proposal_Requested__c = true '
    //let opportunityUrl = queryUrl + 'SELECT Name, Proposal_Requested_Date_Time__c, AccountId, Field_Marketer1__c, Sat__c, Appointment_Date__c, FM_Expected_Pay_Date__c, FM_Commission__c, Id, Sat_Date__c, Proposal_Due_Date__c, Proposal_Completed__c, Proposal_QC_s_Date_Time__c, Reason_Proposal_Incomplete__c, Need_Usage__c, Designer__c, Proposal_QC_d_By__c, Canvass_Status__c, Street_Address__c, City__c, State__c, Zip__c FROM Opportunity WHERE Proposal_Requested__c = true '
    let opportunityUrl = queryUrl + 'SELECT Name,  Proposal_Requested_Date_Time__c, AccountId, Field_Marketer1__c, Sat__c, Appointment_Date__c, FM_Expected_Pay_Date__c, FM_Commission__c, Id, Sat_Date__c, Proposal_Due_Date__c, Proposal_Completed__c, Proposal_QC_s_Date_Time__c, Reason_Proposal_Incomplete__c, Need_Usage__c, Designer__c, Proposal_QC_d_By__c, Canvass_Status__c FROM Opportunity WHERE Proposal_Requested__c = true AND Proposal_Requested_Date_Time__c > LAST_YEAR  ORDER BY Proposal_Requested_Date_Time__c DESC '

    let opportunities = {records: []}
    let opportunityPage = {}
    do {
        if (opportunityPage.nextRecordsUrl) {
            opportunityUrl = instance_url + opportunityPage.nextRecordsUrl
            // console.log("opportunity "+opportunityUrl)
            opportunityPage = await requester.get(opportunityUrl, queryHeaders).catch(err => {
                console.log(err);
            })
            opportunities.records = opportunities.records.concat(opportunityPage.records)
        } else {
            opportunityPage = await requester.get(opportunityUrl, queryHeaders).catch(err => {
                console.log(err);
            })
            opportunities.records = opportunities.records.concat(opportunityPage.records)
        }
    }
    while (opportunityPage.nextRecordsUrl)
    //Site_Audit_Scheduled_Date_Time__c was modified in SF

    // const residentialProjectUrl = queryUrl + 'SELECT Site_Audit_Date__c, Account__c, Field_Marketer1__c, Install_Complete__c, Install_Complete_Date_Time__c, Site_Audit_Notice_Sent_Date_Time__c, Install_Scheduled_Date_Time__c, Id, Name, Installer__c, Install_Date__c, Finance_Partner__c, Final_System_Size__c, Ground_Mount__c, Pending_Cancellation__c, Project_Cancelled__c FROM Residential_Projects__c WHERE Site_Audit_Date__c !=null'
    //const residentialProjectUrl = queryUrl + 'SELECT Site_Audit_Date__c, Account__c,  Field_Marketer1__c, Install_Complete__c, Install_Complete_Date_Time__c, Site_Audit_Notice_Sent_Date_Time__c, Install_Scheduled_Date_Time__c, Id, Name, Installer__c, Install_Date__c, Finance_Partner__c, Final_System_Size__c, Ground_Mount__c, Pending_Cancellation__c, Project_Cancelled__c,  X1st_Funding_Payment_Amount__c, X1st_Funding_Payment_Received__c, X2nd_Funding_Payment_Amount__c, X1st_Funding_Received_Date2__c, X2nd_Funding_Payment_Received__c, Loan_Docs_Signed_Date_Time__c, Funding_Updates__c, Loan_Approved_Date_Time__c, Signing_Updates__c, Completion_Certificate_Signed_Date_Time__c, COC_sent_to_GCU__c, GCU_COC_Signed__c, Substantial_Completion_Submitted__c, PTO_Approved__c FROM Residential_Projects__c WHERE Site_Audit_Date__c != null '
    const residentialProjectUrl = queryUrl + "SELECT Site_Audit_Date__c, Street_Address__c, City__c, State__c, Zip__c, Upgrade_Needed__c, Email_Address__c, Mobile_Phone__c, Battery_Back_Up_Type__c, Account__c, Field_Marketer1__c, Install_Complete__c, Install_Complete_Date_Time__c, Site_Audit_Notice_Sent_Date_Time__c, Install_Scheduled_Date_Time__c, Id, Name, Installer__c, Install_Date__c, Finance_Partner__c, Final_System_Size__c, Ground_Mount__c, Pending_Cancellation__c, Project_Cancelled__c,  X1st_Funding_Payment_Amount__c, X1st_Funding_Payment_Received__c, X2nd_Funding_Payment_Amount__c, X1st_Funding_Received_Date2__c, X2nd_Funding_Payment_Received__c, Loan_Docs_Signed_Date_Time__c, Funding_Updates__c, Loan_Approved_Date_Time__c, Signing_Updates__c, Completion_Certificate_Signed_Date_Time__c, COC_sent_to_GCU__c, GCU_COC_Signed__c, Substantial_Completion_Submitted__c, PTO_Approved__c FROM Residential_Projects__c WHERE Site_Audit_Notice_Sent_Date_Time__c > LAST_YEAR AND Site_Audit_Notice_Sent_Date_Time__c != null ORDER BY Site_Audit_Notice_Sent_Date_Time__c  DESC "

    // console.log("residential "+residentialProjectUrl)Install_Scheduled_Date_Time__c
    const residentialProjects = await requester.get(residentialProjectUrl, queryHeaders).catch(err => {
        console.log(err);
    })

    const accountUrl = queryUrl + "SELECT Id, Name, Position__c, Company_Email__c, Team__c, Phone, CreatedDate, Status__c, Onboarding_Complete_Percent__c, Start_Date__c, Shirt_Size__c, Agreement_Signed__c, W9_Signed__c, Direct_Deposit__c, Personal_Email__c, Direct_Deposit_IMG_Uploaded__c, Termination_Date__c  FROM Account WHERE Name != 'Energy Consultant'  "
    const accounts = await requester.get(accountUrl, queryHeaders).catch(err => {
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
    let contestStartDate = new Date('2021-08-01')
    let contestEndDate = new Date('2020-06-30')

    for (let i = 0; i < accounts.records.length; i++) {

        // console.log("COMP EMAIL ", accounts.records[i].Company_Email__c)
        // console.log("REP ", accounts.records[i].Team__c, accounts.records[i].Name, accounts.records[i].Company_Email__c, accounts.records[i].Status__c)
        if (accounts.records[i].Position__c !== null) {
            //changes account status
            let localFix = await dbService.query("SELECT Id, Name, Status__c, Team__c FROM account WHERE  Id = ? ", [accounts.records[i].Id])
            if (localFix.length !== 0) {
                if (localFix[0].Status__c !== accounts.records[i].Status__c) {
                    console.log("account status changing ", localFix)
                    await dbService.query('UPDATE account SET Status__c =  ? WHERE Id = ?', [accounts.records[i].Status__c, accounts.records[i].Id])
                }
                if (localFix[0].Name !== accounts.records[i].Name) {
                    await dbService.query('UPDATE account SET Name =  ? WHERE Id = ?', [accounts.records[i].Name, accounts.records[i].Id])
                }
                if (localFix[0].Team__c !== accounts.records[i].Team__c) {
                    await dbService.query('UPDATE account SET Team__c =  ? WHERE Id = ?', [accounts.records[i].Team__c, accounts.records[i].Id])
                }
                if (localFix[0].Termination_Date__c !== accounts.records[i].Termination_Date__c) {
                    await dbService.query('UPDATE account SET Termination_Date__c =  ? WHERE Id = ?', [accounts.records[i].Termination_Date__c, accounts.records[i].Id])
                }
                // if (localFix[0].Start_Date__c !== accounts.records[i].Start_Date__c) {
                //     // console.log("account start date ", accounts.records[i].Start_Date__c)
                //     let weeksLater = new Date(accounts.records[i].Start_Date__c);
                //     weeksLater = new Date(+weeksLater + 12096e5)
                //     let twoWeeksLater = weeksLater.toISOString()
                //     let twoWeeksLaterDate =  twoWeeksLater.split('T')
                //     // console.log("weeksLater ", twoWeeksLaterDate[0])
                //     // console.log("original and 2 weeks later ", accounts.records[i].Start_Date__c, weeksLater[0])
                //     await dbService.query('UPDATE account SET Start_Date__c =  ?, Report_Start_Date__c = ? WHERE id = ?', [accounts.records[i].Start_Date__c, twoWeeksLaterDate[0],  accounts.records[i].Id])
                // }
                // if (localFix[0].created_date !== accounts.records[i].CreatedDate) {
                //     // console.log("created data sf ", accounts.records[i].CreatedDate)
                //     let formattedCreatedDate = accounts.records[i].CreatedDate.split('T')
                //     // // console.log("formattedCreatedDate ", formattedCreatedDate[0])
                //     await dbService.query('UPDATE account SET created_date =  ? WHERE id = ?', [formattedCreatedDate[0],  accounts.records[i].Id])
                // }
            }
            let localUser = await dbService.query("SELECT personalEmail, startDate FROM user WHERE  email = ? ", [accounts.records[i].Company_Email__c])
            // console.log("localUser ",localUser)

            if (localUser.length !== 0) {
                if (accounts.records[i].Personal_Email__c !== localUser[0].personalEmail) {
                    await dbService.query('UPDATE user SET personalEmail = ? WHERE email = ?', [accounts.records[i].Personal_Email__c, accounts.records[i].Company_Email__c])
                }
                // if(accounts.records[i].Start_Date__c !== null){
                //      let localStartDate = localUser[0].startDate
                //       localStartDate = localStartDate.toISOString()
                //       localStartDate = localStartDate.split("T")
                //      localStartDate = localStartDate[0]

                //      // console.log("localStartDate ", localStartDate)
                //      if(localStartDate !==  accounts.records[i].Start_Date__c){
                //         console.log("account name and start date ",  accounts.records[i].Name, localStartDate,  accounts.records[i].Start_Date__c)
                //          await dbService.query('UPDATE user SET startDate = ? WHERE email = ?', [accounts.records[i].Start_Date__c, accounts.records[i].Company_Email__c])
                //      }
                // }
            }

            if (accounts.records[i].Status__c !== null && accounts.records[i].Status__c !== 'Inactive' && accounts.records[i].Company_Email__c !== null) {
                // console.log("REP ", accounts.records[i].Team__c, accounts.records[i].Name)
                //TEMP SOLUTION TO POPULATE CONTEST UPDATES
                let accCreatedDate = new Date(accounts.records[i].CreatedDate)
                if (accCreatedDate > contestStartDate) {
                    let localExistence = await dbService.query("SELECT email FROM user WHERE  email = ? ", [accounts.records[i].Company_Email__c])
                    // console.log("localExistence", localExistence)
                    if (localExistence.length === 0) {
                        // if (localExistence[0].email !== accounts.records[i].Company_Email__c) {
                        console.log("CREATED DATE ", accCreatedDate)
                        console.log("EMAIL ", accounts.records[i].Company_Email__c)
                        let accountName = accounts.records[i].Name.split(" ")
                        let firstName = accountName[0]
                        let lastName = accountName[1]
                        let teamId = 0
                        let roleId = 0

                        if (accounts.records[i].Team__c === "Wolf") {
                            teamId = 2
                        } else if (accounts.records[i].Team__c === "Fox") {
                            teamId = 7
                        } else if (accounts.records[i].Team__c === "Rexburg") {
                            teamId = 8
                        } else if (accounts.records[i].Team__c === "Boise") {
                            teamId = 2
                        } else if (accounts.records[i].Team__c === "Bend") {
                            teamId = 14
                        } else if (accounts.records[i].Team__c === "MIT") {
                            teamId = 16
                        }

                        if (accounts.records[i].Position__c === "Field Marketer") {
                            roleId = 7
                        } else if (accounts.records[i].Position__c === "Field Marketer Elite") {
                            roleId = 8
                        } else if (accounts.records[i].Position__c === "Sr Energy Consultant") {
                            roleId = 9
                        } else if (accounts.records[i].Position__c === "Senior Energy Consultant") {
                            roleId = 10
                        }
                        const password = 'password'
                        const salt = cryptoService.getRandomSalt()
                        const hash = cryptoService.getHash(password, salt)


                        await dbService.query('INSERT IGNORE INTO user (email, passwordHash, passwordSalt, firstName, lastName, phoneNumber, teamId,  roleId, isApproved, percentComplete, startDate  ) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [accounts.records[i].Company_Email__c, hash, salt, firstName, lastName, accounts.records[i].Phone, teamId, roleId, 1, 100, accounts.records[i].Start_Date__c])
                        // }
                    }

                }
                //ONBOARDER UPDATES
                if (accounts.records[i].Status__c === "Onboarding" && accounts.records[i].Company_Email__c !== null) {
                    let onboarderLocal = await dbService.query("SELECT isApproved, percentComplete FROM user WHERE  email = ? ", [accounts.records[i].Company_Email__c])
                    // console.log("percent completed ", accounts.records[i].Onboarding_Complete_Percent__c, accounts.records[i].Company_Email__c)
                    // console.log(onboarderLocal)
                    if (onboarderLocal.length !== 0) {
                        if (onboarderLocal[0].isApproved === false) {
                            if (onboarderLocal[0].percentComplete !== accounts.records[i].Onboarding_Complete_Percent__c) {
                                console.log("percent completed inside ", accounts.records[i].Onboarding_Complete_Percent__c, accounts.records[i].Company_Email__c, accounts.records[i].Shirt_Size__c)
                                await dbService.query('UPDATE user SET percentComplete =  ?, personal_info = ?, tax_signed = ?, direct_deposit = ?, agreement_signed = ?, directDepositImage = ?  WHERE email = ?', [accounts.records[i].Onboarding_Complete_Percent__c, (accounts.records[i].Shirt_Size__c !== '' ? 1 : 0), accounts.records[i].W9_Signed__c, accounts.records[i].Direct_Deposit__c, accounts.records[i].Agreement_Signed__c, accounts.records[i].Direct_Deposit_IMG_Uploaded__c, accounts.records[i].Company_Email__c])
                            }
                        }
                    }
                }
                //ACCOUNT UPDATES
                let localPosition = await dbService.query("SELECT Position__c, Team__c FROM account WHERE  Id = ? ", [accounts.records[i].Id])
                if (localPosition.length !== 0) {
                    if (localPosition[0].Position__c !== accounts.records[i].Position__c) {
                        // console.log("Name to change ", accounts.records[i].Name)
                        await dbService.query('UPDATE account SET Position__c =  ? WHERE id = ?', [accounts.records[i].Position__c, accounts.records[i].Id])

                    } else if (localPosition[0].Team__c !== accounts.records[i].Team__c) {
                        await dbService.query('UPDATE account SET Team__c =  ? WHERE id = ?', [accounts.records[i].Team__c, accounts.records[i].Id])
                    }
                }

                let accountDate = accounts.records[i].CreatedDate
                // let accountDate = accountDate.toIsoString()
                accountDate = accountDate.split("T")
                //calculate 2 weeks after started date
                let weeksLater = new Date(accounts.records[i].Start_Date__c);
                // weeksLater = new Date(+weeksLater + 12096e5)
                weeksLater.setDate(weeksLater.getDate() + 7)
                let twoWeeksLater = weeksLater.toISOString()
                let twoWeeksLaterDate = twoWeeksLater.split('T')

                // console.log("CREATED DATE ", accounts.records[i].CreatedDate)
                // await dbService.query('INSERT IGNORE INTO account (Id, Name, Position__c, Team__c, Status__c, created_date, Company_Email__c,  Phone ) VALUES(?, ?, ?, ?, ?, ?, ?, ?)', [accounts.records[i].Id, accounts.records[i].Name, accounts.records[i].Position__c, accounts.records[i].Team__c, accounts.records[i].Status__c, accountDate[0], accounts.records[i].Company_Email__c,  accounts.records[i].Phone])
                await dbService.query('INSERT IGNORE INTO account (Id, Name, Position__c, Team__c, Status__c, created_date,  Company_Email__c,  Phone,  Start_Date__c,  Report_Start_Date__c  ) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [accounts.records[i].Id, accounts.records[i].Name, accounts.records[i].Position__c, accounts.records[i].Team__c, accounts.records[i].Status__c, accountDate[0], accounts.records[i].Company_Email__c, accounts.records[i].Phone, accounts.records[i].Start_Date__c, twoWeeksLaterDate[0]])

                // await dbService.query('UPDATE account SET Phone =  ? WHERE id = ?',  [ accounts.records[i].Phone,  accounts.records[i].Id])
                // await dbService.query('UPDATE account SET Phone =  ? WHERE id = ?',  [ accountDate[0],  accounts.records[i].Id])

                // await dbService.query('UPDATE account SET Company_Email__c =  ? WHERE id = ?',  [accounts.records[i].Company_Email__c,  accounts.records[i].Id])
                // await dbService.query('UPDATE account SET Company_Email__c =  ? WHERE id = ?  ', [ accounts.records[i].Company_Email__c, accounts.records[i].Id])
                // await dbService.query('UPDATE account SET Position__c =  ? WHERE id = ? AND Position__c != ? ', [ accounts.records[i].Position__c, accounts.records[i].Id, accounts.records[i].Position__c])
                // await dbService.query('UPDATE account SET Team__c =  ? WHERE id = ?', [accounts.records[i].Team__c, accounts.records[i].Id])
                // await dbService.query('UPDATE account SET Status__c =  ? WHERE id = ? AND Status__c !=  ?', [accounts.records[i].Status__c, accounts.records[i].Id, accounts.records[i].Status__c])

            } else {
                //update inactive accounts
                let localAccount = await dbService.query("SELECT Id, Name, Status__c FROM account WHERE  Id = ? ", [accounts.records[i].Id])
                if (localAccount.length !== 0) {
                    if (localAccount[0].Status__c !== accounts.records[i].Status__c) {
                        console.log("account status changing ", localAccount)
                        await dbService.query('UPDATE account SET Status__c =  ? WHERE Id = ?', [accounts.records[i].Status__c, accounts.records[i].Id])
                    }
                }
            }
        }
    }
    // for (let i = 0; i < onboarders.records.length; i++) {
    //     await dbService.query('UPDATE  user SET(),
    // }
    for (let i = 0; i < opportunities.records.length; i++) {

        if (opportunities.records[i].Field_Marketer1__c === '0013m00002EawqcAAB') {
            opportunities.records[i].Field_Marketer1__c = '0013m000029RgdeAAC'
        }
        let getUserName = '';
        if (opportunities.records[i].Field_Marketer1__c === null && opportunities.records[i].Field_Marketer__c !== null) {
            // getUserName = await dbService.query('SELECT Name FROM account WHERE Id = ?', [opportunities.records[i].Field_Marketer__c])

            // let localQS = await dbService.query("SELECT Field_Marketer__c FROM qs WHERE  Id = ? AND  Appointment_Date__c  IS NOT NULL", [opportunities.records[i].Id])
            // if (localQS.length !== 0) {
            //     if(localQS[0].Field_Marketer__c !== opportunities.records[i].Field_Marketer__c ){
            //         console.log("fm qs local vs sf fm ", localQS[0].Field_Marketer__c, opportunities.records[i].Field_Marketer__c )
            //         await dbService.query('UPDATE qs SET Field_Marketer__c =  ? WHERE Id = ?', [opportunities.records[i].Field_Marketer__c, opportunities.records[i].Id])
            //     }

            // }

            await dbService.query('INSERT IGNORE INTO _lead (Id, Proposal_Requested_Date_Time__c, Field_Marketer__c, Name) VALUES (?, ?, ?, ?)', [opportunities.records[i].Id, opportunities.records[i].Proposal_Requested_Date_Time__c, opportunities.records[i].Field_Marketer__c, opportunities.records[i].Name])

            // await dbService.query('INSERT IGNORE INTO lead_address (opportunity_id, Street_Address__c, City__c, State__c, Zip__c) VALUES (?, ?, ?, ?, ?)', [opportunities.records[i].Id, opportunities.records[i].Street_Address__c, opportunities.records[i].City__c, opportunities.records[i].State__c, opportunities.records[i].Zip__c])
            if (opportunities.records[i].Sat__c === true && opportunities.records[i].Sat_Date__c !== null) {
                // console.log(opportunities.records[i].Appointment_Date__c)
                await dbService.query('INSERT IGNORE INTO qs (Id, Appointment_Date__c, Sat_Date__c, Field_Marketer__c) VALUES (?, ?, ?, ?)', [opportunities.records[i].Id, opportunities.records[i].Sat_Date__c, opportunities.records[i].Appointment_Date__c, opportunities.records[i].Field_Marketer__c])
            }
        } else if (opportunities.records[i].Field_Marketer1__c !== null) {
            getUserName = await dbService.query('SELECT Name FROM account WHERE Id = ?', [opportunities.records[i].Field_Marketer1__c])
            if (getUserName[0] !== undefined) {
                //LEAD UPDATES STARTS
                let localLeadDateFormattedString = ""

                // let localLeads = await dbService.query("SELECT Proposal_Requested_Date_Time__c, Field_Marketer__c, Name, Appointment_Date__c, Proposal_Due_Date__c, Proposal_Completed__c, Proposal_QC_s_Date_Time__c, Need_Usage__c, Designer__c FROM _lead WHERE  Id = ? AND Proposal_Requested_Date_Time__c IS NOT NULL", [opportunities.records[i].Id])
                let localLeads = await dbService.query("SELECT Proposal_Requested_Date_Time__c, Field_Marketer__c, Name, Appointment_Date__c, Proposal_Due_Date__c, Proposal_Completed__c, Proposal_QC_s_Date_Time__c, Reason_Proposal_Incomplete__c, Need_Usage__c, Designer__c, Canvass_Status__c FROM _lead WHERE  Id = ? AND Proposal_Requested_Date_Time__c IS NOT NULL", [opportunities.records[i].Id])
                if (localLeads.length !== 0) {
                    let localLeadDateString = localLeads[0].Proposal_Requested_Date_Time__c.toISOString()
                    localLeadDateString = localLeadDateString.split("T")
                    let localLeadTimeString = localLeadDateString[1].split(".")
                    localLeadDateFormattedString = localLeadDateString[0] + " " + localLeadTimeString[0]
                    if (localLeads[0].Name !== opportunities.records[i].Name) {
                        // console.log(opportunities.records[i].Id, opportunities.records[i].Name, opportunities.records[i].Id)
                        await dbService.query('UPDATE _lead SET Name =  ? WHERE Id = ?', [opportunities.records[i].Name, opportunities.records[i].Id])
                    }
                    if (localLeads[0].Canvass_Status__c !== opportunities.records[i].Canvass_Status__c) {
                        // console.log(opportunities.records[i].Id, opportunities.records[i].Name, opportunities.records[i].Id)
                        await dbService.query('UPDATE _lead SET Canvass_Status__c =  ? WHERE Id = ?', [opportunities.records[i].Canvass_Status__c, opportunities.records[i].Id])
                    }
                    // if (localLeads[0].Appointment_Date__c !== opportunities.records[i].Appointment_Date__c) {
                    // // console.log("app date ", opportunities.records[i].Appointment_Date__c)
                    // let formattedAppointmentDate = opportunities.records[i].Appointment_Date__c.split("T")
                    // await dbService.query('UPDATE _lead SET Appointment_Date__c =  ? WHERE Id = ?', [formattedAppointmentDate[0], opportunities.records[i].Id])
                    // }
                    if (opportunities.records[i].Proposal_Completed__c !== null) {
                        // console.log("proposal completed ", opportunities.records[i].Proposal_Completed__c)
                        if (localLeads[0].Proposal_Completed__c !== opportunities.records[i].Proposal_Completed__c) {
                            // console.log("proposal completed ", opportunities.records[i].Proposal_Completed__c)
                            await dbService.query('UPDATE _lead SET Proposal_Completed__c =  ? WHERE Id = ?', [(opportunities.records[i].Proposal_Completed__c ? 1 : 0), opportunities.records[i].Id])
                        }
                    }
                    if (opportunities.records[i].Need_Usage__c !== null) {
                        // console.log("proposal completed ", opportunities.records[i].Proposal_Completed__c)
                        if (localLeads[0].Need_Usage__c !== opportunities.records[i].Need_Usage__c) {
                            // console.log("proposal completed ", opportunities.records[i].Proposal_Completed__c)
                            await dbService.query('UPDATE _lead SET Need_Usage__c =  ? WHERE Id = ?', [(opportunities.records[i].Need_Usage__c ? 1 : 0), opportunities.records[i].Id])
                        }
                    }
                    if (opportunities.records[i].Designer__c !== null) {
                        // console.log("designer ", opportunities.records[i].Designer__c)
                        if (opportunities.records[i].Designer__c === '0013m000023uSqjAAE') {
                            opportunities.records[i].Designer__c = '0011N00001v7fxbQAA'
                        } else if (opportunities.records[i].Designer__c === '0013m000023uSqjAAE') {
                            opportunities.records[i].Designer__c = '0011N00001v7fxbQAA'
                        } else if (opportunities.records[i].Designer__c === '0013m00002AwOzyAAF') {
                            opportunities.records[i].Designer__c = '0011N00001l1ZbuQAE'
                        } else if (opportunities.records[i].Designer__c === '0013m000029EDjlAAG') {
                            opportunities.records[i].Designer__c = '0013m000029EDhVAAW'
                        } else if (opportunities.records[i].Designer__c === '0013m00002DPgW6AAL') {
                            opportunities.records[i].Designer__c = '0013m000029RUwcAAG'
                        } else if (opportunities.records[i].Designer__c === '0013m000029SL7kAAG') {
                            opportunities.records[i].Designer__c = '0013m000029RUwcAAG'
                        } else if (opportunities.records[i].Designer__c === '0013m00002DRXXSAA5') {
                            opportunities.records[i].Designer__c = '0013m00002DPChXAAX'
                        }
                        if (localLeads[0].Designer__c !== opportunities.records[i].Designer__c) {
                            // console.log("proposal completed ", opportunities.records[i].Proposal_Completed__c)
                            await dbService.query('UPDATE _lead SET Designer__c =  ? WHERE Id = ?', [opportunities.records[i].Designer__c, opportunities.records[i].Id])
                        }
                    }
                    if (opportunities.records[i].Proposal_QC_s_Date_Time__c !== null) {

                        // let QCToString = opportunities.records[i].Proposal_QC_s_Date_Time__c.toISOString()
                        let QCDateTime = opportunities.records[i].Proposal_QC_s_Date_Time__c.split('.')
                        // console.log("QCDateTime ", QCDateTime)
                        // console.log("designer ", opportunities.records[i].Designer__c)
                        if (localLeads[0].Proposal_QC_s_Date_Time__c !== QCDateTime[0]) {
                            // console.log("proposal completed ", opportunities.records[i].Proposal_Completed__c)
                            await dbService.query('UPDATE _lead SET Proposal_QC_s_Date_Time__c =  ? WHERE Id = ?', [QCDateTime[0], opportunities.records[i].Id])
                        }
                    }
                    if (opportunities.records[i].Proposal_QC_d_By__c !== null) {

                        if (localLeads[0].Proposal_QC_s_Date_Time__c !== opportunities.records[i].Proposal_QC_d_By__c) {
                            // console.log("proposal completed ", opportunities.records[i].Proposal_Completed__c)
                            await dbService.query('UPDATE _lead SET Proposal_QC_d_By__c =  ? WHERE Id = ?', [opportunities.records[i].Proposal_QC_d_By__c, opportunities.records[i].Id])
                        }
                    }
                    if (opportunities.records[i].Reason_Proposal_Incomplete__c !== null) {

                        if (localLeads[0].Reason_Proposal_Incomplete__c !== opportunities.records[i].Reason_Proposal_Incomplete__c) {
                            //     console.log( "Reason_Proposal_Incomplete__c ", opportunities.records[i].Reason_Proposal_Incomplete__c )
                            await dbService.query('UPDATE _lead SET Reason_Proposal_Incomplete__c = ? WHERE Id = ?', [opportunities.records[i].Reason_Proposal_Incomplete__c, opportunities.records[i].Id])
                        }
                        if (opportunities.records[i].Canvass_Status__c !== null) {

                            if (localLeads[0].Canvass_Status__c !== opportunities.records[i].Canvass_Status__c) {
                                //     console.log( "Reason_Proposal_Incomplete__c ", opportunities.records[i].Reason_Proposal_Incomplete__c )
                                await dbService.query('UPDATE _lead SET Canvass_Status__c = ? WHERE Id = ?', [opportunities.records[i].Canvass_Status__c, opportunities.records[i].Id])
                            }
                        }
                    }

                }
                let sfLeadDateString = opportunities.records[i].Proposal_Requested_Date_Time__c.split("T")
                let sfLeadTimeString = sfLeadDateString[1].split(".")
                let sfLeadDateTimeFormatted = sfLeadDateString[0] + " " + sfLeadTimeString[0]
                // console.log("localLeads[0].Proposal_Requested_Date_Time__c ", localLeads[0].Proposal_Requested_Date_Time__c)
                if (sfLeadDateTimeFormatted !== localLeadDateFormattedString) {
                    // console.log("local lead date and time vs sf ", sfLeadDateTimeFormatted, localLeadDateFormattedString, opportunities.records[i].Id, getUserName[0].Name)
                }
                // if(opportunities.records[i].Id === "0063m00000kZixFAAS"){
                //            console.log("missing qs top ", getUserName[0].Name)
                //        }


                if (opportunities.records[i].Sat__c === true) {
                    let localQS = await dbService.query("SELECT Field_Marketer__c FROM qs WHERE  Id = ? AND  Appointment_Date__c  IS NOT NULL", [opportunities.records[i].Id])
                    if (localQS.length !== 0) {


                        // if(opportunities.records[i].Id === "0063m00000kZixFAAS"){
                        //     console.log("missing qs buttom ", getUserName[0].Name)
                        // }
                        if (getUserName[0].Name !== localQS[0].Field_Marketer__c) {
                            // console.log("opportunity name vs local db fm ", getUserName[0].Name, localQS[0].Field_Marketer__c)
                        }

                    }
                }

                // console.log("local lead date and time vs sf ", sfLeadDateTimeFormatted, localLeadDateFormattedString)
                //if(
                // console.log("SF Leads stringed time ", sfLeadDateTimeFormatted)
                await dbService.query('INSERT IGNORE INTO _lead (Id, Proposal_Requested_Date_Time__c, Field_Marketer__c, Name) VALUES (?, ?, ?, ?)', [opportunities.records[i].Id, opportunities.records[i].Proposal_Requested_Date_Time__c, getUserName[0].Name, opportunities.records[i].Name])

                // await dbService.query('INSERT IGNORE INTO lead_address (opportunity_id, Street_Address__c, City__c, State__c, Zip__c) VALUES (?, ?, ?, ?, ?)', [opportunities.records[i].Id, opportunities.records[i].Street_Address__c, opportunities.records[i].City__c, opportunities.records[i].State__c, opportunities.records[i].Zip__c])
                if (opportunities.records[i].Sat__c === true && opportunities.records[i].Sat_Date__c !== null) {
                    // if(opportunities.records[i].Appointment_Date__c !== undefined) {

                    //QS UPDATES STARTS
                    let localQS = await dbService.query("SELECT Appointment_Date__c, Sat_Date__c, Field_Marketer__c, EC  FROM qs WHERE  Id = ? AND  Appointment_Date__c  IS NOT NULL", [opportunities.records[i].Id])
                    // console.log("localQS ", localQS)
                    let sfQsString = opportunities.records[i].Appointment_Date__c !== null ? opportunities.records[i].Appointment_Date__c.split("T") : null

                    if (localQS.length !== 0) {
                        if (localQS[0].Sat_Date__c !== opportunities.records[i].Sat_Date__c) {
                            // console.log("sat date from sf ", opportunities.records[i].Sat_Date__c)
                            await dbService.query('UPDATE qs SET Sat_Date__c =  ? WHERE Id = ?', [opportunities.records[i].Sat_Date__c, opportunities.records[i].Id])
                        }

                        if (opportunities.records[i].Id === "0063m00000kZixFAAS") {
                            console.log("missing qs buttom ", getUserName[0].Name)
                        }

                        // if(opportunities.records[i].Field_Marketer1__c === null){
                        //       console.log('qs fixed')
                        //       if (localQS[0].Field_Marketer__c !== opportunities.records[i].Field_Marketer__c) {
                        //           console.log('qs inside')
                        //           // console.log("sat date from sf ", opportunities.records[i].Sat_Date__c)
                        //           await dbService.query('UPDATE qs SET Field_Marketer__c =  ? WHERE Id = ?', [getUserName[0].Field_Marketer__c, opportunities.records[i].Id])
                        //       }
                        //   }
                        // console.log('qs fixed')
                        if (getUserName[0].Name !== localQS[0].Field_Marketer__c) {
                            console.log("opportunity name vs local db fm ", getUserName[0].Name, localQS[0].Field_Marketer__c)
                            await dbService.query('UPDATE qs SET Field_Marketer__c =  ? WHERE Id = ?', [getUserName[0].Name, opportunities.records[i].Id])

                        }


                        let localQsString = localQS[0].Appointment_Date__c.toISOString()
                        localQsString = localQsString.split("T")
                        // if(localQsString[0] === undefined){
                        //     opportunities.records[i].Id
                        // }
                        if (sfQsString !== null && localQsString[0] !== sfQsString[0]) {
                            // console.log("Name to change for ap date sits", getUserName[0].Name, sfQsString[0], localQsString[0], opportunities.records[i].Id)
                            await dbService.query('UPDATE qs SET Appointment_Date__c =  ? WHERE Id = ?', [sfQsString[0], opportunities.records[i].Id])
                        } else if (localQS[0].Field_Marketer__c !== getUserName[0].Name) {
                            // console.
                            // ("Name to change for fm1 ", localQS[0].Field_Marketer__c, getUserName[0].Name, opportunities.records[i].Id)
                        }
                        // let Energy_Consultant__c = {}
                        //getting EC begin
                        // if (opportunities.records[i].AccountId) {
                        let Energy_Consultant__c = await dbService.query('SELECT Name FROM account WHERE Id = ?', [opportunities.records[i].AccountId])
                        if (Energy_Consultant__c.length !== 0) {
                            Energy_Consultant__c = Energy_Consultant__c[0].Name
                            //update EC begind
                            if (localQS[0].EC !== Energy_Consultant__c) {
                                await dbService.query('UPDATE qs SET EC =  ? WHERE Id = ?', [Energy_Consultant__c, opportunities.records[i].Id])
                            }
                            //update EC end
                        }
                        // }
                        // //getting EC end

                    }

                    //Close name update
                    // if(localQS[0].Field_Marketer__c !== getUserName[0].Name){ console.log("LOCAL NAME VS SF ", localQS[0].Field_Marketer__c, getUserName[0].Name), opportunities.records[i].Id}


                    await dbService.query('INSERT IGNORE INTO qs (Id, Appointment_Date__c, Field_Marketer__c) VALUES (?, ?, ?)', [opportunities.records[i].Id, opportunities.records[i].Appointment_Date__c, getUserName[0].Name])
                    //add fm1 with commission data in
                    if (opportunities.records[i].FM_Expected_Pay_Date__c) {
                        await dbService.query('INSERT IGNORE INTO fm_sit_commission (Id, Name, FM_Expected_Pay_Date__c, FM_Commission__c, Field_Marketer__c) VALUES (?, ?, ?, ?, ?)', [opportunities.records[i].Id, opportunities.records[i].Name, opportunities.records[i].FM_Expected_Pay_Date__c, opportunities.records[i].FM_Commission__c, opportunities.records[i].Field_Marketer1__c])
                    }
                }
            }
        }
    }

    for (let i = 0; i < residentialProjects.records.length; i++) {

        let ecAccountId = residentialProjects.records[i].Account__c === '0013m00002K1moBAAR' ? '0013m00002EbFXPAA3' : residentialProjects.records[i].Account__c === '0013m00002HBuM5AAL' ? '0013m0000210l6eAAA' : residentialProjects.records[i].Account__c === '0013m00002HBuMPAA1' ? '0011N00001sZUeBQAW' : residentialProjects.records[i].Account__c === '0013m00002DQ1MrAAL' || residentialProjects.records[i].Account__c === '0013m00002HBuBMAA1' ? '0013m000029RCXmAAO' : residentialProjects.records[i].Account__c === '0013m00002DQ1N1AAL' ? '0013m000024eOxtAAE' : residentialProjects.records[i].Account__c === '0013m00002K26g9AAB' ? '0013m00002Fh9KjAAJ' : residentialProjects.records[i].Account__c === '0013m00002K2IgrAAF' ? '0013m00002HEMENAA5' : residentialProjects.records[i].Account__c === '0013m00002K2QWnAAN' ? '0013m00002FjEb0AAF' : residentialProjects.records[i].Account__c === '0013m00002K26g9AAB' ? '0013m00002Fh9KjAAJ' : residentialProjects.records[i].Account__c === '0013m00002MjVhwAAF' ? '0013m00002DP7dgAAD' : residentialProjects.records[i].Account__c
        //get EC name
        let Energy_Consultant__c = await dbService.query('SELECT Name FROM account WHERE Id = ?', [ecAccountId])

        // if(residentialProjects.records[i].Id === 'a003m00002HffsaAAB'){
        //     console.log('FM', residentialProjects.records[i].Field_Marketer1__c, 'EC', Energy_Consultant__c)
        // }
        // if(residentialProjects.records[i].Id === 'a003m00002HfkoeAAB'){
        //     console.log('Energy_Consultant__c ', Energy_Consultant__c, 'notice ', residentialProjects.records[i].Site_Audit_Notice_Sent_Date_Time__c)
        // }

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
                // console.log("ID", residentialProjects.records[i].Id, "NOTICE", residentialProjects.records[i].Site_Audit_Notice_Sent_Date_Time__c, "EC", Energy_Consultant__c)
                //update ends
                await dbService.query('INSERT IGNORE INTO _close (Id, Site_Audit_Scheduled_Date_Time__c, Energy_Consultant__c) VALUES (?, ?, ?)', [residentialProjects.records[i].Id, residentialProjects.records[i].Site_Audit_Notice_Sent_Date_Time__c, Energy_Consultant__c])
                //add fms assisted close
                if (residentialProjects.records[i].Field_Marketer1__c !== null) {
                    let getUserName = await dbService.query('SELECT Name FROM account WHERE Id = ?', [residentialProjects.records[i].Field_Marketer1__c])
                    if (getUserName.length !== 0) {
                        await dbService.query('INSERT IGNORE INTO assisted_close (Id, Site_Audit_Scheduled_Date_Time__c, Field_Marketer__c) VALUES (?, ?, ?)', [residentialProjects.records[i].Id, residentialProjects.records[i].Site_Audit_Notice_Sent_Date_Time__c, getUserName[0].Name])
                        //update begin
                        let localAssistedClose = await dbService.query("SELECT Field_Marketer__c FROM assisted_close WHERE Id = ? AND Site_Audit_Scheduled_Date_Time__c IS NOT NULL", [residentialProjects.records[i].Id])
                        if (localAssistedClose.length !== 0 && getUserName[0].Name) {
                            if (getUserName[0].Name !== localAssistedClose[0].Field_Marketer__c) {
                                // console.log("new ", getUserName[0].Name, " vs local ", localAssistedClose[0].Field_Marketer__c)
                                await dbService.query('UPDATE assisted_close SET Field_Marketer__c =  ? WHERE Id = ?', [getUserName[0].Name, residentialProjects.records[i].Id])
                            }
                        }
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
                let localScheduled = await dbService.query("SELECT Install_Scheduled_Date_Time__c, RepName FROM install_scheduled WHERE  Id = ? AND Install_Scheduled_Date_Time__c IS NOT NULL", [residentialProjects.records[i].Id])
                //record is not blank or undefined
                if (localScheduled.length !== 0) {
                    if (localScheduled[0].RepName !== Energy_Consultant__c) {
                        // console.log("scheduled name local vs sf ", localScheduled[0].RepName, Energy_Consultant__c, residentialProjects.records[i].Id)
                        await dbService.query('UPDATE install_scheduled SET RepName =  ? WHERE Id = ?', [Energy_Consultant__c, residentialProjects.records[i].Id])
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
                //update begin
                let localFunding = await dbService.query("SELECT * FROM funding_payment WHERE  Id = ?", [residentialProjects.records[i].Id])


                if (localFunding.length !== 0) {

                    // console.log("name ", residentialProjects.records[i].Name)
                    if (localFunding[0].Finance_Partner__c !== residentialProjects.records[i].Finance_Partner__c) {
                        // console.log("name vs finance partner ",residentialProjects.records[i].Name ,residentialProjects.records[i].Finance_Partner__c)
                        await dbService.query('UPDATE funding_payment SET Finance_Partner__c =  ? WHERE Id = ?', [residentialProjects.records[i].Finance_Partner__c, residentialProjects.records[i].Id])
                    }
                    if (residentialProjects.records[i].Completion_Certificate_Signed_Date_Time__c !== null) {
                        if (localFunding[0].Completion_Certificate_Signed_Date_Time__c !== residentialProjects.records[i].Completion_Certificate_Signed_Date_Time__c) {
                            // let formattedDate = new Date(residentialProjects.records[i].Completion_Certificate_Signed_Date_Time__c)
                            // let formattedDateToString = formattedDate.toISOString()
                            let formattedDateToString = residentialProjects.records[i].Completion_Certificate_Signed_Date_Time__c.split(".")
                            // console.log(formattedDateToString[0])
                            // console.log(residentialProjects.records[i].Name, residentialProjects.records[i].Completion_Certificate_Signed_Date_Time__c)
                            await dbService.query('UPDATE funding_payment SET Completion_Certificate_Signed_Date_Time__c =  ? WHERE Id = ?', [formattedDateToString[0], residentialProjects.records[i].Id])
                        }
                    }
                    if (residentialProjects.records[i].Loan_Docs_Signed_Date_Time__c !== null) {
                        if (localFunding[0].Loan_Docs_Signed_Date_Time__c !== residentialProjects.records[i].Loan_Docs_Signed_Date_Time__c) {
                            // let formattedDate = new Date(residentialProjects.records[i].Completion_Certificate_Signed_Date_Time__c)
                            // let formattedDateToString = formattedDate.toISOString()
                            let formattedDateToString = residentialProjects.records[i].Loan_Docs_Signed_Date_Time__c.split(".")
                            // console.log(formattedDateToString[0])
                            // console.log(residentialProjects.records[i].Name, residentialProjects.records[i].Completion_Certificate_Signed_Date_Time__c)
                            await dbService.query('UPDATE funding_payment SET Loan_Docs_Signed_Date_Time__c =  ? WHERE Id = ?', [formattedDateToString[0], residentialProjects.records[i].Id])
                        }
                    }
                    if (localFunding[0].X1st_Funding_Payment_Received__c !== residentialProjects.records[i].X1st_Funding_Payment_Received__c) {
                        // console.log("name vs finance partner ",residentialProjects.records[i].Name ,residentialProjects.records[i].Finance_Partner__c)
                        await dbService.query('UPDATE funding_payment SET X1st_Funding_Payment_Received__c =  ? WHERE Id = ?', [residentialProjects.records[i].X1st_Funding_Payment_Received__c, residentialProjects.records[i].Id])
                    }
                    if (localFunding[0].X2nd_Funding_Payment_Received__c !== residentialProjects.records[i].X2nd_Funding_Payment_Received__c) {
                        // console.log("name vs finance partner ",residentialProjects.records[i].Name ,residentialProjects.records[i].Finance_Partner__c)
                        await dbService.query('UPDATE funding_payment SET X2nd_Funding_Payment_Received__c =  ? WHERE Id = ?', [residentialProjects.records[i].X2nd_Funding_Payment_Received__c, residentialProjects.records[i].Id])
                    }
                    if (localFunding[0].COC_sent_to_GCU__c !== residentialProjects.records[i].COC_sent_to_GCU__c) {
                        // console.log("name vs finance partner ",residentialProjects.records[i].Name ,residentialProjects.records[i].Finance_Partner__c)
                        await dbService.query('UPDATE funding_payment SET COC_sent_to_GCU__c =  ? WHERE Id = ?', [residentialProjects.records[i].COC_sent_to_GCU__c, residentialProjects.records[i].Id])
                    }
                    if (localFunding[0].GCU_COC_Signed__c !== residentialProjects.records[i].GCU_COC_Signed__c) {
                        // console.log("name vs finance partner ",residentialProjects.records[i].Name ,residentialProjects.records[i].Finance_Partner__c)
                        await dbService.query('UPDATE funding_payment SET GCU_COC_Signed__c =  ? WHERE Id = ?', [residentialProjects.records[i].GCU_COC_Signed__c, residentialProjects.records[i].Id])
                    }
                    if (localFunding[0].Substantial_Completion_Submitted__c !== residentialProjects.records[i].Substantial_Completion_Submitted__c) {
                        // console.log("name vs finance partner ",residentialProjects.records[i].Name ,residentialProjects.records[i].Finance_Partner__c)
                        await dbService.query('UPDATE funding_payment SET Substantial_Completion_Submitted__c =  ? WHERE Id = ?', [residentialProjects.records[i].Substantial_Completion_Submitted__c, residentialProjects.records[i].Id])
                    }
                    if (localFunding[0].PTO_Approved__c !== residentialProjects.records[i].PTO_Approved__c) {
                        // console.log("name vs finance partner ",residentialProjects.records[i].Name ,residentialProjects.records[i].Finance_Partner__c)
                        await dbService.query('UPDATE funding_payment SET PTO_Approved__c =  ? WHERE Id = ?', [residentialProjects.records[i].PTO_Approved__c, residentialProjects.records[i].Id])
                    }

                }
                //update ends
                await dbService.query('INSERT IGNORE INTO install_scheduled (Id, Install_Scheduled_Date_Time__c, RepName) VALUES (?, ?, ?)', [residentialProjects.records[i].Id, residentialProjects.records[i].Install_Scheduled_Date_Time__c, Energy_Consultant__c])
                await dbService.query('INSERT IGNORE INTO install_schedule (Id, Installer__c, Name, Install_Date__c, Final_System_Size__c, Ground_Mount__c, Pending_Cancellation__c, Project_Cancelled__c, Install_Complete__c, Street_Address__c, City__c, State__c, Zip__c, Upgrade_Needed__c, Email_Address__c, Mobile_Phone__c, Battery_Back_Up_Type__c ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ? , ?, ?, ?, ?, ?, ?, ?, ?)', [residentialProjects.records[i].Id, residentialProjects.records[i].Installer__c, residentialProjects.records[i].Name, residentialProjects.records[i].Install_Date__c, residentialProjects.records[i].Final_System_Size__c, residentialProjects.records[i].Ground_Mount__c, residentialProjects.records[i].Pending_Cancellation__c, residentialProjects.records[i].Project_Cancelled__c, residentialProjects.records[i].Install_Complete__c, residentialProjects.records[i].Street_Address__c, residentialProjects.records[i].City__c, residentialProjects.records[i].State__c, residentialProjects.records[i].Zip__c, residentialProjects.records[i].Upgrade_Needed__c, residentialProjects.records[i].Email_Address__c, residentialProjects.records[i].Mobile_Phone__c, residentialProjects.records[i].Battery_Back_Up_Type__c])

                // if (residentialProjects.records[i].X1st_Funding_Payment_Amount__c !== null) {
                //     await dbService.query('INSERT IGNORE INTO funding_payment (Id, X1st_Funding_Payment_Amount__c, X2nd_Funding_Payment_Amount__c, X1st_Funding_Received_Date2__c, Loan_Approved_Date_Time__c, Loan_Docs_Signed_Date_Time__c, X2nd_Funding_Payment_Received_Date__c, Funding_Updates__c, Signing_Updates__c, Finance_Partner__c, Completion_Certificate_Signed_Date_Time__c, X1st_Funding_Payment_Received__c, X2nd_Funding_Payment_Received__c, COC_sent_to_GCU__c, GCU_COC_Signed__c, Substantial_Completion_Submitted__c, PTO_Approved__c) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,? ,?, ?, ?)', [residentialProjects.records[i].Id, residentialProjects.records[i].X1st_Funding_Payment_Amount__c, residentialProjects.records[i].X2nd_Funding_Payment_Amount__c, residentialProjects.records[i].X1st_Funding_Received_Date2__c, residentialProjects.records[i].Loan_Approved_Date_Time__c, residentialProjects.records[i].Loan_Docs_Signed_Date_Time__c, residentialProjects.records[i].X2nd_Funding_Payment_Received_Date__c, residentialProjects.records[i].Funding_Updates__c, residentialProjects.records[i].Signing_Updates__c, residentialProjects.records[i].Finance_Partner__c, residentialProjects.records[i].Completion_Certificate_Signed_Date_Time__c, residentialProjects.records[i].X1st_Funding_Payment_Received__c, residentialProjects.records[i].X2nd_Funding_Payment_Received__c, residentialProjects.records[i].COC_sent_to_GCU__c, residentialProjects.records[i].GCU_COC_Signed__c, residentialProjects.records[i].Substantial_Completion_Submitted__c, residentialProjects.records[i].PTO_Approved__c])
                // }

                if (residentialProjects.records[i].Installer__c !== null) {

                    let today = new Date();
                    today.setHours(today.getHours() - 6)
                    let todayString = today.toISOString()
                    let todayFormatted = todayString.split("T")
                    if (residentialProjects.records[i].Install_Date__c >= '2020-01-01') {
                        // console.log("residentialProjects.records[i].Id ", residentialProjects.records[i].Installer__c)
                        await dbService.query('INSERT IGNORE INTO install_schedule (Id, Installer__c, Name, Install_Date__c, Final_System_Size__c, Ground_Mount__c, Pending_Cancellation__c, Project_Cancelled__c, Install_Complete__c ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [residentialProjects.records[i].Id, residentialProjects.records[i].Installer__c, residentialProjects.records[i].Name, residentialProjects.records[i].Install_Date__c, residentialProjects.records[i].Final_System_Size__c, residentialProjects.records[i].Ground_Mount__c, residentialProjects.records[i].Pending_Cancellation__c, residentialProjects.records[i].Project_Cancelled__c, residentialProjects.records[i].Install_Complete__c])

                        let localInstallsSchedule = await dbService.query('SELECT * FROM install_schedule WHERE Id = ?', [residentialProjects.records[i].Id])
                        // console.log("localInstallsSchedule.length ", localInstallsSchedule.length)
                        if (localInstallsSchedule.length !== 0) {

                            // console.log("pending canel and name ", residentialProjects.records[i].Pending_Cancellation__c, localInstallsSchedule[0].Pending_Cancellation__c, residentialProjects.records[i].Name)

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
                                let mobilePhone = String(residentialProjects.records[i].Mobile_Phone__c)
                                // await dbService.query('UPDATE install_schedule SET Mobile_Phone__c = ? WHERE Id = ?', [residentialProjects.records[i].Mobile_Phone__c, residentialProjects.records[i].Id])
                                await dbService.query('UPDATE install_schedule SET Mobile_Phone__c = ? WHERE Id = ?', [mobilePhone, residentialProjects.records[i].Id])
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

//run every 20 mins
updateStats()

setInterval(updateStats, 1200000)

async function getStats(dateRange) {
    // console.log("getStats ", dateRange)
    const users = await userService.getUsers()
    const teams = await teamService.getTeams()
    console.log("Teams here ", teams);
    const accounts = await dbService.query('SELECT * FROM account WHERE Status__c = "Active" AND Team__c IS NOT NULL')
    const startDateTime = dateRange.start + ' 00:00:00'
    const endDateTime = dateRange.end + ' 23:59:59'
    // UTC date change
    let utcStartDatetime = dateRange.start + ' 06:00:00'
    let gettingDay = new Date(dateRange.end)
    gettingDay.setDate(gettingDay.getDate() + 1)
    // let tomorrow  = new Date(gettingDay)
    gettingDay = gettingDay.toISOString()
    gettingDay = gettingDay.split("T")
    let utcEndDatetime = gettingDay[0] + ' 05:59:59'
    let managerTeam = false
    // console.log("startDateTime ", startDateTime)
    // console.log("utcStartDatetime ", utcStartDatetime)
    // console.log("gettingDay ", gettingDay)
    // console.log("utcEndDatetime ", utcEndDatetime)

    let energyConsultants = []
    let fieldMarketers = []
    let teamScores = []
    let statesScores = [
        {
            State: "Idaho",
            Closes: 0,
            Score: 0,
            Leads: 0,
            Installs: 0,
            Qs: 0,

        },
        {
            State: "Oregon",
            Closes: 0,
            Score: 0,
            Leads: 0,
            Installs: 0,
            Qs: 0,

        }]

    if (dateRange.start > '2021-02-06' && dateRange.start < '2021-05-23') {
        managerTeam = true
        // teams.push({teamId: 1, teamName: 'Managers', created_date: '2020-12-22T07:00:00.000Z'})
        // console.log("teams ", teams)
    }

    for (let i = 0; i < teams.length; i++) {
        teamScores.push({
            Name: teams[i].teamName,
            Score: 0,
            ReportScore: 0,
            Leads: 0,
            FmLeads: 0,
            FmQs: 0,
            FmAssists: 0,
            RexFMScore: 0,
            EcSits: 0,
            Qs: 0,
            Closes: 0,
            Installs: 0
        })
    }


    function parseDate(input) {
        let parts = input.split('-')
        // new Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])
        return new Date(parts[0], parts[1] - 1, parts[2]) // Note: months are 0-based
    }

    function getCountOf(date1, date2, dayToSearch) {
        let dateObj1 = parseDate(date1)
        let dateObj2 = parseDate(date2)
        let count = 0
        let week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        let dayIndex = week.indexOf(dayToSearch)
        while (dateObj1.getTime() <= dateObj2.getTime()) {
            if (dateObj1.getDay() != dayIndex) {
                count++
            }
            dateObj1.setDate(dateObj1.getDate() + 1)
        }
        return count
    }

    let date1 = dateRange.start
    let date2 = dateRange.end
    let dayToSearch = "Sun"
    let businessDays = getCountOf(date1, date2, dayToSearch)
    // console.log("businessDays top ", businessDays)
    for (let i = 0; i < accounts.length; i++) {

        // if (accounts[i].Name === "Ben DuPlessis" || accounts[i].Name === "Preston Burt")
        //     continue;
        let regionalManager = false
        if (dateRange.start > '2021-01-16' && dateRange.start < '2021-05-23') {
            if (accounts[i].Id === "0013m000026TCwEAAW" || accounts[i].Id === "0011N00001sZUeBQAW") {
                regionalManager = true
                // console.log("greater than DATE HERE")
            }
        }

        if (dateRange.start < '2021-06-27') {
            if (accounts[i].Name === "Ben DuPlessis" || accounts[i].Name === "Preston Burt")
                continue;
        }
        if (dateRange.start >= '2021-08-22' && dateRange.start < '2021-09-18') {
            if (accounts[i].Name === "Cayden Larsen")
                continue;
        }

        //Can't do this until people actually make accounts on pwrstation
        // let role = ''
        // const teamId = 0
        // for (let i = 0; i < users.length; i++) {
        //     let name = users[i].firstName + users[i].lastName
        //     if (name === accounts[i].Name) {
        //         if (users[i].roleId === 7) {
        //             role = "Field Marketer"
        //         }
        //         else {
        //             role = "Energy Consultant"
        //         }
        //         teamId = users[i].teamId
        //     }
        // }
        let accountTeam = accounts[i].Team__c
        if (accounts[i].Name === "Rob Thornburgh" || accounts[i].Name === "Cayden Larsen") {
            accountTeam = accounts[i].Name === "Rob Thornburgh" ? "Rexburg" : accounts[i].Name === "Cayden Larsen" ? "MIT" : accounts[i].Team__c
        }

        // if (managerTeam) {
        //     accountTeam = accounts[i].Name === "Rob Thornburgh" ? "Managers" : accounts[i].Name === "Cayden Larsen" ? "Managers" : accounts[i].Team__c
        // }

        let role = accounts[i].Position__c
        // console.log("role sf service ", role)
        if (role === 'Field Marketer' || role === 'Field Marketer Elite') {
            // let leadCount = await dbService.query('SELECT COUNT(*) FROM _lead WHERE Field_Marketer__c = ? AND Proposal_Requested_Date_Time__c >= ? AND Proposal_Requested_Date_Time__c <= ?', [accounts[i].Name, startDateTime, endDateTime])
            let leadCount = await dbService.query('SELECT COUNT(*) FROM _lead WHERE Field_Marketer__c = ? AND Proposal_Requested_Date_Time__c >= ? AND Proposal_Requested_Date_Time__c <= ?', [accounts[i].Name, utcStartDatetime, utcEndDatetime])
            leadCount = leadCount[0]['COUNT(*)']
            let leadDetail = await dbService.query('SELECT _lead.Field_Marketer__c, _lead.Name, _lead.Id, _lead.Proposal_Requested_Date_Time__c, qs.Id AS qsId FROM _lead LEFT JOIN qs ON _lead.Id = qs.Id WHERE _lead.Field_Marketer__c =  ? AND _lead.Proposal_Requested_Date_Time__c >= ? AND _lead.Proposal_Requested_Date_Time__c <= ? AND _lead.Field_Marketer__c IS NOT NULL AND _lead.Name IS NOT NULL', [accounts[i].Name, utcStartDatetime, utcEndDatetime])

            let qsCount = await dbService.query('SELECT COUNT(*) FROM qs WHERE Field_Marketer__c = ? AND Sat_Date__c >= ? AND Sat_Date__c <= ?', [accounts[i].Name, dateRange.start, dateRange.end])
            qsCount = qsCount[0]['COUNT(*)']
            // let qsDetail = await dbService.query('SELECT Field_Marketer__c, Sat_Date__c, EC FROM qs  WHERE Field_Marketer__c =  ? AND Sat_Date__c >= ? AND Sat_Date__c <= ? AND Field_Marketer__c IS NOT NULL', [accounts[i].Name, utcStartDatetime, utcEndDatetime])
            // let qsDetail = await dbService.query('SELECT qs.Field_Marketer__c, qs.Sat_Date__c, qs.EC, _lead.Id, _lead.Name FROM qs LEFT JOIN _lead ON qs.Id = _lead.Id  WHERE qs.Field_Marketer__c =  ? AND qs.Sat_Date__c >= ? AND qs.Sat_Date__c <= ? AND qs.Field_Marketer__c IS NOT NULL', [accounts[i].Name, utcStartDatetime, utcEndDatetime])
            let qsDetail = await dbService.query('SELECT qs.Field_Marketer__c, qs.Sat_Date__c, qs.EC, _lead.Name FROM qs LEFT JOIN _lead ON qs.Id = _lead.Id  WHERE qs.Field_Marketer__c =  ? AND qs.Sat_Date__c >= ? AND qs.Sat_Date__c <= ? AND qs.Field_Marketer__c IS NOT NULL', [accounts[i].Name, utcStartDatetime, utcEndDatetime])
            // console.log("qs ", qsDetail,)

            let assistedClosesCount = await dbService.query('SELECT COUNT(*) FROM assisted_close WHERE Field_Marketer__c = ? AND Site_Audit_Scheduled_Date_Time__c >= ? AND Site_Audit_Scheduled_Date_Time__c <= ?', [accounts[i].Name, utcStartDatetime, utcEndDatetime])
            assistedClosesCount = assistedClosesCount[0]['COUNT(*)']
            // let assistedInstallsCount = await dbService.query('SELECT COUNT(*) FROM assisted_install WHERE _Name = ? AND Install_Complete_Date_Time__c >= ? AND Install_Complete_Date_Time__c <= ?', [accounts[i].Name, startDateTime, endDateTime])
            let assistedInstallsCount = await dbService.query('SELECT COUNT(*) FROM assisted_install WHERE _Name = ? AND Install_Complete_Date_Time__c >= ? AND Install_Complete_Date_Time__c <= ?', [accounts[i].Name, utcStartDatetime, utcEndDatetime])
            let scheduledInstallsCount = await dbService.query('SELECT COUNT(*) FROM install_scheduled WHERE RepName = ? AND Install_Scheduled_Date_Time__c >= ? AND Install_Scheduled_Date_Time__c <= ?', [accounts[i].Name, utcStartDatetime, utcEndDatetime])

            scheduledInstallsCount = scheduledInstallsCount[0]['COUNT(*)']

            assistedInstallsCount = assistedInstallsCount[0]['COUNT(*)']
            // console.log("SCHEDULED INSTALLS COUNT ", scheduledInstallsCount)
            // console.log("SCHEDULED INSTALLS COUNT ", assistedInstallsCount)
            let score = leadCount + qsCount * 2 + assistedClosesCount * 3 + assistedInstallsCount * 4
            // let reportScore = (((((leadCount / 10) * 0.8) + ((qsCount / 8) * 0.8) + ((assistedClosesCount / 2) * 1.3)) / 3) * 100).toFixed(0)
            let reportScore = (((((leadCount / ((10 / 6) * businessDays)) * 0.8) * 100) + ((((qsCount / ((8 / 6) * businessDays))) * 0.8) * 100) + ((((assistedClosesCount / ((2 / 6) * businessDays)) * 1.3) * 100))) / 3).toFixed(0)

            //adding team to fieldMarketeres array
            if (accountTeam === 'Fox') {
                let leadNames = []
                let qsNames = []
                if (leadDetail.length > 0) {
                    // leadDetail[0].filter(leadDetail => leadDetail).map((lead) => {
                    leadDetail.map((lead) => {
                        // console.log(lead)
                        // let qsBool = dbService.query('SELECT COUNT(*) FROM qs WHERE Id = ? ', [lead.Id])
                        // qsBool = qsBool[0]['COUNT(*)']
                        // console.log("qsbool from getstats ", lead.Name, lead.Id)
                        leadNames.push({
                            LeadName: lead.Name,
                            Date: lead.Proposal_Requested_Date_Time__c,
                            QS: (lead.qsId ? 1 : 0)
                        })
                        // leadNames.push(lead.Name)
                        // console.log("lead name and account name", lead.Name, accounts[i].Name)
                    })
                    // console.log("leadDetail TOP ", leadDetail[0].Field_Marketer__c, leadDetail[0].Name)
                }
                if (qsDetail.length > 0) {
                    qsDetail.map((qs) => {
                        qsNames.push({
                            Date: qs.Sat_Date__c,
                            Name: qs.Name,
                            EC: qs.EC,
                        })
                    })
                }
                // console.log("name ", accounts[i].Name)
                // console.log("qsDetail 1", qsNames)

                fieldMarketers.push({
                    Name: accounts[i].Name,
                    Score: score,
                    ReportScore: parseInt(reportScore),
                    Leads: leadCount,
                    Qs: qsCount,
                    Closes: '-',
                    AssistedCloses: assistedClosesCount,
                    AssistedInstalls: assistedInstallsCount,
                    ScheduledInstalls: scheduledInstallsCount,
                    SelfGenInstall: '-',
                    Team: 'Klamath Falls',
                    Position: role,
                    LeadNames: (leadNames.length > 0 ? leadNames : 0),
                    QsNames: (qsNames.length > 0 ? qsNames : 0),

                })


                teamScores.forEach(function (team) {
                    if (team.Name === 'Klamath Falls') {
                        team.Score += leadCount + (qsCount * 2) + (scheduledInstallsCount * 4)
                        team.Leads += leadCount
                        team.FmLeads += leadCount
                        team.Qs += qsCount
                        team.FmQs += qsCount
                        team.FmAssists += assistedClosesCount
                        team.Installs += scheduledInstallsCount

                    }
                })

                statesScores.forEach(function (state) {
                    if (state.State === 'Oregon') {
                        state.Score += leadCount + (qsCount * 2) + (scheduledInstallsCount * 4)
                        state.Leads += leadCount
                        state.Qs += qsCount
                        state.Installs += scheduledInstallsCount
                    }
                })

            } else if (accountTeam === 'Wolf') {
                let leadNames = []
                let qsNames = []
                if (leadDetail.length > 0) {
                    // leadDetail[0].filter(leadDetail => leadDetail).map((lead) => {
                    leadDetail.map((lead) => {
                        leadNames.push({
                            LeadName: lead.Name,
                            Date: lead.Proposal_Requested_Date_Time__c,
                            QS: (lead.qsId ? 1 : 0)
                        })
                        // leadNames.push(lead.Name)
                        // console.log("lead name and account name", lead.Name, accounts[i].Name)
                    })
                    // console.log("leadDetail TOP ", leadDetail[0].Field_Marketer__c, leadDetail[0].Name)
                }
                if (qsDetail.length > 0) {
                    qsDetail.map((qs) => {
                        qsNames.push({
                            Date: qs.Sat_Date__c,
                            Name: qs.Name,
                            EC: qs.EC,
                        })
                    })
                }

                fieldMarketers.push({

                    Name: accounts[i].Name,
                    Score: score,
                    Leads: leadCount,
                    Qs: qsCount,
                    Closes: '-',
                    AssistedCloses: assistedClosesCount,
                    AssistedInstalls: assistedInstallsCount,
                    ScheduledInstalls: scheduledInstallsCount,
                    SelfGenInstall: '-',
                    Team: 'Boise',
                    LeadNames: (leadNames.length > 0 ? leadNames : 0),
                    QsNames: (qsNames.length > 0 ? qsNames : 0),
                })


                teamScores.forEach(function (team) {
                    // console.log("boise assisted installs ", assistedInstallsCount)
                    if (team.Name === 'Boise') {
                        team.Score += leadCount + (qsCount * 2) + (scheduledInstallsCount * 4)
                        team.Leads += leadCount
                        team.Qs += qsCount
                        team.Installs += scheduledInstallsCount

                    }
                })

                statesScores.forEach(function (state) {
                    if (state.State === 'Idaho') {
                        state.Score += leadCount + (qsCount * 2) + (scheduledInstallsCount * 4)
                        state.Leads += leadCount
                        state.Qs += qsCount
                        state.Installs += scheduledInstallsCount
                    }
                })

            } else {
                let leadNames = []
                let qsNames = []
                if (leadDetail.length > 0) {
                    // leadDetail[0].filter(leadDetail => leadDetail).map((lead) => {
                    leadDetail.map((lead) => {
                        leadNames.push({
                            LeadName: lead.Name,
                            Date: lead.Proposal_Requested_Date_Time__c,
                            QS: (lead.qsId ? 1 : 0)
                        })
                        // leadNames.push(lead.Name)
                        // console.log("lead name and account name", lead.Name, accounts[i].Name)
                    })
                    // console.log("leadDetail TOP ", leadDetail[0].Field_Marketer__c, leadDetail[0].Name)
                }
                if (qsDetail.length > 0) {
                    qsDetail.map((qs) => {
                        qsNames.push({
                            Date: qs.Sat_Date__c,
                            Name: qs.Name,
                            EC: qs.EC,
                        })
                    })
                }
                // console.log("name ", accounts[i].Name)
                // console.log("qsDetail ", qsNames.length)
                fieldMarketers.push({
                    Name: accounts[i].Name,
                    Score: score,
                    ReportScore: parseInt(reportScore),
                    Leads: leadCount,
                    Qs: qsCount,
                    Closes: '-',
                    AssistedCloses: assistedClosesCount,
                    AssistedInstalls: assistedInstallsCount,
                    ScheduledInstalls: scheduledInstallsCount,
                    SelfGenInstall: '-',
                    Team: accountTeam,
                    Position: role,
                    LeadNames: (leadNames.length > 0 ? leadNames : 0),
                    QsNames: (qsNames.length > 0 ? qsNames : 0)

                })


                teamScores.forEach(function (team) {
                    if (team.Name === accounts[i].Team__c) {
                        team.Score += leadCount + (qsCount * 2) + (scheduledInstallsCount * 4)
                        team.Leads += leadCount
                        team.FmLeads += leadCount
                        team.Qs += qsCount
                        team.FmQs += qsCount
                        team.Installs += scheduledInstallsCount
                        // if(leadDetail[0].length !== 0 ){
                        //     console.log("leadDetail ", accounts[i].Team__c, leadDetail)
                        //     team.Members[leadDetail[0].Field_Marketer__c] = leadDetail[0].Name
                        // }
                    }
                })
                statesScores.forEach(function (state) {
                    if (state.State === 'Idaho') {
                        state.Score += leadCount + (qsCount * 2) + (scheduledInstallsCount * 4)
                        state.Leads += leadCount
                        state.Qs += qsCount
                        state.Installs += scheduledInstallsCount
                    }
                })
            }
        } else if (role === 'Jr Energy Consultant' || role === 'Sr Energy Consultant' || role === 'Manager' || role === 'District Manager' || role === 'VP' || role === 'Sales Manager' || role === 'Regional Manager' || role === 'Energy Consultant') {
            // let leadCount = await dbService.query("SELECT COUNT(*) FROM _lead WHERE Field_Marketer__c = ? AND Proposal_Requested_Date_Time__c >= ? AND Proposal_Requested_Date_Time__c <= ?", [accounts[i].Name, startDateTime, endDateTime])
            let leadCount = await dbService.query("SELECT COUNT(*) FROM _lead WHERE Field_Marketer__c = ? AND Proposal_Requested_Date_Time__c >= ? AND Proposal_Requested_Date_Time__c <= ?", [accounts[i].Name, utcStartDatetime, utcEndDatetime])
            leadCount = leadCount[0]['COUNT(*)']
            let leadDetail = await dbService.query('SELECT Field_Marketer__c, Name, Id, Proposal_Requested_Date_Time__c  FROM _lead WHERE Field_Marketer__c =  ? AND Proposal_Requested_Date_Time__c >= ? AND Proposal_Requested_Date_Time__c <= ? AND Field_Marketer__c IS NOT NULL AND Name IS NOT NULL', [accounts[i].Name, utcStartDatetime, utcEndDatetime])


            let qsCount = await dbService.query('SELECT COUNT(*) FROM qs WHERE Field_Marketer__c = ? AND Appointment_Date__c  >= ? AND Appointment_Date__c <= ?', [accounts[i].Name, dateRange.start, dateRange.end])
            qsCount = qsCount[0]['COUNT(*)']
            let qsDetail = await dbService.query('SELECT qs.Field_Marketer__c, qs.Sat_Date__c, qs.EC, _lead.Name FROM qs LEFT JOIN _lead ON qs.Id = _lead.Id  WHERE qs.EC =  ? AND qs.Sat_Date__c >= ? AND qs.Sat_Date__c <= ? AND qs.EC IS NOT NULL', [accounts[i].Name, utcStartDatetime, utcEndDatetime])


            let sitsCount = await dbService.query('SELECT COUNT(*) FROM qs WHERE EC = ? AND Sat_Date__c >= ? AND Sat_Date__c <= ?', [accounts[i].Name, dateRange.start, dateRange.end])
            sitsCount = sitsCount[0]['COUNT(*)']
            // let closeCount = await dbService.query('SELECT COUNT(*) FROM _close WHERE Energy_Consultant__c = ? AND Site_Audit_Scheduled_Date_Time__c >= ? AND Site_Audit_Scheduled_Date_Time__c <= ?', [accounts[i].Name, startDateTime, endDateTime])
            let closeCount = await dbService.query('SELECT COUNT(*) FROM _close WHERE Energy_Consultant__c = ? AND Site_Audit_Scheduled_Date_Time__c >= ? AND Site_Audit_Scheduled_Date_Time__c <= ?', [accounts[i].Name, utcStartDatetime, utcEndDatetime])
            closeCount = closeCount[0]['COUNT(*)']
            // let assistedInstallsCount = await dbService.query('SELECT COUNT(*) FROM assisted_install WHERE _Name = ? AND Install_Complete_Date_Time__c >= ? AND Install_Complete_Date_Time__c <= ?', [accounts[i].Name, startDateTime, endDateTime])
            let assistedInstallsCount = await dbService.query('SELECT COUNT(*) FROM assisted_install WHERE _Name = ? AND Install_Complete_Date_Time__c >= ? AND Install_Complete_Date_Time__c <= ?', [accounts[i].Name, utcStartDatetime, utcEndDatetime])
            assistedInstallsCount = assistedInstallsCount[0]['COUNT(*)']
            // console.log("assistedInstallsCount ", assistedInstallsCount)
            // let selfGenInstallsCount = await dbService.query('SELECT COUNT(*) FROM self_gen_install WHERE Energy_Consultant__c = ? AND Install_Complete_Date_Time__c >= ? AND Install_Complete_Date_Time__c <= ?', [accounts[i].Name, startDateTime, endDateTime])
            let selfGenInstallsCount = await dbService.query('SELECT COUNT(*) FROM self_gen_install WHERE Energy_Consultant__c = ? AND Install_Complete_Date_Time__c >= ? AND Install_Complete_Date_Time__c <= ?', [accounts[i].Name, utcStartDatetime, utcEndDatetime])
            selfGenInstallsCount = selfGenInstallsCount[0]['COUNT(*)']
            let scheduledInstallsCount = await dbService.query('SELECT COUNT(*) FROM install_scheduled WHERE RepName = ? AND Install_Scheduled_Date_Time__c >= ? AND Install_Scheduled_Date_Time__c <= ?', [accounts[i].Name, utcStartDatetime, utcEndDatetime])
            scheduledInstallsCount = scheduledInstallsCount[0]['COUNT(*)']
            // console.log("SCHEDULED INSTALLS COUNT ", scheduledInstallsCount, accounts[i].Name, accountTeam)

            let score = sitsCount * 2 + closeCount * 3 + scheduledInstallsCount * 3
            // let reportScore = ((((((sitsCount) / 12) * 0.9) + (((closeCount) / 2) * 0.9) + (((scheduledInstallsCount) / 2) * 0.9)) / 3) * 100).toFixed(0)
            let reportScore = (((((sitsCount / ((12 / 6) * businessDays)) * 0.9) * 100) + (((closeCount / ((2 / 6) * businessDays)) * 0.9) * 100) + (((scheduledInstallsCount / ((2 / 6) * businessDays)) * 1.5) * 100)) / 3).toFixed(0)
            //let reportScore = (((((sitsCount / (((regionalManager ? 6 : 12) / 6) * businessDays)) * 0.9) * 100) + (((closeCount / (((regionalManager ? 1 : 2) / 6) * businessDays)) * 0.9) * 100) + (((scheduledInstallsCount / (((regionalManager ? 1 : 2) / 6) * businessDays)) * 1.5) * 100)) / 3).toFixed(0)

            //adding team to energy consultants array
            if (accountTeam === 'Fox') {
                let leadNames = []
                if (leadDetail.length > 0) {
                    // leadDetail[0].filter(leadDetail => leadDetail).map((lead) => {
                    leadDetail.map((lead) => {
                        leadNames.push({
                            LeadName: lead.Name,
                            Date: lead.Proposal_Requested_Date_Time__c
                        })
                        // leadNames.push(lead.Name)
                        // console.log("lead name and account name", lead.Name, accounts[i].Name)
                    })
                    // console.log("leadDetail TOP ", leadDetail[0].Field_Marketer__c, leadDetail[0].Name)
                }

                energyConsultants.push({
                    Name: accounts[i].Name,
                    Score: score,
                    ReportScore: parseInt(reportScore),
                    Leads: leadCount,
                    Qs: qsCount,
                    Sits: sitsCount,
                    Closes: closeCount,
                    AssistedCloses: '-',
                    AssistedInstalls: assistedInstallsCount,
                    SelfGenInstall: selfGenInstallsCount,
                    ScheduledInstalls: scheduledInstallsCount,
                    Team: 'Klamath Falls',
                    LeadNames: leadNames,

                })

                teamScores.forEach(function (team) {
                    if (team.Name === 'Klamath Falls') {
                        team.Score += leadCount + (qsCount * 2) + (closeCount * 3) + (scheduledInstallsCount * 4)
                        team.Leads += leadCount
                        team.Qs += qsCount
                        team.Sits += sitsCount
                        team.Closes += closeCount
                        team.Installs += scheduledInstallsCount
                    }
                })
                // console.log("SCHEDULED INSTALLS COUNT ", scheduledInstallsCount, accounts[i].Name, accountTeam, scheduledInstallsCount * 4)
                statesScores.forEach(function (state) {
                    if (state.State === 'Oregon') {
                        state.Score += leadCount + (qsCount * 2) + (closeCount * 3) + (scheduledInstallsCount * 4)
                        state.Leads += leadCount
                        state.Qs += qsCount
                        state.Closes += closeCount
                        state.Installs += scheduledInstallsCount
                    }
                })


            } else if (accountTeam === 'Wolf') {
                let leadNames = []
                // console.log(accounts[i].Name, scheduledInstallsCount)
                energyConsultants.push({
                    Name: accounts[i].Name,
                    Score: score,
                    Leads: leadCount,
                    Sits: sitsCount,
                    Qs: qsCount,
                    Closes: closeCount,
                    AssistedCloses: '-',
                    AssistedInstalls: assistedInstallsCount,
                    SelfGenInstall: selfGenInstallsCount,
                    ScheduledInstalls: scheduledInstallsCount,
                    Team: 'Boise'
                })


                teamScores.forEach(function (team) {
                    if (team.Name === 'Boise') {
                        team.Score += leadCount + (qsCount * 2) + (closeCount * 3) + (scheduledInstallsCount * 4)
                        team.Leads += leadCount
                        team.Qs += qsCount
                        team.Closes += closeCount
                        // team.Installs += assistedInstallsCount + selfGenInstallsCount
                        team.Installs += scheduledInstallsCount

                    }
                })

                statesScores.forEach(function (state) {
                    if (state.State === 'Idaho') {
                        state.Score += leadCount + (qsCount * 2) + (closeCount * 3) + (scheduledInstallsCount * 4)
                        state.Leads += leadCount
                        state.Qs += qsCount
                        state.Closes += closeCount
                        // state.Installs += assistedInstallsCount + selfGenInstallsCount
                        state.Installs += scheduledInstallsCount
                    }
                })
            } else {
                let leadNames = []
                let qsNames = []
                if (leadDetail.length > 0) {
                    // leadDetail[0].filter(leadDetail => leadDetail).map((lead) => {
                    leadDetail.map((lead) => {
                        leadNames.push({
                            LeadName: lead.Name,
                            Date: lead.Proposal_Requested_Date_Time__c
                        })
                        // leadNames.push(lead.Name)
                        // console.log("lead name and account name", lead.Name, accounts[i].Name)
                    })
                    // console.log("leadDetail TOP ", leadDetail[0].Field_Marketer__c, leadDetail[0].Name)
                }
                if (qsDetail.length > 0) {
                    qsDetail.map((qs) => {
                        qsNames.push({
                            Date: qs.Sat_Date__c,
                            Name: qs.Name,
                            FM: qs.Field_Marketer__c,
                        })
                    })
                }
                // console.log("acc team ", accountTeam, accounts[i].Name, closeCount)
                if (accountTeam !== null) {
                    energyConsultants.push({
                        Name: accounts[i].Name,
                        Score: score,
                        ReportScore: parseInt(reportScore),
                        Leads: leadCount,
                        Sits: sitsCount,
                        Qs: qsCount,
                        Closes: closeCount,
                        AssistedCloses: '-',
                        AssistedInstalls: assistedInstallsCount,
                        SelfGenInstall: selfGenInstallsCount,
                        ScheduledInstalls: scheduledInstallsCount,
                        Team: accountTeam,
                        LeadNames: (leadNames.length > 0 ? leadNames : 0),
                        QsNames: (qsNames.length > 0 ? qsNames : 0)
                    })
                    teamScores.forEach(function (team) {
                        if (team.Name === accounts[i].Team__c) {
                            team.Score += leadCount + (qsCount * 2) + (closeCount * 3) + (scheduledInstallsCount * 4)
                            team.Leads += leadCount
                            team.Qs += qsCount
                            team.Sits += sitsCount
                            team.Closes += closeCount
                            team.Installs += scheduledInstallsCount
                            // team.Installs = 0
                        }
                    })
                    statesScores.forEach(function (state) {
                        if (state.State === 'Idaho') {
                            state.Score += leadCount + (qsCount * 2) + (closeCount * 3) + (scheduledInstallsCount * 4)
                            state.Leads += leadCount
                            state.Qs += qsCount

                            state.Closes += closeCount
                            // state.Installs += assistedInstallsCount + selfGenInstallsCount
                            state.Installs += scheduledInstallsCount
                        }
                    })
                }

                // teamScores.forEach(function (team) {
                //     if (team.Name === accounts[i].Team__c) {
                //         team.Score += leadCount + qsCount * 2
                //         team.Leads += leadCount
                //         team.Qs += qsCount
                //         team.Closes += closeCount
                //         team.Installs += assistedInstallsCount + selfGenInstallsCount
                //     }
                // })
            }
            // let bloodlineGrowth = await dbService.query('SELECT COUNT(*) FROM user WHERE Field_Marketer__c = ? AND Appointment_Date__c >= ? AND Appointment_Date__c <= ?', [accounts[i].Name, dateRange.start, dateRange.end])
            // teamScores[teamId - 1].Score += leadCount + qsCount * 0.25 + closeCount * 3 + assistedInstallsCount * 6 + selfGenInstallsCount * 6
            // teamScores[teamId - 1].Leads += leadCount
            // teamScores[teamId - 1].Qs += qsCount
            // teamScores[teamId - 1].Close += closeCount
            // teamScores[teamId - 1].Install += assistedInstallsCount + selfGenInstallsCount
            // console.log("GET STATS FROM SF SERVICE ", teamScores)

        }
    }


    //Klamath Falls Report Score end

    return {

        EnergyConsultants: energyConsultants,
        FieldMarketers: fieldMarketers,
        TeamScores: teamScores,
        StateScores: statesScores
    }
}

async function getStatsWeek(dateRange) {
    // console.log("dateRange ", dateRange)
    console.log("getStatsWeek week update ", dateRange.start, dateRange.end)
    let gettingDay = new Date(dateRange.end)
    gettingDay.setDate(gettingDay.getDate() + 1)
    // let tomorrow  = new Date(gettingDay)
    gettingDay = gettingDay.toISOString()
    gettingDay = gettingDay.split("T")
    let utcEndDatetime = gettingDay[0] + ' 05:59:59'
    let managerTeam = false
    let startDate = new Date(dateRange.start)


    // const accounts = await dbService.query('SELECT Name, created_date, Report_Start_Date__c,  Termination_Date__c, Position__c, Status__c, Team__c FROM account WHERE Company_Email__c IS NOT NULL AND Team__c IS NOT NULL AND  Report_Start_Date__c < ? AND Status__c = ?', [dateRange.end, 'Active'])
    const accounts = await dbService.query('SELECT Name, created_date, Report_Start_Date__c,  Termination_Date__c, Position__c, Status__c, Team__c FROM account WHERE  Company_Email__c IS NOT NULL AND Team__c IS NOT NULL AND  Report_Start_Date__c < ? ', [dateRange.end])

    let reps = []
    let companyLeads = 0
    let companyECLeads = 0
    let companyQs = 0
    let companyAss = 0
    let companySits = 0
    let companyCloses = 0
    let companyScheduledInstalls = 0
    let companyECCount = 0
    let companyFMCount = 0

    const teams = await dbService.query('SELECT * FROM team WHERE created_date < ?', [dateRange.end])

    let medfordExist = false
    let teamNumbers = []

    if (dateRange.start > '2021-02-06' && dateRange.start < '2021-05-23') {
        managerTeam = true
        teams.push({teamId: 1, teamName: 'Managers', created_date: '2020-12-22T07:00:00.000Z'})
        // console.log("teams ", teams)
    }

    for (let i = 0; i < teams.length; i++) {


        if (teams[i].teamId === 11 || teams[i].teamId === 12 || teams[i].teamId === 13)
            continue
        if (teams[i].teamName === "Medford") {
            medfordExist = true
        }

        teamNumbers.push({
            Name: teams[i].teamName,
            fieldMarketers: [],
            energyConsultants: [],
            Leads: 0,
            ECLeads: 0,
            Qs: 0,
            Ass: 0,
            LeadsPRA: 0,
            QsPRA: 0,
            AssPRA: 0,
            LeadScore: 0,
            QsScore: 0,
            AssScore: 0,
            Sits: 0,
            SitsRM: 0,
            SitsPRA: 0,
            SitsScore: 0,
            Closes: 0,
            ClosesRM: 0,
            ClosesPRA: 0,
            ClosesScore: 0,
            ScheduledInstalls: 0,
            ScheduledInstallsRM: 0,
            ScheduledInstallsPRA: 0,
            ScheduledInstallsScore: 0,
            fmScore: 0,
            ecScore: 0,
            teamScore: 0,
        })

        teams[i].teamName.toLowerCase().replace(/\s/g, '')
    }

    function parseDate(input) {
        let parts = input.split('-')
        // new Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])
        return new Date(parts[0], parts[1] - 1, parts[2]) // Note: months are 0-based
    }

    function getCountOf(date1, date2, dayToSearch) {
        let dateObj1 = parseDate(date1)
        let dateObj2 = parseDate(date2)
        let count = 0
        let week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        let dayIndex = week.indexOf(dayToSearch)
        while (dateObj1.getTime() <= dateObj2.getTime()) {
            if (dateObj1.getDay() != dayIndex) {
                count++
            }
            dateObj1.setDate(dateObj1.getDate() + 1)
        }
        return count
    }

    let date1 = dateRange.start
    let date2 = dateRange.end
    let date3 = new Date(dateRange.start)
    let dayToSearch = "Sun"
    let businessDays = 0

    if (dateRange.render === 'init') {
        businessDays = 6
    } else {
        businessDays = getCountOf(date1, date2, dayToSearch)
    }

    if (businessDays === 0) {
        businessDays = 1
    }


    // console.log("BUSINESS DAYS ", businessDays)

    // loop through accounts
    for (let a = 0; a < accounts.length; a++) {

        if (accounts[a].Termination_Date__c !== null) {
            if (accounts[a].Termination_Date__c < startDate) {
                continue;
            }
        }

        if (accounts[a].Name === "Ben DuPlessis" || accounts[a].Name === "Braxton  Sorensen")
            continue;
        if (dateRange.start < '2021-06-27') {
            if (accounts[a].Name === "Preston Burt")
                continue;
        }
        if (dateRange.start >= '2021-08-22' && dateRange.start < '2021-09-18') {
            if (accounts[a].Name === "Cayden Larsen")
                continue;
        }

        // console.log("term date ", accounts[a].Termination_Date__c)
        let accountTeamName = ''
        if (medfordExist) {
            accountTeamName = (accounts[a].Team__c === 'Fox' ? 'Klamath Falls' : accounts[a].Team__c === 'Wolf' ? 'Boise' : accounts[a].Team__c)
        } else {
            accountTeamName = (accounts[a].Team__c === 'Fox' ? 'Klamath Falls' : accounts[a].Team__c === 'Wolf' ? 'Boise' : accounts[a].Team__c === 'Medford' ? 'Klamath Falls' : accounts[a].Team__c)
        }
        let role = accounts[a].Position__c
        let teamName = (accounts[a].Team__c === "Wolf" ? "Boise" : accounts[a].Team__c === "Fox" ? "Klamath Falls" : accounts[a].Team__c === "Fox" ? "Klamath Falls" : accounts[a].Team__c)
        if (accounts[a].Name === "Rob Thornburgh" || accounts[a].Name === "Cayden Larsen") {
            accountTeamName = accounts[a].Name === "Rob Thornburgh" ? "Rexburg" : accounts[a].Name === "Cayden Larsen" ? "MIT" : accounts[a].Team__c
        }
        // if (managerTeam) {
        //     accountTeamName = accounts[a].Name === "Rob Thornburgh" ? "Managers" : accounts[a].Name === "Cayden Larsen" ? "Managers" : accounts[a].Team__c
        // }


        // console.log(accounts[a].Name)
        if (role === 'Field Marketer' || role === 'Field Marketer Elite') {
            //start getting fms stats
            let leadCount = await dbService.query('SELECT COUNT(*) FROM _lead WHERE Field_Marketer__c = ? AND Proposal_Requested_Date_Time__c >= ? AND Proposal_Requested_Date_Time__c <= ?', [accounts[a].Name, dateRange.start, (dateRange.end + ' 23:59:00')])
            leadCount = leadCount[0]['COUNT(*)']

            let qsCount = await dbService.query('SELECT COUNT(*) FROM qs WHERE Field_Marketer__c = ? AND Sat_Date__c >= ? AND Sat_Date__c <= ?', [accounts[a].Name, dateRange.start, utcEndDatetime])
            qsCount = qsCount[0]['COUNT(*)']

            let assistedClosesCount = await dbService.query('SELECT COUNT(*) FROM assisted_close WHERE Field_Marketer__c = ? AND Site_Audit_Scheduled_Date_Time__c >= ? AND Site_Audit_Scheduled_Date_Time__c <= ?', [accounts[a].Name, dateRange.start, utcEndDatetime])
            assistedClosesCount = assistedClosesCount[0]['COUNT(*)']


            if (leadCount !== 0 && teamName !== "Amp" || qsCount !== 0 && teamName !== "Amp" || assistedClosesCount !== 0 && teamName || accounts[a].Status__c === 'Active' && teamName !== "Amp") {
                //calculate company overall fm numbers

                companyLeads += leadCount
                companyQs += qsCount
                companyAss += assistedClosesCount
                companyFMCount += 1


                teamNumbers.forEach(function (team) {
                    // if(team.Name === "Rexburg"){
                    //        console.log("name and leads count ", accounts[a].Name, leadCount)
                    //        console.log("name and qs count ", accounts[a].Name, qsCount)
                    //        console.log("name and assists count ", accounts[a].Name, assistedClosesCount)
                    //    }
                    if (team.Name === accountTeamName) {
                        team.Leads += leadCount
                        team.Qs += qsCount
                        team.Ass += assistedClosesCount
                        team.fieldMarketers.push({
                            Name: accounts[a].Name,
                            Leads: leadCount,
                            LeadGrade: (((leadCount / ((10 / 6) * businessDays)) * 0.8) * 100).toFixed(2),
                            Qs: qsCount,
                            QsGrade: (((qsCount / ((8 / 6) * businessDays)) * 0.8) * 100).toFixed(2),
                            AssistedCloses: assistedClosesCount,
                            AssGrade: (((assistedClosesCount / ((2 / 6) * businessDays)) * 1.3) * 100).toFixed(2),
                            WeekGrade: ((((leadCount / ((10 / 6) * businessDays)) * 0.8) * 100) + ((((qsCount / ((8 / 6) * businessDays))) * 0.8) * 100) + ((((assistedClosesCount / ((2 / 6) * businessDays)) * 1.3) * 100)) / 3).toFixed(2),
                        })

                    }
                })

                // reps.push({
                //     Name: accounts[a].Name,
                //     Position: role,
                //     Leads: leadCount,
                //     LeadsPRA: ((leadCount / 8) * .8),
                //     LeadsScore: 0,
                //     Qs: qsCount,
                //     AssistedCloses: assistedClosesCount
                // })
            }

            //end getting fms stats
        } else if (role === 'Jr Energy Consultant' || role === 'Sr Energy Consultant' || role === 'Manager' || role === 'VP' || role === 'District Manager' || role === 'Sales Manager' || role === 'Regional Manager' || role === 'Energy Consultant') {

            let leadCount = await dbService.query('SELECT COUNT(*) FROM _lead WHERE Field_Marketer__c = ? AND Proposal_Requested_Date_Time__c >= ? AND Proposal_Requested_Date_Time__c <= ?', [accounts[a].Name, dateRange.start, (dateRange.end + ' 23:59:00')])
            leadCount = leadCount[0]['COUNT(*)']

            let sitsCount = await dbService.query('SELECT COUNT(*) FROM qs WHERE EC = ? AND Sat_Date__c >= ? AND Sat_Date__c <= ?', [accounts[a].Name, dateRange.start, (dateRange.end + ' 23:59:00')])
            sitsCount = sitsCount[0]['COUNT(*)']

            let closeCount = await dbService.query('SELECT COUNT(*) FROM _close WHERE Energy_Consultant__c = ? AND Site_Audit_Scheduled_Date_Time__c >= ? AND Site_Audit_Scheduled_Date_Time__c <= ?', [accounts[a].Name, dateRange.start, utcEndDatetime])
            closeCount = closeCount[0]['COUNT(*)']

            let scheduledInstallsCount = await dbService.query('SELECT COUNT(*) FROM install_scheduled WHERE RepName = ? AND Install_Scheduled_Date_Time__c >= ? AND Install_Scheduled_Date_Time__c <= ?', [accounts[a].Name, dateRange.start, utcEndDatetime])
            scheduledInstallsCount = scheduledInstallsCount[0]['COUNT(*)']


            if (leadCount > 0 && accounts[a].Team__c !== "Amp" || sitsCount !== 0 && accounts[a].Team__c !== "Amp" || closeCount !== 0 && accounts[a].Team__c !== "Amp" || scheduledInstallsCount !== 0 && accounts[a].Team__c !== "Amp" || accounts[a].Status__c === 'Active' && accounts[a].Team__c !== "Amp") {
                // console.log("EC leadCount ", accounts[a].Name, leadCount)
                companyECLeads += leadCount
                companySits += sitsCount
                companyCloses += closeCount
                companyScheduledInstalls += scheduledInstallsCount


                companyECCount += 1

                teamNumbers.forEach(function (team) {
                    // console.log("EC", accounts[a].Name, "leads ", leadCount)
                    let regionalManager = false
                    let sitsCountRM = sitsCount
                    let closeCountRM = closeCount
                    let scheduledInstallsCountRM = scheduledInstallsCount
                    // console.log(".") 
                    if (dateRange.start > '2021-01-16' && dateRange.start < '2021-05-23') {
                        // if(date3 > '2021-01-16') {
                        // console.log("x") 
                        // if (accounts[a].Id === "0013m000026TCwEAAW" && team.Name === "Pocatello" || accounts[a].Id === "0011N00001sZUeBQAW" && team.Name === "Boise") {
                        if (accounts[a].Name === "Rob Thornburgh" && accountTeamName === 'Pocatello' || accounts[a].Name === "Rob Thornburgh" && accountTeamName === 'Managers' || accounts[a].Name === "Cayden Larsen" && accountTeamName === 'Boise' || accounts[a].Name === "Cayden Larsen" && accountTeamName === 'Managers') {
                            regionalManager = true
                            sitsCountRM = sitsCount
                            closeCountRM = closeCount
                            scheduledInstallsCountRM = scheduledInstallsCount
                            // console.log("Name and sits ", accounts[a].Name, teamName, sitsCountRM)
                        }
                    }

                    if (team.Name === accountTeamName) {
                        if (team.Name === "Rexburg") {
                            // console.log("name and close count ", accounts[a].Name, closeCount)
                            // console.log("name and sit count ", accounts[a].Name, sitsCount)
                            // console.log("name and installs count ", accounts[a].Name, scheduledInstallsCount)
                        }
                        team.ECLeads += leadCount
                        team.Sits += sitsCount
                        team.Closes += closeCount
                        team.ScheduledInstalls += scheduledInstallsCount
                        team.SitsRM += sitsCountRM
                        team.ClosesRM += closeCountRM
                        team.ScheduledInstallsRM += scheduledInstallsCountRM
                        team.energyConsultants.push({
                            Name: accounts[a].Name,
                            Leads: leadCount,
                            Sits: sitsCount,
                            // SitsGrade: (((sitsCount / (((regionalManager ? 6 : 12) / 6) * businessDays)) * 0.9) * 100).toFixed(2),
                            SitsGrade: (((sitsCount / ((12 / 6) * businessDays)) * 0.9) * 100).toFixed(2),
                            Closes: closeCount,
                            // ClosesGrade: (((closeCount / (((regionalManager ? 1 : 2) / 6) * businessDays)) * 0.9) * 100).toFixed(2),
                            ClosesGrade: (((closeCount / ((2 / 6) * businessDays)) * 0.9) * 100).toFixed(2),
                            ScheduledInstalls: scheduledInstallsCount,
                            // ScheduledInstallsGrade: (((scheduledInstallsCount / (((regionalManager ? 1 : 2) / 6) * businessDays)) * 1.5) * 100).toFixed(2),
                            ScheduledInstallsGrade: (((scheduledInstallsCount / ((2 / 6) * businessDays)) * 1.5) * 100).toFixed(2),
                            // WeekGrade: (((((sitsCount / (((regionalManager ? 6 : 12) / 6) * businessDays)) * 0.9) * 100) + (((closeCount / (((regionalManager ? 1 : 2) / 6) * businessDays)) * 0.9) * 100) + (((scheduledInstallsCount / (((regionalManager ? 1 : 2) / 6) * businessDays)) * 1.5) * 100)) / 3).toFixed(2)
                            WeekGrade: (((((sitsCount / ((12 / 6) * businessDays)) * 0.9) * 100) + (((closeCount / ((2 / 6) * businessDays)) * 0.9) * 100) + (((scheduledInstallsCount / ((2 / 6) * businessDays)) * 1.5) * 100)) / 3).toFixed(2)

                        })
                    }
                })
            }
        }
    }
    //company FMs calculations

    let leadsPRA = (companyLeads / companyFMCount)
    let leadsScore = (((leadsPRA / 8) * .8) * 100)
    let qsPRA = (companyQs / companyFMCount)
    let qsScore = (((qsPRA / 6) * .8) * 100)
    let assPRA = (companyAss / companyFMCount)
    let assScore = (((assPRA / 1.5) * 1.3) * 100)
    let fmUnitScore = ((leadsScore + qsScore + assScore) / 3)
    // company ECs calculations
    let sitsPRA = (companySits / companyECCount)
    let sitsScore = (((sitsPRA / 8) * .9) * 100)
    let closePRA = (companyCloses / companyECCount)
    let closeScore = (((closePRA / 1.5) * .9) * 100)
    let scheduledInstallsPRA = (companyScheduledInstalls / companyECCount)
    let scheduledInstallsScore = (((scheduledInstallsPRA / 1.5) * .9) * 100)
    let ecUnitScore = ((sitsScore + closeScore + scheduledInstallsScore) / 3)
    let weekScore = (((ecUnitScore ? ecUnitScore : 0) + (fmUnitScore ? fmUnitScore : 0)) / 2)
    // console.log("weekScore ", weekScore)
    //team Calculations


    // function getCountOf(date1, date2, dayToSearch) {
    //     let dateObj1 = parseDate(date1)
    //     let dateObj2 = parseDate(date2)
    //     let count = 0
    //     let week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    //     let dayIndex = week.indexOf(dayToSearch)
    //     while (dateObj1.getTime() <= dateObj2.getTime()) {
    //         if (dateObj1.getDay() != dayIndex) {
    //             count++
    //         }
    //         dateObj1.setDate(dateObj1.getDate() + 1)
    //     }
    //     return count
    // }

    // let date1 = dateRange.start
    // let date2 = dateRange.end
    // let dayToSearch = "Sun"
    // let businessDays = getCountOf(date1, date2, dayToSearch)
    // console.log("businessDays ", businessDays)
    let t = -1
    while (++t < teamNumbers.length) {
        // console.log("iteration ", t)
        teamNumbers[t].LeadsPRA = (teamNumbers[t].Leads / teamNumbers[t].fieldMarketers.length)
        // teamNumbers[t].LeadsScore = (((teamNumbers[t].LeadsPRA / (businessDays * (8 / 6))) * .8) * 100)
        teamNumbers[t].LeadsScore = (((teamNumbers[t].Leads / ((businessDays * (10 / 6)) * teamNumbers[t].fieldMarketers.length)) * .8) * 100)
        teamNumbers[t].QsPRA = (teamNumbers[t].Qs / teamNumbers[t].fieldMarketers.length)
        // teamNumbers[t].QsScore = (((teamNumbers[t].QsPRA / (businessDays * (6 / 6))) * .8) * 100)
        teamNumbers[t].QsScore = (((teamNumbers[t].Qs / ((businessDays * (8 / 6)) * teamNumbers[t].fieldMarketers.length)) * .8) * 100)
        teamNumbers[t].AssPRA = (teamNumbers[t].Ass / teamNumbers[t].fieldMarketers.length)
        // teamNumbers[t].AssScore = (((teamNumbers[t].AssPRA / (businessDays * (1.5 / 6))) * 1.3) * 100)
        teamNumbers[t].AssScore = (((teamNumbers[t].Ass / ((businessDays * (2 / 6)) * teamNumbers[t].fieldMarketers.length)) * 1.3) * 100)
        teamNumbers[t].fmScore = ((teamNumbers[t].LeadsScore + teamNumbers[t].QsScore + teamNumbers[t].AssScore) / 3)

        teamNumbers[t].SitsPRA = (teamNumbers[t].Sits / teamNumbers[t].energyConsultants.length)
        // teamNumbers[t].SitsScore = (((teamNumbers[t].SitsPRA / (businessDays * (8 / 6))) * .9) * 100)
        teamNumbers[t].SitsScore = (((teamNumbers[t].SitsRM / ((businessDays * (12 / 6)) * teamNumbers[t].energyConsultants.length)) * .9) * 100)
        teamNumbers[t].ClosesPRA = (teamNumbers[t].Closes / teamNumbers[t].energyConsultants.length)
        // teamNumbers[t].ClosesScore = (((teamNumbers[t].ClosesPRA / (businessDays * (1.5 / 6))) * .9) * 100)
        teamNumbers[t].ClosesScore = (((teamNumbers[t].ClosesRM / ((businessDays * (2 / 6)) * teamNumbers[t].energyConsultants.length)) * .9) * 100)
        teamNumbers[t].ScheduledInstallsPRA = (teamNumbers[t].ScheduledInstalls / teamNumbers[t].energyConsultants.length)
        teamNumbers[t].ScheduledInstallsScore = (((teamNumbers[t].ScheduledInstallsPRA / (businessDays * (1.5 / 6))) * .9) * 100)
        teamNumbers[t].ScheduledInstallsScore = (((teamNumbers[t].ScheduledInstallsRM / ((businessDays * (2 / 6)) * teamNumbers[t].energyConsultants.length)) * 1.5) * 100)

        teamNumbers[t].ecScore = ((teamNumbers[t].SitsScore + teamNumbers[t].ClosesScore + teamNumbers[t].ScheduledInstallsScore) / 3)
        // console.log("begin score cal ", teamNumbers[t].fmScore, teamNumbers[t].ecScore)
        teamNumbers[t].teamScore = teamNumbers[t].Name === 'Managers' ? teamNumbers[t].ecScore : ((teamNumbers[t].fmScore ? teamNumbers[t].fmScore : 0) + (teamNumbers[t].ecScore ? teamNumbers[t].ecScore : 0)) / 2
        // console.log("end score cal ", teamNumbers[t].Name, teamNumbers[t].teamScore)
    }


    let rexWins = 0, boiseWins = 0, bendWins = 0, pocatelloWins = 0, kfWins = 0
    let teamStats = await dbService.query('SELECT * FROM week_stats WHERE id >= ?', [348])

    // console.log("teamStats HERE ", teamStats)

    for (let i = 0; i < teamStats.length; i++) {
        let teamStandingsObject = JSON.parse(teamStats[i].team_numbers)
        // console.log("teamStandingsObject ", teamStandingsObject)
        let winnerName = ''
        if (teamStandingsObject.length > 0) {
            let maxVal = Math.max.apply(Math, teamStandingsObject.map(function (o) {
                return o.teamScore;
            }))
            if (maxVal > 10) {
                teamStandingsObject.filter(team => team.teamScore === maxVal).map((team) => {
                    winnerName = team.Name
                })
                if (winnerName === 'Klamath Falls') {
                    kfWins++
                } else if (winnerName === 'Pocatello') {
                    console.log("Pocatello win ", teamStats[i].start_date)
                    pocatelloWins++
                } else if (winnerName === 'Rexburg') {
                    rexWins++
                } else if (winnerName === 'Boise') {
                    boiseWins++
                } else if (winnerName === 'Bend') {
                    bendWins++
                }
            }
        }

    }
    // teamStandings

    // console.log("winnerName ", winnerName)
    console.log("team standings ", "Rex W ", rexWins, "Boise W ", boiseWins, "Bend W ", bendWins, "Pocatello W ", pocatelloWins, "KF W ", kfWins)

    let comReportStats = {
        comLeads: (companyLeads + companyECLeads),
        comQs: companySits,
        comCloses: companyCloses,
        comInstalls: companyScheduledInstalls,
        comScore: weekScore,
        rexWins: rexWins,
        boiseWins: boiseWins,
        pocatelloWins: pocatelloWins,
        kfWins: kfWins,
        bendWins: bendWins,
        pastWeeks: teamStats.length
    }    // console.log("companyLeads ", (companyLeads + companyECLeads))
    return {ComReportStats: comReportStats, TeamNumbers: teamNumbers}

}

async function getStatsTeam(dateRange) {
    // console.log(date)
    const users = await userService.getUsers()
    const teams = await teamService.getTeams()
    const accounts = await dbService.query('SELECT * FROM account')
    const startDateTime = dateRange.start + ' 15:00:00'

    let gettingDay = new Date(dateRange.end)
    gettingDay.setDate(gettingDay.getDate() + 1)
    // let tomorrow  = new Date(gettingDay)
    gettingDay = gettingDay.toISOString()
    gettingDay = gettingDay.split("T")
    // let utcEndDatetime = gettingDay[0] + ' 14:59:59'
    const endDateTime = gettingDay[0] + ' 14:59:59'

    // console.log("getstatsTEAM ", dateRange.start)
    let energyConsultants = []
    let fieldMarketers = []
    let teamScores = []
    let statesScores = [
        {
            State: "Idaho",
            Closes: 0,
            Score: 0,
            Leads: 0,
            Installs: 0,
            Qs: 0
        },
        {
            State: "Oregon",
            Closes: 0,
            Score: 0,
            Leads: 0,
            Installs: 0,
            Qs: 0
        }]
    // console.log("STATES SCORES", statesScores)
    for (let i = 0; i < teams.length; i++) {
        teamScores.push({Name: teams[i].teamName, Score: 0, Leads: 0, Qs: 0, Closes: 0, Installs: 0})
    }
    // console.log("TEAM SCORES AFTER LOOP ", teamScores)
    for (let i = 0; i < accounts.length; i++) {
        //Can't do this until people actually make accounts on pwrstation
        // let role = ''
        // const teamId = 0
        // for (let i = 0; i < users.length; i++) {
        //     let name = users[i].firstName + users[i].lastName
        //     if (name === accounts[i].Name) {
        //         if (users[i].roleId === 7) {
        //             role = "Field Marketer"
        //         }
        //         else {
        //             role = "Energy Consultant"
        //         }
        //         teamId = users[i].teamId
        //     }
        // }
        let accountTeam = accounts[i].Team__c
        let role = accounts[i].Position__c
        if (role === 'Field Marketer' || role === 'Field Marketer Elite') {
            let leadCount = await dbService.query('SELECT COUNT(*) FROM _lead WHERE Field_Marketer__c = ? AND Proposal_Requested_Date_Time__c >= ? AND Proposal_Requested_Date_Time__c <= ?', [accounts[i].Name, startDateTime, endDateTime])
            leadCount = leadCount[0]['COUNT(*)']
            let qsCount = await dbService.query('SELECT COUNT(*) FROM qs WHERE Field_Marketer__c = ? AND Appointment_Date__c >= ? AND Appointment_Date__c <= ?', [accounts[i].Name, dateRange.start, dateRange.end])
            qsCount = qsCount[0]['COUNT(*)']
            let assistedClosesCount = await dbService.query('SELECT COUNT(*) FROM assisted_close WHERE Field_Marketer__c = ? AND Site_Audit_Scheduled_Date_Time__c >= ? AND Site_Audit_Scheduled_Date_Time__c <= ?', [accounts[i].Name, startDateTime, endDateTime])
            assistedClosesCount = assistedClosesCount[0]['COUNT(*)']
            let assistedInstallsCount = await dbService.query('SELECT COUNT(*) FROM assisted_install WHERE _Name = ? AND Install_Complete_Date_Time__c >= ? AND Install_Complete_Date_Time__c <= ?', [accounts[i].Name, startDateTime, endDateTime])
            assistedInstallsCount = assistedInstallsCount[0]['COUNT(*)']
            let score = leadCount + qsCount * 2 + assistedClosesCount * 3 + assistedInstallsCount * 4
            //adding team to fieldMarketeres array
            if (accountTeam === 'Fox') {
                fieldMarketers.push({
                    Name: accounts[i].Name,
                    Score: score,
                    Leads: leadCount,
                    Qs: qsCount,
                    AssistedCloses: assistedClosesCount,
                    AssistedInstalls: assistedInstallsCount,
                    Team: 'Klamath Falls'
                })

                teamScores.forEach(function (team) {
                    if (team.Name === 'Klamath Falls') {
                        team.Score += leadCount + qsCount * 2
                        team.Leads += leadCount
                        team.Qs += qsCount
                    }
                })
                statesScores.forEach(function (state) {
                    if (state.State === 'Oregon') {
                        state.Score += leadCount + qsCount * 2
                        state.Leads += leadCount
                        state.Qs += qsCount
                    }
                })

            } else if (accountTeam === 'Pocatello') {
                fieldMarketers.push({
                    Name: accounts[i].Name,
                    Score: score,
                    Leads: leadCount,
                    Qs: qsCount,
                    AssistedCloses: assistedClosesCount,
                    AssistedInstalls: assistedInstallsCount,
                    Team: 'Rexburg'
                })

                teamScores.forEach(function (team) {
                    if (team.Name === 'Rexburg') {
                        team.Score += leadCount + qsCount * 2
                        team.Leads += leadCount
                        team.Qs += qsCount
                    }
                })

                statesScores.forEach(function (state) {
                    if (state.State === 'Idaho') {
                        state.Score += leadCount + qsCount * 2
                        state.Leads += leadCount
                        state.Qs += qsCount
                    }
                })
            } else if (accountTeam === 'Wolf') {
                fieldMarketers.push({
                    Name: accounts[i].Name,
                    Score: score,
                    Leads: leadCount,
                    Qs: qsCount,
                    AssistedCloses: assistedClosesCount,
                    AssistedInstalls: assistedInstallsCount,
                    Team: 'Boise'
                })

                teamScores.forEach(function (team) {
                    if (team.Name === 'Boise') {
                        team.Score += leadCount + qsCount * 2
                        team.Leads += leadCount
                        team.Qs += qsCount
                    }
                })

                statesScores.forEach(function (state) {
                    if (state.State === 'Idaho') {
                        state.Score += leadCount + qsCount * 2
                        state.Leads += leadCount
                        state.Qs += qsCount
                    }
                })
            } else {
                fieldMarketers.push({
                    Name: accounts[i].Name,
                    Score: score,
                    Leads: leadCount,
                    Qs: qsCount,
                    AssistedCloses: assistedClosesCount,
                    AssistedInstalls: assistedInstallsCount,
                    Team: accountTeam
                })
                teamScores.forEach(function (team) {
                    if (team.Name === accounts[i].Team__c) {
                        team.Score += leadCount + qsCount * 2
                        team.Leads += leadCount
                        team.Qs += qsCount
                    }
                })


            }
        } else if (role === 'Jr Energy Consultant' || role === 'Sr Energy Consultant' || role === 'Manager' || role === 'District Manager' || role === 'Sales Manager' || role === 'Regional Manager' || role === 'Energy Consultant') {
            let leadCount = await dbService.query("SELECT COUNT(*) FROM _lead WHERE Field_Marketer__c = ? AND Proposal_Requested_Date_Time__c >= ? AND Proposal_Requested_Date_Time__c <= ?", [accounts[i].Name, startDateTime, endDateTime])
            leadCount = leadCount[0]['COUNT(*)']
            let qsCount = await dbService.query('SELECT COUNT(*) FROM qs WHERE Field_Marketer__c = ? AND Appointment_Date__c >= ? AND Appointment_Date__c <= ?', [accounts[i].Name, dateRange.start, dateRange.end])
            qsCount = qsCount[0]['COUNT(*)']
            let closeCount = await dbService.query('SELECT COUNT(*) FROM _close WHERE Energy_Consultant__c = ? AND Site_Audit_Scheduled_Date_Time__c >= ? AND Site_Audit_Scheduled_Date_Time__c <= ?', [accounts[i].Name, startDateTime, endDateTime])
            closeCount = closeCount[0]['COUNT(*)']
            let assistedInstallsCount = await dbService.query('SELECT COUNT(*) FROM assisted_install WHERE _Name = ? AND Install_Complete_Date_Time__c >= ? AND Install_Complete_Date_Time__c <= ?', [accounts[i].Name, startDateTime, endDateTime])
            assistedInstallsCount = assistedInstallsCount[0]['COUNT(*)']
            let selfGenInstallsCount = await dbService.query('SELECT COUNT(*) FROM self_gen_install WHERE Energy_Consultant__c = ? AND Install_Complete_Date_Time__c >= ? AND Install_Complete_Date_Time__c <= ?', [accounts[i].Name, startDateTime, endDateTime])
            selfGenInstallsCount = selfGenInstallsCount[0]['COUNT(*)']
            let score = leadCount + qsCount * 0.25 + closeCount * 3 + assistedInstallsCount * 4 + selfGenInstallsCount * 6
            //adding team to energy consultants array
            if (accountTeam === 'Fox') {
                energyConsultants.push({
                    Name: accounts[i].Name,
                    Score: score,
                    Leads: leadCount,
                    Qs: qsCount,
                    Closes: closeCount,
                    AssistedInstalls: assistedInstallsCount,
                    SelfGenInstall: selfGenInstallsCount,
                    Team: 'Klamath Falls'
                })

                teamScores.forEach(function (team) {
                    if (team.Name === 'Klamath Falls') {
                        team.Score += leadCount + qsCount * 2
                        team.Leads += leadCount
                        team.Qs += qsCount
                        team.Closes += closeCount
                        team.Installs += assistedInstallsCount + selfGenInstallsCount
                    }
                })
                statesScores.forEach(function (state) {
                    if (state.State === 'Oregon') {
                        state.Score += leadCount + qsCount * 2
                        state.Leads += leadCount
                        state.Qs += qsCount
                    }
                })
            } else if (accountTeam === 'Pocatello') {
                energyConsultants.push({
                    Name: accounts[i].Name,
                    Score: score,
                    Leads: leadCount,
                    Qs: qsCount,
                    Closes: closeCount,
                    AssistedInstalls: assistedInstallsCount,
                    SelfGenInstall: selfGenInstallsCount,
                    Team: 'Rexburg'
                })

                teamScores.forEach(function (team) {
                    if (team.Name === 'Rexburg') {
                        team.Score += leadCount + qsCount * 2
                        team.Leads += leadCount
                        team.Qs += qsCount
                        team.Closes += closeCount
                        team.Installs += assistedInstallsCount + selfGenInstallsCount
                    }
                })
                statesScores.forEach(function (state) {
                    if (state.State === 'Idaho') {
                        state.Score += leadCount + qsCount * 2
                        state.Leads += leadCount
                        state.Qs += qsCount
                    }
                })
            } else if (accountTeam === 'Wolf') {
                energyConsultants.push({
                    Name: accounts[i].Name,
                    Score: score,
                    Leads: leadCount,
                    Qs: qsCount,
                    Closes: closeCount,
                    AssistedInstalls: assistedInstallsCount,
                    SelfGenInstall: selfGenInstallsCount,
                    Team: 'Boise'
                })

                teamScores.forEach(function (team) {
                    if (team.Name === 'Boise') {
                        team.Score += leadCount + qsCount * 2
                        team.Leads += leadCount
                        team.Qs += qsCount
                        team.Closes += closeCount
                        team.Installs += assistedInstallsCount + selfGenInstallsCount
                    }
                })
                statesScores.forEach(function (state) {
                    if (state.State === 'Idaho') {
                        state.Score += leadCount + qsCount * 2
                        state.Leads += leadCount
                        state.Qs += qsCount
                    }
                })
            } else {
                energyConsultants.push({
                    Name: accounts[i].Name,
                    Score: score,
                    Leads: leadCount,
                    Qs: qsCount,
                    Closes: closeCount,
                    AssistedInstalls: assistedInstallsCount,
                    SelfGenInstall: selfGenInstallsCount,
                    Team: accountTeam
                })
                // teamScores.forEach(function (team) {
                //     if (team.Name === accounts[i].Team__c) {
                //         team.Score += leadCount + qsCount * 2
                //         team.Leads += leadCount
                //         team.Qs += qsCount
                //         team.Closes += closeCount
                //         team.Installs += assistedInstallsCount + selfGenInstallsCount
                //     }
                // })
            }
            // teamScores[teamId - 1].Score += leadCount + qsCount * 0.25 + closeCount * 3 + assistedInstallsCount * 6 + selfGenInstallsCount * 6
            // teamScores[teamId - 1].Leads += leadCount
            // teamScores[teamId - 1].Qs += qsCount
            // teamScores[teamId - 1].Close += closeCount
            // teamScores[teamId - 1].Install += assistedInstallsCount + selfGenInstallsCount
        }
    }
    // console.log("SF service STATES ", statesScores)
    return {
        EnergyConsultantsTeam: energyConsultants,
        FieldMarketersTeam: fieldMarketers,
        TeamScoresTeam: teamScores,
        StateScores: statesScores
    }
}

async function getStatsFM(dateRange) {
    // console.log(date)
    const users = await userService.getUsers()
    const teams = await teamService.getTeams()
    const accounts = await dbService.query('SELECT * FROM account')
    const startDateTime = dateRange.start + ' 06:00:00'
    let gettingDay = new Date(dateRange.end)
    gettingDay.setDate(gettingDay.getDate() + 1)
    // let tomorrow  = new Date(gettingDay)
    gettingDay = gettingDay.toISOString()
    gettingDay = gettingDay.split("T")
    // let utcEndDatetime = gettingDay[0] + ' 14:59:59'
    const endDateTime = gettingDay[0] + ' 05:59:59'
    // console.log("getstatsTEAM ", startDateTime)
    let energyConsultants = []
    let fieldMarketers = []
    let teamScores = []
    let statesScores = [
        {
            State: "Idaho",
            Closes: 0,
            Score: 0,
            Leads: 0,
            Installs: 0,
            Qs: 0,

        },
        {
            State: "Oregon",
            Closes: 0,
            Score: 0,
            Leads: 0,
            Installs: 0,
            Qs: 0,
        }]

    for (let i = 0; i < teams.length; i++) {
        teamScores.push({Name: teams[i].teamName, Score: 0, Leads: 0, Qs: 0, Closes: 0, Installs: 0})
    }
    for (let i = 0; i < accounts.length; i++) {
        //Can't do this until people actually make accounts on pwrstation
        // let role = ''
        // const teamId = 0
        // for (let i = 0; i < users.length; i++) {
        //     let name = users[i].firstName + users[i].lastName
        //     if (name === accounts[i].Name) {
        //         if (users[i].roleId === 7) {
        //             role = "Field Marketer"
        //         }
        //         else {
        //             role = "Energy Consultant"
        //         }
        //         teamId = users[i].teamId
        //     }
        // }
        let accountTeam = accounts[i].Team__c

        let role = accounts[i].Position__c
        if (role === 'Field Marketer' || role === 'Field Marketer Elite') {
            // let leadCount = await dbService.query('SELECT COUNT(*) FROM _lead WHERE Field_Marketer__c = ? AND Proposal_Requested_Date_Time__c >= ? AND Proposal_Requested_Date_Time__c <= ?', [accounts[i].Name, startDateTime, endDateTime])
            let leadCount = await dbService.query('SELECT COUNT(*) FROM _lead WHERE Field_Marketer__c = ? AND Proposal_Requested_Date_Time__c >= ? AND Proposal_Requested_Date_Time__c <= ?', [accounts[i].Name, startDateTime, endDateTime])
            leadCount = leadCount[0]['COUNT(*)']
            let qsCount = await dbService.query('SELECT COUNT(*) FROM qs WHERE Field_Marketer__c = ? AND Appointment_Date__c >= ? AND Appointment_Date__c <= ?', [accounts[i].Name, dateRange.start, dateRange.end])
            qsCount = qsCount[0]['COUNT(*)']
            // let assistedClosesCount = await dbService.query('SELECT COUNT(*) FROM assisted_close WHERE Field_Marketer__c = ? AND Site_Audit_Scheduled_Date_Time__c >= ? AND Site_Audit_Scheduled_Date_Time__c <= ?', [accounts[i].Name, startDateTime, endDateTime])
            let assistedClosesCount = await dbService.query('SELECT COUNT(*) FROM assisted_close WHERE Field_Marketer__c = ? AND Site_Audit_Scheduled_Date_Time__c >= ? AND Site_Audit_Scheduled_Date_Time__c <= ?', [accounts[i].Name, startDateTime, endDateTime])
            assistedClosesCount = assistedClosesCount[0]['COUNT(*)']
            // let assistedInstallsCount = await dbService.query('SELECT COUNT(*) FROM assisted_install WHERE _Name = ? AND Install_Complete_Date_Time__c >= ? AND Install_Complete_Date_Time__c <= ?', [accounts[i].Name, startDateTime, endDateTime])
            let assistedInstallsCount = await dbService.query('SELECT COUNT(*) FROM assisted_install WHERE _Name = ? AND Install_Complete_Date_Time__c >= ? AND Install_Complete_Date_Time__c <= ?', [accounts[i].Name, startDateTime, endDateTime])
            let scheduledInstallsCount = await dbService.query('SELECT COUNT(*) FROM install_scheduled WHERE RepName = ? AND Install_Scheduled_Date_Time__c >= ? AND Install_Scheduled_Date_Time__c <= ?', [accounts[i].Name, startDateTime, endDateTime])
            scheduledInstallsCount = scheduledInstallsCount[0]['COUNT(*)']
            assistedInstallsCount = assistedInstallsCount[0]['COUNT(*)']
            // console.log("SCHEDULED INSTALLS COUNT ", scheduledInstallsCount)
            // console.log("SCHEDULED INSTALLS COUNT ", assistedInstallsCount)
            // let score = leadCount + qsCount * 2 + assistedClosesCount * 3 + assistedInstallsCount * 4
            let score = leadCount + (qsCount * 2) + (scheduledInstallsCount * 4)

            //adding team to fieldMarketeres array
            if (accountTeam === 'Fox') {
                fieldMarketers.push({
                    Name: accounts[i].Name,
                    Score: score,
                    Leads: leadCount,
                    Qs: qsCount,
                    Closes: '-',
                    AssistedCloses: assistedClosesCount,
                    AssistedInstalls: assistedInstallsCount,
                    ScheduledInstalls: scheduledInstallsCount,
                    SelfGenInstall: '-',
                    Team: 'Klamath Falls'
                })

                teamScores.forEach(function (team) {
                    if (team.Name === 'Klamath Falls') {
                        team.Score += leadCount + qsCount * 2
                        team.Leads += leadCount
                        team.Qs += qsCount
                        team.Installs += scheduledInstallsCount
                    }
                })

                statesScores.forEach(function (state) {
                    if (state.State === 'Oregon') {
                        state.Score += leadCount + (qsCount * 2) + (scheduledInstallsCount * 4)
                        state.Leads += leadCount
                        state.Qs += qsCount
                        state.Installs += scheduledInstallsCount
                    }
                })

            } else if (accountTeam === 'Pocatello') {
                fieldMarketers.push({
                    Name: accounts[i].Name,
                    Score: score,
                    Leads: leadCount,
                    Qs: qsCount,
                    Closes: '-',
                    AssistedCloses: assistedClosesCount,
                    AssistedInstalls: assistedInstallsCount,
                    ScheduledInstalls: scheduledInstallsCount,
                    SelfGenInstall: '-',
                    Team: 'Rexburg'
                })

                teamScores.forEach(function (team) {
                    if (team.Name === 'Rexburg') {
                        team.Score += leadCount + qsCount * 2
                        team.Leads += leadCount
                        team.Qs += qsCount
                        team.Installs += scheduledInstallsCount
                    }
                })

                statesScores.forEach(function (state) {
                    if (state.State === 'Idaho') {
                        state.Score += leadCount + (qsCount * 2) + (scheduledInstallsCount * 4)
                        state.Leads += leadCount
                        state.Qs += qsCount
                        state.Installs += scheduledInstallsCount
                    }
                })

            } else if (accountTeam === 'Wolf') {
                // console.log(accounts[i].Name)
                fieldMarketers.push({

                    Name: accounts[i].Name,
                    Score: score,
                    Leads: leadCount,
                    Qs: qsCount,
                    Closes: '-',
                    AssistedCloses: assistedClosesCount,
                    AssistedInstalls: assistedInstallsCount,
                    ScheduledInstalls: scheduledInstallsCount,
                    SelfGenInstall: '-',
                    Team: 'Boise'

                })

                teamScores.forEach(function (team) {
                    if (team.Name === 'Boise') {
                        team.Score += leadCount + qsCount * 2
                        team.Leads += leadCount
                        team.Qs += qsCount
                        team.Installs += assistedInstallsCount
                    }
                })

                statesScores.forEach(function (state) {
                    if (state.State === 'Idaho') {
                        state.Score += leadCount + (qsCount * 2) + (scheduledInstallsCount * 4)
                        state.Leads += leadCount
                        state.Qs += qsCount
                        state.Installs += scheduledInstallsCount
                    }
                })

            } else {
                fieldMarketers.push({
                    Name: accounts[i].Name,
                    Score: score,
                    Leads: leadCount,
                    Qs: qsCount,
                    Closes: '-',
                    AssistedCloses: assistedClosesCount,
                    AssistedInstalls: assistedInstallsCount,
                    ScheduledInstalls: scheduledInstallsCount,
                    SelfGenInstall: '-',
                    Team: accountTeam
                })
                teamScores.forEach(function (team) {
                    if (team.Name === accounts[i].Team__c) {
                        team.Score += leadCount + qsCount * 2
                        team.Leads += leadCount
                        team.Qs += qsCount
                        team.Installs += scheduledInstallsCount
                    }
                })
                statesScores.forEach(function (state) {
                    if (state.State === 'Idaho') {
                        state.Score += leadCount + (qsCount * 2) + (scheduledInstallsCount * 4)
                        state.Leads += leadCount
                        state.Qs += qsCount
                        state.Installs += scheduledInstallsCount
                    }
                })
            }
        } else if (role === 'Jr Energy Consultant' || role === 'Sr Energy Consultant' || role === 'Manager' || role === 'District Manager' || role === 'Sales Manager' || role === 'Regional Manager' || role === 'Energy Consultant') {
            // let leadCount = await dbService.query("SELECT COUNT(*) FROM _lead WHERE Field_Marketer__c = ? AND Proposal_Requested_Date_Time__c >= ? AND Proposal_Requested_Date_Time__c <= ?", [accounts[i].Name, startDateTime, endDateTime])
            let leadCount = await dbService.query("SELECT COUNT(*) FROM _lead WHERE Field_Marketer__c = ? AND Proposal_Requested_Date_Time__c >= ? AND Proposal_Requested_Date_Time__c <= ?", [accounts[i].Name, startDateTime, endDateTime])
            leadCount = leadCount[0]['COUNT(*)']
            let qsCount = await dbService.query('SELECT COUNT(*) FROM qs WHERE Field_Marketer__c = ? AND Appointment_Date__c >= ? AND Appointment_Date__c <= ?', [accounts[i].Name, dateRange.start, dateRange.end])
            qsCount = qsCount[0]['COUNT(*)']
            // let closeCount = await dbService.query('SELECT COUNT(*) FROM _close WHERE Energy_Consultant__c = ? AND Site_Audit_Scheduled_Date_Time__c >= ? AND Site_Audit_Scheduled_Date_Time__c <= ?', [accounts[i].Name, startDateTime, endDateTime])
            let closeCount = await dbService.query('SELECT COUNT(*) FROM _close WHERE Energy_Consultant__c = ? AND Site_Audit_Scheduled_Date_Time__c >= ? AND Site_Audit_Scheduled_Date_Time__c <= ?', [accounts[i].Name, startDateTime, endDateTime])
            closeCount = closeCount[0]['COUNT(*)']
            // let assistedInstallsCount = await dbService.query('SELECT COUNT(*) FROM assisted_install WHERE _Name = ? AND Install_Complete_Date_Time__c >= ? AND Install_Complete_Date_Time__c <= ?', [accounts[i].Name, startDateTime, endDateTime])
            let assistedInstallsCount = await dbService.query('SELECT COUNT(*) FROM assisted_install WHERE _Name = ? AND Install_Complete_Date_Time__c >= ? AND Install_Complete_Date_Time__c <= ?', [accounts[i].Name, startDateTime, endDateTime])
            assistedInstallsCount = assistedInstallsCount[0]['COUNT(*)']
            // let selfGenInstallsCount = await dbService.query('SELECT COUNT(*) FROM self_gen_install WHERE Energy_Consultant__c = ? AND Install_Complete_Date_Time__c >= ? AND Install_Complete_Date_Time__c <= ?', [accounts[i].Name, startDateTime, endDateTime])
            let selfGenInstallsCount = await dbService.query('SELECT COUNT(*) FROM self_gen_install WHERE Energy_Consultant__c = ? AND Install_Complete_Date_Time__c >= ? AND Install_Complete_Date_Time__c <= ?', [accounts[i].Name, startDateTime, endDateTime])
            selfGenInstallsCount = selfGenInstallsCount[0]['COUNT(*)']
            let scheduledInstallsCount = await dbService.query('SELECT COUNT(*) FROM install_scheduled WHERE RepName = ? AND Install_Scheduled_Date_Time__c >= ? AND Install_Scheduled_Date_Time__c <= ?', [accounts[i].Name, startDateTime, endDateTime])
            scheduledInstallsCount = scheduledInstallsCount[0]['COUNT(*)']

            // let score = leadCount + qsCount * 0.25 + closeCount * 3 + assistedInstallsCount * 4 + selfGenInstallsCount * 6
            let score = leadCount + (qsCount * 2) + (closeCount * 3) + (scheduledInstallsCount * 4)
            //adding team to energy consultants array
            if (accountTeam === 'Fox') {
                energyConsultants.push({
                    Name: accounts[i].Name,
                    Score: score,
                    Leads: leadCount,
                    Qs: qsCount,
                    Closes: closeCount,
                    AssistedCloses: '-',
                    AssistedInstalls: assistedInstallsCount,
                    SelfGenInstall: selfGenInstallsCount,
                    ScheduledInstalls: scheduledInstallsCount,
                    Team: 'Klamath Falls'
                })

                teamScores.forEach(function (team) {
                    if (team.Name === 'Klamath Falls') {
                        team.Score += leadCount + (qsCount * 2) + (closeCount * 3)
                        team.Leads += leadCount
                        team.Qs += qsCount
                        team.Closes += closeCount
                        team.Installs += scheduledInstallsCount
                    }
                })
                statesScores.forEach(function (state) {
                    if (state.State === 'Oregon') {
                        state.Score += leadCount + (qsCount * 2) + (closeCount * 3) + (scheduledInstallsCount * 4)
                        state.Leads += leadCount
                        state.Qs += qsCount
                        state.Closes += closeCount
                        state.Installs += scheduledInstallsCount
                    }
                })


            } else if (accountTeam === 'Pocatello') {
                energyConsultants.push({
                    Name: accounts[i].Name,
                    Score: score,
                    Leads: leadCount,
                    Qs: qsCount,
                    Closes: closeCount,
                    AssistedCloses: '-',
                    AssistedInstalls: assistedInstallsCount,
                    SelfGenInstall: selfGenInstallsCount,
                    ScheduledInstalls: scheduledInstallsCount,
                    Team: 'Rexburg'
                })

                teamScores.forEach(function (team) {
                    if (team.Name === 'Rexburg') {
                        team.Score += leadCount + qsCount * 2
                        team.Leads += leadCount
                        team.Qs += qsCount
                        team.Closes += closeCount
                        // team.Installs += assistedInstallsCount + selfGenInstallsCount
                        team.Installs += scheduledInstallsCount
                    }
                })
                statesScores.forEach(function (state) {
                    if (state.State === 'Idaho') {
                        // state.Score += ((leadCount + qsCount) * 2) + (assistedInstallsCount * 3)
                        state.Score += leadCount + (qsCount * 2) + (closeCount * 3) + (scheduledInstallsCount * 4)
                        state.Leads += leadCount
                        state.Qs += qsCount
                        state.Closes += closeCount
                        // state.Installs += assistedInstallsCount + selfGenInstallsCount
                        state.Installs += scheduledInstallsCount
                    }
                })


            } else if (accountTeam === 'Wolf') {
                energyConsultants.push({
                    Name: accounts[i].Name,
                    Score: score,
                    Leads: leadCount,
                    Qs: qsCount,
                    Closes: closeCount,
                    AssistedCloses: '-',
                    AssistedInstalls: assistedInstallsCount,
                    SelfGenInstall: selfGenInstallsCount,
                    ScheduledInstalls: scheduledInstallsCount,
                    Team: 'Boise'
                })

                teamScores.forEach(function (team) {
                    if (team.Name === 'Boise') {
                        team.Score += leadCount + qsCount * 2 + closeCount
                        team.Leads += leadCount
                        team.Qs += qsCount
                        team.Closes += closeCount
                        // team.Installs += assistedInstallsCount + selfGenInstallsCount
                        team.Installs += scheduledInstallsCount
                    }
                })

                statesScores.forEach(function (state) {
                    if (state.State === 'Idaho') {
                        state.Score += leadCount + (qsCount * 2) + (closeCount * 3) + (scheduledInstallsCount * 4)
                        state.Leads += leadCount
                        state.Qs += qsCount
                        state.Closes += closeCount
                        // state.Installs += assistedInstallsCount + selfGenInstallsCount
                        state.Installs += scheduledInstallsCount
                    }
                })
            } else {
                energyConsultants.push({
                    Name: accounts[i].Name,
                    Score: score,
                    Leads: leadCount,
                    Qs: qsCount,
                    Closes: closeCount,
                    AssistedCloses: '-',
                    AssistedInstalls: assistedInstallsCount,
                    SelfGenInstall: selfGenInstallsCount,
                    ScheduledInstalls: scheduledInstallsCount,
                    Team: accountTeam
                })
                statesScores.forEach(function (state) {
                    if (state.State === 'Idaho') {
                        state.Score += leadCount + (qsCount * 2) + (closeCount * 3) + (scheduledInstallsCount * 4)
                        state.Leads += leadCount
                        state.Qs += qsCount
                        state.Closes += closeCount
                        // state.Installs += assistedInstallsCount + selfGenInstallsCount
                        state.Installs += scheduledInstallsCount
                    }
                })
                // teamScores.forEach(function (team) {
                //     if (team.Name === accounts[i].Team__c) {
                //         team.Score += leadCount + qsCount * 2
                //         team.Leads += leadCount
                //         team.Qs += qsCount
                //         team.Closes += closeCount
                //         team.Installs += assistedInstallsCount + selfGenInstallsCount
                //     }
                // })
            }
            // let bloodlineGrowth = await dbService.query('SELECT COUNT(*) FROM user WHERE Field_Marketer__c = ? AND Appointment_Date__c >= ? AND Appointment_Date__c <= ?', [accounts[i].Name, dateRange.start, dateRange.end])
            // teamScores[teamId - 1].Score += leadCount + qsCount * 0.25 + closeCount * 3 + assistedInstallsCount * 6 + selfGenInstallsCount * 6
            // teamScores[teamId - 1].Leads += leadCount
            // teamScores[teamId - 1].Qs += qsCount
            // teamScores[teamId - 1].Close += closeCount
            // teamScores[teamId - 1].Install += assistedInstallsCount + selfGenInstallsCount
            // console.log("GET STATS FROM SF SERVICE ", teamScores)
        }
    }
    // console.log("SF service FM", fieldMarketers)
    return {EnergyConsultantsFM: energyConsultants, FieldMarketersFM: fieldMarketers, TeamScoresFM: teamScores}
}

async function getStatsEC(dateRange) {
    // console.log(date)
    const users = await userService.getUsers()
    const teams = await teamService.getTeams()
    const accounts = await dbService.query('SELECT * FROM account')
    const startDateTime = dateRange.start + ' 15:00:00'
    let gettingDay = new Date(dateRange.end)
    gettingDay.setDate(gettingDay.getDate() + 1)
    // let tomorrow  = new Date(gettingDay)
    gettingDay = gettingDay.toISOString()
    gettingDay = gettingDay.split("T")
    // let utcEndDatetime = gettingDay[0] + ' 14:59:59'
    const endDateTime = gettingDay[0] + ' 14:59:59'
    // console.log("getstatsTEAM ", startDateTime)
    let energyConsultants = []
    let fieldMarketers = []
    let teamScores = []
    let statesScores = [
        {
            State: "Idaho",
            Closes: 0,
            Score: 0,
            Leads: 0,
            Installs: 0,
            Qs: 0,

        },
        {
            State: "Oregon",
            Closes: 0,
            Score: 0,
            Leads: 0,
            Installs: 0,
            Qs: 0,
        }]
    for (let i = 0; i < teams.length; i++) {
        teamScores.push({Name: teams[i].teamName, Score: 0, Leads: 0, Qs: 0, Closes: 0, Installs: 0})
    }
    for (let i = 0; i < accounts.length; i++) {
        //Can't do this until people actually make accounts on pwrstation
        // let role = ''
        // const teamId = 0
        // for (let i = 0; i < users.length; i++) {
        //     let name = users[i].firstName + users[i].lastName
        //     if (name === accounts[i].Name) {
        //         if (users[i].roleId === 7) {
        //             role = "Field Marketer"
        //         }
        //         else {
        //             role = "Energy Consultant"
        //         }
        //         teamId = users[i].teamId
        //     }
        // }
        let accountTeam = accounts[i].Team__c

        let role = accounts[i].Position__c
        if (role === 'Field Marketer' || role === 'Field Marketer Elite') {
            // let leadCount = await dbService.query('SELECT COUNT(*) FROM _lead WHERE Field_Marketer__c = ? AND Proposal_Requested_Date_Time__c >= ? AND Proposal_Requested_Date_Time__c <= ?', [accounts[i].Name, startDateTime, endDateTime])
            let leadCount = await dbService.query('SELECT COUNT(*) FROM _lead WHERE Field_Marketer__c = ? AND Proposal_Requested_Date_Time__c >= ? AND Proposal_Requested_Date_Time__c <= ?', [accounts[i].Name, startDateTime, endDateTime])
            leadCount = leadCount[0]['COUNT(*)']
            let qsCount = await dbService.query('SELECT COUNT(*) FROM qs WHERE Field_Marketer__c = ? AND Appointment_Date__c >= ? AND Appointment_Date__c <= ?', [accounts[i].Name, dateRange.start, dateRange.end])
            qsCount = qsCount[0]['COUNT(*)']
            // let assistedClosesCount = await dbService.query('SELECT COUNT(*) FROM assisted_close WHERE Field_Marketer__c = ? AND Site_Audit_Scheduled_Date_Time__c >= ? AND Site_Audit_Scheduled_Date_Time__c <= ?', [accounts[i].Name, startDateTime, endDateTime])
            let assistedClosesCount = await dbService.query('SELECT COUNT(*) FROM assisted_close WHERE Field_Marketer__c = ? AND Site_Audit_Scheduled_Date_Time__c >= ? AND Site_Audit_Scheduled_Date_Time__c <= ?', [accounts[i].Name, startDateTime, endDateTime])
            assistedClosesCount = assistedClosesCount[0]['COUNT(*)']
            // let assistedInstallsCount = await dbService.query('SELECT COUNT(*) FROM assisted_install WHERE _Name = ? AND Install_Complete_Date_Time__c >= ? AND Install_Complete_Date_Time__c <= ?', [accounts[i].Name, startDateTime, endDateTime])
            let assistedInstallsCount = await dbService.query('SELECT COUNT(*) FROM assisted_install WHERE _Name = ? AND Install_Complete_Date_Time__c >= ? AND Install_Complete_Date_Time__c <= ?', [accounts[i].Name, startDateTime, endDateTime])
            let scheduledInstallsCount = await dbService.query('SELECT COUNT(*) FROM install_scheduled WHERE RepName = ? AND Install_Scheduled_Date_Time__c >= ? AND Install_Scheduled_Date_Time__c <= ?', [accounts[i].Name, startDateTime, endDateTime])
            scheduledInstallsCount = scheduledInstallsCount[0]['COUNT(*)']
            assistedInstallsCount = assistedInstallsCount[0]['COUNT(*)']
            // console.log("SCHEDULED INSTALLS COUNT ", scheduledInstallsCount)
            // console.log("SCHEDULED INSTALLS COUNT ", assistedInstallsCount)
            // let score = leadCount + qsCount * 2 + assistedClosesCount * 3 + assistedInstallsCount * 4
            let score = leadCount + (qsCount * 2) + (scheduledInstallsCount * 4)

            //adding team to fieldMarketeres array
            if (accountTeam === 'Fox') {
                fieldMarketers.push({
                    Name: accounts[i].Name,
                    Score: score,
                    Leads: leadCount,
                    Qs: qsCount,
                    Closes: '-',
                    AssistedCloses: assistedClosesCount,
                    AssistedInstalls: assistedInstallsCount,
                    ScheduledInstalls: scheduledInstallsCount,
                    SelfGenInstall: '-',
                    Team: 'Klamath Falls'
                })

                teamScores.forEach(function (team) {
                    if (team.Name === 'Klamath Falls') {
                        team.Score += leadCount + qsCount * 2
                        team.Leads += leadCount
                        team.Qs += qsCount
                        team.Installs += scheduledInstallsCount
                    }
                })

                statesScores.forEach(function (state) {
                    if (state.State === 'Oregon') {
                        state.Score += leadCount + (qsCount * 2) + (scheduledInstallsCount * 4)
                        state.Leads += leadCount
                        state.Qs += qsCount
                        state.Installs += scheduledInstallsCount
                    }
                })

            } else if (accountTeam === 'Pocatello') {
                fieldMarketers.push({
                    Name: accounts[i].Name,
                    Score: score,
                    Leads: leadCount,
                    Qs: qsCount,
                    Closes: '-',
                    AssistedCloses: assistedClosesCount,
                    AssistedInstalls: assistedInstallsCount,
                    ScheduledInstalls: scheduledInstallsCount,
                    SelfGenInstall: '-',
                    Team: 'Rexburg'
                })

                teamScores.forEach(function (team) {
                    if (team.Name === 'Rexburg') {
                        team.Score += leadCount + qsCount * 2
                        team.Leads += leadCount
                        team.Qs += qsCount
                        team.Installs += scheduledInstallsCount
                    }
                })

                statesScores.forEach(function (state) {
                    if (state.State === 'Idaho') {
                        state.Score += leadCount + (qsCount * 2) + (scheduledInstallsCount * 4)
                        state.Leads += leadCount
                        state.Qs += qsCount
                        state.Installs += scheduledInstallsCount
                    }
                })

            } else if (accountTeam === 'Wolf') {
                // console.log(accounts[i].Name)
                fieldMarketers.push({

                    Name: accounts[i].Name,
                    Score: score,
                    Leads: leadCount,
                    Qs: qsCount,
                    Closes: '-',
                    AssistedCloses: assistedClosesCount,
                    AssistedInstalls: assistedInstallsCount,
                    ScheduledInstalls: scheduledInstallsCount,
                    SelfGenInstall: '-',
                    Team: 'Boise'

                })

                teamScores.forEach(function (team) {
                    if (team.Name === 'Boise') {
                        team.Score += leadCount + qsCount * 2
                        team.Leads += leadCount
                        team.Qs += qsCount
                        team.Installs += assistedInstallsCount
                    }
                })

                statesScores.forEach(function (state) {
                    if (state.State === 'Idaho') {
                        state.Score += leadCount + (qsCount * 2) + (scheduledInstallsCount * 4)
                        state.Leads += leadCount
                        state.Qs += qsCount
                        state.Installs += scheduledInstallsCount
                    }
                })

            } else {
                fieldMarketers.push({
                    Name: accounts[i].Name,
                    Score: score,
                    Leads: leadCount,
                    Qs: qsCount,
                    Closes: '-',
                    AssistedCloses: assistedClosesCount,
                    AssistedInstalls: assistedInstallsCount,
                    ScheduledInstalls: scheduledInstallsCount,
                    SelfGenInstall: '-',
                    Team: accountTeam
                })
                teamScores.forEach(function (team) {
                    if (team.Name === accounts[i].Team__c) {
                        team.Score += leadCount + qsCount * 2
                        team.Leads += leadCount
                        team.Qs += qsCount
                        team.Installs += scheduledInstallsCount
                    }
                })
                statesScores.forEach(function (state) {
                    if (state.State === 'Idaho') {
                        state.Score += leadCount + (qsCount * 2) + (scheduledInstallsCount * 4)
                        state.Leads += leadCount
                        state.Qs += qsCount
                        state.Installs += scheduledInstallsCount
                    }
                })
            }
        } else if (role === 'Jr Energy Consultant' || role === 'Sr Energy Consultant' || role === 'Manager' || role === 'District Manager') {
            // let leadCount = await dbService.query("SELECT COUNT(*) FROM _lead WHERE Field_Marketer__c = ? AND Proposal_Requested_Date_Time__c >= ? AND Proposal_Requested_Date_Time__c <= ?", [accounts[i].Name, startDateTime, endDateTime])
            let leadCount = await dbService.query("SELECT COUNT(*) FROM _lead WHERE Field_Marketer__c = ? AND Proposal_Requested_Date_Time__c >= ? AND Proposal_Requested_Date_Time__c <= ?", [accounts[i].Name, startDateTime, endDateTime])
            leadCount = leadCount[0]['COUNT(*)']
            let qsCount = await dbService.query('SELECT COUNT(*) FROM qs WHERE Field_Marketer__c = ? AND Appointment_Date__c >= ? AND Appointment_Date__c <= ?', [accounts[i].Name, dateRange.start, dateRange.end])
            qsCount = qsCount[0]['COUNT(*)']
            // let closeCount = await dbService.query('SELECT COUNT(*) FROM _close WHERE Energy_Consultant__c = ? AND Site_Audit_Scheduled_Date_Time__c >= ? AND Site_Audit_Scheduled_Date_Time__c <= ?', [accounts[i].Name, startDateTime, endDateTime])
            let closeCount = await dbService.query('SELECT COUNT(*) FROM _close WHERE Energy_Consultant__c = ? AND Site_Audit_Scheduled_Date_Time__c >= ? AND Site_Audit_Scheduled_Date_Time__c <= ?', [accounts[i].Name, startDateTime, endDateTime])
            closeCount = closeCount[0]['COUNT(*)']
            // let assistedInstallsCount = await dbService.query('SELECT COUNT(*) FROM assisted_install WHERE _Name = ? AND Install_Complete_Date_Time__c >= ? AND Install_Complete_Date_Time__c <= ?', [accounts[i].Name, startDateTime, endDateTime])
            let assistedInstallsCount = await dbService.query('SELECT COUNT(*) FROM assisted_install WHERE _Name = ? AND Install_Complete_Date_Time__c >= ? AND Install_Complete_Date_Time__c <= ?', [accounts[i].Name, startDateTime, endDateTime])
            assistedInstallsCount = assistedInstallsCount[0]['COUNT(*)']
            // let selfGenInstallsCount = await dbService.query('SELECT COUNT(*) FROM self_gen_install WHERE Energy_Consultant__c = ? AND Install_Complete_Date_Time__c >= ? AND Install_Complete_Date_Time__c <= ?', [accounts[i].Name, startDateTime, endDateTime])
            let selfGenInstallsCount = await dbService.query('SELECT COUNT(*) FROM self_gen_install WHERE Energy_Consultant__c = ? AND Install_Complete_Date_Time__c >= ? AND Install_Complete_Date_Time__c <= ?', [accounts[i].Name, startDateTime, endDateTime])
            selfGenInstallsCount = selfGenInstallsCount[0]['COUNT(*)']
            let scheduledInstallsCount = await dbService.query('SELECT COUNT(*) FROM install_scheduled WHERE RepName = ? AND Install_Scheduled_Date_Time__c >= ? AND Install_Scheduled_Date_Time__c <= ?', [accounts[i].Name, startDateTime, endDateTime])
            scheduledInstallsCount = scheduledInstallsCount[0]['COUNT(*)']

            // let score = leadCount + qsCount * 0.25 + closeCount * 3 + assistedInstallsCount * 4 + selfGenInstallsCount * 6
            let score = leadCount + (qsCount * 2) + (closeCount * 3) + (scheduledInstallsCount * 4)
            //adding team to energy consultants array
            if (accountTeam === 'Fox') {
                energyConsultants.push({
                    Name: accounts[i].Name,
                    Score: score,
                    Leads: leadCount,
                    Qs: qsCount,
                    Closes: closeCount,
                    AssistedCloses: '-',
                    AssistedInstalls: assistedInstallsCount,
                    SelfGenInstall: selfGenInstallsCount,
                    ScheduledInstalls: scheduledInstallsCount,
                    Team: 'Klamath Falls'
                })

                teamScores.forEach(function (team) {
                    if (team.Name === 'Klamath Falls') {
                        team.Score += leadCount + (qsCount * 2) + (closeCount * 3)
                        team.Leads += leadCount
                        team.Qs += qsCount
                        team.Closes += closeCount
                        team.Installs += scheduledInstallsCount
                    }
                })
                statesScores.forEach(function (state) {
                    if (state.State === 'Oregon') {
                        state.Score += leadCount + (qsCount * 2) + (closeCount * 3) + (scheduledInstallsCount * 4)
                        state.Leads += leadCount
                        state.Qs += qsCount
                        state.Closes += closeCount
                        state.Installs += scheduledInstallsCount
                    }
                })


            } else if (accountTeam === 'Pocatello') {
                energyConsultants.push({
                    Name: accounts[i].Name,
                    Score: score,
                    Leads: leadCount,
                    Qs: qsCount,
                    Closes: closeCount,
                    AssistedCloses: '-',
                    AssistedInstalls: assistedInstallsCount,
                    SelfGenInstall: selfGenInstallsCount,
                    ScheduledInstalls: scheduledInstallsCount,
                    Team: 'Rexburg'
                })

                teamScores.forEach(function (team) {
                    if (team.Name === 'Rexburg') {
                        team.Score += leadCount + qsCount * 2
                        team.Leads += leadCount
                        team.Qs += qsCount
                        team.Closes += closeCount
                        // team.Installs += assistedInstallsCount + selfGenInstallsCount
                        team.Installs += scheduledInstallsCount
                    }
                })
                statesScores.forEach(function (state) {
                    if (state.State === 'Idaho') {
                        // state.Score += ((leadCount + qsCount) * 2) + (assistedInstallsCount * 3)
                        state.Score += leadCount + (qsCount * 2) + (closeCount * 3) + (scheduledInstallsCount * 4)
                        state.Leads += leadCount
                        state.Qs += qsCount
                        state.Closes += closeCount
                        // state.Installs += assistedInstallsCount + selfGenInstallsCount
                        state.Installs += scheduledInstallsCount
                    }
                })


            } else if (accountTeam === 'Wolf') {
                energyConsultants.push({
                    Name: accounts[i].Name,
                    Score: score,
                    Leads: leadCount,
                    Qs: qsCount,
                    Closes: closeCount,
                    AssistedCloses: '-',
                    AssistedInstalls: assistedInstallsCount,
                    SelfGenInstall: selfGenInstallsCount,
                    ScheduledInstalls: scheduledInstallsCount,
                    Team: 'Boise'
                })

                teamScores.forEach(function (team) {
                    if (team.Name === 'Boise') {
                        team.Score += leadCount + qsCount * 2 + closeCount
                        team.Leads += leadCount
                        team.Qs += qsCount
                        team.Closes += closeCount
                        // team.Installs += assistedInstallsCount + selfGenInstallsCount
                        team.Installs += scheduledInstallsCount
                    }
                })

                statesScores.forEach(function (state) {
                    if (state.State === 'Idaho') {
                        state.Score += leadCount + (qsCount * 2) + (closeCount * 3) + (scheduledInstallsCount * 4)
                        state.Leads += leadCount
                        state.Qs += qsCount
                        state.Closes += closeCount
                        // state.Installs += assistedInstallsCount + selfGenInstallsCount
                        state.Installs += scheduledInstallsCount
                    }
                })
            } else {
                energyConsultants.push({
                    Name: accounts[i].Name,
                    Score: score,
                    Leads: leadCount,
                    Qs: qsCount,
                    Closes: closeCount,
                    AssistedCloses: '-',
                    AssistedInstalls: assistedInstallsCount,
                    SelfGenInstall: selfGenInstallsCount,
                    ScheduledInstalls: scheduledInstallsCount,
                    Team: accountTeam
                })
                statesScores.forEach(function (state) {
                    if (state.State === 'Idaho') {
                        state.Score += leadCount + (qsCount * 2) + (closeCount * 3) + (scheduledInstallsCount * 4)
                        state.Leads += leadCount
                        state.Qs += qsCount
                        state.Closes += closeCount
                        // state.Installs += assistedInstallsCount + selfGenInstallsCount
                        state.Installs += scheduledInstallsCount
                    }
                })
                // teamScores.forEach(function (team) {
                //     if (team.Name === accounts[i].Team__c) {
                //         team.Score += leadCount + qsCount * 2
                //         team.Leads += leadCount
                //         team.Qs += qsCount
                //         team.Closes += closeCount
                //         team.Installs += assistedInstallsCount + selfGenInstallsCount
                //     }
                // })
            }
            // let bloodlineGrowth = await dbService.query('SELECT COUNT(*) FROM user WHERE Field_Marketer__c = ? AND Appointment_Date__c >= ? AND Appointment_Date__c <= ?', [accounts[i].Name, dateRange.start, dateRange.end])
            // teamScores[teamId - 1].Score += leadCount + qsCount * 0.25 + closeCount * 3 + assistedInstallsCount * 6 + selfGenInstallsCount * 6
            // teamScores[teamId - 1].Leads += leadCount
            // teamScores[teamId - 1].Qs += qsCount
            // teamScores[teamId - 1].Close += closeCount
            // teamScores[teamId - 1].Install += assistedInstallsCount + selfGenInstallsCount
            // console.log("GET STATS FROM SF SERVICE ", teamScores)
        }
    }
    // console.log("SF service FM", fieldMarketers)
    return {EnergyConsultantsEC: energyConsultants, FieldMarketersEC: fieldMarketers, TeamScoresEC: teamScores}
}

async function getCommissions(userId) {
    //can't without users
    const user = await userService.getUser(userId)
    // console.log("user ", user)
    // console.log("user ", user)
    // const name = user.firstName + ' ' + user.lastName
    const email = user.email
    // let accountRole = await dbService.query('SELECT Id FROM account WHERE Name = ?', [name])

    let account = await dbService.query('SELECT Id, Position__c, Team__c FROM account WHERE Company_Email__c = ?', [email])
    let accountId = ""

    if (account[0] !== undefined) {
        if (account[0].Position__c === 'Field Marketer') {
            if (account[0].Team__c === "Wolf") {
                accountId = '0011N00001xhHRXQA2'
            } else if (account[0].Team__c === "Fox") {
                accountId = '0011N00001sZUeBQAW'
            }
        } else {
            accountId = account[0].Id
        }
    }

    //let account = '0011N00001MBUmNQAX'
    // let account = '0011N00001xhHRXQA2'
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
    //const residentialProjectUrl = instance_url + "/services/data/v47.0/query/?q=SELECT X1st_Commission_Paid_Date__c, X2nd_Commission_Paid_Date__c, X2nd_Commission_Paid__c, X1st_Commission_Paid__c, Id, Name, Account__c, System_Size__c, Manager_2__c, Parent_Override_Paid__c, Parent_Account__c, Manager_3_Override_Amount__c, Expected_Pay_Date__c, Concession_Amount__c, Completion_Certificate_Signed__c, Field_Marketer1__c, Field_Marketer__c, FM_Cost__c, FM_Position__c, Manager_3__c, FM_Assist_Commission__c, X1st_Commission_Due_Date__c, X1st_Commission_Amount__c, X2nd_Commission_Amount__c, X2nd_Commission_Due_Date__c, Manager_3_Override__c, Manager_3_Override_Paid_Date__c, Parent_Override__c, Parent_Override_Paid_Date__c, Manager_2_Override_Paid_Date__c, Manager_2_Override__c, Commission_Deductions__c FROM Residential_Projects__c WHERE  Project_Cancelled__c != true AND (X1st_Commission_Due_Date__c >= THIS_WEEK OR X2nd_Commission_Due_Date__c >= THIS_WEEK OR Parent_Override_Paid_Date__c >= THIS_WEEK OR Manager_2_Override_Paid_Date__c >= THIS_WEEK OR Manager_3_Override_Paid_Date__c >= THIS_WEEK OR Expected_Pay_Date__c >= THIS_WEEK) "
    const residentialProjectUrl = instance_url + "/services/data/v47.0/query/?q=SELECT Id, Name, Account__c, System_Size__c, X2nd_Commission_Paid__c, X1st_Commission_Paid__c, Manager_2__c, Parent_Override_Paid__c, Parent_Account__c, Manager_3_Override_Amount__c, Expected_Pay_Date__c, Concession_Amount__c, Completion_Certificate_Signed__c, Field_Marketer1__c, FM_Position__c, Manager_3__c, FM_Assist_Commission__c, X1st_Commission_Due_Date_new__c, X1st_Commission_Amount__c, X2nd_Commission_Amount__c, X2nd_Commission_Due_Date__c, X2nd_Commission_Paid_Date__c, X1st_Commission_Paid_Date__c, Manager_3_Override__c, Manager_3_Override_Paid_Date__c, Parent_Override__c, Parent_Override_Paid_Date__c, Manager_2_Override_Paid_Date__c, Manager_2_Override__c, Commission_Deductions__c FROM Residential_Projects__c WHERE Project_Cancelled__c != true  AND (Energy_Consultant_Email1__c = '" + email + "' OR Account__c = '" + accountId + "' OR Manager_2__c = '" + accountId + "' OR Manager_3__c = '" + accountId + "' OR Field_Marketer1__c = '" + accountId + "' ) "
    const opportunityUrl = instance_url + "/services/data/v47.0/query/?q=SELECT Id, Field_Marketer1__c, Name, FM_Commission__c, FM_Expected_Pay_Date__c, FM_Commission_Paid__c, FM_Commission_Paid_Date__c, Field_Marketer_Team_Name__c, FM_Expected_Pay_Date_New__c FROM Opportunity WHERE FM_Expected_Pay_Date__c >= THIS_WEEK OR EC_Expected_Pay_Date__c >= THIS_WEEK"

    // const response = await requester.get(url, queryHeaders)

    const residentialProjects = await requester.get(residentialProjectUrl, queryHeaders).catch(err => {
        console.log(err);
    })
    const opportunities = await requester.get(opportunityUrl, queryHeaders).catch(err => {
        console.log(err);
    })

    const opportunityCommissions = []
    const residentialProjectsCommissions = []

    residentialProjects.records.length > 0 ?

        residentialProjects.records.map((residentialProject) => {
            residentialProject.Account__c = residentialProject.Account__c === '0013m00002K1moBAAR' ? '0013m00002EbFXPAA3' : residentialProject.Account__c === '0013m00002HBuM5AAL' ? '0013m0000210l6eAAA' : residentialProject.Account__c === '0013m00002HBuMPAA1' ? '0011N00001sZUeBQAW' : residentialProject.Account__c === '0013m00002DQ1MrAAL' || residentialProject.Account__c === '0013m00002HBuBMAA1' ? '0013m000029RCXmAAO' : residentialProject.Account__c === '0013m00002DQ1N1AAL' ? '0013m000024eOxtAAE' : residentialProject.Account__c === '0013m00002K26g9AAB' ? '0013m00002Fh9KjAAJ' : residentialProject.Account__c === '0013m00002K2IgrAAF' ? '0013m00002HEMENAA5' : residentialProject.Account__c === '0013m00002K2QWnAAN' ? '0013m00002FjEb0AAF' : residentialProject.Account__c === '0013m00002K26g9AAB' ? '0013m00002Fh9KjAAJ' : residentialProject.Account__c === '0013m00002MjVhwAAF' ? '0013m00002DP7dgAAD' : residentialProject.Account__c

        }) : 0

    // console.log("Residential Projects Commissions Length ", residentialProjects.records.length)
    // console.log("Opportunities Commissions Length ", opportunities.records.length)


    return {

        OpportunityCommissions: opportunities.records,
        ResidentialProjectsCommissions: residentialProjects.records
    }
}


module.exports = {
    getStats,
    getStatsTeam,
    getStatsWeek,
    getStatsFM,
    getStatsEC,
    getCommissions
}
    