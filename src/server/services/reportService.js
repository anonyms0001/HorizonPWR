const dbService = require('./dbService')
const userService = require('./userService')
const teamService = require('./teamService')



async function currentWeekUpdate(dateRange) {
    console.log("current week update1 HERE ", dateRange.start, dateRange.end)
    let gettingDay = new Date(dateRange.end)
    gettingDay.setDate(gettingDay.getDate() + 1)
    // let tomorrow  = new Date(gettingDay)
    gettingDay = gettingDay.toISOString()
    gettingDay = gettingDay.split("T")
    let utcEndDatetime = gettingDay[0] + ' 05:59:59'
    let managerTeam = false
    let startDate = new Date(dateRange.start)
    let startDateMonth = startDate.getMonth()
    let startDateYear = startDate.getYear()


    // const accounts = await dbService.query('SELECT Name, created_date, Report_Start_Date__c,  Termination_Date__c, Position__c, Status__c, Team__c FROM account WHERE Company_Email__c IS NOT NULL AND Team__c IS NOT NULL AND  Report_Start_Date__c < ? ', [dateRange.end])
    // const accounts = await dbService.query('SELECT Name, created_date, Report_Start_Date__c,  Termination_Date__c, Position__c, Status__c, Team__c FROM account WHERE Company_Email__c IS NOT NULL AND Team__c IS NOT NULL AND  Report_Start_Date__c < ? AND Status__c = ?', [dateRange.end, 'Active'])
    // const accounts = await dbService.query('SELECT Name, created_date, Report_Start_Date__c,  Termination_Date__c, Position__c, Status__c, Team__c FROM account WHERE Company_Email__c IS NOT NULL AND Team__c IS NOT NULL AND Report_Start_Date__c < ? ', [dateRange.end])
    const accounts = await dbService.query('SELECT Id, Name, created_date, Start_Date__c, Report_Start_Date__c,  Termination_Date__c, Position__c, Status__c, Team__c FROM account WHERE  Company_Email__c IS NOT NULL AND Team__c IS NOT NULL AND  Report_Start_Date__c < ? AND Status__c != ? ', [dateRange.end, 'Onboarding'])

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

    // if (dateRange.start > '2021-02-06') {
    //     managerTeam = true
    //     teams.push({teamId: 1, teamName: 'Managers', created_date: '2020-12-22T07:00:00.000Z'})
    //     // console.log("teams ", teams)
    // }
    for (let i = 0; i < teams.length; i++) {

        if (teams[i].teamId === 11 || teams[i].teamId === 12 || teams[i].teamId === 13 || teams[i].teamId === 7 || teams[i].teamId === 15)
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

    let today = new Date(startDate);

    // loop through accounts
    for (let a = 0; a < accounts.length; a++) {

        if (accounts[a].Termination_Date__c !== null) {
            if (accounts[a].Termination_Date__c < startDate) {
                continue;
            }
        }

        let fmStartedDate = new Date(accounts[a].Start_Date__c);
        // console.log(fmStartedDate, today)
        let weeksPassed = Math.floor((today - fmStartedDate) / (1000 * 60 * 60 * 24 * 7));
        // if (weeksPassed <= 3 && weeksPassed >= 0) {
        //     console.log(accounts[a].Name, weeksPassed)
        // }


        // let fmReportStartDateMonth  = new Date(accounts[a].Report_Start_Date__c).getMonth()
        // let fmReportStartDateYear  = new Date(accounts[a].Report_Start_Date__c).getYear()
        // console.log(accounts[a].Name, fmReportStartDateMonth, fmReportStartDateYear, " vs ", startDateMonth, startDateYear)

        if (accounts[a].Name === "Ben DuPlessis"  || accounts[a].Name === "Braxton  Sorensen")
            continue;

         if (dateRange.start < '2021-06-27') {
            if (accounts[a].Name === "Preston Burt")
            continue;
        }
        if (dateRange.start >= '2021-08-22' && dateRange.start < '2021-09-18') {
            if ( accounts[a].Name === "Cayden Larsen")
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
        // if (!managerTeam) {
        //     accountTeamName = accounts[a].Name === "Rob Thornburgh" ? "Rexburg" : accounts[a].Name === "Cayden Larsen" ? "Boise" : accounts[a].Team__c
        // }
        // console.log(accounts[a].Name)
        if (role === 'Field Marketer' || role === 'Field Marketer Elite') {
            if (accounts[a].Name === 'Jacob Hatch') {
                continue
            }
            //start getting fms stats
            let leadCount = await dbService.query('SELECT COUNT(*) FROM _lead WHERE Field_Marketer__c = ? AND Proposal_Requested_Date_Time__c >= ? AND Proposal_Requested_Date_Time__c <= ?', [accounts[a].Name, dateRange.start, (dateRange.end + ' 23:59:00')])
            leadCount = leadCount[0]['COUNT(*)']

            let qsCount = await dbService.query('SELECT COUNT(*) FROM qs WHERE Field_Marketer__c = ? AND Sat_Date__c >= ? AND Sat_Date__c <= ?', [accounts[a].Name, dateRange.start, utcEndDatetime])
            qsCount = qsCount[0]['COUNT(*)']

            let assistedClosesCount = await dbService.query('SELECT COUNT(*) FROM assisted_close WHERE Field_Marketer__c = ? AND Site_Audit_Scheduled_Date_Time__c >= ? AND Site_Audit_Scheduled_Date_Time__c <= ?', [accounts[a].Name, (dateRange.start + ' 06:00:00'), utcEndDatetime])
            assistedClosesCount = assistedClosesCount[0]['COUNT(*)']


            if (leadCount !== 0 && teamName !== "Amp" || qsCount !== 0 && teamName !== "Amp" || assistedClosesCount !== 0 && teamName || accounts[a].Status__c === 'Active' && teamName !== "Amp") {
                //calculate company overall fm numbers
                companyLeads += leadCount
                companyQs += qsCount
                companyAss += assistedClosesCount
                companyFMCount += 1

                // if(accountTeamName === 'Rexburg'){
                //       console.log("name", accounts[a].Name, "leads ",  leadCount)
                //   }

                teamNumbers.forEach(function (team) {
                    if (team.Name === accountTeamName) {
                        team.Leads += leadCount
                        team.Qs += qsCount
                        team.Ass += assistedClosesCount
                        team.fieldMarketers.push({
                            Name: accounts[a].Name,
                            Leads: leadCount,
                            LeadGrade: (((leadCount / 10) * 0.8) * 100).toFixed(2),
                            Qs: qsCount,
                            QsGrade: (((qsCount / 8) * 0.8) * 100).toFixed(2),
                            AssistedCloses: assistedClosesCount,
                            AssGrade: (((assistedClosesCount / 2) * 1.3) * 100).toFixed(2),
                            WeekGrade: (((((leadCount / 10) * 0.8) * 100) + (((qsCount / 8) * 0.8) * 100) + (((assistedClosesCount / 2) * 1.3) * 100)) / 3).toFixed(2),
                        })

                        if (weeksPassed === 0) {
                            if (qsCount >= 8) {
                                console.log("first bonus ", accounts[a].Name, weeksPassed, qsCount)
                                dbService.query('UPDATE account SET 1st_FM_Bonus = 1 WHERE Id = ?', [accounts[a].Id])
                            }
                        } else if (weeksPassed === 1) {
                            if (qsCount >= 10) {
                                console.log("second bonus ", accounts[a].Name, weeksPassed, qsCount)
                                dbService.query('UPDATE account SET 2nd_FM_Bonus = 1 WHERE Id = ?', [accounts[a].Id])
                            }
                        }
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
        } else if (role === 'Jr Energy Consultant' || role === 'Sr Energy Consultant' || role === 'Manager' || role === 'VP' || role === 'District Manager') {

            let leadCount = await dbService.query('SELECT COUNT(*) FROM _lead WHERE Field_Marketer__c = ? AND Proposal_Requested_Date_Time__c >= ? AND Proposal_Requested_Date_Time__c <= ?', [accounts[a].Name, dateRange.start, (dateRange.end + ' 23:59:00')])
            leadCount = leadCount[0]['COUNT(*)']

            let sitsCount = await dbService.query('SELECT COUNT(*) FROM qs WHERE EC = ? AND Sat_Date__c >= ? AND Sat_Date__c <= ?', [accounts[a].Name, dateRange.start, dateRange.end])
            sitsCount = sitsCount[0]['COUNT(*)']

            let closeCount = await dbService.query('SELECT COUNT(*) FROM _close WHERE Energy_Consultant__c = ? AND Site_Audit_Scheduled_Date_Time__c >= ? AND Site_Audit_Scheduled_Date_Time__c <= ?', [accounts[a].Name, (dateRange.start + ' 06:00:00'), utcEndDatetime])
            closeCount = closeCount[0]['COUNT(*)']

            let scheduledInstallsCount = await dbService.query('SELECT COUNT(*) FROM install_scheduled WHERE RepName = ? AND Install_Scheduled_Date_Time__c >= ? AND Install_Scheduled_Date_Time__c <= ?', [accounts[a].Name, (dateRange.start + ' 06:00:00'), utcEndDatetime])
            scheduledInstallsCount = scheduledInstallsCount[0]['COUNT(*)']


            if (leadCount > 0 && accounts[a].Team__c !== "Amp" || sitsCount !== 0 && accounts[a].Team__c !== "Amp" || closeCount !== 0 && accounts[a].Team__c !== "Amp" || scheduledInstallsCount !== 0 && accounts[a].Team__c !== "Amp" || accounts[a].Status__c === 'Active' && accounts[a].Team__c !== "Amp") {
                // console.log("EC leadCount ", accounts[a].Name, leadCount)
                companyECLeads += leadCount
                companySits += sitsCount
                companyCloses += closeCount
                companyScheduledInstalls += scheduledInstallsCount

                //  if(accountTeamName === 'Pocatello'){
                //     console.log("name", accounts[a].Name, "leads ",  leadCount)
                // }


                companyECCount += 1

                teamNumbers.forEach(function (team) {
                    let regionalManager = false
                    let sitsCountRM = sitsCount
                    let closeCountRM = closeCount
                    let scheduledInstallsCountRM = scheduledInstallsCount
                    // if (accounts[a].Name === "Rob Thornburgh" && team.Name === 'Pocatello' || accounts[a].Name === "Cayden Larsen" && team.Name === 'Boise') {
                    // if (accounts[a].Name === "Rob Thornburgh" && accountTeamName === 'Rexburg' || accounts[a].Name === "Rob Thornburgh" && accountTeamName === 'Rexburg' || accounts[a].Name === "Cayden Larsen" && accountTeamName === 'Boise' || accounts[a].Name === "Cayden Larsen" && accountTeamName === 'Boise') {
                    //
                    //     // regionalManager = true
                    //     // console.log("Name vs sitsCount ", accounts[a].Name, sitsCount)
                    //
                    //     // if(sitsCount !==)
                    //     //  sitsCount
                    //     sitsCountRM = sitsCount
                    //     closeCountRM = closeCount
                    //     scheduledInstallsCountRM = scheduledInstallsCount
                    //     // console.log("Name vs sitsCountRM ", accounts[a].Name, sitsCount)
                    //     // console.log(sitsCount)
                    // }
                    if (team.Name === accountTeamName) {
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
                            SitsGrade: (((sitsCount / 12) * 0.9) * 100).toFixed(2),
                            Closes: closeCount,
                            ClosesGrade: (((closeCount / 2) * 0.9) * 100).toFixed(2),
                            ScheduledInstalls: scheduledInstallsCount,
                            ScheduledInstallsGrade: (((scheduledInstallsCount / 2) * 1.5) * 100).toFixed(2),
                            WeekGrade: (((((sitsCount / 12) * 0.9) * 100) + (((closeCount / 2) * 1.5) * 100) + (((scheduledInstallsCount / 2) * 0.9) * 100)) / 3).toFixed(2)

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
    let weekScore = ((ecUnitScore + fmUnitScore) / 2)
    //team Calculations
    let t = -1
    while (++t < teamNumbers.length) {
        // console.log("iteration ", t)
        teamNumbers[t].LeadsPRA = (teamNumbers[t].Leads / teamNumbers[t].fieldMarketers.length)
        // teamNumbers[t].LeadsScore = (((teamNumbers[t].LeadsPRA / 8) * .8) * 100)
        // teamNumbers[t].LeadsScore = (((teamNumbers[t].LeadsPRA / 8) * .8) * 100)
        teamNumbers[t].LeadsScore = (((teamNumbers[t].Leads / (10 * teamNumbers[t].fieldMarketers.length)) * .8) * 100)
        teamNumbers[t].QsPRA = (teamNumbers[t].Qs / teamNumbers[t].fieldMarketers.length)
        // teamNumbers[t].QsScore = (((teamNumbers[t].QsPRA / 6) * .8) * 100)
        teamNumbers[t].QsScore = (((teamNumbers[t].Qs / (8 * teamNumbers[t].fieldMarketers.length)) * .8) * 100)
        teamNumbers[t].AssPRA = (teamNumbers[t].Ass / teamNumbers[t].fieldMarketers.length)
        // teamNumbers[t].AssScore = (((teamNumbers[t].AssPRA / 1.5) * 1.3) * 100)
        teamNumbers[t].AssScore = (((teamNumbers[t].Ass / (2 * teamNumbers[t].fieldMarketers.length)) * 1.3) * 100)
        teamNumbers[t].fmScore = ((teamNumbers[t].LeadsScore + teamNumbers[t].QsScore + teamNumbers[t].AssScore) / 3)

        teamNumbers[t].SitsPRA = (teamNumbers[t].Sits / teamNumbers[t].energyConsultants.length)
        // teamNumbers[t].SitsPRA = ((teamNumbers[t].Sits/(12* teamNumbers[t].energyConsultants.length))*.9)
        // teamNumbers[t].SitsScore = (((teamNumbers[t].SitsPRA / 8) * .9) * 100)

        teamNumbers[t].SitsScore = (((teamNumbers[t].SitsRM / (12 * teamNumbers[t].energyConsultants.length)) * .9) * 100)

        teamNumbers[t].ClosesPRA = (teamNumbers[t].Closes / teamNumbers[t].energyConsultants.length)
        // teamNumbers[t].ClosesScore = (((teamNumbers[t].ClosesPRA / 1.5) * .9) * 100)
        teamNumbers[t].ClosesScore = (((teamNumbers[t].ClosesRM / (2 * teamNumbers[t].energyConsultants.length)) * .9) * 100)
        teamNumbers[t].ScheduledInstallsPRA = (teamNumbers[t].ScheduledInstalls / teamNumbers[t].energyConsultants.length)
        // teamNumbers[t].ScheduledInstallsScore = (((teamNumbers[t].ScheduledInstallsPRA / 1.5) * .9) * 100)
        teamNumbers[t].ScheduledInstallsScore = (((teamNumbers[t].ScheduledInstallsRM / (2 * teamNumbers[t].energyConsultants.length)) * 1.5) * 100)
        teamNumbers[t].ecScore = ((teamNumbers[t].SitsScore + teamNumbers[t].ClosesScore + teamNumbers[t].ScheduledInstallsScore) / 3)
        // console.log("begin score cal ", teamNumbers[t].fmScore, teamNumbers[t].ecScore)
        teamNumbers[t].teamScore = (teamNumbers[t].fmScore + teamNumbers[t].ecScore) / 2
        // console.log("end score cal ", teamNumbers[t].teamScore)
    }

    //insert week stat
    // console.log("date range start bottom ", dateRange.start)
    const currentWeekRow = await dbService.query('SELECT id FROM week_stats WHERE start_date = ?', [dateRange.start])
    // console.log("currentWeekRow ", currentWeekRow)
    console.log("currentWeekRow ", currentWeekRow)

    if (currentWeekRow) {
        // console.log("companyECLeads ", companyECLeads)

        await dbService.query('UPDATE  week_stats SET  fm_leads = ?, fm_qs = ?, fm_ass = ?, ec_sits = ?, ec_closes = ?, ec_scheduled_installs = ?, team_numbers = ?, fms_number = ?, ecs_number = ?, fm_leads_pra = ?, fm_leads_score = ?, fm_qs_pra = ?, fm_qs_score = ?, fm_ass_pra = ?, fm_ass_score = ?, fm_unit_score = ?, ec_sits_pra = ?, ec_sits_score = ?, ec_closes_pra = ?, ec_closes_score = ?, ec_scheduled_installs_pra = ?, ec_scheduled_installs_score = ?, ec_unit_score = ?, week_score = ?, ec_leads = ? WHERE id = ?', [companyLeads, companyQs, companyAss, companySits, companyCloses, companyScheduledInstalls, JSON.stringify(teamNumbers), companyFMCount, companyECCount, leadsPRA, leadsScore, qsPRA, qsScore, assPRA, assScore, fmUnitScore, sitsPRA, sitsScore, closePRA, closeScore, scheduledInstallsPRA, scheduledInstallsScore, ecUnitScore, weekScore, companyECLeads, currentWeekRow[0].id])

        // console.log("updateWeekRow ", updateWeekRow)

    }

}

async function populateWeekStatsTable() {
    const startDatePassedWeeks = new Date('2019-12-18')
    // const startDatePassedWeeks = new Date('2020-08-01')
    const endDatePassedWeeks = new Date()

    let qsPassedWeeks = Math.ceil((((endDatePassedWeeks - startDatePassedWeeks) / 86400000) + 1) / 7)
    // console.log("qsPassedWeeks ", qsPassedWeeks)

    const week_stats = []

    let start = []
    let end = []
    for (let i = 0; i < qsPassedWeeks; i++) {
        let startDate = new Date()
        startDate.setDate(startDate.getDate() - startDate.getDay() - 7 * i)
        let now = new Date(startDate)
        now.setDate(startDate.getDate() + 6)
        start = startDate.toIsoString()
        start = start.split("T")
        end = now.toIsoString()
        end = end.split("T")
        // CQ.push({ ["week" + i] : start[0] + ", " + end[0] })
        week_stats.push({start: start[0], end: end[0]})
    }

    //iterate through week_stats
    for (let w = 0; w < week_stats.length; w++) {

        console.log("week ", [w], " from ", week_stats[w].start, " to ", week_stats[w].end)
        let endDateTime = new Date(week_stats[w].end)
        const accounts = await dbService.query('SELECT Name, created_date, Report_Start_Date__c, Termination_Date__c, Position__c, Status__c, Team__c FROM account WHERE Company_Email__c IS NOT NULL AND Team__c IS NOT NULL AND  Report_Start_Date__c < ? ', [week_stats[w].end])
        // const team = await dbService.query('SELECT * FROM account WHERE Company_Email__c IS NOT NULL AND Team__c IS NOT NULL AND  Report_Start_Date__c < ?', ['2018-10-15'])

        let reps = []
        let companyLeads = 0
        let companyQs = 0
        let companyAss = 0
        let companySits = 0
        let companyCloses = 0
        let companyScheduledInstalls = 0
        let companyECCount = 0
        let companyFMCount = 0

        const teams = await dbService.query('SELECT * FROM team WHERE created_date < ?', [week_stats[w].end])

        let medfordExist = false
        let teamNumbers = []
        for (let i = 0; i < teams.length; i++) {
           if (teams[i].teamId === 11 || teams[i].teamId === 12)
                continue
            if (teams[i].teamName === "Medford") {
                medfordExist = true
            }

            teamNumbers.push({
                Name: teams[i].teamName,
                fieldMarketers: [],
                energyConsultants: [],
                Leads: 0,
                Qs: 0,
                Ass: 0,
                LeadsPRA: 0,
                QsPRA: 0,
                AssPRA: 0,
                LeadScore: 0,
                QsScore: 0,
                AssScore: 0,
                Sits: 0,
                SitsPRA: 0,
                SitsScore: 0,
                Closes: 0,
                ClosesPRA: 0,
                ClosesScore: 0,
                ScheduledInstalls: 0,
                ScheduledInstallsPRA: 0,
                ScheduledInstallsScore: 0,
                fmScore: 0,
                ecScore: 0,
                teamScore: 0,
            })

            teams[i].teamName.toLowerCase().replace(/\s/g, '')
        }

        // loop through accounts
        for (let a = 0; a < accounts.length; a++) {
            // console.log("term date ", accounts[a].Termination_Date__c)
            let accountTeamName = ''
            if (medfordExist) {
                accountTeamName = (accounts[a].Team__c === 'Fox' ? 'Klamath Falls' : accounts[a].Team__c === 'Wolf' ? 'Boise' :  accounts[a].Team__c)
            } else {
                accountTeamName = (accounts[a].Team__c === 'Fox' ? 'Klamath Falls' : accounts[a].Team__c === 'Wolf' ? 'Boise' :  accounts[a].Team__c === 'Medford' ? 'Klamath Falls' : accounts[a].Team__c)
            }
            let role = accounts[a].Position__c
            let teamName = (accounts[a].Team__c === "Wolf" ? "Boise" : accounts[a].Team__c === "Fox" ? "Klamath Falls" : accounts[a].Team__c === "Fox" ? "Klamath Falls" : accounts[a].Team__c)


            // console.log(accounts[a].Name)
            if (role === 'Field Marketer' || role === 'Field Marketer Elite') {
                //start getting fms stats
                let leadCount = await dbService.query('SELECT COUNT(*) FROM _lead WHERE Field_Marketer__c = ? AND Proposal_Requested_Date_Time__c >= ? AND Proposal_Requested_Date_Time__c <= ?', [accounts[a].Name, week_stats[w].start, (week_stats[w].end + ' 23:59:00')])
                leadCount = leadCount[0]['COUNT(*)']

                let qsCount = await dbService.query('SELECT COUNT(*) FROM qs WHERE Field_Marketer__c = ? AND Appointment_Date__c >= ? AND Appointment_Date__c <= ?', [accounts[a].Name, week_stats[w].start, (week_stats[w].end + ' 23:59:00')])
                qsCount = qsCount[0]['COUNT(*)']

                let assistedClosesCount = await dbService.query('SELECT COUNT(*) FROM assisted_close WHERE Field_Marketer__c = ? AND Site_Audit_Scheduled_Date_Time__c >= ? AND Site_Audit_Scheduled_Date_Time__c <= ?', [accounts[a].Name, week_stats[w].start, (week_stats[w].end + ' 23:59:00')])
                assistedClosesCount = assistedClosesCount[0]['COUNT(*)']


                if (leadCount !== 0 && teamName !== "Amp" || qsCount !== 0 && teamName !== "Amp" || assistedClosesCount !== 0 && teamName || accounts[a].Status__c === 'Active' && teamName !== "Amp") {
                    if (accounts[a].Termination_Date__c !== null && accounts[a].Termination_Date__c < endDateTime) {
                        console.log("termination vs endDateTime", accounts[a].Termination_Date__c, endDateTime, accounts[a].Name)
                        continue
                    }
                    //calculate company overall fm numbers
                    companyLeads += leadCount
                    companyQs += qsCount
                    companyAss += assistedClosesCount
                    companyFMCount += 1

                    teamNumbers.forEach(function (team) {
                        if (team.Name === accountTeamName) {
                            team.Leads += leadCount
                            team.Qs += qsCount
                            team.Ass += assistedClosesCount
                            team.fieldMarketers.push({
                                Name: accounts[a].Name,
                                Leads: leadCount,
                                LeadGrade: (((leadCount / 10) * 0.8) * 100).toFixed(2),
                                Qs: qsCount,
                                QsGrade: (((qsCount / 8) * 0.8) * 100).toFixed(2),
                                AssistedCloses: assistedClosesCount,
                                AssGrade: (((assistedClosesCount / 2) * 1.3) * 100).toFixed(2),
                                WeekGrade: (((((leadCount / 10) * 0.8) * 100) + (((qsCount / 8) * 0.8) * 100) + (((assistedClosesCount / 2) * 1.3) * 100)) / 3).toFixed(2),
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
            } else if (role === 'Jr Energy Consultant' || role === 'Sr Energy Consultant' || role === 'Manager' || role === 'VP' || role === 'District Manager') {

                let sitsCount = await dbService.query('SELECT COUNT(*) FROM qs WHERE EC = ? AND Appointment_Date__c >= ? AND Appointment_Date__c <= ?', [accounts[a].Name, week_stats[w].start, (week_stats[w].end + ' 23:59:00')])
                sitsCount = sitsCount[0]['COUNT(*)']

                let closeCount = await dbService.query('SELECT COUNT(*) FROM _close WHERE Energy_Consultant__c = ? AND Site_Audit_Scheduled_Date_Time__c >= ? AND Site_Audit_Scheduled_Date_Time__c <= ?', [accounts[a].Name, week_stats[w].start, (week_stats[w].end + ' 23:59:00')])
                closeCount = closeCount[0]['COUNT(*)']

                let scheduledInstallsCount = await dbService.query('SELECT COUNT(*) FROM install_scheduled WHERE RepName = ? AND Install_Scheduled_Date_Time__c >= ? AND Install_Scheduled_Date_Time__c <= ?', [accounts[a].Name, week_stats[w].start, (week_stats[w].end + ' 23:59:00')])
                scheduledInstallsCount = scheduledInstallsCount[0]['COUNT(*)']


                if (sitsCount !== 0 && accounts[a].Team__c !== "Amp" || closeCount !== 0 && accounts[a].Team__c !== "Amp" || scheduledInstallsCount !== 0 && accounts[a].Team__c !== "Amp" || accounts[a].Status__c === 'Active' && accounts[a].Team__c !== "Amp") {
                    companySits += sitsCount
                    companyCloses += closeCount
                    companyScheduledInstalls += scheduledInstallsCount


                    companyECCount += 1

                    teamNumbers.forEach(function (team) {
                        if (team.Name === accountTeamName) {
                            team.Sits += sitsCount
                            team.Closes += closeCount
                            team.ScheduledInstalls += scheduledInstallsCount
                            team.energyConsultants.push({
                                Name: accounts[a].Name,
                                Sits: sitsCount,
                                SitsGrade: (((sitsCount / 12) * 0.9) * 100).toFixed(2),
                                Closes: closeCount,
                                ClosesGrade: (((closeCount / 2) * 0.9) * 100).toFixed(2),
                                ScheduledInstalls: scheduledInstallsCount,
                                ScheduledInstallsGrade: (((scheduledInstallsCount / 2) * 1.5) * 100).toFixed(2),
                                WeekGrade: (((((sitsCount / 12) * 0.9) * 100) + (((closeCount / 2) * 0.9) * 100) + (((scheduledInstallsCount / 2) * 0.9) * 100)) / 3).toFixed(2)

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
        let weekScore = ((ecUnitScore + fmUnitScore) / 2)
        //team Calculations
        let t = -1
        while (++t < teamNumbers.length) {
            // console.log("iteration ", t)
            teamNumbers[t].LeadsPRA = (teamNumbers[t].Leads / teamNumbers[t].fieldMarketers.length)
            teamNumbers[t].LeadsScore = (((teamNumbers[t].LeadsPRA / 8) * .8) * 100)
            teamNumbers[t].QsPRA = (teamNumbers[t].Qs / teamNumbers[t].fieldMarketers.length)
            teamNumbers[t].QsScore = (((teamNumbers[t].QsPRA / 6) * .8) * 100)
            teamNumbers[t].AssPRA = (teamNumbers[t].Ass / teamNumbers[t].fieldMarketers.length)
            teamNumbers[t].AssScore = (((teamNumbers[t].AssPRA / 1.5) * 1.3) * 100)
            teamNumbers[t].fmScore = ((teamNumbers[t].LeadsScore + teamNumbers[t].QsScore + teamNumbers[t].AssScore) / 3)

            teamNumbers[t].SitsPRA = (teamNumbers[t].Sits / teamNumbers[t].energyConsultants.length)
            teamNumbers[t].SitsScore = (((teamNumbers[t].SitsPRA / 8) * .9) * 100)
            teamNumbers[t].ClosesPRA = (teamNumbers[t].Closes / teamNumbers[t].energyConsultants.length)
            teamNumbers[t].ClosesScore = (((teamNumbers[t].ClosesPRA / 1.5) * .9) * 100)
            teamNumbers[t].ScheduledInstallsPRA = (teamNumbers[t].ScheduledInstalls / teamNumbers[t].energyConsultants.length)
            teamNumbers[t].ScheduledInstallsScore = (((teamNumbers[t].ScheduledInstallsPRA / 1.5) * .9) * 100)
            teamNumbers[t].ecScore = ((teamNumbers[t].SitsScore + teamNumbers[t].ClosesScore + teamNumbers[t].ScheduledInstallsScore) / 3)
            // console.log("begin score cal ", teamNumbers[t].fmScore, teamNumbers[t].ecScore)
            teamNumbers[t].teamScore = (teamNumbers[t].fmScore + teamNumbers[t].ecScore) / 2
            // console.log("end score cal ", teamNumbers[t].teamScore)
        }

        //insert week stat
        // await dbService.query('INSERT IGNORE INTO week_stats(start_date, end_date, fm_leads, fm_qs, fm_ass, ec_sits, ec_closes, ec_scheduled_installs, teams, reps, fms_number, ecs_number, fm_leads_pra, fm_leads_score, fm_qs_pra, fm_qs_score, fm_ass_pra, fm_ass_score, fm_unit_score, ec_sits_pra, ec_sits_score, ec_closes_pra, ec_closes_score, ec_scheduled_installs_pra, ec_scheduled_installs_score, ec_unit_score, week_score) VALUES( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )', [week_stats[w].start, week_stats[w].end, companyLeads, companyQs, companyAss, companySits, companyCloses, companyScheduledInstalls, JSON.stringify(queryTeams), JSON.stringify(reps), companyFMCount, companyECCount, leadsPRA, leadsScore, qsPRA, qsScore, assPRA, assScore, fmUnitScore, sitsPRA, sitsScore, closePRA, closeScore, scheduledInstallsPRA, scheduledInstallsScore, ecUnitScore, weekScore])
        await dbService.query('INSERT IGNORE INTO week_stats(start_date, end_date, fm_leads, fm_qs, fm_ass, ec_sits, ec_closes, ec_scheduled_installs, team_numbers, fms_number, ecs_number, fm_leads_pra, fm_leads_score, fm_qs_pra, fm_qs_score, fm_ass_pra, fm_ass_score, fm_unit_score, ec_sits_pra, ec_sits_score, ec_closes_pra, ec_closes_score, ec_scheduled_installs_pra, ec_scheduled_installs_score, ec_unit_score, week_score) VALUES( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )', [week_stats[w].start, week_stats[w].end, companyLeads, companyQs, companyAss, companySits, companyCloses, companyScheduledInstalls, JSON.stringify(teamNumbers), companyFMCount, companyECCount, leadsPRA, leadsScore, qsPRA, qsScore, assPRA, assScore, fmUnitScore, sitsPRA, sitsScore, closePRA, closeScore, scheduledInstallsPRA, scheduledInstallsScore, ecUnitScore, weekScore])

    }

}

async function getWeekReport(dateRange) {
    // console.log("getCurrentWeek ini", dateRange)
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
    // console.log("utcStartDatetime ", utcStartDatetime)

    let leadCount = await dbService.query('SELECT * FROM week_stats WHERE start_date = ?', [dateRange['start']])
    // console.log("leadCount ", leadCount)

   let currentWeekEvaluation = []
    let getNewWeek = []
    if(leadCount.length !== 0){
        // console.log("lead count not zero")
        currentWeekEvaluation = leadCount[0]
    }else{
       await dbService.query('INSERT IGNORE INTO week_stats(start_date, end_date, fm_leads, fm_qs, fm_ass, ec_sits, ec_closes, ec_scheduled_installs, team_numbers, fms_number, ecs_number, fm_leads_pra, fm_leads_score, fm_qs_pra, fm_qs_score, fm_ass_pra, fm_ass_score, fm_unit_score, ec_sits_pra, ec_sits_score, ec_closes_pra, ec_closes_score, ec_scheduled_installs_pra, ec_scheduled_installs_score, ec_unit_score, week_score) VALUES( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )', [dateRange.start, dateRange.end, 0, 0, 0, 0, 0, 0, '{}', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
        let getNewWeek = await dbService.query('SELECT * FROM week_stats WHERE start_date = ?', [dateRange['start']])
        currentWeekEvaluation = getNewWeek[0]
    }
    // console.log("leadCount ", leadCount)
    return currentWeekEvaluation

}

async function weeksForChart({rangeSelection}) {
    // console.log("rangeSelection ", rangeSelection)
    let d = new Date()
    let labelWeeks = []
    let labelScores = []
    let weekRanges = []
    let q1Start = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    let q2Start = new Date(Date.UTC( ( d.getUTCFullYear() ), 3, 1))
    let q3Start = new Date(Date.UTC( ( d.getUTCFullYear() ), 6, 1))
    let q4Start = new Date(Date.UTC(( d.getUTCFullYear()  - 1), 9, 1))
    let q1End = new Date(Date.UTC(d.getUTCFullYear(), 2, 31))
    let q2End = new Date(Date.UTC(( d.getUTCFullYear()), 5, 30))
    let q3End = new Date(Date.UTC(( d.getUTCFullYear() ), 8, 30))
    let q4End = new Date(Date.UTC(( d.getUTCFullYear()  - 1), 11, 31))
    let qsPassedWeeks = 0
    let qStart

    //get current quarter based on today's date
    let startDateReference = new Date()
    // console.log("today " + today)
    startDateReference = new Date(Date.UTC(startDateReference.getFullYear(), startDateReference.getMonth(), startDateReference.getDate()))
    startDateReference.setUTCDate(startDateReference.getUTCDate() + 4 - (startDateReference.getUTCDay() || 7))
    let monthVal = d.getMonth()
    //date ranges that includes today's date
    if (rangeSelection === 'current') {
        qStart = (monthVal <= 2 ? q1Start : monthVal >= 3 && monthVal <= 5 ? q2Start : monthVal >= 6 && monthVal <= 8 ? q3Start : q4Start)
    } else if (rangeSelection === 'previous and current') {
        qStart = (monthVal <= 2 ? q4Start : monthVal >= 3 && monthVal <= 5 ? q1Start : monthVal >= 6 && monthVal <= 8 ? q2Start : q3Start)
    } else if (rangeSelection === 'previous') {
        qStart = (monthVal <= 2 ? q4Start : monthVal >= 3 && monthVal <= 5 ? q1Start : monthVal >= 6 && monthVal <= 8 ? q2Start : q3Start)
        startDateReference = (monthVal <= 2 ? q4End : monthVal >= 3 && monthVal <= 5 ? q1End : monthVal >= 6 && monthVal <= 8 ? q2End : q3End)
    }else if (rangeSelection === 'this year') {
        qStart = q1Start
    }

    qsPassedWeeks = Math.ceil((((startDateReference - qStart) / 86400000) + 1) / 7)


    let starDate = startDateReference.toISOString()
    starDate = starDate.split("T")

    let endDate = qStart.toISOString()
    endDate = endDate.split("T")

    // console.log("start and end for query ", starDate[0], endDate[0])
    //
    let dataForChart = await dbService.query('SELECT start_date, end_date, week_score, team_numbers FROM week_stats WHERE start_date < ? AND end_date > ? ORDER BY start_date DESC', [starDate[0], endDate[0]])


    // console.log("dataForChart ", dataForChart)
    // let teamScores = []
    let teamScores = {}
    teamScores['Rexburg'] = []
    teamScores['Medford'] = []
    teamScores['Boise'] = []
    teamScores['Fox'] = []
    teamScores['Bend'] = []

    let weekECs = []
    let weekFMs = []
    // teamNumbers.push({
    //     Name: teams[i].teamName,
    //
    // })

    if (dataForChart.length > 0) {
        // console.log("start loop")

        let w = -1

        let limit = dataForChart.length - 1
        while (w++ < limit) {
            weekECs[w] = []
            weekFMs[w] = []
            // console.log("w ", w, " ", dataForChart[w])
            // console.log( "dataForChart w0ile month ", dataForChart[w].start_date.getMonth() )
            let startDateDay = dataForChart[w].start_date.getDate()
            let startDateMonth = dataForChart[w].start_date.getMonth()
            let startFormattedDate = dataForChart[w].start_date.toISOString()
            let startFormattedDateSplit = startFormattedDate.split('T')
            let endDateMonth = dataForChart[w].end_date.getMonth()
            let endDateDay = dataForChart[w].end_date.getDate()
            let endFormattedDate = dataForChart[w].end_date.toISOString()
            let endFormattedDateSplit = startFormattedDate.split('T')
            labelWeeks.push((startDateMonth === 0 ? "Jan" : startDateMonth === 1 ? "Feb" : startDateMonth === 2 ? "Mar" : startDateMonth === 3 ? "Apr" : startDateMonth === 4 ? "May" : startDateMonth === 5 ? "Jun" : startDateMonth === 6 ? "Jul" : startDateMonth === 7 ? "Aug" : startDateMonth === 8 ? "Sep" : startDateMonth === 9 ? "Oct" : startDateMonth === 10 ? "Nov" : "Dic") + "-" + startDateDay + "/" + (endDateMonth === 0 ? "Jan" : endDateMonth === 1 ? "Feb" : endDateMonth === 2 ? "Mar" : endDateMonth === 3 ? "Apr" : endDateMonth === 4 ? "May" : endDateMonth === 5 ? "Jun" : endDateMonth === 6 ? "Jul" : endDateMonth === 7 ? "Aug" : endDateMonth === 8 ? "Sep" : endDateMonth === 9 ? "Oct" : endDateMonth === 10 ? "Nov" : "Dic") + "-" + endDateDay)
            labelScores.push(dataForChart[w].week_score.toFixed(2))
            weekRanges.push({start: startFormattedDateSplit[0], end: endFormattedDateSplit[0]})

            let t = -1
            let teamsData = JSON.parse(dataForChart[w].team_numbers)
            let teamsLength = teamsData.length - 1

            while (t++ < teamsLength) {
                weekECs[w].push(teamsData[t].energyConsultants)
                weekFMs[w].push(teamsData[t].fieldMarketers)
                if (teamsData[t].Name === "Rexburg") {
                    teamScores['Rexburg'].push(teamsData[t].teamScore !== null ? teamsData[t].teamScore.toFixed(2) : 0)

                } else if (teamsData[t].Name === "Boise") {
                    teamScores['Boise'].push(teamsData[t].teamScore !== null ? teamsData[t].teamScore.toFixed(2) : 0)
                } else if (teamsData[t].Name === "Klamath Falls") {
                    teamScores['Fox'].push(teamsData[t].teamScore !== null ? teamsData[t].teamScore.toFixed(2) : 0)
                } else if (teamsData[t].Name === "Medford") {
                    teamScores['Medford'].push(teamsData[t].teamScore !== null ? teamsData[t].teamScore.toFixed(2) : 0)
                }else if (teamsData[t].Name === "Bend") {
                    teamScores['Bend'].push(teamsData[t].teamScore !== null ? teamsData[t].teamScore.toFixed(2) : 0)
                }
            }

        }
    }

    // console.log("teamScores ", teamScores)

    weekRanges.reverse()
    labelWeeks.reverse()
    labelScores.reverse()
    // console.log("labelWeeks ", labelWeeks)
    // console.log("labelScores ", labelScores)
    return {
        TopLabel: labelWeeks,
        BottomLabel: labelScores,
        WeekRanges: weekRanges,
        TeamScoresLabel: teamScores,
        WeeksFMs: weekFMs,
        WeeksECs: weekECs,
    }
}

async function recalculateWeek({weekId, accounts, start, end}) {
    // console.log("modifyWeeks ", weekId, start, end)

    let companyLeads = 0
    let companyQs = 0
    let companyAss = 0
    let companySits = 0
    let companyCloses = 0
    let companyScheduledInstalls = 0
    let companyECCount = 0
    let companyFMCount = 0

    const teams = await dbService.query('SELECT * FROM team WHERE created_date < ?', [end])

    let medfordExist = false
    let teamNumbers = []
    for (let i = 0; i < teams.length; i++) {
        if (teams[i].teamId === 11 || teams[i].teamId === 12 || teams[i].teamId === 13 || teams[i].teamId === 14)
            continue
        if (teams[i].teamName === "Medford") {
            medfordExist = true
        }

        teamNumbers.push({
            Name: teams[i].teamName,
            fieldMarketers: [],
            energyConsultants: [],
            Leads: 0,
            Qs: 0,
            Ass: 0,
            LeadsPRA: 0,
            QsPRA: 0,
            AssPRA: 0,
            LeadScore: 0,
            QsScore: 0,
            AssScore: 0,
            Sits: 0,
            SitsPRA: 0,
            SitsScore: 0,
            Closes: 0,
            ClosesPRA: 0,
            ClosesScore: 0,
            ScheduledInstalls: 0,
            ScheduledInstallsPRA: 0,
            ScheduledInstallsScore: 0,
            fmScore: 0,
            ecScore: 0,
            teamScore: 0,
        })

        teams[i].teamName.toLowerCase().replace(/\s/g, '')
    }

    // loop through accounts
    for (let fm = 0; fm < accounts.fms.length; fm++) {
        // console.log("term date ", accounts[a].Termination_Date__c)
        let accountTeamName = accounts.fms[fm].Team


        // console.log(accounts[a].Name)

        //start getting fms stats
        let leadCount = await dbService.query('SELECT COUNT(*) FROM _lead WHERE Field_Marketer__c = ? AND Proposal_Requested_Date_Time__c >= ? AND Proposal_Requested_Date_Time__c <= ?', [accounts.fms[fm].Name, start, (end + ' 23:59:00')])
        leadCount = leadCount[0]['COUNT(*)']

        let qsCount = await dbService.query('SELECT COUNT(*) FROM qs WHERE Field_Marketer__c = ? AND Appointment_Date__c >= ? AND Appointment_Date__c <= ?', [accounts.fms[fm].Name, start, (end + ' 23:59:00')])
        qsCount = qsCount[0]['COUNT(*)']

        let assistedClosesCount = await dbService.query('SELECT COUNT(*) FROM assisted_close WHERE Field_Marketer__c = ? AND Site_Audit_Scheduled_Date_Time__c >= ? AND Site_Audit_Scheduled_Date_Time__c <= ?', [accounts.fms[fm].Name, start, (end + ' 23:59:00')])
        assistedClosesCount = assistedClosesCount[0]['COUNT(*)']


        //calculate company overall fm numbers
        companyLeads += leadCount
        companyQs += qsCount
        companyAss += assistedClosesCount
        companyFMCount += 1

        teamNumbers.forEach(function (team) {
            if (team.Name === accountTeamName) {
                team.Leads += leadCount
                team.Qs += qsCount
                team.Ass += assistedClosesCount
                team.fieldMarketers.push({
                    Name: accounts.fms[fm].Name,
                    Leads: leadCount,
                    LeadGrade: (((leadCount / 10) * 0.8) * 100).toFixed(2),
                    Qs: qsCount,
                    QsGrade: (((qsCount / 8) * 0.8) * 100).toFixed(2),
                    AssistedCloses: assistedClosesCount,
                    AssGrade: (((assistedClosesCount / 2) * 1.3) * 100).toFixed(2),
                    WeekGrade: (((((leadCount / 10) * 0.8) * 100) + (((qsCount / 8) * 0.8) * 100) + (((assistedClosesCount / 2) * 1.3) * 100)) / 3).toFixed(2),
                })

            }
        })

    }

    //end getting fms stats
    for (let ec = 0; ec < accounts.ecs.length; ec++) {
        let accountTeamName = accounts.ecs[ec].Team
        let sitsCount = await dbService.query('SELECT COUNT(*) FROM qs WHERE EC = ? AND Appointment_Date__c >= ? AND Appointment_Date__c <= ?', [accounts.ecs[ec].Name, start, (end + ' 23:59:00')])
        sitsCount = sitsCount[0]['COUNT(*)']

        let closeCount = await dbService.query('SELECT COUNT(*) FROM _close WHERE Energy_Consultant__c = ? AND Site_Audit_Scheduled_Date_Time__c >= ? AND Site_Audit_Scheduled_Date_Time__c <= ?', [accounts.ecs[ec].Name, start, (end + ' 23:59:00')])
        closeCount = closeCount[0]['COUNT(*)']

        let scheduledInstallsCount = await dbService.query('SELECT COUNT(*) FROM install_scheduled WHERE RepName = ? AND Install_Scheduled_Date_Time__c >= ? AND Install_Scheduled_Date_Time__c <= ?', [accounts.ecs[ec].Name, start, (end + ' 23:59:00')])
        scheduledInstallsCount = scheduledInstallsCount[0]['COUNT(*)']

        companySits += sitsCount
        companyCloses += closeCount
        companyScheduledInstalls += scheduledInstallsCount

        companyECCount += 1

        teamNumbers.forEach(function (team) {
            if (team.Name === accountTeamName) {
                team.Sits += sitsCount
                team.Closes += closeCount
                team.ScheduledInstalls += scheduledInstallsCount
                team.energyConsultants.push({
                    Name: accounts.ecs[ec].Name,
                    Sits: sitsCount,
                    SitsGrade: (((sitsCount / 12) * 0.9) * 100).toFixed(2),
                    Closes: closeCount,
                    ClosesGrade: (((closeCount / 2) * 0.9) * 100).toFixed(2),
                    ScheduledInstalls: scheduledInstallsCount,
                    ScheduledInstallsGrade: (((scheduledInstallsCount / 2) * 1.5) * 100).toFixed(2),
                    WeekGrade: (((((sitsCount / 12) * 0.9) * 100) + (((closeCount / 2) * 0.9) * 100) + (((scheduledInstallsCount / 2) * 0.9) * 100)) / 3).toFixed(2)

                })
            }
        })


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
    let weekScore = ((ecUnitScore + fmUnitScore) / 2)
//team Calculations
    let t = -1
    while (++t < teamNumbers.length) {
        // console.log("iteration ", t)
        teamNumbers[t].LeadsPRA = (teamNumbers[t].Leads / teamNumbers[t].fieldMarketers.length)
        teamNumbers[t].LeadsScore = (((teamNumbers[t].LeadsPRA / 8) * .8) * 100)
        teamNumbers[t].QsPRA = (teamNumbers[t].Qs / teamNumbers[t].fieldMarketers.length)
        teamNumbers[t].QsScore = (((teamNumbers[t].QsPRA / 6) * .8) * 100)
        teamNumbers[t].AssPRA = (teamNumbers[t].Ass / teamNumbers[t].fieldMarketers.length)
        teamNumbers[t].AssScore = (((teamNumbers[t].AssPRA / 1.5) * 1.3) * 100)
        teamNumbers[t].fmScore = ((teamNumbers[t].LeadsScore + teamNumbers[t].QsScore + teamNumbers[t].AssScore) / 3)

        teamNumbers[t].SitsPRA = (teamNumbers[t].Sits / teamNumbers[t].energyConsultants.length)
        teamNumbers[t].SitsScore = (((teamNumbers[t].SitsPRA / 8) * .9) * 100)
        teamNumbers[t].ClosesPRA = (teamNumbers[t].Closes / teamNumbers[t].energyConsultants.length)
        teamNumbers[t].ClosesScore = (((teamNumbers[t].ClosesPRA / 1.5) * .9) * 100)
        teamNumbers[t].ScheduledInstallsPRA = (teamNumbers[t].ScheduledInstalls / teamNumbers[t].energyConsultants.length)
        teamNumbers[t].ScheduledInstallsScore = (((teamNumbers[t].ScheduledInstallsPRA / 1.5) * .9) * 100)
        teamNumbers[t].ecScore = ((teamNumbers[t].SitsScore + teamNumbers[t].ClosesScore + teamNumbers[t].ScheduledInstallsScore) / 3)
        // console.log("begin score cal ", teamNumbers[t].fmScore, teamNumbers[t].ecScore)
        teamNumbers[t].teamScore = (teamNumbers[t].fmScore + teamNumbers[t].ecScore) / 2
        // console.log("end score cal ", teamNumbers[t].teamScore)
    }

//update week stat
    await dbService.query('UPDATE  week_stats SET  fm_leads = ?, fm_qs = ?, fm_ass = ?, ec_sits = ?, ec_closes = ?, ec_scheduled_installs = ?, team_numbers = ?, fms_number = ?, ecs_number = ?, fm_leads_pra = ?, fm_leads_score = ?, fm_qs_pra = ?, fm_qs_score = ?, fm_ass_pra = ?, fm_ass_score = ?, fm_unit_score = ?, ec_sits_pra = ?, ec_sits_score = ?, ec_closes_pra = ?, ec_closes_score = ?, ec_scheduled_installs_pra = ?, ec_scheduled_installs_score = ?, ec_unit_score = ?, week_score = ? WHERE id = ?', [companyLeads, companyQs, companyAss, companySits, companyCloses, companyScheduledInstalls, JSON.stringify(teamNumbers), companyFMCount, companyECCount, leadsPRA, leadsScore, qsPRA, qsScore, assPRA, assScore, fmUnitScore, sitsPRA, sitsScore, closePRA, closeScore, scheduledInstallsPRA, scheduledInstallsScore, ecUnitScore, weekScore, weekId])


}

async function getReportStats(dateRange) {
    // console.log("from report service", dateRange)
    const users = await userService.getUsers()
    // const teams = await teamService.getTeams()
    //
    // const accounts = await dbService.query('SELECT * FROM account WHERE Company_Email__c IS NOT NULL AND Team__c IS NOT NULL AND created_date')
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


    const teams = await dbService.query('SELECT * FROM team WHERE created_date < ?', [utcStartDatetime])
    const accounts = await dbService.query('SELECT * FROM account WHERE Company_Email__c IS NOT NULL AND Team__c IS NOT NULL AND  Report_Start_Date__c < ?', [utcEndDatetime])
    // console.log("startDateTime ", startDateTime)
    // console.log("utcStartDatetime ", utcStartDatetime)
    // console.log("gettingDay ", gettingDay)
    // console.log("utcEndDatetime ", utcEndDatetime)


    // let energyConsultants = []
    // let fieldMarketers = []

    //show medford
    // console.log("report teams iteration ", teams)
    // if(teams[i].teamId === 15) {
    //     const teamCreatedDate = new Date(teams[i].created_date)
    //     if (teamCreatedDate > currentWeekDate && payDate < currentWeekEnd) {
    //     }
    // }

    let medfordExist = false
    let teamNumbers = []
    for (let i = 0; i < teams.length; i++) {
        if (teams[i].teamId === 11 || teams[i].teamId === 12)
            continue
        if (teams[i].teamName === "Medford") {
            medfordExist = true
        }

        teamNumbers.push({
            Name: teams[i].teamName,
            fieldMarketers: [],
            energyConsultants: [],
            Leads: 0,
            Qs: 0,
            Ass: 0,
            LeadsPRA: 0,
            QsPRA: 0,
            AssPRA: 0,
            LeadScore: 0,
            QsScore: 0,
            AssScore: 0,
            TeamScore: 0,
            Sits: 0,
            SitsPRA: 0,
            SitsScore: 0,
            Closes: 0,
            ClosesPRA: 0,
            ClosesScore: 0,
            ScheduledInstalls: 0,
            ScheduledInstallsPRA: 0,
            ScheduledInstallsScore: 0,
            fmScore: 0,
            ecScore: 0,
            teamScore: 0,
        })

        teams[i].teamName.toLowerCase().replace(/\s/g, '')
    }
    let companyLeads = 0
    let companyQs = 0
    let companyAss = 0
    let companySits = 0
    let companyCloses = 0
    let companyScheduledInstalls = 0
    let fmCount = 0
    let ecCount = 0

    // console.log("medfordExist ", medfordExist)
    //iterate through accounts and populate ec and fm arrays
    for (let i = 0; i < accounts.length; i++) {
        let accountTeamName = ''
        if (medfordExist) {
            accountTeamName = (accounts[i].Team__c === 'Fox' ? 'Klamath Falls' : accounts[i].Team__c === 'Wolf' ? 'Boise' : accounts[i].Team__c === 'Pocatello' ? 'Rexburg' : accounts[i].Team__c)
        } else {
            accountTeamName = (accounts[i].Team__c === 'Fox' ? 'Klamath Falls' : accounts[i].Team__c === 'Wolf' ? 'Boise' : accounts[i].Team__c === 'Pocatello' ? 'Rexburg' : accounts[i].Team__c === 'Medford' ? 'Klamath Falls' : accounts[i].Team__c)
        }


        let accountTeam = accounts[i].Team__c
        //medford


        let role = accounts[i].Position__c

        if (role === 'Jr Energy Consultant' || role === 'Sr Energy Consultant' || role === 'Manager' || role === 'VP' || role === 'District Manager') {
            let sitsCount = await dbService.query('SELECT COUNT(*) FROM qs WHERE EC = ? AND Appointment_Date__c >= ? AND Appointment_Date__c <= ?', [accounts[i].Name, dateRange.start, dateRange.end])
            sitsCount = sitsCount[0]['COUNT(*)']

            let closeCount = await dbService.query('SELECT COUNT(*) FROM _close WHERE Energy_Consultant__c = ? AND Site_Audit_Scheduled_Date_Time__c >= ? AND Site_Audit_Scheduled_Date_Time__c <= ?', [accounts[i].Name, utcStartDatetime, utcEndDatetime])
            closeCount = closeCount[0]['COUNT(*)']

            let scheduledInstallsCount = await dbService.query('SELECT COUNT(*) FROM install_scheduled WHERE RepName = ? AND Install_Scheduled_Date_Time__c >= ? AND Install_Scheduled_Date_Time__c <= ?', [accounts[i].Name, utcStartDatetime, utcEndDatetime])
            scheduledInstallsCount = scheduledInstallsCount[0]['COUNT(*)']

            companySits += sitsCount
            companyCloses += closeCount
            companyScheduledInstalls += scheduledInstallsCount
            ecCount += 1
            //adding team to energy consultants array
            if (sitsCount !== 0 || closeCount !== 0 || scheduledInstallsCount !== 0) {
                teamNumbers.forEach(function (team) {
                    if (team.Name === accountTeamName) {
                        team.Sits += sitsCount
                        team.Closes += closeCount
                        team.ScheduledInstalls += scheduledInstallsCount
                        team.energyConsultants.push({
                            Name: accounts[i].Name,
                            Sits: sitsCount,
                            Closes: closeCount,
                            ScheduledInstalls: scheduledInstallsCount,
                        })
                    }
                })
            } else {


            }
        } else if (role === 'Field Marketer' || role === 'Field Marketer Elite') {

            // let leadCount = await dbService.query('SELECT COUNT(*) FROM _lead WHERE Field_Marketer__c = ? AND Proposal_Requested_Date_Time__c >= ? AND Proposal_Requested_Date_Time__c <= ?', [accounts[i].Name, startDateTime, endDateTime])
            let leadCount = await dbService.query('SELECT COUNT(*) FROM _lead WHERE Field_Marketer__c = ? AND Proposal_Requested_Date_Time__c >= ? AND Proposal_Requested_Date_Time__c <= ?', [accounts[i].Name, utcStartDatetime, utcEndDatetime])
            leadCount = leadCount[0]['COUNT(*)']

            let qsCount = await dbService.query('SELECT COUNT(*) FROM qs WHERE Field_Marketer__c = ? AND Appointment_Date__c >= ? AND Appointment_Date__c <= ?', [accounts[i].Name, dateRange.start, dateRange.end])
            qsCount = qsCount[0]['COUNT(*)']
            // let assistedClosesCount = await dbService.query('SELECT COUNT(*) FROM assisted_close WHERE Field_Marketer__c = ? AND Site_Audit_Scheduled_Date_Time__c >= ? AND Site_Audit_Scheduled_Date_Time__c <= ?', [accounts[i].Name, startDateTime, endDateTime])
            let assistedClosesCount = await dbService.query('SELECT COUNT(*) FROM assisted_close WHERE Field_Marketer__c = ? AND Site_Audit_Scheduled_Date_Time__c >= ? AND Site_Audit_Scheduled_Date_Time__c <= ?', [accounts[i].Name, utcStartDatetime, utcEndDatetime])
            assistedClosesCount = assistedClosesCount[0]['COUNT(*)']

            companyLeads += leadCount
            companyQs += qsCount
            companyAss += assistedClosesCount


            if (leadCount !== 0 || accounts[i].Status__c === 'Active') {
                fmCount += 1

                // console.log(accounts[i].Name, [i])

                teamNumbers.forEach(function (team) {
                    if (team.Name === accountTeamName) {
                        team.Leads += leadCount
                        team.Qs += qsCount
                        team.Ass += assistedClosesCount
                        team.fieldMarketers.push({
                            Name: accounts[i].Name,
                            Leads: leadCount,
                            Qs: qsCount,
                            AssistedCloses: assistedClosesCount
                        })

                    }
                })
            }

        }
    }
    //team Calculations
    let t = -1
    while (++t < teamNumbers.length) {
        // console.log("iteration ", t)
        teamNumbers[t].LeadsPRA = (teamNumbers[t].Leads / teamNumbers[t].fieldMarketers.length)
        teamNumbers[t].LeadsScore = (((teamNumbers[t].LeadsPRA / 8) * .8) * 100)
        teamNumbers[t].QsPRA = (teamNumbers[t].Qs / teamNumbers[t].fieldMarketers.length)
        teamNumbers[t].QsScore = (((teamNumbers[t].QsPRA / 6) * .8) * 100)
        teamNumbers[t].AssPRA = (teamNumbers[t].Ass / teamNumbers[t].fieldMarketers.length)
        teamNumbers[t].AssScore = (((teamNumbers[t].AssPRA / 1.5) * 1.3) * 100)
        teamNumbers[t].fmScore = ((teamNumbers[t].LeadsScore + teamNumbers[t].QsScore + teamNumbers[t].AssScore) / 3)

        teamNumbers[t].SitsPRA = (teamNumbers[t].Sits / teamNumbers[t].energyConsultants.length)
        teamNumbers[t].SitsScore = (((teamNumbers[t].SitsPRA / 8) * .9) * 100)
        teamNumbers[t].ClosesPRA = (teamNumbers[t].Closes / teamNumbers[t].energyConsultants.length)
        teamNumbers[t].ClosesScore = (((teamNumbers[t].ClosesPRA / 1.5) * .9) * 100)
        teamNumbers[t].ScheduledInstallsPRA = (teamNumbers[t].ScheduledInstalls / teamNumbers[t].energyConsultants.length)
        teamNumbers[t].ScheduledInstallsScore = (((teamNumbers[t].ScheduledInstallsPRA / 1.5) * .9) * 100)
        teamNumbers[t].ecScore = ((teamNumbers[t].SitsScore + teamNumbers[t].ClosesScore + teamNumbers[t].ScheduledInstallsScore) / 3)
        // console.log("begin score cal ", teamNumbers[t].fmScore, teamNumbers[t].ecScore)
        teamNumbers[t].teamScore = (teamNumbers[t].fmScore + teamNumbers[t].ecScore) / 2
        // console.log("end score cal ", teamNumbers[t].teamScore)
    }
    //fm calculations
    // console.log("fm length vs fm count ", fmCount)
    let companyLeadsPRA = companyLeads / fmCount
    let companyQsPRA = companyQs / fmCount
    let companyAssPRA = companyAss / fmCount
    let companyLeadsScore = (((companyLeadsPRA / 8) * 0.8) * 100)
    let companyQsScore = (((companyQsPRA / 6) * 0.8) * 100)
    let companyAssScore = (((companyAssPRA / 1.5) * 1.3) * 100)
    let companyFMScore = (companyAssScore + companyQsScore + companyAssScore) / 3

    //company FM Numbers
    let companyFMNumbers = [
        {
            CompanyLeads: companyLeads,
            CompanyQS: companyQs,
            CompanyAss: companyAss,
            CompanyLeadsPRA: companyLeadsPRA,
            CompanyQsPRA: companyQsPRA,
            CompanyAssPRA: companyAssPRA,
            CompanyLeadScore: companyLeadsScore,
            CompanyQsScore: companyQsScore,
            CompanyAssScore: companyAssScore,
            CompanyFMScore: companyFMScore,
        }
    ]
    //ec calculations
    // console.log("ec length vs ec count ", energyConsultants.length, ecCount)
    let companySitsPRA = companySits / ecCount
    let companyClosesPRA = companyQs / ecCount
    let companySheduledInstallsPRA = companyScheduledInstalls / ecCount
    let companySitsScore = (((companySitsPRA / 8) * 0.9) * 100)
    let companyClosesScore = (((companyClosesPRA / 1.5) * 0.9) * 100)
    let companyInstallsSheduledScore = (((companySheduledInstallsPRA / 1.5) * 0.9) * 100)
    let companyECScore = (companySitsScore + companyClosesScore + companyInstallsSheduledScore) / 3
    let companyECNumbers = [
        {
            CompanySits: companySits,
            CompanyCloses: companyCloses,
            CompanyScheduledInstalls: companyScheduledInstalls,
            CompanySitsPRA: companySitsPRA,
            CompanyClosesPRA: companyClosesPRA,
            CompanySheduledInstallsPRA: companySheduledInstallsPRA,
            CompanySitsScore: companySitsScore,
            CompanyClosesScore: companyClosesScore,
            CompanyInstallsScheduledScore: companyInstallsSheduledScore,
            CompanyECScore: companyECScore,

        }
    ]

    // console.log("teamNumbers ", teamNumbers)

    // let companyOverallNumbers = [
    //     {
    //         Score: ((companyECScore + companyFMScore) / 2),
    //         CompanyECNumbers: companyECNumbers,
    //         CompanyFMNumbers: companyFMNumbers,
    //         Teams: teamNumbers,
    //     }
    // ]
    //
    // return {
    //
    //     CompanyNumbers: companyOverallNumbers
    // }
}

async function quarterWeeks({quarter}) {

    let d = new Date()
    let CQ = []
    let labels = []
    let q1Start = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    let q2Start = new Date(Date.UTC(d.getUTCFullYear(), 3, 1))
    let q3Start = new Date(Date.UTC(d.getUTCFullYear(), 6, 1))
    let q4Start = new Date(Date.UTC(d.getUTCFullYear(), 9, 1))
    let qsPassedWeeks = 0
    let qStart

    //get current quarter based on today's date
    let startDateReference = new Date()

    // console.log("today " + today)
    startDateReference = new Date(Date.UTC(startDateReference.getFullYear(), startDateReference.getMonth(), startDateReference.getDate()))
    startDateReference.setUTCDate(startDateReference.getUTCDate() + 4 - (startDateReference.getUTCDay() || 7))
    let monthVal = d.getMonth()
    //date ranges that includes today's date
    if (quarter === 'current') {
        qStart = (monthVal <= 2 ? q1Start : monthVal >= 3 && monthVal <= 5 ? q2Start : monthVal >= 6 && monthVal <= 8 ? q3Start : q4Start)
    } else if (quarter === 'previous and current') {
        qStart = (monthVal <= 2 ? q1Start : monthVal >= 3 && monthVal <= 5 ? q1Start : monthVal >= 6 && monthVal <= 8 ? q2Start : q4Start)
    } else if (quarter === 'this year') {
        qStart = q1Start
    }
    // let qStart = q1Start
    // console.log("month and qsStart ", monthVal, qStart)
    // console.log("qsStart ", qsStart)
    qsPassedWeeks = Math.ceil((((startDateReference - qStart) / 86400000) + 1) / 7)
    // console.log("qsPassedWeeks ", qsPassedWeeks)
    //date ranges that doesn't includes today's date
    // if (quarter === 'previous') {
    //     qStart = (monthVal <= 2 ? q4Start : monthVal >= 3 && monthVal <= 5 ? q2Start : monthVal >= 6 && monthVal <= 8 ? q3Start : q4Start)
    // }


    let start = []
    let end = []
    for (let i = 0; i < qsPassedWeeks; i++) {
        let startDate = new Date()
        startDate.setDate(startDate.getDate() - startDate.getDay() - 7 * i)
        let now = new Date(startDate)
        now.setDate(startDate.getDate() + 6)
        start = startDate.toIsoString()
        start = start.split("T")
        end = now.toIsoString()
        end = end.split("T")
        labels.push(i > 1 ? i + ' Weeks Ago' : i === 1 ? "Last Week" : i === 0 ? "This Week" : '')
        // CQ.push({ ["week" + i] : start[0] + ", " + end[0] })
        CQ.push({start: start[0], end: end[0]})
    }
    // console.log("CQ ", CQ)
    // console.log("Labels ", labels)
    let weekScore = []
    for (let i = 0; i < CQ.length; i++) {
        // console.log(CQ[i])
        let getScores = await getReportStats(CQ[i])
        if (getScores) {
            // console.log([i], getScores.CompanyNumbers[0].Score)
            weekScore.push((getScores.CompanyNumbers[0].Score).toFixed(2))
        }
    }
    // console.log("weekScore ", weekScore)
    CQ.reverse()
    labels.reverse()
    weekScore.reverse()
    let quarterData = [
        {
            WeeksScore: weekScore,
            ChartLabels: labels,
            QuarterWeeks: CQ
        }
    ]
    return {
        QuarterDate: quarterData
    }

}

module.exports = {
    getReportStats,
    quarterWeeks,
    populateWeekStatsTable,
    getWeekReport,
    weeksForChart,
    currentWeekUpdate,
    recalculateWeek
}
