const {resolve} = require('path')
const router = require('koa-router')()
const send = require('koa-send')
const asyncBusboy = require('async-busboy')
const constants = require('../shared/constants')
const sessionService = require('./services/sessionService')
const userService = require('./services/userService')
const teamService = require('./services/teamService')
const roleService = require('./services/roleService')
const reportService = require('./services/reportService')
const projectionService = require('./services/projectionService')
const certificationService = require('./services/certificationService')
const salesforceService = require('./services/salesforceService')
const installersActivityService = require('./services/installersActivityService')
const canvassService = require('./services/canvassService')
const proposalService = require('./services/proposalService')
const fundingService = require('./services/fundingService')

// assets directory structure is a rigid 1 level deep :P
router.get('/assets/:assetType/:resource', async (ctx) => {
    const {assetType, resource} = ctx.params
    await send(ctx, resource, {root: resolve(__dirname, '../../assets', assetType)})
})

// hosted directory structure is a rigid 2 levels deep :P
// TODO: get rid of this (and above) restriction by doing some more legit programmatic url parsing
router.get('/hosted/:parentDirectory/:subDirectory/:resource', async (ctx) => {
    const {parentDirectory, subDirectory, resource} = ctx.params
    await send(ctx, resource, {root: resolve(__dirname, '../../hosted', parentDirectory, subDirectory)})
})

async function getEagerlyLoadedEntities(user) {
    // console.log('getEagerlyLoadedEntities for ', user.firstName, ' ', user.roleId)
    // console.log(user)
    // if( user.roleId === '3' ){
    //     console.log('SALES SUPPORT HERE')
    // }
    let date = new Date()

    date.setHours(date.getHours() - 6)
    // console.log("KOA ROUTER ", date)
    date = date.toISOString()

    date = date.split("T")
    this.dateRange = {start: date[0], end: date[0]}


    let weekDate = new Date()
    weekDate.setHours(weekDate.getHours() - 6)
    weekDate.setDate(weekDate.getDate() - weekDate.getDay())
    let now = new Date(weekDate)
    now.setDate(weekDate.getDate() + 6)
    weekDate = weekDate.toIsoString()
    weekDate = weekDate.split("T")
    let weekEnd = now.toIsoString()
    weekEnd = weekEnd.split("T")
    this.dateRangeWeek = {start: weekDate[0], end: weekEnd[0]}
    // console.log("KOA ROUTER WEEK START DATE ", weekDate[0], weekEnd[0])

    let initDate = new Date(), y = initDate.getFullYear(), m = initDate.getMonth()
    let firstDay = new Date(y, m, 1)
    let firstToString = firstDay.toISOString()
    let firstDate = firstToString.split('T')
    let lastDay = new Date(y, m + 1, 0)
    let lastToString = lastDay.toISOString()
    let lastDate = lastToString.split('T')


    const [
        users,
        teams,
        roles,
        // stats,
        // statsTeam,
        // statsWeek,
        // statsFM,
        // statsEC,
        commissions,
        isNewUser,
        // populateWeeks,
        // weekReport,
        // weeksForChart,
        // certifications,
        // projections,
        // redirectId,
        installSchedule,
        installers,
        // canvassAppointments,
        // proposals,
        // fundingPayments,
        // financialPartnersFunding,
    ] = await Promise.all([
        userService.getUsers(),
        //user.isOnboarder ? userService.getUsers() : [],
        user.isAdmin || user.isOnboarder ? teamService.getTeams() : [],
        roleService.getRoles(),
        // user.roleId !== '3' ? salesforceService.getStats({
        //     start: this.dateRangeWeek.start,
        //     end: this.dateRangeWeek.end
        // }) : [],
        // user.roleId !== '3' ? salesforceService.getStatsTeam({
        //     start: this.dateRangeWeek.start,
        //     end: this.dateRangeWeek.end
        // }) : [],
        // user.roleId !== '3' ? salesforceService.getStatsWeek({
        //     start: this.dateRangeWeek.start,
        //     end: this.dateRangeWeek.end,
        //     render: 'init'
        // }) : [],
        // salesforceService.getStatsFM({ start: this.dateRangeWeek.start, end: this.dateRangeWeek.end }),
        // salesforceService.getStatsEC({ start: this.dateRangeWeek.start, end: this.dateRangeWeek.end }),
        user.userId !== 10 || user.roleId >= '4' ? salesforceService.getCommissions(user.userId) : [],
        sessionService.isNewUser(user.userId),
        // user.isAdmin ? reportService.populateWeekStatsTable() : [],
        // user.roleId !== '3' || user.roleId >= '7' && user.roleId <= '8' ? reportService.getWeekReport({
        //     start: this.dateRangeWeek.start,
        //     end: this.dateRangeWeek.end
        // }) : [],
        // user.roleId !== '3' || user.roleId >= '7' && user.roleId <= '8' ? reportService.weeksForChart({rangeSelection: 'current'}) : [],
        // user.isOnboarder ? certificationService.getCertifications() : [],
        // user.roleId !== '3' || user.roleId !== '7' || user.roleId !== '8' ? projectionService.getProjections() : [],
        // user.roleId !== '3' || user.roleId !== '7' || user.roleId !== '8' ? projectionService.getCurrentMonthProjections({
        //     start: firstDate[0],
        //     end: lastDate[0]
        // }) : [],
         installersActivityService.getInstallsSchedule(),
        installersActivityService.getInstallers(),
        // user.isOnboarder || user.isAdmin ? canvassService.getCanvassAppointments() : [],
        // user.isOnboarder || user.isAdmin ? proposalService.getUpcomingProposals() : [],
        // fundingService.getFundingPayments(),
        // fundingService.getFinancialPartnerFunding(),
    ])
    return {
        user,
        users,
        teams,
        roles,
        // stats,
        // statsTeam,
        // statsWeek,
        // statsFM,
        // statsEC,
        commissions,
        isNewUser,
        // populateWeeks,
        // weekReport,
        // weeksForChart,
        // certifications,
        // projections,
        // redirectId,
        installSchedule,
        installers,
        // canvassAppointments,
        // proposals,
        // fundingPayments,
        // financialPartnersFunding
    }

}

Date.prototype.toIsoString = function () {
    var tzo = -this.getTimezoneOffset(),
        dif = tzo >= 0 ? '+' : '-',
        pad = function (num) {
            var norm = Math.floor(Math.abs(num));
            return (norm < 10 ? '0' : '') + norm;
        };
    return this.getFullYear() +
        '-' + pad(this.getMonth() + 1) +
        '-' + pad(this.getDate()) +
        'T' + pad(this.getHours()) +
        ':' + pad(this.getMinutes()) +
        ':' + pad(this.getSeconds()) +
        dif + pad(tzo / 60) +
        ':' + pad(tzo % 60);
}


router.post('/api/login', async (ctx) => {
    const {email, password} = ctx.request.body
    let {sessionKey, user} = await sessionService.login({email, password})
    if (user && sessionKey !== null) {
        console.log("api login session key no null")
        const entities = await getEagerlyLoadedEntities(user)
        ctx.cookies.set(constants.SESSION_KEY_COOKIE_NAME, sessionKey, {overwrite: true})
        ctx.body = {
            isActive: true,
            entities,
        }
    } else if (user && sessionKey === null) {
        console.log("api login session key  null")
        // const entities = await getEagerlyLoadedEntities(user)
        ctx.body = {
            isActive: null

        }
    } else {
        const entities = null
        ctx.body = {
            isActive: false,
            entities,
        }
    }
})

router.post('/api/register', async (ctx) => {
    const {signUpEmail} = ctx.request.body

    await userService.Register({signUpEmail})
    ctx.body = {ok: true}

})

router.get('/api/sessionStatus', async (ctx) => {
    const {isActive, user} = await sessionService.getSession(ctx.cookies.get(constants.SESSION_KEY_COOKIE_NAME))
    const entities = isActive ? await getEagerlyLoadedEntities(user) : {}
    ctx.body = {
        isActive,
        entities,
    }
})

router.post('/api/logout', async (ctx) => {
    await sessionService.logout(ctx.cookies.get(constants.SESSION_KEY_COOKIE_NAME))
    ctx.body = {ok: true}
})

router.get('/api/users', async (ctx) => {

    const {user} = await sessionService.getSession(ctx.cookies.get(constants.SESSION_KEY_COOKIE_NAME))
    if (!user.isOnboarder) {
        throw new Error('Unauthorized get users request')
    }
    const users = await userService.getUsers()
    ctx.body = {users}
})

router.get('/api/certifications', async (ctx) => {
    const {user} = await sessionService.getSession(ctx.cookies.get(constants.SESSION_KEY_COOKIE_NAME))
    if (!user.isOnboarder) {
        throw new Error('Unauthorized get users request')
    }
    const certifications = await certificationService.getCertifications()
    ctx.body = {certifications}
})

router.post('/api/createUser', async (ctx) => {
    const {user} = await sessionService.getSession(ctx.cookies.get(constants.SESSION_KEY_COOKIE_NAME))

    if (!user.isOnboarder && user.email !== 'allyssa.jimenez@horizonpwr.com') {
        throw new Error('Unauthorized create user request')
    }

    const {
        email,
        roleId,
        firstName,
        lastName,
        phoneNumber,
        teamId,
        startDate,
        password,
    } = ctx.request.body
    await userService.createUser({
        email,
        roleId,
        firstName,
        lastName,
        phoneNumber,
        teamId,
        startDate,
        password,
    })
    const users = await userService.getUsers()
    ctx.body = {users}
})

router.post('/api/editUser', async (ctx) => {
    const {user} = await sessionService.getSession(ctx.cookies.get(constants.SESSION_KEY_COOKIE_NAME))
    if (!user.isOnboarder) {
        throw new Error('Unauthorized create user request')
    }
    const {
        userId,
        email,
        personalEmail,
        roleId,
        teamId,
        firstName,
        lastName,
        phoneNumber,
        startDate,
    } = ctx.request.body
    await userService.editUser({
        userId,
        email,
        personalEmail,
        roleId,
        teamId,
        firstName,
        lastName,
        phoneNumber,
        startDate,
    })
    const users = await userService.getUsers()
    ctx.body = {users}
})

router.post('/api/certifyUser', async (ctx) => {
    const {user} = await sessionService.getSession(ctx.cookies.get(constants.SESSION_KEY_COOKIE_NAME))
    if (!user.isOnboarder) {
        throw new Error('Unauthorized create user request')
    }
    const {
        userId,
        work_ethic,
        attitude,
        leadership_potential,
        sales_skills,
        becoming_ec,
        work_days,
        leads_amount,
        culture_contribution,
        certify,
        rep_con,
        rep_pros,
    } = ctx.request.body
    await certificationService.certifyUser({
        userId,
        work_ethic,
        attitude,
        leadership_potential,
        sales_skills,
        becoming_ec,
        work_days,
        leads_amount,
        culture_contribution,
        certify,
        rep_con,
        rep_pros,
    })
    // const users = await userService.getUsers()
    // ctx.body = { users }
    const certifications = await certificationService.getCertifications()
    ctx.body = {certifications}
})


router.post('/api/createTeam', async (ctx) => {
    const {user} = await sessionService.getSession(ctx.cookies.get(constants.SESSION_KEY_COOKIE_NAME))
    if (!user.isAdmin) {
        throw new Error('Unauthorized create user request')
    }
    const {newTeamName} = ctx.request.body
    await teamService.createTeam({newTeamName})
    const teams = await teamService.getTeams()
    ctx.body = {teams}
})

router.post('/api/uploadProfileImage/:userId', async (ctx) => {
    const {user} = await sessionService.getSession(ctx.cookies.get(constants.SESSION_KEY_COOKIE_NAME))
    if (!user.isAdmin) {
        throw new Error('Unauthorized create user request')
    }
    const {userId} = ctx.params // NOT session user userId
    const {files, fields} = await asyncBusboy(ctx.req)
    const fileStream = files[0]
    const {filename} = fileStream
    console.log({filename})
    const fileBuffer = await new Promise((resolve, reject) => {
        let buffers = []
        fileStream.on('data', data => buffers.push(data))
        fileStream.on('end', () => {
            resolve(Buffer.concat(buffers))
        })
    })
    await userService.setProfileImage({userId, filename, fileBuffer})
    const users = await userService.getUsers()
    ctx.body = {users}
})

router.post('/api/resetPassword', async (ctx) => {
    const {user} = await sessionService.getSession(ctx.cookies.get(constants.SESSION_KEY_COOKIE_NAME))
    if (!user.isAdmin) {
        throw new Error('Unauthorized create user request')
    }
    const {userId} = ctx.request.body
    await sessionService.resetPassword({userId})
    ctx.body = {ok: true}
})

router.post('/api/completePromotion', async (ctx) => {
    // console.log(ctx.request.query)
    // console.log(ctx.request.body)
    // console.log(ctx.type)
    // console.log(ctx.params)
    // const  userId  = ctx.query.userId
    const {userId} = ctx.request.body
    console.log("k-router ", userId)
    // const { newUser } = await userService.Register({ signUpEmail })
    await userService.finishRepPromo(userId)

    ctx.query = {ok: true}
    // if(newUser){
    //     alert("new User created successfully, your password is password")
    // }else{
    //     alert("new User is returning false or not returning")
    // }
    // ctx.body = {
    //     email
    // }
    // alert(ctx)
    // const users = await userService.getUsers()
    // ctx.body = { users }
})
router.post('/api/canvassAppointment', async (ctx) => {

    const canvassData = ctx.request.body

    await canvassService.saveAppointment({data: canvassData})

    ctx.body = {ok: true}

})
router.post('/api/canvassInteraction', async (ctx) => {

    const canvassData = ctx.request.body

    await canvassService.saveAppointmentInteraction({data: canvassData})

    ctx.body = {ok: true}

})

// router.get('/api/stats', async (ctx) => {
//     const { stats } = await salesforceService.otherStats()
//     console.log(stats)
//     ctx.body = { stats: stats }
// })

// router.get('/api/teams', async (ctx) => {
//     const { user } = await sessionService.getSession(ctx.cookies.get(constants.SESSION_KEY_COOKIE_NAME))
//     if (!user.isAdmin && !user.isOnboarder) {
//         throw new Error('Unauthorized get users request')
//     }
//     const teams = await teamService.getTeams()
//     ctx.body = { teams }
// })

// router.get('/api/roles', async (ctx) => {
//     const roles = await roleService.getRoles()
//     ctx.body = { roles }
// })

// router.get('/.well-known/acme-challenge/:resource', async (ctx) => {
//     const { resource } = ctx.params
//     await send(ctx, resource, { root: resolve(__dirname, '../../hosted') })
// })

module.exports = router
