import Link from '../components/link'
import sessionStore from '../stores/sessionStore'
import {view, emit} from '../framework'
// import userStore from '../stores/userStore'
import ChangePassword from './changePassword'
// import ManagerReportCard from './managerReportCard'
import FMReportCard from './fmReportCard'
import ECReportCard from './ecReportCard'
//import CompanyReportCard from './companyReportCard'
import WeeklyReportCard from './reports/weeklyReportCard'
import WeeklyManagerReport from './reports/weeklyManagerReport'
import WeeklyCompanyReportCard from "./reports/weeklyCompanyReportCard"

export default view(function ReportCards() {


    return (
        <div id="content" className="content repsLeaderboard" style={{padding: "36px 0px"}}>
            <div id="repsdashboard" className="container">
                {/*<div className="clear50"></div>*/}
                {
                    sessionStore.isAdmin === false && sessionStore.isNewUser ?
                        <ChangePassword/>
                        :
                        <div className="row">

                            {/*<InteractiveBanner />*/}
                            {/*<LeftWidgets />//import component */}
                            <div className="col-md-12">
                                {/*{sessionStore.user.roleId}*/}
                                {sessionStore.user.roleId <= 4 ?  <WeeklyCompanyReportCard /> : sessionStore.user.roleId === '7' || sessionStore.user.roleId === '8'   ? <WeeklyManagerReport /> : sessionStore.user.roleId === '9' || sessionStore.user.roleId === '10'  ?   <WeeklyManagerReport /> : sessionStore.user.roleId === '5' || sessionStore.user.roleId === '6' ? <WeeklyManagerReport />  : 'no' }

                                {/* <TeamsWidget />*/}
                                {/* <MobileTeamsWidget />*/}
                                {/* {<LeaderBoardTest />}*/}
                                {/*<LeaderBoardTest />*/}
                                {/*<TeamLeaderboard />*/}

                            </div>

                        </div>

                }
            </div>
        </div>
    )
})