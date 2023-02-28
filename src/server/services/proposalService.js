const dbService = require('./dbService')
const requester = require('../requester')
let querystring = require('querystring')

async function updateOpportunitySF() {
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

    let opportunityUrl = queryUrl + 'SELECT Id, Proposal_Requested_Date_Time__c, Field_Marketer1__c, Name, Appointment_Date__c, Proposal_Completed__c, Proposal_QC_s_Date_Time__c, Reason_Proposal_Incomplete__c, Need_Usage__c, Designer__c, Proposal_QC_d_By__c, Canvass_Status__c FROM Opportunity WHERE Proposal_Requested__c = true AND Proposal_Requested_Date_Time__c > 2020-10-17T00:00:00Z'
    // console.log("opportunityUrl ", opportunityUrl)
    let opportunities = {records: []}
    let opportunityPage = {}
    do {
        if (opportunityPage.nextRecordsUrl) {
            opportunityUrl = instance_url + opportunityPage.nextRecordsUrl
            // console.log("opportunity "+opportunityUrl)
            opportunityPage = await requester.get(opportunityUrl, queryHeaders).catch(err => {
                console.log(err)
            })
            opportunities.records = opportunities.records.concat(opportunityPage.records)
        } else {
            opportunityPage = await requester.get(opportunityUrl, queryHeaders).catch(err => {
                console.log(err)
            })
            opportunities.records = opportunities.records.concat(opportunityPage.records)
        }
    }
    while (opportunityPage.nextRecordsUrl)

    //iterate through opportunities, insert or update
    for (let i = 0; i < opportunities.records.length; i++) {
        //LEAD UPDATES STARTS
        let localLeadDateFormattedString = ""
        let localLeads = await dbService.query("SELECT Proposal_Requested_Date_Time__c,  Name, Appointment_Date__c, Proposal_Completed__c, Proposal_QC_s_Date_Time__c, Reason_Proposal_Incomplete__c, Need_Usage__c, Designer__c, Proposal_QC_d_By__c, Canvass_Status__c FROM _lead WHERE  Id = ? AND Proposal_Requested_Date_Time__c IS NOT NULL", [opportunities.records[i].Id])
        if (localLeads.length !== 0 && localLeads[0].Proposal_Requested_Date_Time__c !== null) {
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

            if(opportunities.records[i].Appointment_Date__c !== null){
                 if (localLeads[0].Appointment_Date__c !== opportunities.records[i].Appointment_Date__c) {
                    // console.log("app date ", opportunities.records[i].Appointment_Date__c)
                    let formattedAppointmentDate = opportunities.records[i].Appointment_Date__c.split("T")
                    await dbService.query('UPDATE _lead SET Appointment_Date__c =  ? WHERE Id = ?', [formattedAppointmentDate[0], opportunities.records[i].Id])
                }
            }

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
            }
        }
    }
}
async function getUpcomingProposals() {
    let now = new Date()
    let nowString = now.toISOString()
    let nowDateOnly = nowString.split('T')
    let todayUTCStart = nowDateOnly[0]

    console.log(" getUpcomingProposals todayUTCStart ", todayUTCStart)
    // const proposals = await dbService.query('SELECT * FROM _lead WHERE Appointment_Date__c >= ? ORDER BY Appointment_Date__c ASC', [todayUTCStart])
    const proposals = await dbService.query('SELECT lead.Id, lead.Proposal_Requested_Date_Time__c, lead.Name, lead.Appointment_Date__c, lead.Proposal_Due_Date__c, lead.Drawing_Starting_Date_Time__c, lead.Proposal_Completed__c, lead.Proposal_QC_s_Date_Time__c, lead.Reason_Proposal_Incomplete__c, lead.Need_Usage__c, lead.Canvass_Status__c, ac1.Name as designer, ac2.Name as qc_guy, address.Street_Address__c, address.City__c, address.State__c, address.Zip__c  FROM _lead lead LEFT JOIN account ac1  ON lead.Designer__c = ac1.Id LEFT JOIN account ac2  ON lead.Proposal_QC_d_By__c = ac2.Id LEFT JOIN lead_address address  ON lead.Id = address.opportunity_id WHERE Appointment_Date__c >= ?  ORDER BY Appointment_Date__c ASC ', [todayUTCStart])
    // console.log("proposalsToDraw ", proposalsToDraw)
    return proposals
}
async function proposalStart({leadId, accountId, now}) {
    // console.log("proposalStart ", leadId, accountId, now)
    let nowDateTime = new Date()
    let stringNowDateTime = nowDateTime.toISOString()
    let stringNowTime = stringNowDateTime.split('.')
    console.log("stringNowTime ", stringNowTime[0])

    // const [ designerExists ] = await dbService.query('SELECT Designer__c FROM _lead WHERE Id = ?', [leadId])
    // if(designerExists === null){
        const updateLead = await dbService.query('UPDATE _lead SET Drawing_Starting_Date_Time__c = ?, Designer__c = ? WHERE Id = ?', [stringNowTime[0], accountId, leadId])
        const opportunityUpdates = {
        action: 'start',
        opportunityId: leadId,
        designer: accountId
        }
        await updateOpportunity(opportunityUpdates)
    // } 
}
async function proposalNeedsUsage({ leadId }) {
    console.log("proposalNeedsUsage only")
    const needUsageProposal = await dbService.query('UPDATE _lead SET Need_Usage__c = ? WHERE Id = ?', [ 1, leadId])
    const opportunityUpdates = {
        action: 'needsUsage',
        opportunityId: leadId,
    }
    // await updateOpportunity(opportunityUpdates)
}
async function proposalFinished({leadId}) {
    console.log("proposalFinished ", leadId)
    let nowDateTime = new Date()
    let stringNowDateTime = nowDateTime.toISOString()
    let stringNowTime = stringNowDateTime.split('.')
    // console.log("stringNowTime ", stringNowTime[0] + '.000+0000')
    const markProposalAsCompleted = await dbService.query('UPDATE _lead SET Proposal_Completed__c = ? WHERE Id = ?', [1,  leadId])
    // const markProposalAsCompleted = await dbService.query('UPDATE _lead SET Proposal_Completed__c = ?, Proposal_QC_s_Date_Time__c = ? WHERE Id = ?', [1, stringNowTime[0],  leadId])
    const opportunityUpdates = {
        action: 'finishedProposal',
        opportunityId: leadId,
        // dataQCDateTime: stringNowTime[0],
        finishedDate: (stringNowTime[0] + '.000+0000')
    }
    // console.log("proposalFinished ", nowDateTime)
    await updateOpportunity(opportunityUpdates)
}
async function proposalQCStarted({leadId, accountId, now}) {
    // console.log("proposalQCStarted ", leadId, accountId, now)
    let nowDateTime = new Date()
    let stringNowDateTime = nowDateTime.toISOString()
    let stringNowTime = stringNowDateTime.split('.')
    // console.log("stringNowTime ", stringNowTime[0] + '.000+0000')
    // const proposalQCStarted = await dbService.query('UPDATE _lead SET Proposal_QC_d_By__c = ?, Proposal_QC_s_Date_Time__c = ? WHERE Id = ?', [accountId, stringNowTime[0],  leadId])
    const proposalQCStarted = await dbService.query('UPDATE _lead SET Proposal_QC_d_By__c = ? WHERE Id = ?', [accountId, leadId])
    const opportunityUpdates = {
        action: 'proposalQCStarted',
        opportunityId: leadId,
        QCperson: accountId
    }
    await updateOpportunity(opportunityUpdates)
}
async function proposalQCFinished({leadId}) {
    // console.log("proposalQCStarted ", leadId, accountId, now)
    let nowDateTime = new Date()
    let stringNowDateTime = nowDateTime.toISOString()
    let stringNowTime = stringNowDateTime.split('.')
    // console.log("stringNowTime ", stringNowTime[0] + '.000+0000')
    const proposalQCFinished = await dbService.query('UPDATE _lead SET Proposal_QC_s_Date_Time__c = ? WHERE Id = ?', [ stringNowTime[0],  leadId])

    const opportunityUpdates = {
        action: 'proposalQCFinished',
        opportunityId: leadId,
        dataQCDateTime: stringNowTime[0],
    }
    // console.log("proposalFinished ", nowDateTime)
    await updateOpportunity(opportunityUpdates)
}
async function proposalUsageFixed({leadId, accountId}) {
    let nowDateTime = new Date()
    let stringNowDateTime = nowDateTime.toISOString()
    let stringNowTime = stringNowDateTime.split('.')
    console.log("stringNowTime ", stringNowTime[0])
    const UsageProposalFixed = await dbService.query('UPDATE _lead SET Need_Usage__c = ?, Drawing_Starting_Date_Time__c = ?, Designer__c = ? WHERE Id = ?', [ 0, stringNowTime[0], accountId, leadId])
    const opportunityUpdates = {
        action: 'usageFixed',
        opportunityId: leadId,
        designer: accountId
    }
    await updateOpportunity(opportunityUpdates)
}
async function proposalIncompleteReason({proposalId, incompleteReason}){
    console.log("proposalIncompleteReason ", proposalId, incompleteReason)
    const proposalIncompleteReasonUpdate = await dbService.query('UPDATE _lead SET Reason_Proposal_Incomplete__c = ? WHERE Id = ?', [ incompleteReason, proposalId])
    const opportunityUpdates = {
        action: 'updateIncompleteReason',
        opportunityId: proposalId,
        reason: incompleteReason
    }
     await updateOpportunity(opportunityUpdates)
}
async function proposalMultipleIncompleteReason({proposalId, incompleteReason, updateField}) {
    console.log("proposalMultipleIncompleteReason ", updateField, proposalId, incompleteReason)
    if(updateField === 'needsUsage'){
        const needsUsageUpdate = await dbService.query('UPDATE _lead SET Need_Usage__c = ?, Reason_Proposal_Incomplete__c = ? WHERE Id = ?', [1, incompleteReason, proposalId])

        const opportunityUpdates = {
            action: 'needsUsage',
            opportunityId: proposalId,
            reason: incompleteReason !== '' ? incompleteReason : ''
        }

        await updateOpportunity(opportunityUpdates)

    }else{
        const proposalIncompleteReasonUpdate = await dbService.query('UPDATE _lead SET Reason_Proposal_Incomplete__c = ? WHERE Id = ?', [incompleteReason, proposalId])

        const opportunityUpdates = {
            action: 'updateIncompleteReason',
            opportunityId: proposalId,
            reason: incompleteReason !== '' ? incompleteReason : ''
        }

        await updateOpportunity(opportunityUpdates)
    }
}
async function executeUndoAction({proposalId, undoAction}){
    console.log("executeUndoAction ", proposalId, undoAction)
    if(undoAction === 'drawingToNew'){
        const clearDesigner = await dbService.query('UPDATE _lead SET Designer__c = ? WHERE Id = ?', [null, proposalId])

        const opportunityUpdates = {
            action: undoAction,
            opportunityId: proposalId,
        }

        await updateOpportunity(opportunityUpdates)

    }else if(undoAction === 'moveToNew'){
        const clearNeedsUsage = await dbService.query('UPDATE _lead SET Need_Usage__c = ? WHERE Id = ?', [null, proposalId])

        const opportunityUpdates = {
            action: undoAction,
            opportunityId: proposalId,
        }

        await updateOpportunity(opportunityUpdates)

    }else if(undoAction === 'qcToDrawing'){
        const clearProposalFinished = await dbService.query('UPDATE _lead SET Proposal_Completed__c = ? WHERE Id = ?', [null, proposalId])
    }else if(undoAction === 'removeQCDesigner'){
        const clearQcBy = await dbService.query('UPDATE _lead SET Proposal_QC_d_By__c = ? WHERE Id = ?', [null, proposalId])
    }else if(undoAction === 'removeIncompleteReason'){
        const removeIncompleteReason = await dbService.query('UPDATE _lead SET Designer__c = ? WHERE Id = ?', [null,proposalId])
        const opportunityUpdates = {
            action: undoAction,
            opportunityId: proposalId,
        }
        await updateOpportunity(opportunityUpdates)
    }
}
async function updateOpportunity(opportunityUpdates) {
    // console.log("updateOpportunity ", opportunityUpdates)
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

    const queryUrl = instance_url + "/services/data/v47.0/query/?q=SELECT Id FROM Opportunity WHERE Id = '" + opportunityUpdates.opportunityId + "'"
    // const totalSize = await requester.get(queryUrl, queryHeaders)
    const {totalSize} = await requester.get(queryUrl, queryHeaders)

    console.log("TOTAL SIZE ", totalSize, opportunityUpdates.action, opportunityUpdates.opportunityId)
    if (totalSize) {
        // const accountUrl = instance_url + totalSize.records[0].attributes.url
        const accountUrl = instance_url + "/services/data/v47.0/sobjects/Opportunity/" +  opportunityUpdates.opportunityId
        if (opportunityUpdates.action === 'start') {
            accountData = {
                Designer__c: opportunityUpdates.designer
            }
        } else if (opportunityUpdates.action === 'finishedProposal') {
            accountData = {
                Proposal_Completed_Date_Time__c: opportunityUpdates.finishedDate,
                // Proposal_QC_s_Date_Time__c: opportunityUpdates.dataQCDateTime,
                Proposal_Completed__c: true
            }
        } else if (opportunityUpdates.action === 'needsUsage') {
            // console.log("needs usage ", opportunityUpdates)
            accountData = {
                Need_Usage__c: true,
                Reason_Proposal_Incomplete__c: opportunityUpdates.reason
            }
        }else if (opportunityUpdates.action === 'proposalQCStarted') {
            accountData = {
                Proposal_QC_d_By__c: opportunityUpdates.QCperson
            }
        }else if (opportunityUpdates.action === 'proposalQCFinished') {
            accountData = {
                Proposal_QC_s__c: true,
                Proposal_QC_s_Date_Time__c: opportunityUpdates.dataQCDateTime,
            }
        }else if (opportunityUpdates.action === 'usageFixed') {
            accountData = {
                Need_Usage__c: false,
                Designer__c: opportunityUpdates.designer
            }
        }else if (opportunityUpdates.action === 'updateIncompleteReason') {

            accountData = {
                Reason_Proposal_Incomplete__c: opportunityUpdates.reason
            }
        }else if (opportunityUpdates.action === 'drawingToNew') {

            accountData = {
                Designer__c: null
            }
        }else if (opportunityUpdates.action === 'moveToNew') {

            accountData = {
                Need_Usage__c: false
                // Reason_Proposal_Incomplete__c:  null
            }
        }

        const response = await requester.patch(accountUrl, accountData, queryHeaders).catch(err => {
                console.log(err)
            })
        // console.log("RESPONSE ", response)
    }
}
module.exports = {
    getUpcomingProposals,
    proposalStart,
    proposalNeedsUsage,
    proposalFinished,
    proposalQCStarted,
    proposalQCFinished,
    proposalUsageFixed,
    proposalIncompleteReason,
    updateOpportunitySF,
    proposalMultipleIncompleteReason,
    executeUndoAction,
    updateOpportunity
}