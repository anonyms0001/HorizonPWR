import {emit, view} from "../framework";
import sessionStore from '../stores/sessionStore'
import Link from '../components/link'
import routeStore from "../stores/routeStore";

// export default view(function TopMenu() {

@view
export default class TopMenu extends React.Component {
    state = {
        optionsMenuExpanded: false,
        mobileMenuExpanded: true,
    }

    render() {

        // const { pathname } = routeStore
        // console.log("ROUTE TM ", routeStore.pathnameString)
        // this.setState({mobileMenuExpanded: false})

        return (
            sessionStore.isActive ?
                <nav className="navbar navbar-inverse ">
                    <div className="container">
                        <Link to="/home" className="navbar-brand">
                            <img src="/assets/images/pwrstation-logo.png"/>
                        </Link>
                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse"
                                style={sessionStore.user.userId === 10 || sessionStore.user.userId === 64 || sessionStore.user.userId === 42 || sessionStore.user.userId === 43 || sessionStore.user.userId === 48 ? {
                                    pointerEvents: "none",
                                    marginTop: "12px"
                                } : {marginTop: "12px"}}
                                onClick={() => this.setState({mobileMenuExpanded: !this.state.mobileMenuExpanded})}
                                data-target="#navbar"
                                aria-expanded="false" aria-controls="navbar">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <div style={this.state.mobileMenuExpanded ? {display: "none"} : {display: "block"}}>
                            <ul className="dropdown-menu"
                                style={this.state.mobileMenuExpanded ? {
                                    display: "none",
                                    width: "100%",
                                    textAlign: "center"
                                } : {display: "block", width: "100%", textAlign: "center"}}
                                onClick={() => this.setState({mobileMenuExpanded: !this.state.mobileMenuExpanded})}>
                                {/*<li><a href="#">Edit Profile</a></li>*/}
                                <li style={sessionStore.user.userId === 44 ? {display: "block"} : {display: "none"}}>
                                    <Link to="/usersManagement">
                                        Users Management
                                    </Link>
                                </li>
                                {/*<li className="divider" style={ sessionStore.user.userId === 41 ? {display: "block"} : {display: "none"}}></li>
                                <li style={  sessionStore.user.userId === 41 ? {display: "block"} : {display: "none"}}>
                                    <Link to="/createUser/">Add Team Member</Link>
                                </li>*/}
                                {/*<li className="divider"></li>*/}
                                {/*<li>*/}
                                {/*    <Link to="/repsLeaderboard">Leaderboard</Link>*/}
                                {/*</li>*/}
                                <li style={!sessionStore.user.isAdmin && !sessionStore.user.isOnboarder  ? {display: "block"} : {display: "none"}} className="divider"></li>
                                <li style={!sessionStore.user.isAdmin && !sessionStore.user.isOnboarder  ? {display: "block"} : {display: "none"}}>
                                    <Link to="/commissions">Commissions</Link>
                                </li>
                                {/*<li style={sessionStore.user.roleId >= 5 ? {display: "block"} : {display: "none"}} >*/}
                                {/*    <Link to="/reports" >*/}
                                {/*        Report*/}
                                {/*    </Link>*/}
                                {/*</li>*/}
                                {/*<li className="divider"*/}
                                {/*    style={sessionStore.user.roleId <= 4 || sessionStore.user.userId === '47' ? {display: "block"} : {display: "none"}}/>*/}
                                {/*<li style={sessionStore.user.roleId <= 4 || sessionStore.user.userId === '47' ? {display: "block"} : {display: "none"}}>*/}
                                {/*    <Link to="/proj">SI Projections</Link>*/}
                                {/*</li>*/}
                                <li style={sessionStore.user.userId === 44 ? {display: "block"} : {display: "none"}}
                                    className="divider"></li>
                                <li style={sessionStore.user.userId === 44 ? {display: "block"} : {display: "none"}}>
                                    <Link to="/installers-calendar">Installs Schedule</Link>
                                </li>
                                <li className="divider"/>
                                <li>
                                    <div style={{cursor: "pointer"}} onClick={() => emit.ClickedLogout()}>
                                        Sign Out
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div id="navbar" className="collapse navbar-collapse">

                            <ul className="nav navbar-nav navbar-right">
                                {/*<li style={sessionStore.user.userId === 10 || sessionStore.user.userId === 64 || sessionStore.user.userId === 62 || sessionStore.user.userId === 42 || sessionStore.user.userId === 43 || sessionStore.user.userId === 48 || sessionStore.user.roleId === '3' || sessionStore.user.roleId === '11' ? {display: "none"} : {display: "block"}} className={ routeStore.pathnameString === "/repsLeaderboard" ? "active" : "inactive" }>*/}
                                {/*    <Link className="menu-item" to="/repsLeaderboard" >LEADERBOARD</Link>*/}
                                {/*</li>*/}
                                {/*<li style={ sessionStore.user.userId === 41 ? {display: "block"} : {display: "none"}}
                                    className={routeStore.pathnameString === "/createUser/" ? "active" : "inactive"}>
                                    <Link to="/createUser/" className="menu-item">
                                        ADD TEAM MEMBER
                                    </Link>
                                </li>
                                <li className={ routeStore.pathnameString === "/commissions" ? "active" : "inactive" }
                                    style={ sessionStore.user.roleId === '9' ? {display: "block"} : sessionStore.user.roleId === '10' ?  {display: "block"} : {display: "none"}}
                                >
                                    <Link className="menu-item" to="/commissions" >COMMISSIONS</Link>
                                </li> */}

                                {/*<li style={sessionStore.user.roleId === '6' || sessionStore.user.roleId === '5' ? {display: "block"} : {display: "none"} } className={ routeStore.pathnameString === "/home" ||  routeStore.pathnameString === "/createUser/" ? "active" : "inactive"} >
                                    <Link to="/home" className="menu-item">
                                        ADMIN Dashboard
                                    </Link>
                                </li>*/}
                                { !sessionStore.user.isAdmin && !sessionStore.user.isOnboarder ?
                                    <li style={sessionStore.user.userId === 10 || sessionStore.user.userId === 64 || sessionStore.user.userId === 62 || sessionStore.user.userId === 42 || sessionStore.user.userId === 43 || sessionStore.user.userId === 48 ? {display: "none"} : {display: "block"}}
                                        className={routeStore.pathnameString === "/commissions" ? "active" : "inactive"}>
                                        <Link to="/commissions" className="menu-item">
                                            COMMISSIONS
                                        </Link>
                                    </li> : 0}
                                { sessionStore.user.isAdmin || sessionStore.user.isOnboarder ?
                                <li
                                    className={routeStore.pathnameString === "/installers-calendar" || routeStore.pathnameString === "/home" ? "active" : "inactive"}>
                                    <Link to="/installers-calendar" className="menu-item">
                                        INSTALLS SCHEDULE
                                    </Link>
                                </li> : 0}
                                <li style={sessionStore.user.userId === 44 ? {display: "block"} : {display: "none"}}
                                    className={routeStore.pathnameString === "/usersManagement" ? "active" : "inactive"}>
                                    <Link to="/usersManagement" className="menu-item">
                                        USER MANAGEMENT
                                    </Link>
                                </li>
                                {/*<li style={sessionStore.user.roleId < 5 ? {display: "block"} : {display: "none"}}
                                    className={routeStore.pathnameString === "/proposalBoard" ? "active" : "inactive"}>
                                    <Link to="/proposalBoard" className="menu-item">
                                        PROPOSAL BOARD
                                    </Link>
                                </li>*/}
                                {/* <li style={sessionStore.user.roleId >= 5 ? {display: "block"} : {display: "none"}}
                                    className={routeStore.pathnameString === "/reports" ? "active" : "inactive"}>
                                    <Link to="/reports" className="menu-item">
                                        TEAM REPORT
                                    </Link>
                                </li>*/}
                                {/*<li style={sessionStore.user.isAdmin ? {display: "block"} : {display: "none"} } className={ routeStore.pathnameString === "/leaderboard" ? "active" : "inactive"} >
                                    <Link to="/leaderboard" className="menu-item">
                                        OLD LEADERBOARD
                                    </Link>
                                </li>
                                 <li style={sessionStore.user.isOnboarder ? {display: "block"} : {display: "none"} } className={ routeStore.pathnameString === "/createUser/" ? "active" : "inactive"} >
                                    <Link to="/createUser/"className="menu-item">
                                        ADD TEAM MEMBER
                                    </Link>
                                </li>*/}
                                {/*<li*/}
                                {/*    className={routeStore.pathnameString !== "/repsLeaderboard" && routeStore.pathnameString !== "/installers-calendar" ? "dropdown active" : "dropdown inactive"}*/}
                                {/*    style={sessionStore.user.roleId === '5' || sessionStore.user.roleId === '6' ? {display: "block"} : {display: "none"}}*/}
                                {/*>*/}
                                {/*<div id='admin-tools' className="dropdown-toggle text-center" style={{*/}
                                {/*    display: "flex",*/}
                                {/*    paddingLeft: "0",*/}
                                {/*    paddingRight: "0",*/}
                                {/*    minWidth: "125px",*/}
                                {/*    paddingBottom: "14px",*/}
                                {/*    cursor: "pointer",*/}
                                {/*    color: "#fff",*/}
                                {/*}}>*/}
                                {/*    <div className="collapsible-title"*/}
                                {/*         style={{textAlign: "center", width: "100%"}}>MANAGER TOOLS*/}
                                {/*    </div>*/}
                                {/*    <ul className="dropdown-menu" style={{marginTop: "2.3em", top: "21px"}}>*/}

                                {/*        <li>*/}
                                {/*            <Link to="/home">Team Members Management</Link>*/}
                                {/*        </li>*/}
                                {/*        /!*<li>*!/*/}
                                {/*        /!*    <Link to="/reports">Team Reports</Link>*!/*/}
                                {/*        /!*</li>`*!/*/}
                                {/*        <li>*/}
                                {/*            <Link to="/installers-calendar">Installs Scheduled</Link>*/}
                                {/*        </li>*/}
                                {/*    </ul>*/}
                                {/*</div>*/}
                                {/*</li>*/}
                                {/*<li*/}
                                {/*    className={routeStore.pathnameString !== "/repsLeaderboard" && routeStore.pathnameString !== "/installers-calendar" ? "dropdown active" : "dropdown inactive"}*/}
                                {/*    style={sessionStore.user.roleId === '3' ? {display: "block"} : {display: "none"}}*/}
                                {/*>*/}
                                {/*    <div id='admin-tools' className="dropdown-toggle text-center" style={{*/}
                                {/*        display: "flex",*/}
                                {/*        paddingLeft: "0",*/}
                                {/*        paddingRight: "0",*/}
                                {/*        minWidth: "125px",*/}
                                {/*        paddingBottom: "14px",*/}
                                {/*        cursor: "pointer",*/}
                                {/*        color: "#fff",*/}
                                {/*    }}>*/}
                                {/*        <div className="collapsible-title"*/}
                                {/*             style={{textAlign: "center", width: "100%"}}>SALES SUPPORT TOOLS*/}
                                {/*        </div>*/}
                                {/*        <ul className="dropdown-menu" style={{marginTop: "2.3em", top: "21px"}}>*/}
                                {/*            /!*<li><a href="#">Edit Profile</a></li>*!/*/}
                                {/*            <li>*/}
                                {/*                <Link to="/home">User Management</Link>*/}
                                {/*            </li>*/}
                                {/*            /!*<li>*/}
                                {/*                <Link to="/proposalBoard">Proposal Board</Link>*/}
                                {/*            </li>*!/*/}
                                {/*        </ul>*/}
                                {/*    </div>*/}
                                {/*</li>*/}
                                {/*<li*/}
                                {/*    className={ routeStore.pathnameString !== "/repsLeaderboard" && routeStore.pathnameString !== "/installers-calendar"  ? "dropdown active" :  "dropdown inactive" }*/}
                                {/*    style={sessionStore.user.roleId <= 4 && sessionStore.user.roleId !== '3' ? {display: "block"} : {display: "none"}}*/}
                                {/*>*/}
                                {/*    <div id='admin-tools' className="dropdown-toggle text-center" style={{*/}
                                {/*        display: "flex",*/}
                                {/*        paddingLeft: "0",*/}
                                {/*        paddingRight: "0",*/}
                                {/*        minWidth: "125px",*/}
                                {/*        paddingBottom: "14px",*/}
                                {/*        cursor: "pointer",*/}
                                {/*        color: "#fff",*/}
                                {/*    }}>*/}

                                {/*        <div className="collapsible-title" style={{textAlign: "center", width: "100%"}}>ADMIN TOOLS</div>*/}
                                {/*        <ul className="dropdown-menu" style={{marginTop: "2.3em", top: "21px"}}>*/}
                                {/*            /!*<li><a href="#">Edit Profile</a></li>*!/*/}
                                {/*            <li>*/}
                                {/*                <Link to="/home">User Management</Link>*/}
                                {/*            </li>*/}
                                {/*            /!*<li>*!/*/}
                                {/*            /!*    <Link to="/reports">Reports</Link>*!/*/}
                                {/*            /!*</li>*!/*/}
                                {/*            <li style={ sessionStore.user.roleId === '1' || sessionStore.user.roleId === '4' || sessionStore.user.userId === '47'  ? {display: "block"} : {display: "none"} }>*/}
                                {/*                <Link to="/proj">Projections</Link>*/}
                                {/*            </li>*/}
                                {/*            /!* <li style={ sessionStore.user.roleId === '1' || sessionStore.user.roleId === '4' || sessionStore.user.roleId === '11'  ? {display: "block"} : {display: "none"} }>*/}
                                {/*                <Link to="/fundingBoard">Funding Payments</Link>*/}
                                {/*            </li>*/}
                                {/*            <li style={ sessionStore.user.roleId === '1' || sessionStore.user.roleId === '4' || sessionStore.user.roleId === '11'  ? {display: "block"} : {display: "none"} }>*/}
                                {/*                <Link to="/proposalBoard">Proposal Board</Link>*/}
                                {/*            </li>*!/*/}
                                {/*        </ul>*/}
                                {/*    </div>*/}
                                {/*</li>*/}

                                <li
                                    className={'dropdown' + (this.state.optionsMenuExpanded ? ' open' : '')}
                                    onClick={() => this.setState({optionsMenuExpanded: !this.state.optionsMenuExpanded})}
                                    style={{marginLeft: "5em"}}
                                >
                                    <div className="dropdown-toggle" style={{
                                        display: "flex",
                                        paddingLeft: "0",
                                        paddingRight: "0",
                                        minWidth: "125px",
                                        marginTop: "18px",
                                        paddingBottom: "14px",
                                        cursor: "pointer",
                                        color: "#fff",
                                    }}>
                                        {
                                            sessionStore.user && sessionStore.user.firstName ?
                                                <div>{sessionStore.user.firstName}&nbsp;{sessionStore.user.lastName}</div>

                                                : null
                                        }
                                        <img style={{
                                            maxWidth: "30px",
                                            maxHeight: "30px",
                                            borderRadius: "45%",
                                            marginTop: "-4px",
                                            marginLeft: "5px",
                                            background: "#e79236"
                                        }} src="/assets/images/top-reps-ic-white.svg"/>
                                        <ul className="dropdown-menu">
                                            {/*<li><a href="#">Edit Profile</a></li> */}

                                            {/*<li className="divider"></li>*/}
                                            <li>
                                                <div style={{cursor: "pointer"}} onClick={() => emit.ClickedLogout()}>
                                                    Sign Out
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                </nav>
                : null

        )
    }
}
