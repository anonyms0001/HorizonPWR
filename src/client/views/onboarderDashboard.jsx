import {view, emit} from "../framework"
import ClunkyTable from '../components/clunkyTable'
import Link from '../components/link'
import unapprovedUserStore from '../stores/unapprovedUserStore'
import sessionStore from '../stores/sessionStore'

export default view(function OnboarderDashboard() {

    const {unapprovedUsers, unapprovedUserSearchString, selectedUnapprovedUsers, sortBy, reverseSort, selectedOnboarderToDelete, selectedOnboarderReasonToDelete, selectedUnapprovedUser} = unapprovedUserStore

    // console.log("selectedUnapprovedUser ", selectedUnapprovedUser)
    // console.log("selectedOnboarderToDelete ", selectedOnboarderToDelete)

    let rexOnboarders = []
    let kfOnboarders = []
    let boiseOnboarders = []
    let ampOnboarders = []
    let medfordOnboarders = []
    let bendOnboarders = []
    let sortedUsers = []
    let pocatelloOnboarders = []
    let lastStepOnboarder = []
    let unapprovedSorted = []
    let caydenRegion = []

    for (let i = 0; i < unapprovedUsers.length; i++) {
        if (unapprovedUsers[i].deleted || unapprovedUsers[i].userId === 42 || unapprovedUsers[i].userId === 43 || unapprovedUsers[i].userId === 64 ) {
            continue
        }
        unapprovedSorted.push(unapprovedUsers[i])
        lastStepOnboarder.push(unapprovedUsers[i])
        // console.log("unapprovedUsers.percentComplete ", unapprovedUsers[i].percentComplete)
        if (unapprovedUsers[i].teamName === "Oregon" || unapprovedUsers[i].teamName === "Fox" || unapprovedUsers[i].teamName === "Klamath Falls") {
            kfOnboarders.push(unapprovedUsers[i])
            caydenRegion.push(unapprovedUsers[i])

        } else if (unapprovedUsers[i].teamName === "Wolf" || unapprovedUsers[i].teamName === "Boise") {
            boiseOnboarders.push(unapprovedUsers[i])
            caydenRegion.push(unapprovedUsers[i])

        } else if (unapprovedUsers[i].teamName === "Amp") {
            ampOnboarders.push(unapprovedUsers[i])
        } else if (unapprovedUsers[i].teamName === "Pocatello") {
            pocatelloOnboarders.push(unapprovedUsers[i])
        } else if (unapprovedUsers[i].teamName === "Rexburg") {
            rexOnboarders.push(unapprovedUsers[i])
        } else if (unapprovedUsers[i].teamName === "Medford") {
            medfordOnboarders.push(unapprovedUsers[i])
        } else if (unapprovedUsers[i].teamName === "Bend") {
            bendOnboarders.push(unapprovedUsers[i])
            caydenRegion.push(unapprovedUsers[i])
        }
        // if (unapprovedUsers[i].percentComplete > 55) {
        //     lastStepOnboarder.push(unapprovedUsers[i])
        // }
    }
    // console.log("HERE ", lastStepOnboarder)
    // user.percentComplete > 50
    if (sessionStore.user.email === "jeremy.hall@horizonpwr.com") {

        // sortedUsers = boiseOnboarders.sort((u1, u2) => Number(u1.userId) < Number(u2.userId) ? 1 : -1)
         sortedUsers = kfOnboarders.sort((u1, u2) => Number(u1.userId) < Number(u2.userId) ? 1 : -1)
    } else if (sessionStore.user.email === "cayden.larsen@horizonpwr.com") {

        // sortedUsers = kfOnboarders.sort((u1, u2) => Number(u1.userId) < Number(u2.userId) ? 1 : -1)
        sortedUsers = caydenRegion.sort((u1, u2) => Number(u1.userId) < Number(u2.userId) ? 1 : -1)
    } else if (sessionStore.user.email === "blaine.mckee@horizonpwr.com") {
        sortedUsers = pocatelloOnboarders.sort((u1, u2) => Number(u1.userId) < Number(u2.userId) ? 1 : -1)
    } else if (sessionStore.user.email === "jacob.jones@horizonpwr.com" || sessionStore.user.email === "michael.lawrence@horizonpwr.com") {
        sortedUsers = ampOnboarders.sort((u1, u2) => Number(u1.userId) < Number(u2.userId) ? 1 : -1)
    } else if (sessionStore.user.email === "travis.lanham@horizonpwr.com" || sessionStore.user.email === "jameson.pasko@horizonpwr.com") {
        sortedUsers = medfordOnboarders.sort((u1, u2) => Number(u1.userId) < Number(u2.userId) ? 1 : -1)

    } else if (sessionStore.user.email === "logan.swanson@horizonpwr.com") {

        sortedUsers = bendOnboarders.sort((u1, u2) => Number(u1.userId) < Number(u2.userId) ? 1 : -1)
    } else if (sessionStore.user.email === "preston.burt@horizonpwr.com") {

        sortedUsers = rexOnboarders.sort((u1, u2) => Number(u1.userId) < Number(u2.userId) ? 1 : -1)
    }else if (sessionStore.user.roleName === "Sales Support") {
        sortedUsers = lastStepOnboarder.sort((u1, u2) => Number(u1.userId) < Number(u2.userId) ? 1 : -1)
    } else {
        sortedUsers = unapprovedSorted.sort((u1, u2) => Number(u1.userId) < Number(u2.userId) ? 1 : -1) // higher IDs are more recent so we want them first as per the spec
    }

    if (sortBy) {
        sortedUsers = sortedUsers.sort((u1, u2) => sortBy ? (u1[sortBy] > u2[sortBy] ? 1 : -1) : 0)
        if (reverseSort) {
            sortedUsers = sortedUsers.reverse()
        }
    }
    // console.log("sortedUsers  ", sortedUsers)

    if (unapprovedUserSearchString) {
        sortedUsers = sortedUsers.filter(user => {
            return ['firstName', 'lastName', 'email', 'phoneNumber', 'roleName', 'teamName'].some(field => {
                return user[field] && user[field].toLowerCase().includes(unapprovedUserSearchString.toLowerCase())
            })
        })
    }
    let headOptions = []
    // if (sessionStore.user.roleName === "CEO" || sessionStore.user.roleName === "VP" || sessionStore.user.roleName === "Administrator") {
    headOptions = [
        {sortBy: 'lastName', label: 'Name'},
        {sortBy: 'starDate', label: 'Start Date'},
        {sortBy: 'Team', label: 'Team'},
        {sortBy: 'percentComplete', label: '% Complete'},
    ]
    // } else {
    //     headOptions = [
    //         {sortBy: 'lastName', label: 'Name'},
    //         {sortBy: 'starDate', label: 'Start Date'},
    //         {sortBy: 'Team', label: 'Team'},
    //     ]
    // }
    let rows = []
    let inactiveReasons = []


    function inputSelection(userId) {
        let count = -1
        // console.log(userId)
        let selectionVal = document.getElementById('deactivation-type-' + userId).value
        // console.log("inputSelection selected " + selectionVal + " " + 'deactivation-type-' + userId)

        emit.ClickedSelectUnapprovedUserCheckbox({
            reason: userId + "-quit",
            // reason: userId + "-" + selectionVal
        })
        // console.log("selectedUnapprovedUsers ", selectedUnapprovedUsers)

        // let filterTest = unapprovedUsers.filter(u => selectedUnapprovedUsers[u.reason]).map(u => u.reason)
        // console.log("filterTest ", filterTest)
    }

    function openModal2(userId) {

        // console.log("open modal 2", userId)
        let selectionVal = document.getElementById('deactivation-type-' + userId).value
        // console.log("inputSelection selected " + selectionVal + userId)
        let activeListModal = document.getElementById("modal-onboarding-delete")
        activeListModal.classList.add("in")
        emit.ClickedRowTrashCan({
            selectedOnboarderReasonToDelete: selectionVal,
            userToDelete: userId,

        })

    }

    function clickedDelete(userId) {
        emit.ClickedRowTrashCan({
            userToDelete: userId
        })
        if (selectedUnapprovedUser === userId) {
            emit.ClickedSelectUnapprovedUserCheckbox({
                userId: null
            })
        }

    }

    function clickedCheckbox(userId) {
        emit.ClickedSelectUnapprovedUserCheckbox({
            userId: userId
        })
        if (selectedOnboarderToDelete === userId) {
            emit.ClickedRowTrashCan({
                userToDelete: null
            })
        } else if ((selectedUnapprovedUser === userId)) {
            emit.ClickedSelectUnapprovedUserCheckbox({
                userId: null
            })
        }
    }


    return (

        <ClunkyTable

            title="Onboarding"
            modalType="onboarding"
            searchString={unapprovedUserSearchString}
            onSearchStringChange={unapprovedUserSearchString => emit.ChangedUnapprovedUserSearchString({unapprovedUserSearchString})}
            onDelete={() => emit.ClickedDeleteUsers({
                // userIds: approvedUsers.filter(u => selectedUsers[u.userId]).map(u => u.userId)
                userId: selectedOnboarderToDelete,
                reason: selectedOnboarderReasonToDelete
            })}

            tableHead={
                <thead id="onboarding-head">
                <tr>
                    <th>
                        <div className="checkbox">
                                <span
                                    param="all"
                                    className={unapprovedUsers.length && unapprovedUsers.every(user => selectedUnapprovedUsers[user.userId]) ? 'checked' : ''}
                                    onClick={() => emit.ClickedSelectAllUnapprovedUsersCheckbox()}
                                />
                        </div>
                    </th>
                    {
                        headOptions.map(({sortBy, label}) => {
                            let className = 'greyColor'
                            if (sortBy === sortBy) {
                                className = 'sort greyColor active'
                            }
                            return (
                                <th
                                    key={sortBy}
                                    className={className}
                                    onClick={() => emit.SelectedUnapprovedUserSortBy({sortBy})}
                                >
                                    {label}
                                </th>
                            )
                        })
                    }
                    <th className="greyColor" style={{width: "11%"}}>Actions</th>
                </tr>
                </thead>
            }
            tableBody={

                <tbody>
                {
                    sortedUsers.map((user, idx) => {
                        // if(user.deleted){
                        //     continue
                        // }
                        // console.log("USER ", user)
                        let date = user.startDate != null ? user.startDate.split("T") : '-';

                        if (!unapprovedUsers.length) {
                            rows = [
                                <tr>
                                    <td colSpan="6">
                                        No records found.
                                    </td>
                                </tr>
                            ]
                        } else {
                            // if (sessionStore.user.roleName === "CEO" || sessionStore.user.roleName === "VP" || sessionStore.user.roleName === "Administrator") {
                            rows = [
                                <tr key={user.userId} className={idx % 2 ? '' : 'even-column'}>
                                    <td>
                                        <div className="checkbox">
                                            <span
                                                param="all"
                                                className={selectedUnapprovedUser === user.userId ? 'checked' : ''}
                                                // onClick={() => emit.ClickedSelectUnapprovedUserCheckbox({
                                                //     userId: user.userId
                                                // })}
                                                onClick={clickedCheckbox.bind(this, user.userId)}
                                            />
                                        </div>
                                    </td>
                                    <td style={{width: "21%"}}>
                                        <div className="profile-holder">
                                            <span className="username">
                                                {user.firstName} {user.lastName}
                                            </span>
                                            <br/>
                                            <span className="action">
                                                {/*<Link to={`/editUser/${user.userId}`}>Edit</Link> | <Link to={`/user/${user.userId}`}>View</Link>*/}
                                                {/*<Link*/}
                                                {/*    to={`/editUser/${user.userId}`}>Edit</Link> | <span>View</span>*/}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="greyColor" style={{width: "21%"}}>{date[0]}</td>
                                    <td className="greyColor">
                                        {user.teamName}
                                    </td>
                                    <td className="greyColor">
                                        <div className="progress">

                                            <div className="progress-bar"
                                                 style={{width: `${user.percentComplete || 0}%`}}/>
                                        </div>
                                        {user.percentComplete || '0'}%
                                    </td>
                                    <td className="greyColor text-center">
                                        <Link
                                            to={`/editUser/${user.userId}`}>
                                            <span className="glyphicon glyphicon-edit"
                                                  style={{fontSize: "20px", marginRight: "10px"}}/>
                                        </Link>
                                        {/*<span className="glyphicon glyphicon-trash"*/}
                                        {/*      style={{fontSize: "20px", marginRight: "10px"}}*/}
                                        {/*      onClick={() => emit.ClickedRowTrashCan({*/}
                                        {/*          userToDelete: user.userId*/}
                                        {/*      })}*/}
                                        {/*/>*/}
                                        <span id={'delete-' + user.userId} className="glyphicon glyphicon-trash"
                                              style={selectedOnboarderToDelete === user.userId ? {
                                                  fontSize: "20px",
                                                  marginRight: "10px",
                                                  pointerEvents: "none",
                                                  color: "red"
                                              } : {fontSize: "20px", marginRight: "10px", cursor: "pointer"}}

                                            // onClick={() => emit.ClickedRowTrashCan({
                                            //     userToDelete: user.userId
                                            // })}
                                              onClick={clickedDelete.bind(this, user.userId)}
                                            // onInput={openModal.bind(this, user.userId)}

                                        />
                                    </td>
                                </tr>
                            ]


                            // if (sessionStore.user.roleName === "Sales Support" || sessionStore.user.roleName === "Operational Manager") {
                            //     // console.log("USER EMAIL ", user.email)
                            //     rows.push(
                            //
                            //     )
                            //
                            // } else {
                            rows.push(
                                <tr key={user.userId + "deleteOptions"}
                                    style={selectedOnboarderToDelete === user.userId ? {display: "table-row"} : {display: "none"}}>
                                    <td colSpan="6" style={{textAlign: "center"}}>

                                        <table className="table table-striped"
                                               style={{paddingLeft: "1em", width: "100%", marginTop: "0px"}}>
                                            <tbody>
                                            <tr>
                                                <td></td>
                                                <td style={{padding: "1em"}}>
                                                    <div className="form-group"
                                                         style={{maxWidth: "500px", margin: "auto"}}>
                                                        <label className="p greyColor">
                                                            <strong>Reason Inactive?</strong>
                                                        </label>
                                                        <select id={"deactivation-type-" + user.userId}
                                                                className="form-control"
                                                                name={"deactivation-name-" + user.userId}
                                                            // onInput={() => emit.openModal({userId: user.userId, reason: this})}
                                                                onInput={openModal2.bind(this, user.userId)}
                                                        >
                                                            <option>Select...</option>
                                                            <option key='quit' value="quit">Quit</option>
                                                            <option key='cut' value="cut">Cut</option>
                                                        </select>

                                                    </div>
                                                </td>
                                                <td></td>
                                            </tr>
                                            </tbody>
                                        </table>

                                    </td>
                                </tr>,
                                <tr key={user.userId + "sub"}
                                    style={selectedUnapprovedUser === user.userId ? {display: "table-row"} : {display: "none"}}>
                                    <td colSpan="6">
                                        <table className="table table-striped"
                                               style={{paddingLeft: "1em", width: "100%", marginTop: "0px"}}>
                                            <tbody>
                                            <tr>
                                                <td colSpan="6" style={{padding: "0 15px"}}>
                                                    <h4 style={{marginBottom: "20px"}}>Onboarding Progress &nbsp;
                                                        {user.inviteResent ?
                                                            <span className="label label-warning"
                                                                  onClick={() => emit.NotifyUser({userId: user.userId})}
                                                                  style={user.percentComplete > 0 ? {
                                                                      display: 'none',
                                                                      float: 'right',
                                                                      background: '#062d44'
                                                                  } : {
                                                                      display: 'inline',
                                                                      float: 'right',
                                                                      background: '#062d44',
                                                                      opacity: '0.4'
                                                                  }}>Onboarding Invite Resent&nbsp; <i
                                                                className="glyphicon glyphicon-envelope"/></span>
                                                            :
                                                            <span className="label label-warning"
                                                                  onClick={() => emit.NotifyUser({userId: user.userId})}
                                                                  style={user.percentComplete > 0 ? {
                                                                      display: 'none',
                                                                      float: 'right',
                                                                      background: '#062d44'
                                                                  } : {
                                                                      display: 'inline',
                                                                      float: 'right',
                                                                      background: '#062d44',
                                                                      cursor: 'pointer'
                                                                  }}>Resend Onboarding Invite&nbsp; <i
                                                                className="glyphicon glyphicon-envelope"/></span>
                                                        }
                                                    </h4>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td style={{paddingBottom: "1em", paddingLeft: "15px"}}>
                                                    Personal Information&nbsp;
                                                    <span
                                                        className={"label label-" + (user.personal_info ? 'success' : 'info')}>{user.personal_info ? 'Completed' : 'Pending'}</span>
                                                </td>
                                                <td style={{paddingBottom: "1em"}}>
                                                    Agreement Signed&nbsp;
                                                    <span
                                                        className={"label label-" + (user.agreement_signed ? 'success' : 'info')}>{user.agreement_signed ? 'Completed' : 'Pending'}</span>
                                                </td>
                                                <td style={{paddingBottom: "1em"}}>
                                                    W9 Signed&nbsp;
                                                    <span
                                                        className={"label label-" + (user.tax_signed ? 'success' : 'info')}>{user.tax_signed ? 'Completed' : 'Pending'}</span>
                                                </td>
                                                <td style={{paddingBottom: "1em"}}>
                                                    Direct Deposit&nbsp;
                                                    <span
                                                        className={"label label-" + (user.direct_deposit && user.directDepositImage ? 'success' : 'info')}>{user.direct_deposit && user.directDepositImage ? 'Completed' : user.direct_deposit && user.directDepositImage === false ? 'Check Image Pending' : 'Pending'}</span>
                                                </td>

                                            </tr>
                                            <tr>
                                                <td style={{paddingBottom: "1em", paddingLeft: "15px"}}>
                                                    Slack Setup&nbsp;<span
                                                    className={"label label-" + (user.slack_setup ? 'success' : 'info')}>{user.slack_setup ? 'Completed' : 'Pending'}</span>
                                                </td>
                                                <td style={{paddingBottom: "1em"}}>
                                                    Email Setup&nbsp;<span
                                                    className={"label label-" + (user.email_setup ? 'success' : 'info')}>{user.email_setup ? 'Completed' : 'Pending'}</span>
                                                </td>
                                                <td style={{paddingBottom: "1em"}}>
                                                    Canvass Setup&nbsp;<span
                                                    className={"label label-" + (user.canvass_setup ? 'success' : 'info')}>{user.canvass_setup ? 'Completed' : 'Pending'}</span>
                                                </td>
                                                <td style={{paddingBottom: "1em"}}>
                                                    Lessonly Setup&nbsp;<span
                                                    className={"label label-" + (user.lessonly_setup ? 'success' : 'info')}>{user.lessonly_setup ? 'Completed' : 'Pending'}</span>
                                                </td>

                                            </tr>
                                            <tr key={user.userId + "onboardingBreakdown"}
                                                style={selectedUnapprovedUser === user.userId && sessionStore.user.roleName === "Sales Support" || selectedUnapprovedUser === user.userId && sessionStore.user.roleName === "Operational Manager" ? {display: "table-row"} : {display: "none"}}>
                                                <td colSpan="6" style={user.percentComplete > 85 ? {opacity: "1"} : {
                                                    opacity: "0.5",
                                                    pointerEvents: "none"
                                                }}>
                                                    <form className="activate-account" action="" method="POST"
                                                          onSubmit={e => {
                                                              e.preventDefault()
                                                              emit.ActivateOnboarder({
                                                                  onboarderEmail: user.email,
                                                              })
                                                          }}>
                                                        <table className="table table-striped"
                                                               style={{
                                                                   paddingLeft: "1em",
                                                                   width: "100%",
                                                                   marginTop: "0px"
                                                               }}>
                                                            <tbody>
                                                            <tr>
                                                                <td colSpan="3">
                                                                    <h4 style={{
                                                                        textAlign: "left",
                                                                        fontWeight: 500
                                                                    }}>Check on completion</h4>
                                                                </td>
                                                                <td><span style={{fontWeight: 500}}>Personal Email:<br/></span> {user.personalEmail}
                                                                </td>
                                                                <td><span style={{textAlign: "left", fontWeight: 500}}>Phone Number:<br/></span> {user.phoneNumber}
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{paddingBottom: "1em", width: "20%"}}>
                                                                    <label className="checkbox-inline">
                                                                        <input type="checkbox" value=""
                                                                               required="required"/>
                                                                        Slack Setup
                                                                    </label>
                                                                </td>
                                                                <td style={{paddingBottom: "1em", width: "20%"}}>
                                                                    <label className="checkbox-inline">
                                                                        <input type="checkbox" value=""
                                                                               required="required"/>
                                                                        Email Setup
                                                                    </label>
                                                                </td>
                                                                <td style={{paddingBottom: "1em", width: "20%"}}>
                                                                    <label className="checkbox-inline">
                                                                        <input type="checkbox" value=""
                                                                               required="required"/>
                                                                        Canvass Setup
                                                                    </label>
                                                                </td>
                                                                <td style={{paddingBottom: "1em", width: "20%"}}>
                                                                    <label className="checkbox-inline">
                                                                        <input type="checkbox" value=""/>
                                                                        Lessonly Setup
                                                                    </label>
                                                                </td>

                                                                <td style={{paddingBottom: "2em", width: "20%"}}>
                                                                    {/*<button className="approve-onb" type="submit" onClick={ () => {emit.ActivateOnboarder({accountEmail: user.email})} }>*/}
                                                                    <button className="approve-onb" type="submit">
                                                                        Activate Account
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                    </form>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            )
                            // }

                            // }
                        }
                        return (
                            rows
                        )
                    })

                }

                </tbody>
            }
        />

    )
})
