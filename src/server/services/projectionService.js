const dbService = require('./dbService')


async function getProjections() {
    const projections = await dbService.query('SELECT * FROM month_projection ', [])
    // console.log("thisMonthProjection ", thisMonthProjection)
    return projections

}

// async function getProjection({start, end}){
//     console.log("getProjection ", start, end)
//     const thisMonthProjection = await dbService.query('SELECT * FROM month_projection WHERE start_date = ? AND end_date = ?', [start, end])
//     console.log("thisMonthProjection ", thisMonthProjection)
//     if(thisMonthProjection > 0){
//         return thisMonthProjection
//     }else{
//
//     }
// }

async function getCurrentMonthProjections({start, end}) {
     // console.log("getCurrentMonthProjections ", start, end)
    let gettingDay = new Date(end)
    gettingDay.setDate(gettingDay.getDate() + 1)
    // let tomorrow  = new Date(gettingDay)
    gettingDay = gettingDay.toISOString()
    gettingDay = gettingDay.split("T")
    let utcEndDatetime = gettingDay[0] + ' 05:59:59'
    // console.log("getCurrentMonthProjections ", start, end)
    //getting current month start and end date
    const existingProjection = await dbService.query('SELECT * FROM month_projection WHERE start_date = ? AND end_date = ?', [start, end])
    let updatedRepGoals = []
    if (existingProjection.length === 0) {

        // console.log("existingProjection is zero")
        //create projections start
        const accounts = await dbService.query('SELECT Name, Position__c FROM account WHERE  Status__c = ? AND Team__c != ?', ['Active', 'Amp'])
        // const accounts = await dbService.query('SELECT firstName, lastName FROM user WHERE roleId BETWEEN ? AND ? AND isApproved = ? ', [9, 10, 1])
        let monthRepProjections = []
        let companyMTD = 0

        for (let a = 0; a < accounts.length; a++) {
            if (accounts[a].Position__c === 'Jr Energy Consultant' || accounts[a].Position__c === ' ' || accounts[a].Position__c === 'District Manager' || accounts[a].Position__c === 'Manager'  || accounts[a].Position__c === 'Sales Manager'  || accounts[a].Position__c === 'Regional Manager' || accounts[a].Position__c === 'Energy Consultant') {
                // console.log("accounts[a].Name ", accounts[a].Name)
                let scheduledInstallsCount = await dbService.query('SELECT COUNT(*) FROM install_scheduled WHERE RepName = ? AND Install_Scheduled_Date_Time__c >= ? AND Install_Scheduled_Date_Time__c <= ?', [accounts[a].Name, (start + '06:00:00'), (end + '05:59:00')])
                scheduledInstallsCount = scheduledInstallsCount[0]['COUNT(*)']
                companyMTD += scheduledInstallsCount
                monthRepProjections.push({
                    Name: accounts[a].Name,
                    MTD: scheduledInstallsCount,
                    Target: 0,
                    Projected: 0,
                })
            }
        }
        // console.log("createProjection ", firstDay, lastDay, target, projection)
        const {insertId} = await dbService.query('INSERT INTO month_projection (start_date, end_date, target_installs, reps_projection, mtd ) VALUES (?, ?, ?, ?, ?)', [start, end, 0, JSON.stringify(monthRepProjections), companyMTD])
        // console.log("insertId ", insertId)
        // const monthlyProjectionId = insertId
        return insertId
        //create projections end
    } else {
        // console.log("existingProjection is not zero")
        // console.log("existed projection ", existingProjection[0])
        // //update mtd
        //
        let objectRepGoals = JSON.parse(existingProjection[0].reps_projection)
        let companyMTD = 0
        
      //       //if rep is missing 
      // let isRepHere = objectRepGoals.find(rep => rep.Name === 'Levi Noethe')
      //   if(isRepHere){
      //       console.log("isRepHere ", isRepHere)
      //   }else{
      //       objectRepGoals.push({"MTD": "0", "Name": "Levi Noethe", "Target": "0", "Projected": "0"})
      //   }
        //objectRepGoals.pop()

        for (let a = 0; a < objectRepGoals.length; a++) {

           
            const stringStartDateTime = existingProjection[0].start_date.toISOString()
            const formattedStartDateTime = stringStartDateTime.split('T')
            const stringStartEndTime = existingProjection[0].end_date.toISOString()
            const formattedEndDateTime = stringStartEndTime.split('T')

            // console.log("getCurrentMonthProjections utc ", formattedStartDateTime, utcEndDatetime)

            let scheduledInstallsCount = await dbService.query('SELECT COUNT(*) FROM install_scheduled WHERE RepName = ? AND Install_Scheduled_Date_Time__c >= ? AND Install_Scheduled_Date_Time__c <= ?', [objectRepGoals[a].Name, (formattedStartDateTime + ' 06:00:00'), (formattedEndDateTime + ' 05:59:00')])
            scheduledInstallsCount = scheduledInstallsCount[0]['COUNT(*)']
            companyMTD += scheduledInstallsCount
            if (objectRepGoals[a].MTD !== scheduledInstallsCount) {
                // console.log("inside loop name new vs old ", objectRepGoals[a].Name, objectRepGoals[a].MTD, scheduledInstallsCount)
                objectRepGoals[a].MTD = scheduledInstallsCount
                updatedRepGoals.push(objectRepGoals[a])
            } else{
                updatedRepGoals.push(objectRepGoals[a])
            }
        }
        // console.log("updatedGoals ", updatedRepGoals)
         // console.log("companyMTD ", companyMTD)
        //
        await dbService.query('UPDATE month_projection SET mtd = ?, reps_projection = ? WHERE id = ?', [companyMTD, JSON.stringify(updatedRepGoals), existingProjection[0].id])

        return existingProjection[0].id
    }
}

async function createProjection({date, target, projection}) {
    // console.log("createProjection ", date, target, projection)
    const initDate = new Date(), y = initDate.getFullYear(), m = initDate.getMonth()
    const firstDay = new Date(y, m, 1)
    const firstToString = firstDay.toISOString()
    const firstDate = firstToString.split('T')
    const lastDay = new Date(y, m + 1, 0)
    const lastToString = lastDay.toISOString()
    const lastDate = lastToString.split('T')

    const accounts = await dbService.query('SELECT Name, Position__c FROM account WHERE  Status__c = ? AND Team__c != ?', ['Active', 'Amp'])
    // const accounts = await dbService.query('SELECT firstName, lastName FROM user WHERE roleId BETWEEN ? AND ? AND isApproved = ? ', [9, 10, 1])
    let monthRepProjections = []
    let companyMTD = 0


    for (let a = 0; a < accounts.length; a++) {
        if (accounts[a].Position__c === 'Jr Energy Consultant' || accounts[a].Position__c === 'Sr Energy Consultant' || accounts[a].Position__c === 'District Manager' || accounts[a].Position__c === 'Manager'  || accounts[a].Position__c === 'Sales Manager'  || accounts[a].Position__c === 'Regional Manager' || accounts[a].Position__c === 'Energy Consultant') {
            // console.log("accounts[a].Name ", accounts[a].Name)
            let scheduledInstallsCount = await dbService.query('SELECT COUNT(*) FROM install_scheduled WHERE RepName = ? AND Install_Scheduled_Date_Time__c >= ? AND Install_Scheduled_Date_Time__c <= ?', [accounts[a].Name, (date.start  + ' 06:00:00'), (date.end +  + ' 05:059:00')])
            scheduledInstallsCount = scheduledInstallsCount[0]['COUNT(*)']
            companyMTD += scheduledInstallsCount
            monthRepProjections.push({
                Name: accounts[a].Name,
                MTD: scheduledInstallsCount,
                Target: 0,
                Projected: 0,
            })
        }
    }

    // console.log("createProjection ", firstDay, lastDay, target, projection)
    const {insertId} = await dbService.query('INSERT INTO month_projection (start_date, end_date, target_installs, reps_projection, mtd ) VALUES (?, ?, ?, ?, ?)', [firstDate[0], lastDate[0], target, JSON.stringify(monthRepProjections), companyMTD])
    const monthlyProjectionId = insertId
    return {ProjectionId: monthlyProjectionId}
}

async function updateBreakdown({startDate, endDate, projectionId}) {
    // console.log("updateBreakdown ", startDate, endDate, projectionId)
    const accounts = await dbService.query('SELECT Name, Position__c FROM account WHERE  Status__c = ? AND Team__c != ?', ['Active', 'Amp'])
    // const accounts = await dbService.query('SELECT firstName, lastName FROM user WHERE roleId BETWEEN ? AND ? AND isApproved = ? ', [9, 10, 1])
    let monthRepProjections = []
    let companyMTD = 0


    for (let a = 0; a < accounts.length; a++) {
        if (accounts[a].Position__c === 'Jr Energy Consultant' || accounts[a].Position__c === 'Sr Energy Consultant' || accounts[a].Position__c === 'District Manager' || accounts[a].Position__c === 'Manager'  || accounts[a].Position__c === 'Sales Manager'  || accounts[a].Position__c === 'Regional Manager' || accounts[a].Position__c === 'Energy Consultant') {
            // console.log("accounts[a].Name ", accounts[a].Name)
            let scheduledInstallsCount = await dbService.query('SELECT COUNT(*) FROM install_scheduled WHERE RepName = ? AND Install_Scheduled_Date_Time__c >= ? AND Install_Scheduled_Date_Time__c <= ?', [accounts[a].Name, (startDate  + ' 00:00:00'), (endDate +  + ' 05:059:00') ])
            scheduledInstallsCount = scheduledInstallsCount[0]['COUNT(*)']
            companyMTD += scheduledInstallsCount
            monthRepProjections.push({
                Name: accounts[a].Name,
                MTD: scheduledInstallsCount,
                Target: 0,
                Projected: 0,
            })
        }
    }
    await dbService.query('UPDATE month_projection SET reps_projection = ?, mtd = ? WHERE id = ?', [JSON.stringify(monthRepProjections), companyMTD, projectionId])

    return {ProjectionId: projectionId}
}

async function updateCompanyProjection({projectionId, target}) {
    // console.log("updateCompanyProjection ", projectionId, target)
    await dbService.query('UPDATE month_projection SET target_installs = ? WHERE id = ?', [target, projectionId])

    const projections = await dbService.query('SELECT * FROM month_projection ', [])
    // console.log("thisMonthProjection ", thisMonthProjection)
    return projections
}

async function updateRepsProjection({projectionId, updatedGoals}) {
    // console.log("updateRepsProjection ", projectionId, updatedGoals)
    await dbService.query('UPDATE month_projection SET reps_projection = ? WHERE id = ?', [JSON.stringify(updatedGoals), projectionId])
    const projections = await dbService.query('SELECT * FROM month_projection ', [])
    return projections
}

module.exports = {
    getProjections,
    getCurrentMonthProjections,
    createProjection,
    updateBreakdown,
    updateCompanyProjection,
    updateRepsProjection
}
