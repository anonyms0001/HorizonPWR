import * as React from 'react'
import {withRouter, Switch, Route, Redirect} from 'react-router-dom'
import PropTypes from 'prop-types'
import {emit, view} from './framework'
import routeStore from './stores/routeStore' // leave this
import sessionStore from './stores/sessionStore'
import TopMenu from './views/topMenu'
import TopTitle from './views/topTitle'
import Header from './views/header'
import Footer from './views/footer'
import Login from './views/login'
import SignUp from './views/singup'
import Home from './views/home'
import AdminDashboard from './views/adminDashboard'
import RepsLeaderboard from './views/repsLeaderboard'
import LeaderboardPage from './views/leaderboard/leaderboardPage'
import ReportCards from './views/reportCards'
import Commissions from './views/commissions'
import CommissionsAlter from './views/comissions/commissionsAlter'
import Leaderboard from './views/leaderboard'
import CreateUser from './views/createUser'
import EditUser from './views/editUser'
import CertificationOverview from './views/certificationOverview'
import CertifyForm from './views/certifyForm'
import ProjectionRedirect from './views/projections/projectionRedirect'
import ProjectionBreakdown from './views/projections/projectionBreakdown'
import InstallersCalendar from './views/support-tools/installersCalendar'
import CanvassAppointments from './views/support-tools/canvassAppointments'
import ProposalBoard from './views/support-tools/proposalBoard'
import CustomCardsTest from './views/support-tools/customCardsTest'
import FundingBoard from './views/operational-tools/fundingBoard'
import FundingPage from './views/operational-tools/fundingPage'

const HomeWithChildRoutes = view(function HomeWithChildRoutes() {
    const {user} = sessionStore

    return (
        <Home>
            <Switch>
                <Route path="/home" render={() => {
                    return (
                        <div>
                            {user.isAdmin || user.isOnboarder ?
                                <InstallersCalendar/> : <Redirect to="/commissions"/>
                            }
                        </div>
                    )
                }}/>
                <Route path="/usersManagement" render={() => {
                    return (
                        <div>
                            {
                                user.userId == 44 ? <AdminDashboard /> : user.isOnboarder ? <Redirect to="/installers-calendar"/>  : <Redirect to="/commissions"/>

                            }

                        </div>
                    )
                }}/>
                <Route path="/leaderboard" render={() => {
                    return (
                        <div>
                            <Leaderboard/>
                        </div>
                    )
                }}/>
                <Route path="/repsLeaderboard" render={() => {
                    return (
                        <div>
                            <LeaderboardPage/>


                        </div>
                    )
                }}/>
                <Route path="/leaderboardTest" render={() => {
                    return (
                        <div>
                            <RepsLeaderboard/>
                        </div>
                    )
                }}/>
                <Route path="/proj" render={() => {
                    return (
                        <div>
                            <ProjectionRedirect/>
                        </div>
                    )
                }}/>
                <Route path="/commissions" render={() => {
                    return (
                        <div>
                            <Commissions/>
                        </div>
                    )
                }}/>
                <Route path="/commissions_v2" render={() => {
                    return (
                        <div>
                            <CommissionsAlter/>
                        </div>
                    )
                }}/>
                <Route path="/installers-calendar" render={() => {
                    return (
                        <div>
                            {user.isAdmin || user.isOnboarder ?
                                <InstallersCalendar/> : <Redirect to="/commissions"/>}

                        </div>
                    )
                }}/>
                <Route path="/canvassAppointments" render={() => {
                    return (
                        <div>
                            <CanvassAppointments/>
                        </div>
                    )
                }}/>
                <Route path="/kanbanTest" render={() => {
                    return (
                        <div>
                            <ProposalBoard/>
                        </div>
                    )
                }}/>
                <Route path="/fundingPage" render={() => {
                    return (
                        <div>
                            <FundingBoard/>
                        </div>
                    )
                }}/>
                <Route path="/fundingBoard" render={() => {
                    return (
                        <div>
                            <FundingPage/>
                        </div>
                    )
                }}/>
                <Route path="/proposalBoard" render={() => {
                    return (
                        <div>
                            <CustomCardsTest/>
                        </div>
                    )
                }}/>
                <Route path="/createUser" component={CreateUser}/>
                <Route path="/editUser/:userId" component={EditUser}/>
                <Route path="/certification/:certificationId" component={CertificationOverview}/>
                <Route path="/certify/:userId" component={CertifyForm}/>
                <Route path="/projection/:projectionId" component={ProjectionBreakdown}/>
            </Switch>
        </Home>
    )
})

// TODO: route is lost on rerender unless it's one of these routes
const Routes = view(function Routes() {

    // leave this -- it causes this component to rerender when route changes
    const {pathname} = routeStore

    const {isActive} = sessionStore

    // const { sessionUser } = sessionStore

    if (isActive === null) {
        return (
            <div style={{margin: "auto", textAlign: 'center', paddingTop: "4em"}}>
                <img src="/assets/images/charging.gif"/>
                <h4 style={{textAlign: 'center'}}>Charging...</h4>
            </div>
        )
    }


    if (isActive && pathname === '/repsLeaderboard') {
        return (
            <div>
                <TopMenu/>
                <TopTitle/>
                <LeaderboardPage/>
                <Footer/>
            </div>
        )
    } else if (isActive && pathname === '/reports') {
        return (
            <div>
                <TopMenu/>
                <TopTitle/>
                <ReportCards/>
                <Footer/>
            </div>
        )

    } else if (isActive && pathname === '/commissions') {
        return (
            <div>
                <TopMenu/>
                <TopTitle/>
                <Commissions/>
                <Footer/>
            </div>
        )
    } else {

        return (
            <div>

                <TopMenu/>
                <TopTitle/>
                <Switch>
                    <Route path="/signup" render={() => {
                        return isActive ? <Redirect to="/home"/> : <SignUp/>
                    }}/>
                    <Route path="/login" render={() => {
                        return isActive ? <Redirect to="/home"/> : <Login/>
                    }}/>
                    <Route path="/home" render={() => {
                        return isActive ? <HomeWithChildRoutes/> : <Redirect to="/login"/>
                    }}/>
                    <Route path="/" render={() => {
                        return isActive ? <HomeWithChildRoutes/> : <Redirect to="/login"/>
                    }}/>
                </Switch>
                <Footer/>
            </div>
        )
    }

})


@withRouter
export default class RoutesWrapper extends React.Component {

    static propTypes = {
        location: PropTypes.object.isRequired
    }

    componentDidMount() {
        const {pathname, search, hash} = this.props.location
        emit.RouteChanged({pathname, search, hash})
    }

    componentDidUpdate(prevProps) {
        if (this.props.location !== prevProps.location) {
            const {pathname, search, hash} = this.props.location
            emit.RouteChanged({
                pathname,
                // search,
                // hash,
                previousPathname: prevProps.location.pathname,
            })
        }
    }

    render() {
        return <Routes/>
    }
}
