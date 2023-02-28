import Link from '../components/link'
import sessionStore from '../stores/sessionStore'
import {view, emit} from '../framework'
// import userStore from '../stores/userStore'


// import ChartWidget from './chartWidget'
// import TeamsWidget from './teamsWidget'
// import LeaderBoardTest from './leaderboardTest'
// // import MobileTeamsWidget from './mobileTeamsWidget'
// import FMWidget from './fmWidget'
// import ECWidget from './ecWidget'
// import SitsEarningWidget from './comissions/sitsEarningsWidget'
import FMSitsWidget from './comissions/fmSitsWidget'
import CustomerConcessions from './comissions/concessionsCustomerWidget'
import TotalEarnings from './comissions/totalEarningsWidget'
import TotalEarningsFM from './comissions/totalEarningsFMWidget'
import QSWidget from "./comissions/qsWidget"
import AssistEarningsWidget from "./comissions/assistEarningsWidget"
import CommissionBreakdown from "./comissions/commissionBreakdown";
import UpfrontCommissions from "./comissions/upfrontCommissions"
import BackendCommissions from "./comissions/backendCommissions"
import OverrideCommissions from "./comissions/overrideCommissions"
import salesforceStore from "../stores/salesforceStore";

export default view(function Commissions() {
    // console.log(sessionStore.user.roleName)
    const {overrideDetected} = salesforceStore

    return (
        <div id="content" className="content repsLeaderboard">
            <div id="repsdashboard" className="container">
                <div className="clear50"></div>

                <div className="row">
                    <div className="col-md-6">
                        {/*<SitsEarningWidget />*/}
                        {overrideDetected ? <OverrideCommissions/> : ''}
                        {sessionStore.user.roleId === '7' || sessionStore.user.roleId === '8' ?
                            <FMSitsWidget/> : <UpfrontCommissions/>}
                        {sessionStore.user.roleId === '7' || sessionStore.user.roleId === '8' ? <AssistEarningsWidget/> :
                            <BackendCommissions/>}
                        {/*{ sessionStore.user.roleId === '7' || sessionStore.user.roleId === '8' ? <FMSitsWidget/> : '' }*/}
                        {/*    /!*<CustomerConcessions/>*!/*/}
                    </div>
                    <div className="col-md-6">
                        {sessionStore.user.roleId === '7' || sessionStore.user.roleId === '8' ? <TotalEarningsFM/> : <TotalEarnings/>}
                    </div>
                </div>
            </div>
        </div>
    )
})