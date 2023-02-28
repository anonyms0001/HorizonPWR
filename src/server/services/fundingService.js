const dbService = require('./dbService')
const requester = require('../requester')
let querystring = require('querystring')

async function updateResidentialProjectSF() {
    const credentialsUrl = 'https://login.salesforce.com/services/oauth2/token'
    let data = {
        grant_type: 'password',
        client_id: '3MVG9mclR62wycM2QCvilyDrGjq8DvpGohXz.nJsA8n7MAA2ntKXGwqv2jOXapE3dHIbaxIe2vix7M5emxMj1',
        client_secret: 'E4B116D1D3BC3A56259361F17EB4395748D96F5B95CCDE496198C85C83BD6B94',
        username: 'horizonpwr.salesforce@gmail.com',
        password: '$Horizon$2020%'
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

    let residentialProjectUrl = queryUrl + 'SELECT Id, X1st_Funding_Payment_Amount__c, X2nd_Funding_Payment_Amount__c, X1st_Funding_Received_Date2__c, Loan_Approved_Date_Time__c, Loan_Docs_Signed_Date_Time__c, X2nd_Funding_Payment_Received_Date__c, Funding_Updates__c, Signing_Updates__c, Finance_Partner__c, Completion_Certificate_Signed_Date_Time__c, X1st_Funding_Payment_Received__c, X2nd_Funding_Payment_Received__c, COC_sent_to_GCU__c, GCU_COC_Signed__c, Substantial_Completion_Submitted__c, PTO_Approved__c, Pending_Cancellation__c, Project_Cancelled__c FROM Residential_Projects__c WHERE Site_Audit_Date__c != null AND Substantial_Completion_Submitted__c != true AND Site_Audit_Date__c > 2020-01-01'
    // console.log("opportunityUrl ", opportunityUrl)
    const residentialProjects = await requester.get(residentialProjectUrl, queryHeaders)

    //iterate through residentialProjects, insert or update
    for (let i = 0; i < residentialProjects.records.length; i++) {

        let localFunding = await dbService.query("SELECT * FROM funding_payment WHERE  Id = ?", [residentialProjects.records[i].Id])

        if (localFunding.length !== 0) {
            // console.log("name ", residentialProjects.records[i].Name)
            if (localFunding[0].Finance_Partner__c !== residentialProjects.records[i].Finance_Partner__c) {
                // console.log("name vs finance partner ",residentialProjects.records[i].Name ,residentialProjects.records[i].Finance_Partner__c)
                await dbService.query('UPDATE funding_payment SET Finance_Partner__c =  ? WHERE Id = ?', [residentialProjects.records[i].Finance_Partner__c, residentialProjects.records[i].Id])
            }
            if(residentialProjects.records[i].Completion_Certificate_Signed_Date_Time__c !== null){
                if (localFunding[0].Completion_Certificate_Signed_Date_Time__c !== residentialProjects.records[i].Completion_Certificate_Signed_Date_Time__c) {
                    // let formattedDate = new Date(residentialProjects.records[i].Completion_Certificate_Signed_Date_Time__c)
                    // let formattedDateToString = formattedDate.toISOString()
                    let formattedDateToString = residentialProjects.records[i].Completion_Certificate_Signed_Date_Time__c.split(".")
                    // console.log(formattedDateToString[0])
                    // console.log(residentialProjects.records[i].Name, residentialProjects.records[i].Completion_Certificate_Signed_Date_Time__c)
                    await dbService.query('UPDATE funding_payment SET Completion_Certificate_Signed_Date_Time__c =  ? WHERE Id = ?', [formattedDateToString[0], residentialProjects.records[i].Id])
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

         let localInstallsSchedule = await dbService.query('SELECT Pending_Cancellation__c, Project_Cancelled__c FROM install_schedule WHERE Id = ?', [residentialProjects.records[i].Id])
         if (localInstallsSchedule.length !== 0) {
            if (localInstallsSchedule[0].Pending_Cancellation__c !== residentialProjects.records[i].Pending_Cancellation__c) {
                // console.log("pending canel and name ", residentialProjects.records[i].Pending_Cancellation__c, residentialProjects.records[i].Name)
                await dbService.query('UPDATE install_schedule SET Pending_Cancellation__c = ? WHERE Id = ?', [residentialProjects.records[i].Pending_Cancellation__c, residentialProjects.records[i].Id])
                // console.log("Pending_Cancellation__c not same")
            }
            if (localInstallsSchedule[0].Project_Cancelled__c !== residentialProjects.records[i].Project_Cancelled__c) {
                await dbService.query('UPDATE install_schedule SET Project_Cancelled__c = ? WHERE Id = ?', [residentialProjects.records[i].Project_Cancelled__c, residentialProjects.records[i].Id])
                // console.log("Project_Cancelled__c not same")
            }
         }
    }
}

async function getFundingPayments() {

    const funding = await dbService.query('SELECT install.Id, funding.X1st_Funding_Payment_Amount__c, funding.X2nd_Funding_Payment_Amount__c, funding.X1st_Funding_Received_Date2__c, funding.Loan_Approved_Date_Time__c, funding.Loan_Docs_Signed_Date_Time__c, funding.X2nd_Funding_Payment_Received_Date__c, funding.Funding_Updates__c, funding.Signing_Updates__c, funding.Signing_Updates__c, funding.Finance_Partner__c, funding.Completion_Certificate_Signed_Date_Time__c, funding.X1st_Funding_Payment_Received__c, funding.X2nd_Funding_Payment_Received__c, funding.COC_sent_to_GCU__c ,funding.GCU_COC_Signed__c ,funding.Substantial_Completion_Submitted__c, funding.PTO_Approved__c, schedule.Name, schedule.Pending_Cancellation__c, schedule.Project_Cancelled__c, schedule.Install_Date__c, schedule.Install_Complete__c  FROM install_scheduled install  LEFT JOIN funding_payment funding ON install.Id = funding.Id  LEFT JOIN install_schedule schedule ON install.Id = schedule.Id WHERE funding.X1st_Funding_Payment_Amount__c IS NOT NULL AND install.Install_Scheduled_Date_Time__c > ?', ['2020-09-12 00:00:00'])
    // console.log("funding ", funding)
    return funding
}

async function getFinancialPartnerFunding(){

    console.log("getFinancialPartnerFunding")

    const sunlight = await dbService.query('SELECT install.Id, funding.X1st_Funding_Payment_Amount__c, funding.X2nd_Funding_Payment_Amount__c, funding.X1st_Funding_Received_Date2__c, funding.Loan_Approved_Date_Time__c, funding.Loan_Docs_Signed_Date_Time__c, funding.X2nd_Funding_Payment_Received_Date__c, funding.Funding_Updates__c, funding.Signing_Updates__c, funding.Signing_Updates__c, funding.Completion_Certificate_Signed_Date_Time__c, funding.X1st_Funding_Payment_Received__c, funding.X2nd_Funding_Payment_Received__c, funding.COC_sent_to_GCU__c ,funding.GCU_COC_Signed__c ,funding.Substantial_Completion_Submitted__c ,  funding.PTO_Approved__c ,schedule.Name, schedule.Pending_Cancellation__c, schedule.Project_Cancelled__c, schedule.Install_Date__c, schedule.Install_Complete__c  FROM install_scheduled install  LEFT JOIN funding_payment funding ON install.Id = funding.Id  LEFT JOIN install_schedule schedule ON install.Id = schedule.Id WHERE funding.X1st_Funding_Payment_Amount__c IS NOT NULL AND funding.Finance_Partner__c = ? AND install.Install_Scheduled_Date_Time__c > ? AND schedule.Install_Complete__c = ?', ['Sunlight' ,'2020-07-12 00:00:00', true])





    const loanPal = await dbService.query('SELECT install.Id, funding.X1st_Funding_Payment_Amount__c, funding.X2nd_Funding_Payment_Amount__c, funding.X1st_Funding_Received_Date2__c, funding.Loan_Approved_Date_Time__c, funding.Loan_Docs_Signed_Date_Time__c, funding.X2nd_Funding_Payment_Received_Date__c, funding.Funding_Updates__c, funding.Signing_Updates__c, funding.Signing_Updates__c, funding.Completion_Certificate_Signed_Date_Time__c, funding.X1st_Funding_Payment_Received__c, funding.X2nd_Funding_Payment_Received__c, funding.COC_sent_to_GCU__c ,funding.GCU_COC_Signed__c ,funding.Substantial_Completion_Submitted__c ,  funding.PTO_Approved__c ,schedule.Name, schedule.Pending_Cancellation__c, schedule.Project_Cancelled__c, schedule.Install_Date__c, schedule.Install_Complete__c  FROM install_scheduled install  LEFT JOIN funding_payment funding ON install.Id = funding.Id  LEFT JOIN install_schedule schedule ON install.Id = schedule.Id WHERE funding.X1st_Funding_Payment_Amount__c IS NOT NULL AND funding.Finance_Partner__c = ? AND install.Install_Scheduled_Date_Time__c > ?', ['LoanPal' ,'2020-07-12 00:00:00'])

    const generations = await dbService.query('SELECT install.Id, funding.X1st_Funding_Payment_Amount__c, funding.X2nd_Funding_Payment_Amount__c, funding.X1st_Funding_Received_Date2__c, funding.Loan_Approved_Date_Time__c, funding.Loan_Docs_Signed_Date_Time__c, funding.X2nd_Funding_Payment_Received_Date__c, funding.Funding_Updates__c, funding.Signing_Updates__c, funding.Signing_Updates__c, funding.Completion_Certificate_Signed_Date_Time__c, funding.X1st_Funding_Payment_Received__c, funding.X2nd_Funding_Payment_Received__c, funding.COC_sent_to_GCU__c ,funding.GCU_COC_Signed__c ,funding.Substantial_Completion_Submitted__c ,  funding.PTO_Approved__c ,schedule.Name, schedule.Pending_Cancellation__c, schedule.Project_Cancelled__c, schedule.Install_Date__c, schedule.Install_Complete__c  FROM install_scheduled install  LEFT JOIN funding_payment funding ON install.Id = funding.Id  LEFT JOIN install_schedule schedule ON install.Id = schedule.Id WHERE funding.X1st_Funding_Payment_Amount__c IS NOT NULL AND funding.Finance_Partner__c = ? AND install.Install_Scheduled_Date_Time__c > ?', ['Generations' ,'2020-07-12 00:00:00'])

    // console.log(generations)

    const cash = await dbService.query('SELECT install.Id, funding.X1st_Funding_Payment_Amount__c, funding.X2nd_Funding_Payment_Amount__c, funding.X1st_Funding_Received_Date2__c, funding.Loan_Approved_Date_Time__c, funding.Loan_Docs_Signed_Date_Time__c, funding.X2nd_Funding_Payment_Received_Date__c, funding.Funding_Updates__c, funding.Signing_Updates__c, funding.Signing_Updates__c, funding.Completion_Certificate_Signed_Date_Time__c, funding.X1st_Funding_Payment_Received__c, funding.X2nd_Funding_Payment_Received__c, funding.COC_sent_to_GCU__c ,funding.GCU_COC_Signed__c ,funding.Substantial_Completion_Submitted__c ,  funding.PTO_Approved__c ,schedule.Name, schedule.Pending_Cancellation__c, schedule.Project_Cancelled__c, schedule.Install_Date__c, schedule.Install_Complete__c  FROM install_scheduled install  LEFT JOIN funding_payment funding ON install.Id = funding.Id  LEFT JOIN install_schedule schedule ON install.Id = schedule.Id WHERE funding.X1st_Funding_Payment_Amount__c IS NOT NULL AND funding.Finance_Partner__c = ? AND install.Install_Scheduled_Date_Time__c > ?', ['Cash' ,'2020-07-12 00:00:00'])

    // console.log(sunl)
    return {
        Sunlight: sunlight,
        LoanPal: loanPal,
        Generations: generations,
        Cash: cash
    }

}

async function confirmFirstFundingPayment({projectId}){
    // console.log("confirmFirstFundingPayment ", projectId)
    const updateFirstFundingReceived = await dbService.query('UPDATE funding_payment SET X1st_Funding_Payment_Received__c = ? WHERE Id = ?', [1, projectId])
    const residentialProjectUpdates = {
        action: 'updateFirstFunding',
        residentialProjectId: projectId,
        firstFundingPaymentReceived: true
    }
    await updateResidentialProject(residentialProjectUpdates)
}

async function confirmSecondFundingPayment({projectId}){
    // console.log("confirmSecondFundingPayment ", projectId)
    const updateSecondFundingReceived = await dbService.query('UPDATE funding_payment SET X2nd_Funding_Payment_Received__c = ? WHERE Id = ?', [1, projectId])
    const residentialProjectUpdates = {
        action: 'updateSecondFunding',
        residentialProjectId: projectId,
        secondFundingPaymentReceived: true
    }
    await updateResidentialProject(residentialProjectUpdates)
}

async function submitSubstantialCompletion({projectId}){
    // console.log("confirmSecondFundingPayment ", projectId)
    const substantialCompletion = await dbService.query('UPDATE funding_payment SET Substantial_Completion_Submitted__c = ? WHERE Id = ?', [1, projectId])
    const residentialProjectUpdates = {
        action: 'submitCompletion',
        residentialProjectId: projectId,
        completion: true
    }
    await updateResidentialProject(residentialProjectUpdates)
}

async function updateResidentialProject(residentialProjectUpdates) {
    
    let accountData = []
    const credentialsUrl = 'https://login.salesforce.com/services/oauth2/token'
    let authData = {
        grant_type: 'password',
        client_id: '3MVG9mclR62wycM2QCvilyDrGjq8DvpGohXz.nJsA8n7MAA2ntKXGwqv2jOXapE3dHIbaxIe2vix7M5emxMj1',
        client_secret: 'E4B116D1D3BC3A56259361F17EB4395748D96F5B95CCDE496198C85C83BD6B94',
        username: 'horizonpwr.salesforce@gmail.com',
        password: '$Horizon$2020%'
    }
    authData = querystring.stringify(authData)
    const authHeaders = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': "*/*",
        'Connection': 'keep-alive'
    }
    const {access_token, instance_url} = await requester.post(credentialsUrl, authData, {authHeaders})
    const queryHeaders = {headers: {'Authorization': 'Bearer ' + access_token, 'Content-Type': 'application/json'}}

    const queryUrl = instance_url + "/services/data/v47.0/query/?q=SELECT Id FROM Residential_Projects__c WHERE Id = '" + residentialProjectUpdates.residentialProjectId + "'"
    // const totalSize = await requester.get(queryUrl, queryHeaders)
    const {totalSize} = await requester.get(queryUrl, queryHeaders)

    console.log("TOTAL SIZE ", totalSize)
    if (totalSize) {
        // const accountUrl = instance_url + totalSize.records[0].attributes.url
        const accountUrl = instance_url + "/services/data/v47.0/sobjects/Residential_Projects__c/" +  residentialProjectUpdates.residentialProjectId
        if (residentialProjectUpdates.action === 'updateFirstFunding') {
            accountData = {
                X1st_Funding_Payment_Received__c: true
            }
        }else  if (residentialProjectUpdates.action === 'updateSecondFunding') {
            accountData = {
                X2nd_Funding_Payment_Received__c: true
            }
        }else  if (residentialProjectUpdates.action === 'submitCompletion') {
            accountData = {
                Substantial_Completion_Submitted__c: true
            }
        }
        
        const response = await requester.patch(accountUrl, accountData, queryHeaders)
        // console.log("RESPONSE ", response)
    }
}

module.exports = {
    updateResidentialProjectSF,
    getFundingPayments,
    confirmFirstFundingPayment,
    confirmSecondFundingPayment,
    submitSubstantialCompletion,
    getFinancialPartnerFunding
}