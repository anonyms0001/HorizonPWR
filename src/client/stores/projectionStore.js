import {emit, store} from '../framework'
import {Redirect} from 'react-router-dom'
import requester from "../requester"


export default store({
    projections: [],
    currentMonthProjections: [],
    projectionState: null,
    projectionBreakdownState: null,
    dashboardState: 0,
    processingRedirect: true,
    projectionMonthId: null,

    eventListeners: {
        LoginConfirmed({entities}) {
            const {projections, redirectId} = entities
            this.projections = projections
            emit.RedirectCurrentMonthProjection({redirectId})
            // this.currentMonthProjections = thisMonthProjection

        },
        async RedirectCurrentMonthProjection({redirectId}){
            this.processingRedirect = false
            this.projectionMonthId = redirectId
        },
        async ReceivedCurrentProjections({updatedProjectionId}){
            console.log("updatedProjectionId ", updatedProjectionId)
            emit.GetCurrentProjection()
            // this.currentMonthProjections = thisMonthProjection
        },
        // async EmitPrepareCurrentMonthProjections({thisMonthProjection}){
        //     this.currentMonthProjections = thisMonthProjection
        // },
        async RouteChanged({pathname}) {
            if (pathname.includes("projection")) {

            }
        },
        ClickedChangeProjectionStatus({action}) {
            this.projectionState = action
        },
        async ClickedAddNewProjection({date, target, projection}) {
            const {projections} = await requester.post('/api/createProjection', {
                date, target, projection
            })
            alert("Projection Added") // TODO: change alert to show the month that got changed
            emit.ReceivedProjections({projections})
            this.projectionState = 'dashboard'
            // return [{path: 'repsLogin'}]
        },
        async ClickedChangeBreakdownStatus({action}) {
            this.projectionBreakdownState = action
        },
        ReceivedProjections({projections}) {
            this.projections = projections
        },
        ReceivedBreakdownItems({breakdownId}) {
            emit.GetCurrentProjection()
            console.log("breakdownItems ", breakdownId)
            this.dashboardState = breakdownId.ProjectionId
        },
        ReceivedCompanyUpdated({projections}){
            this.projections = projections
        },
        ResetDashStateVal() {
            this.dashboardState = 0
        }

    }
})
