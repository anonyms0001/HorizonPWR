import sessionStore from '../../stores/sessionStore'
import {view, emit} from '../../framework'
import ChartWidget from '../chartWidget'
import ReportsLeaderboard from '../tables/reportsLeaderboard'
// import FMWidget from '../fmWidget'
import TopFM from '../leaderboardWidgets/topFM'
// import ECWidget from '../ecWidget'
import TopEC from '../leaderboardWidgets/topEC'
import PerformanceWidget from '../leaderboardWidgets/performanceWidget'


export default view(function LeaderboardPage() {

    const {user} = sessionStore
    // console.log("LEADERBOARD PAGE ")
    return (
        <div id="content" className="content repsLeaderboard" style={{padding: "36px 0px"}}>
            <div id="repsdashboard" className="container">


                <div className="row">
                    {/*{ user.roleId <= 4 || user.userId === '181' ?  <div className="col-md-12"><PerformanceWidget /></div> : null }*/}
                    {user.roleId >= 9 || user.roleId <= 6 ?
                        <div className="col-md-12"><PerformanceWidget/></div>
                        : null}
                    {/*<InteractiveBanner />*/}
                    {/*<LeftWidgets />//import component */}
                    <div className="col-md-9">
                        <ChartWidget/>
                        {/* <TeamsWidget />*/}
                        {/* <MobileTeamsWidget />*/}
                        {/* {<LeaderBoardTest />}*/}
                        {/*<LeaderBoardTest />*/}
                        <ReportsLeaderboard/>

                    </div>
                    <div className="col-md-3">
                        <TopEC/>
                        {/*<ECWidget/>*/}
                        {/*<FMWidget/>*/}
                        <TopFM/>
                    </div>
                </div>


            </div>
        </div>
    )
})