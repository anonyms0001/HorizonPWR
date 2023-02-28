import Link from '../components/link'
import sessionStore from '../stores/sessionStore'
import {view, emit} from '../framework'
// import userStore from '../stores/userStore'
import ChangePassword from './changePassword'
import ChartWidget from './chartWidget'
// import LeaderBoardTest from './leaderboardTest'
import TeamLeaderboard from './teamLeaderboard'
import FMWidget from './fmWidget'
import ECWidget from './ecWidget'
// import FMReportCard from './fmReportCard'
//import InteractiveBanner from './interactiveBanner'
import PerformanceWidget from './leaderboardWidgets/performanceWidget'



export default view(function RepsLeaderboard() {

    const {user} = sessionStore

    return (
        <div id="content" className="content repsLeaderboard" style={{padding: "36px 0px"}}>
            <div id="repsdashboard" className="container">
                {/*<div className="clear50"></div>*/}
                {
                    sessionStore.isAdmin === false && sessionStore.isNewUser ?
                        <ChangePassword/>
                        :
                        <div className="row">
                            { user.roleId >= 9 || user.roleId <= 6  && user.roleId !== 3  ?  <div className="col-md-12"><PerformanceWidget /></div> : null }
                            {/*<InteractiveBanner />*/}
                            {/*<LeftWidgets />//import component */}
                            <div className="col-md-9">
                                <ChartWidget />
                                {/* <TeamsWidget />*/}
                                {/* <MobileTeamsWidget />*/}
                                {/* {<LeaderBoardTest />}*/}
                                {/*<LeaderBoardTest />*/}
                                <TeamLeaderboard />

                            </div>
                            <div className="col-md-3">
                                <ECWidget />
                                <FMWidget />

                            </div>
                        </div>

                }
            </div>
        </div>
    )
})