    const constants = require('../shared/constants')
const sessionService = require('./services/sessionService')
const userService = require('./services/userService')
const dbService = require('./services/dbService')
const salesforceService = require('./services/salesforceService')
const reportService = require('./services/reportService')
const teamService = require('./services/teamService')
const emailService = require('./services/emailService')
const projectionService = require('./services/projectionService')
const installersActivityService = require('./services/installersActivityService')
const proposalService = require('./services/proposalService')
const fundingService = require('./services/fundingService')

const listeners = {

  ClickedDeleteUsers: {
        auth: user => user.isOnboarder,
        async cb ({ user, event,  emitBack }) {
            const { userId, reason } = event

            console.log("userId ",userId)
            console.log("REASON ",reason)

            await userService.sfDeleteUpdate({userId, reason})
            //
            // // for (const userId of userIds) {
            // //     if (userId === user.userId) {
            // //         continue // do not delete the user making the request XD
            // //     }
            //
                let managerId = user.userId
                await userService.deleteUser({ userId })
                await  emailService.deactivateNotification( {userId, managerId} )
            // // }
            //
            const users = await userService.getUsers()
            emitBack.ReceivedUsers({ users })
            emitBack.DeletedUserMessage({ users })

        }
    },

    GetStats: {
        auth: user => user.isApproved,
        async cb ({ event, emitBack }) {
            const stats = await salesforceService.getStats(event)
            emitBack.ReceivedStats({ stats })
        }
    },
    GetStatsReport: {
        auth: user => user.isApproved,
        async cb ({ event, emitBack }) {
            const statsReport = await reportService.getReportStats(event)
            emitBack.ReceivedStatsReport({ statsReport })
        }
    },
     GetWeeksReport: {
        auth: user => user.isApproved,
        async cb({event, emitBack}) {
            // const quarter = await reportService.quarterWeeks(event)
            // emitBack.ReceivedQuarterWeeks({quarter})
            const weekReport = await reportService.getWeekReport(event)
            emitBack.ReceivedWeekStatsReport({weekReport})
        }
    },
      GetCurrentWeek: {
        auth: user => user.isApproved,
        async cb({event}) {
            // console.log("socket get curret week")
           await reportService.currentWeekUpdate(event)
            // emitBack.ReceivedCurrentWeekStatsReport({currentWeekReport})
        }
    },
    GetWeeksForChart: {
        auth: user => user.isApproved,
        async cb({event, emitBack}) {
            const weeksForChart = await reportService.weeksForChart(event)
            emitBack.ReceivedDataForChart({weeksForChart})
        }
    },
    RecalculateReportWeek: {
        auth: user => user.isApproved,
        async cb({event, emitBack}) {
            // console.log(" RecalculateReportWeek init")
           await reportService.recalculateWeek(event)   
            // emitBack.ReceivedDataForChart({weeksForChart})
        }
    },
    GetStatsTeam: {
        auth: user => user.isApproved,
        async cb ({ event, emitBack }) {
            const statsTeam = await salesforceService.getStatsTeam(event)
            emitBack.ReceivedStatsTeam({ statsTeam })
        }
    },
    GetStatsWeek: {
        auth: user => user.isApproved,
        async cb ({ event, emitBack }) {
            const statsWeek = await salesforceService.getStatsWeek(event)
            emitBack.ReceivedWeekStats({ statsWeek })
        }
    },
    GetStatsFM: {
        auth: user => user.isApproved,
        async cb ({ event, emitBack }) {
            const statsFM = await salesforceService.getStatsFM(event)
            emitBack.ReceivedStatsFM({ statsFM })
        }
    },
    GetStatsEC: {
        auth: user => user.isApproved,
        async cb ({ event, emitBack }) {
            const statsEC = await salesforceService.getStatsEC(event)
            emitBack.ReceivedStatsEC({ statsEC })
        }
    },
    GetCommissions: {
        auth: user => user.isApproved,
        async cb ({ user, emitBack }) {
            const { userId } = user.userId
            const commissions = await salesforceService.getCommissions(userId)
            emitBack.ReceivedCommissions({ commissions })
        }
    },


    EditTeam: {
        auth: user => user.isAdmin,
        async cb ({ event, emitBack }) {
            await teamService.editTeam(event)
            const teams = await teamService.getTeams()
            emitBack.ReceivedTeams({ teams })
        }
    },

    DeleteTeam: {
        auth: user => user.isAdmin,
        async cb ({ event, emitBack }) {
            await teamService.deleteTeam(event)
            const teams = await teamService.getTeams()
            emitBack.ReceivedTeams({ teams })
        }
    },
    
    IsNewUser: {
        auth: user => user.isApproved,
        async cb ({ event, emitBack }) {
            const isNewUser = await sessionService.isNewUser(event)
            emitBack.ReceivedIsNewUser({ isNewUser })
        }
    },
       NotifyUser: {
        auth: user => user.isApproved,
        async cb ({ event, emitBack }) {
            const { userId } = event
            console.log("socket Router ", userId)
            await  emailService.onboardingInviteAgain({ userId })
            const users = await userService.getUsers()
            emitBack.ReceivedUsers({ users })
            emitBack.onboardingInviteSent()

        }
    },
    TestEmail: {
        auth: user => user.isApproved,
        async cb ({ event }) {
            const { userId } = event
            await  emailService.reachingEmail({ userId })

        }
    },
    ActivateAccount: {
        auth: user => user.isApproved,
        async cb ({ event, emitBack }) {
            const { onboarderEmail } = event
            await  userService.activateRep({ onboarderEmail })
            await emitBack.OnboarderActivated()
        }

    },
    PromoteUser: {
        auth: user => user.isApproved,
        async cb ({ event, emitBack }) {
            const { modalUserId, modalNewPosition } = event
            console.log("socket Router promote user HERE ", modalUserId, modalNewPosition)
            // emitBack.AwaitingForNewAgreement({userId: modalUserId})
            await  userService.promoteRep({ userId: modalUserId, newPosition: modalNewPosition })
            const users = await userService.getUsers()
            emitBack.ReceivedUsers({ users })

        }
    },
    ChangePassword: {
        auth: user => user.isApproved,
        async cb ({ event, emitBack }) {
            const { userId, password } = event
            if (password !== 'password') {
                await userService.changePassword({ userId, password })
            }
            emitBack.PasswordChanged()
        }
    },
       ProcessProjectionRedirect: {
        auth: user => user.isAdmin,
        async cb({event, emitBack}) {
            const updatedProjectionId = await projectionService.getCurrentMonthProjections(event)
            emitBack.ReceivedCurrentProjections({updatedProjectionId})
        }
    },
    GetCurrentProjection: {
        auth: user => user.isAdmin,
        async cb({event, emitBack}) {
            const currentProjections = await projectionService.getProjection(event)
            emitBack.ReceivedProjections({currentProjections})
        }
    },
    UpdateProjectionCompany: {
        auth: user => user.isAdmin,
        async cb({event, emitBack}) {
            const projections = await projectionService.updateCompanyProjection(event)
            emitBack.ReceivedCompanyUpdated({projections})
        }
    },
    UpdateProjectionReps: {
        auth: user => user.isAdmin,
        async cb({event, emitBack}) {
            const projections = await projectionService.updateRepsProjection(event)
            emitBack.ReceivedCompanyUpdated({projections})
        }
    },
    PrepareBreakdownPage: {
        auth: user => user.isAdmin,
        async cb({event, emitBack}) {

            const breakdownId = await projectionService.updateBreakdown(event)
            emitBack.ReceivedBreakdownItems({breakdownId})
        }
    },
    ClickedRefreshCalendarBoard: {
        auth: user => user.isApproved,
        async cb({ emitBack}) {
             await installersActivityService.refreshInstallsSchedule()
            const activityInstalls = await installersActivityService.getInstallsSchedule()
            emitBack.ReceivedUpdatedInstalls({activityInstalls})
            emitBack.InstallsReceivedAlert({alert: "Calendar Data was Refreshed"})
        }
    },
    UpdateInstallerComment: {
        auth: user => user.isAdmin,
        async cb({event, emitBack}) {
            const updatedInstallerId = await installersActivityService.updateInstallerComment(event)
            const installers = await installersActivityService.getInstallers()
            emitBack.ReceivedUpdateInstallers({updatedInstallers: installers, lastInstallerId: updatedInstallerId})
        }
    },
    UpdateInstallerBlockDates: {
        auth: user => user.isAdmin,
        async cb({event, emitBack}) {
            const updatedInstallerId = await installersActivityService.updateInstallerBlockDates(event)
            const installers = await installersActivityService.getInstallers()
            emitBack.ReceivedBlockedDates({updatedInstallers: installers, lastInstallerId: updatedInstallerId})
        }
    },
    StartProposalDrawing: {
        auth: user => user.isApproved,
        async cb({event, emitBack}) {
            const {leadId, accountId, now} = event
            await proposalService.proposalStart({leadId, accountId, now})
            const proposals = await proposalService.getUpcomingProposals()
            emitBack.ReceivedProposals({proposals})
            emitBack.ReceivedAlert({leadId: leadId, alert: "Proposal Drawing has Started"})
        }
    },
    ProposalNeedsUsage: {
        auth: user => user.isApproved,
        async cb({event, emitBack}) {
            const {leadId} = event
            await proposalService.proposalNeedsUsage({leadId})
            const proposals = await proposalService.getUpcomingProposals()
            emitBack.ReceivedProposals({proposals})
            emitBack.ReceivedAlert({leadId: leadId, alert: "Proposal Needs Usage"})
        }
    },
    ProposalFinished: {
        auth: user => user.isApproved,
        async cb({event, emitBack}) {
            const { leadId } = event
            await proposalService.proposalFinished({ leadId })
            const proposals = await proposalService.getUpcomingProposals()
            emitBack.ReceivedProposals({proposals})
            emitBack.ReceivedAlert({leadId: leadId, alert: "Proposal Finished, Ready for QC"})
        }
    },
    ProposalQCStarted: {
        auth: user => user.isApproved,
        async cb({event, emitBack}) {
            const {leadId, accountId, now} = event
            await proposalService.proposalQCStarted({ leadId, accountId, now })
            const proposals = await proposalService.getUpcomingProposals()
            emitBack.ReceivedProposals({proposals})
            emitBack.ReceivedAlert({leadId: leadId, alert: "Proposal QC has Started"})
        }
    },
    ProposalQCFinished: {
        auth: user => user.isApproved,
        async cb({event, emitBack}) {
            const {leadId} = event
            await proposalService.proposalQCFinished({ leadId })
            const proposals = await proposalService.getUpcomingProposals()
            emitBack.ReceivedProposals({proposals})
            emitBack.ReceivedAlert({leadId: leadId, alert: "Proposal QC Finished"})
        }
    },
    ProposalUsageFixed: {
        auth: user => user.isApproved,
        async cb({event, emitBack}) {
            const {leadId, accountId} = event
            await proposalService.proposalUsageFixed({ leadId, accountId })
            const proposals = await proposalService.getUpcomingProposals()
            emitBack.ReceivedProposals({proposals})
            emitBack.ReceivedAlert({leadId: leadId, alert: "Proposal Usage Was Fixed"})
        }
    },
    ClickedRefreshProposalBoard: {
        auth: user => user.isApproved,
        async cb({ emitBack}) {
             await proposalService.updateOpportunitySF()
            const proposals = await proposalService.getUpcomingProposals()
            emitBack.ReceivedProposals({proposals})
            emitBack.ProposalReceivedAlert({alert: "Proposal Board was Refreshed"})
        }
    },
   ProposalUpdateIncompleteReason: {
        auth: user => user.isApproved,
        async cb({event, emitBack}) {
            const {proposalId, incompleteReason, updateField} = event
            await proposalService.proposalMultipleIncompleteReason({proposalId, incompleteReason, updateField})
            const proposals = await proposalService.getUpcomingProposals()
            emitBack.ReceivedProposals({proposals})
            emitBack.ProposalReceivedAlert({alert: "Proposal Board was Refreshed"})
        }
    },
    // ProposalUpdateIncompleReason: {
    //     auth: user => user.isApproved,
    //     async cb({event, emitBack}) {
    //         const {proposalId, incompleteReason} = event
    //         await proposalService.proposalIncompleteReason({proposalId, incompleteReason})
    //         const proposals = await proposalService.getUpcomingProposals()
    //         emitBack.ReceivedProposals({proposals})
    //         emitBack.ProposalReceivedAlert({alert: "Proposal Board was Refreshed"})
    //     }
    // },
    ProposalIncompleteUpdateReason: {
        auth: user => user.isApproved,
        async cb({event, emitBack}) {
            const {proposalId, incompleteReason} = event
            await proposalService.proposalIncompleteReason ({proposalId, incompleteReason})
            const proposals = await proposalService.getUpcomingProposals()
            emitBack.ReceivedProposals({proposals})
            emitBack.ProposalReceivedAlert({alert: "Proposal Board was Refreshed"})
        }
    },
    UndoProposalAction: {
        auth: user => user.isApproved,
        async cb({event, emitBack}) {
            const {proposalId, undoAction} = event
            await proposalService.executeUndoAction({proposalId, undoAction})
            const proposals = await proposalService.getUpcomingProposals()
            emitBack.ReceivedProposals({proposals})
            emitBack.ProposalReceivedAlert({alert: "Undo Action Executed"})
        }
    },
    ConfirmFirstFundingPayment: {
        auth: user => user.isApproved,
        async cb({event, emitBack}) {
            const {projectId} = event
            await fundingService.confirmFirstFundingPayment({projectId})
            const fundingPayments = await fundingService.getFundingPayments()
            emitBack.ReceivedFundingPayments({fundingPayments})
            emitBack.FundingReceivedAlert({alert: "First Funding Payment Received"})
        }
    },
    ConfirmSecondFundingPayment: {
        auth: user => user.isApproved,
        async cb({event, emitBack}) {
            const {projectId} = event
            await fundingService.confirmSecondFundingPayment({projectId})
            const fundingPayments = await fundingService.getFundingPayments()
            emitBack.ReceivedFundingPayments({fundingPayments})
            emitBack.FundingReceivedAlert({alert: "Second Funding Payment Received"})
        }
    },
    SubmitSubstantialCompletion: {
        auth: user => user.isApproved,
        async cb({event, emitBack}) {
            const {projectId} = event
            await fundingService.submitSubstantialCompletion({projectId})
            const fundingPayments = await fundingService.getFundingPayments()
            emitBack.ReceivedFundingPayments({fundingPayments})
            emitBack.FundingReceivedAlert({alert: "Substantial Payment Completed"})
        }
    },
    ProcessRefreshFundingBoard: {
        auth: user => user.isApproved,
        async cb({emitBack}) {
            await fundingService.updateResidentialProjectSF()
            const fundingPayments = await fundingService.getFundingPayments()
            emitBack.ReceivedFundingPayments({fundingPayments})
            emitBack.FundingReceivedAlert({alert: "Board Refreshed"})
        }
    }

}

module.exports = {
    getEventTypesSubscribedTo: () => Object.keys(listeners),
    dispatch: async ({ eventType, ctx, event, emitBack, emitToId }) => {
        const { user } = await sessionService.getSession(ctx.cookies.get(constants.SESSION_KEY_COOKIE_NAME))
        const { auth, cb } = listeners[eventType]
        if (!auth(user)) {
            return ctx.throw(401, 'Unauthorized')
        }
        await cb({ user, event, emitBack, emitToId })
    },
}
// const constants = require('../shared/constants')
// const sessionService = require('./services/sessionService')
// const userService = require('./services/userService')
// const dbService = require('./services/dbService')
// const salesforceService = require('./services/salesforceService')

// const listeners = {

//     ClickedDeleteUsers: {
//         auth: user => user.isAdmin,
//         async cb ({ user, event, emitBack }) {
//             const { userIds } = event
//             for (const userId of userIds) {
//                 if (userId === user.userId) {
//                     continue // do not delete the user making the request XD
//                 }
//                 await userService.deleteUser({ userId })
//             }
//             const users = await userService.getUsers()
//             emitBack.ReceivedUsers({ users })
//         }
//     },

//     ClickedApproveUser: {
//         auth: user => user.isAdmin,
//         async cb ({ event, emitBack }) {
//             const { userId } = event
//             await dbService.query(`UPDATE user SET isApproved = 1 WHERE userId = ?`, [userId])
//             const users = await userService.getUsers()
//             emitBack.ReceivedUsers({ users })
//         }
//     },

//     GetStats: {
//         auth: user => user.isApproved,
//         async cb ({ event, emitBack }) {
//             const stats = await salesforceService.getStats(event)
//             emitBack.ReceivedStats({ stats })
//         }
//     },

//     GetCommissions: {
//         auth: user => user.isApproved,
//         async cb ({ user, emitBack }) {
//             const { userId } = user.userId
//             const commissions = await salesforceService.getCommisions(userId)
//             emitBack.ReceivedCommissions({ commissions })
//         }
//     }

// }

// module.exports = {
//     getEventTypesSubscribedTo: () => Object.keys(listeners),
//     dispatch: async ({ eventType, ctx, event, emitBack, emitToId }) => {
//         const { user } = await sessionService.getSession(ctx.cookies.get(constants.SESSION_KEY_COOKIE_NAME))
//         const { auth, cb } = listeners[eventType]
//         if (!auth(user)) {
//             return ctx.throw(401, 'Unauthorized')
//         }
//         await cb({ user, event, emitBack, emitToId })
//     },
// }
