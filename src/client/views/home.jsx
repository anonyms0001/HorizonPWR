import Link from '../components/link'
import {view} from '../framework'
import routeStore from '../stores/routeStore'
import sessionStore from '../stores/sessionStore'
import salesforceStore from "../stores/salesforceStore";

@view
export default class Home extends React.Component {

    // const { updateTracker } = salesforceStore
    //
    // if(updateTracker){
    //
    // }
    state = {
        moreMenuExpanded: false,

    }

    render() {
        return (
            <div className="menu-desktop">
                <section id="menu-desktop" style={{display: "none"}}>
                    <div className="mini-container container">f
                        <ul className="menu-holder">
                            <Link to="/home">
                                <li className={routeStore.pathname === '/home' ? 'active' : ''} style={{width: "25%"}}>
                                    <img src="/assets/images/dashboard.svg" className="svg icon"/>
                                    <div className="clear"/>
                                    {
                                        sessionStore.user.isAdmin ? 'Admin' : 'Dashboard'
                                    }
                                </li>
                            </Link>
                            <Link to="/leaderboard">
                                <li className={routeStore.pathname === '/leaderboard' ? 'active' : ''}
                                    style={{width: "25%"}}>
                                    <img src="/assets/images/leader-board.svg" className="svg icon"/>
                                    <div className="clear"/>
                                    Old Leaderboard
                                </li>
                            </Link>
                            <Link to="/repsLeaderboard">
                                <li className={routeStore.pathname === '/repsLeaderboard' ? 'active' : ''}
                                    style={{width: "25%"}}>
                                    <img src="/assets/images/leader-board.svg" className="svg icon"/>
                                    <div className="clear"/>
                                    Rep's Leaderboard
                                </li>
                            </Link>
                            {/*<Link to="/training">*/}
                            {/*    <li className={routeStore.pathname === '/training' ? 'active' : ''}>*/}
                            {/*        <img src="/assets/images/training.svg" className="svg icon" />*/}
                            {/*        <div className="clear" />*/}
                            {/*        Training*/}
                            {/*    </li>*/}
                            {/*</Link>*/}
                            {/*<Link to="/pwrLine">*/}
                            {/*    <li className={routeStore.pathname === '/pwrLine' ? 'active' : ''}>*/}
                            {/*        <img src="/assets/images/pwr-ic-black.svg" className="svg icon" />*/}
                            {/*        <div className="clear" />*/}
                            {/*        Pwr Line*/}
                            {/*    </li>*/}
                            {/*</Link>*/}
                            {/*<li*/}
                            {/*    className={'more-desktop' + (this.state.moreMenuExpanded ? ' open' : '')}*/}
                            {/*    onClick={() => this.setState({moreMenuExpanded: !this.state.moreMenuExpanded})}*/}
                            {/*>*/}
                            {/*    <img src="/assets/images/more.svg" className="svg icon"/>*/}
                            {/*    <div className="clear"/>*/}
                            {/*    More*/}
                            {/*    <div className="dropdown-menu">*/}
                            {/*        <ul className="dropdown-menu-nav">*/}
                            {/*            {*/}

                            {/*                sessionStore.user.isOnboarder ?*/}
                            {/*                    <Link to="/onboarding">*/}
                            {/*                        <li>Onboarding</li>*/}
                            {/*                    </Link>*/}
                            {/*                    : null*/}
                            {/*            }*/}
                            {/*            <Link to="/pwr-goals">*/}
                            {/*                <li>PWR Goals</li>*/}
                            {/*            </Link>*/}
                            {/*            <Link to="/profile/">*/}
                            {/*                <li>Profile</li>*/}
                            {/*            </Link>*/}
                            {/*        </ul>*/}
                            {/*    </div>*/}
                            {/*</li>*/}
                        </ul>
                    </div>
                </section>
                <div className="content" style={ routeStore.pathnameString === "/installers-calendar" || routeStore.pathnameString === "/proposalBoard" || routeStore.pathnameString === "/fundingBoard" ? {backgroundColor: "#f2f3f8"} : {padding: "0px"} }>
                    <div className="container"  style={ routeStore.pathnameString === "/leaderboardTest" ? {margin: "0px", width: "100%", padding: "0px"} : { padding: "0px" } } >
                        {this.props.children}
                    </div>
                </div>
            </div>
        )
    }
}
