import {view, emit} from '../../framework'
import installersActivityStore from "../../stores/installersActivityStore"
import Calendar from "../support-tools/calendar"
// import InstallersCalendarSettings from "../support-tools/installerCalendarSettings"
import sessionStore from "../../stores/sessionStore";

export default view(function InstallersCalendar() {

    const {installersActivity, installersState, installerSettings, postState, installers, alert, calendarReloading} = installersActivityStore
    const {user} = sessionStore
    // console.log("installersState HERE ", installersState)
    // console.log("installers  ", installers)

    // console.log("installersActivity view in ", installersActivity)
    if (alert !== null && alert !== "hide") {
        setTimeout(clearAlert, 15000)
    }

    function clearAlert() {
        emit.ReceivedAlert({alert: 'hide'})
    }

    function InstallerStateChange(installer) {
        // console.log("installer ", installer)
        emit.ClickedInstallersTab(installer)
        emit.ClickedEditPost('posted')
    }

    function refreshCalendar() {
        emit.ClickedRefreshCalendar()
        emit.ClickedRefreshCalendarBoard()
    }

    // function SettingsStateChange(setting) {
    //     // console.log("installer ", installer)
    //     emit.ClickedBlockDates(setting)
    // }
    //
    // function closeModal() {
    //     document.getElementById('modal-' + installersState + '-comment').classList.remove("in")
    // }

    function openCommentModal() {
        // console.log("openCommentModal ", installersState)
        document.getElementById('modal-' + installersState + '-comment').classList.add("in")
    }


    let selectedInstaller = installersState === 'comet' ? 'East Idaho Comet' : installersState === 'boiseComet' ? 'Comet Energy' : installersState === 'winema' ? 'Winema Electric' : installersState === 'elemental' ? ' Elemental Energy' : installersState === 'dog' ? 'Big Dog' : installersState === 'turnSolar' ? 'Turn 2 Solar' : installersState === 'horizonpwr' ? 'HorizonPWR' : installersState === 'horizonpwrBoise' ? 'HorizonPWR Boise' : installersState === 'powerTim' ? 'Power By Tim' : installersState === 'horizonpwrBoise' ? 'HorizonPWR Boise' : installersState === 'horizonpwrOregon' ? 'HorizonPWR Oregon' : installersState === 'horizonpwrBoise2' ? 'HorizonPWR Boise 2' : installersState === 'eastIdaho2' ? 'East Idaho 2' : installersState === 'horizonpwrOregon2' ? 'Horizon Oregon 2' : ''

    let today = new Date()
    let formattedToday = today.getFullYear() + '-' + ((today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1)) + '-' + (today.getDate() < 10 ? '0' + today.getDate() : today.getDate())

    const absoluteToday = today.getFullYear() + '-' + ((today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1)) + '-' + (today.getDate() < 10 ? '0' + today.getDate() : today.getDate())

    let installerId = ''
    if (installersState === 'comet') {
        installerId = 'a0z3m00000Al1sVAAR'
    } else if (installersState === 'boiseComet') {
        installerId = 'a0z3m00000AkyCdAAJ'
    } else if (installersState === 'winema') {
        installerId = 'a0z3m00000Al7CrAAJ'
    } else if (installersState === 'elemental') {
        installerId = 'a0z3m00000Al7CcAAJ'
    } else if (installersState === 'dog') {
        installerId = 'a0z3m00000ADdKXAA1'
    } else if (installersState === 'ericAdair') {
        installerId = 'a0z3m00000AkvplAAB'
    } else if (installersState === 'turnSolar') {
        installerId = 'a0z3m00000917NrAAI'
    } else if (installersState === 'horizonpwr') {
        installerId = 'a0z3m0000091UDGAA2'
    } else if (installersState === 'eastIdaho2') {
        installerId = 'a0z3m00000Eai2CAAR'
    } else if (installersState === 'horizonpwrBoise') {
        installerId = 'a0z3m00000BSEzOAAX'
    } else if (installersState === 'horizonpwrBoise2') {
        installerId = 'a0z3m00000AFxvsAAD'
    } else if (installersState === 'horizonpwrOregon') {
        installerId = 'a0z3m00000AFvPtAAL'
    } else if (installersState === 'horizonpwrOregon2') {
        installerId = 'a0z3m00000Eai2HAAR'
    } else if (installersState === 'powerTim') {
        installerId = 'a0z3m0000091FIOAA2'
    }

    // console.log("installerId ", installerId)

    function changeInstallerInstructions(action) {
        // console.log("changeInstallerInstructions ", action)
        let currentInstaller = installers.find(installer => installer.Id === installerId)
        console.log("currentInstaller Instructions ", currentInstaller.Instructions)
        if (currentInstaller.Comment !== null) {
            document.getElementById('installer-comment-' + installerId).value = currentInstaller.Instructions
        }
        emit.ClickedEditPost(action)
        // document.getElementById('modal-' + installersState + '-comment').classList.add("in")
    }

    function triggerSubmitForm() {
        console.log("clicked triggerSubmitForm " + installersState + '-submit-form')
        // document.getElementById(installersState + '-form').submit()
        document.getElementById(installersState + '-submit-form').click()

    }

    return (
        <section id="installers-activity-calendar" className="pwrstation-view-profile">

            <div id="resultbox"/>

            <div className="row">
                <div className="col-xs-12">
                    {calendarReloading ? <div id='loading-overlay'><img id="spinner" style={{
                        height: "40%",
                        maxHeight: "70px",
                        margin: "0"
                    }} src="/assets/images/spinner.gif"/></div> : ''}
                    <div className="panel with-nav-tabs panel-default">
                        <div className="panel-heading" style={{padding: "1em 0px 0px 0px", border: "none"}}>
                            <div style={{display: "flex"}}>
                                <div style={{flex: "4"}}>
                                    <ul className="nav nav-tabs" style={{padding: "0px 5px"}}>
                                        <li style={sessionStore.user.userId === 64 || sessionStore.user.userId === 62 || sessionStore.user.userId === 42 ? {display: "none"} : {display: "block"}}
                                            className={installersState === 'horizonpwr' ? "active" : ""}>
                                            <a tabIndex="0" style={{cursor: "pointer"}}
                                               onClick={InstallerStateChange.bind(this, 'horizonpwr')}>East Idaho 1</a>

                                        </li>
                                        <li style={sessionStore.user.userId === 64 || sessionStore.user.userId === 62 || sessionStore.user.userId === 42 ? {display: "none"} : {display: "block"}}
                                            className={installersState === 'eastIdaho2' ? "active" : ""}>
                                            <a tabIndex="0" style={{cursor: "pointer"}}
                                               onClick={InstallerStateChange.bind(this, 'eastIdaho2')}>East Idaho 2</a>

                                        </li>
                                        <li style={sessionStore.user.userId === 64 || sessionStore.user.userId === 62 || sessionStore.user.userId === 42 ? {display: "none"} : {display: "block"}}
                                            className={installersState === 'horizonpwrBoise' ? "active" : ""}>
                                            <a tabIndex="0" style={{cursor: "pointer"}}
                                               onClick={InstallerStateChange.bind(this, 'horizonpwrBoise')}>Horizon
                                                Boise 1</a>

                                        </li>
                                        <li style={sessionStore.user.userId === 64 || sessionStore.user.userId === 62 || sessionStore.user.userId === 42 ? {display: "none"} : {display: "block"}}
                                            className={installersState === 'horizonpwrBoise2' ? "active" : ""}>
                                            <a tabIndex="0" style={{cursor: "pointer"}}
                                               onClick={InstallerStateChange.bind(this, 'horizonpwrBoise2')}>Horizon
                                                Boise 2</a>

                                        </li>

                                        {/*<li className={installersState === 'boiseComet' ? "active" : ""}>
                                            <a tabIndex="0" style={{cursor: "pointer"}}
                                               onClick={InstallerStateChange.bind(this, 'boiseComet')}>Comet Energy</a>

                                        </li>
                                        <li className={installersState === 'winema' ? "active" : ""}>
                                            <a tabIndex="1" style={{cursor: "pointer"}}
                                               onClick={InstallerStateChange.bind(this, 'winema')}> Winema
                                                Electric</a>
                                        </li>
                                        {/*<li className={installersState === 'elemental' ? "active" : ""}>
                                            <a tabIndex="2" style={{cursor: "pointer"}}
                                               onClick={InstallerStateChange.bind(this, 'elemental')}>Elemental
                                                Energy< /a>
                                        </li>
                                        <li className={installersState === 'dog' ? "active" : ""}>
                                            <a tabIndex="2" style={{cursor: "pointer"}}
                                               onClick={InstallerStateChange.bind(this, 'dog')}>Big Dog</a>
                                        </li>*/}
                                        {/*<li style={sessionStore.user.userId === 64 || sessionStore.user.userId === 62 || sessionStore.user.userId === 42 || sessionStore.user.userId === 43 || sessionStore.user.userId === 48 ? {display: "none"} : {display: "block"}}*/}
                                        {/*    className={installersState === 'ericAdair' ? "active" : ""}>*/}
                                        {/*    <a tabIndex="2" style={{cursor: "pointer"}}*/}
                                        {/*       onClick={InstallerStateChange.bind(this, 'ericAdair')}>Power Alliance</a>*/}
                                        {/*</li>*/}
                                        <li style={sessionStore.user.userId === 64 || sessionStore.user.userId === 62 || sessionStore.user.userId === 42 ? {display: "none"} : {display: "block"}}
                                            className={installersState === 'horizonpwrOregon' ? "active" : ""}>
                                            <a tabIndex="0" style={{cursor: "pointer"}}
                                               onClick={InstallerStateChange.bind(this, 'horizonpwrOregon')}>Horizon
                                                Oregon 1</a>

                                        </li>
                                        <li style={sessionStore.user.userId === 64 || sessionStore.user.userId === 62 || sessionStore.user.userId === 42 ? {display: "none"} : {display: "block"}}
                                            className={installersState === 'horizonpwrOregon2' ? "active" : ""}>
                                            <a tabIndex="0" style={{cursor: "pointer"}}
                                               onClick={InstallerStateChange.bind(this, 'horizonpwrOregon2')}>Horizon
                                                Oregon 2</a>

                                        </li>
                                        <li style={sessionStore.user.userId === 43 || sessionStore.user.userId === 48 ? {display: "none"} : {display: "block"}}
                                            className={installersState === 'turnSolar' ? "active" : ""}>
                                            <a tabIndex="2" style={{cursor: "pointer"}}
                                               onClick={InstallerStateChange.bind(this, 'turnSolar')}>Turn 2 Solar</a>
                                        </li>
                                        {/*<li style={sessionStore.user.userId === 64 || sessionStore.user.userId === 62 || sessionStore.user.userId === 42 || sessionStore.user.userId === 43 || sessionStore.user.userId === 48 ? {display: "none"} : {display: "block"}}*/}
                                        {/*    className={installersState === 'powerTim' ? "active" : ""}>*/}
                                        {/*    <a tabIndex="2" style={{cursor: "pointer"}}*/}
                                        {/*       onClick={InstallerStateChange.bind(this, 'powerTim')}>Power By Tim</a>*/}
                                        {/*</li>*/}
                                    </ul>
                                </div>
                                <div id="installer-calendar-options"
                                     style={user.isOnboarder ? {
                                         display: "block",
                                         borderBottom: "1px solid #dddddd"
                                     } : {display: "none"}}>
                                    <button className="btn btn-default" style={{border: "none"}}>
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                             width="24px" height="24px"
                                             viewBox="0 0 24 24" version="1.1" className="kt-svg-icon">
                                            <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                                <rect id="bound" x="0" y="0" width="24" height="24"/>
                                                <circle id="Oval-67" fill="#000000" cx="12" cy="5" r="2"/>
                                                <circle id="Oval-67-Copy" fill="#000000" cx="12" cy="12" r="2"/>
                                                <circle id="Oval-67-Copy-2" fill="#000000" cx="12" cy="19" r="2"/>
                                            </g>
                                        </svg>
                                    </button>
                                    <ul className="dropdown-menu">
                                        <li>
                                            {/*<a tabIndex="2" style={{cursor: "pointer"}}*/}
                                            {/*   onClick={openCommentModal.bind(this)}*/}
                                            {/*>Calendar Settings</a>*/}
                                        </li>
                                        {/*<li><a tabIndex="2" style={{cursor: "pointer"}}>Hide Calendar</a></li>*/}
                                    </ul>
                                </div>
                                <div
                                    style={user.isOnboarder ? {
                                        display: "block",
                                        paddingRight: "15px",
                                        borderBottom: "1px solid #dddddd"
                                    } : {display: "none"}}>
                                    <button onClick={refreshCalendar.bind(this)} className="btn btn-default"
                                            style={{border: "none"}}>
                                        <span className="glyphicon glyphicon-refresh"></span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="panel-body" style={{padding: "5px 15px 0px 15px"}}>
                            <div className="tab-content" style={{border: "none"}}>
                                <Calendar/>
                                <div
                                    className="tab-pane fade in active"
                                    style={{border: "none"}}>
                                    <div className="calendar-legends">
                                        <div style={{paddingLeft: "5px"}}>
                                            <p>
                                                <div style={{
                                                    width: "15px",
                                                    height: "15px",
                                                    background: "#1e88e5",
                                                    float: "left",
                                                    marginRight: "5px"
                                                }}/>
                                                <span style={{position: "relative", top: "-2px"}}>Regular Install</span>
                                                &nbsp;
                                                &nbsp;
                                                <div style={{
                                                    width: "15px",
                                                    height: "15px",
                                                    background: "rgb(0 128 0)",
                                                    display: "inline-block",
                                                    marginRight: "5px"
                                                }}/>
                                                <span style={{
                                                    position: "relative",
                                                    top: "-2px"
                                                }}>Ground Mounted Install</span>
                                                &nbsp;
                                                &nbsp;
                                                <div style={{
                                                    width: "15px",
                                                    height: "15px",
                                                    background: "#ff0000",
                                                    display: "inline-block",
                                                    marginRight: "5px"
                                                }}/>
                                                <span style={{position: "relative", top: "-2px"}}>Pending Cancel</span>
                                            </p>
                                        </div>

                                    </div>


                                    {
                                        installers.length > 0 && user.userId !== 10 ?
                                            installers.filter(installer => installer.Id === installerId).map((installer) => {
                                                return (
                                                    <div>
                                                        <h3>Additional Instructions
                                                            <button className='btn btn-default'
                                                                    style={postState === 'posted' ? {
                                                                        float: "right",
                                                                        display: 'block'
                                                                    } : {display: 'none'}}
                                                                    onClick={changeInstallerInstructions.bind(this, 'editing')}>Edit &nbsp;
                                                                <i
                                                                    className='glyphicon glyphicon-edit'/></button>
                                                            <button className='btn btn-default'
                                                                    style={postState === 'editing' ? {
                                                                        float: "right",
                                                                        display: 'block', marginLeft: "8px"
                                                                    } : {display: 'none'}}
                                                                    onClick={changeInstallerInstructions.bind(this, 'posted')}>Cancel
                                                            </button>

                                                            <button className='btn btn-default'
                                                                    style={postState === 'editing' ? {
                                                                        float: "right",
                                                                        display: 'block'
                                                                    } : {display: 'none'}}
                                                                    onClick={triggerSubmitForm.bind(this)}>Post &nbsp;
                                                                <i
                                                                    className='glyphicon glyphicon-saved'/></button>

                                                        </h3>
                                                        <form id={installersState + '-form'}
                                                              style={postState === 'editing' ? {
                                                                  display: 'block', paddingBottom: "3em"
                                                              } : {display: 'none'}}
                                                              onSubmit={e => {
                                                                  e.preventDefault()
                                                                  emit.UpdateInstallerComment({
                                                                      installerId: installer.Id,
                                                                      installerComment: document.getElementById('installer-comment-' + installerId).value
                                                                  })
                                                              }}
                                                        >
                                                            <div className="row">
                                                                <div className="col-md-12">
                                                                    <textarea style={{marginTop: "1em"}}
                                                                              className="form-control"
                                                                              id={'installer-comment-' + installerId}
                                                                              name="rep_pros" rows="5"
                                                                              placeholder="Ex. Needs to be 7 KW or under"
                                                                              required
                                                                    />
                                                                    <button style={{display: "none"}} type='submit'
                                                                            id={installersState + '-submit-form'}
                                                                            form={installersState + '-form'}>s
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </form>
                                                        <div className="well" style={postState === 'posted' ? {
                                                            display: 'block'
                                                        } : {display: 'none'}}>
                                                            {installer.Instructions !== null ? installer.Instructions : 'There are not additional instructions at the moment'}
                                                        </div>
                                                    </div>
                                                )
                                            }) : null
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="clear20"/>
            </div>

            <div className="clear30"/>
            {/*<InstallersCalendarSettings/>*/}
        </section>


    )
})



