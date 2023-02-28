import Link from '../components/link'
import ClunkyTable from '../components/clunkyTable'
import {view, emit} from '../framework'
import userStore from '../stores/userStore'
import sessionStore from "../stores/sessionStore"
import roleStore from '../stores/roleStore'
import promotionStore from '../stores/promotionStore'

export default view(function ApprovedUsersManagers() {

    const {userSearchString, users, selectedUsers, selectedUser, sortBy, reverseSort, selectedReasonToDelete, selectedUserToDelete, agreementProcessing} = userStore

    // console.log("agreementProcessing view ", agreementProcessing)
    // console.log("users ", users)

    const approvedUsers = users.slice().filter(u => u.isApproved).filter(u => u.userId !== 10).filter(u => u.userId !== 48)
    let rexOnboarders = []
    let kfOnboarders = []
    let boiseOnboarders = []
    let ampOnboarders = []
    let medfordOnboarders = []
    let pocatelloOnboarders = []
    let bendOnboarders = []
    let sortedUsers = []
    let sortedApprovedUsers = []
    let lastStepOnboarder = []
    let unapprovedSorted = []
    let rows = []
    let caydenRegion = []

    for (let i = 0; i < approvedUsers.length; i++) {
        if (approvedUsers[i].deleted || approvedUsers[i].userId === 48 ) {
            continue
        }
        // unapprovedSorted.push(approvedUsers[i])
        // console.log("approvedUsers.percentComplete ", approvedUsers[i].percentComplete)
        if (approvedUsers[i].teamName === "Oregon" || approvedUsers[i].teamName === "Fox" || approvedUsers[i].teamName === "Klamath Falls") {
            kfOnboarders.push(approvedUsers[i])
            caydenRegion.push(approvedUsers[i])
        } else if (approvedUsers[i].teamName === "Wolf" || approvedUsers[i].teamName === "Boise") {
            boiseOnboarders.push(approvedUsers[i])
            caydenRegion.push(approvedUsers[i])
        } else if (approvedUsers[i].teamName === "Amp") {
            ampOnboarders.push(approvedUsers[i])
        } else if (approvedUsers[i].teamName === "Rexburg") {
            rexOnboarders.push(approvedUsers[i])
        } else if (approvedUsers[i].teamName === "Medford") {
            medfordOnboarders.push(approvedUsers[i])
        } else if (approvedUsers[i].teamName === "Pocatello") {
            pocatelloOnboarders.push(approvedUsers[i])
        } else if (approvedUsers[i].teamName === "Bend") {
            bendOnboarders.push(approvedUsers[i])
            caydenRegion.push(approvedUsers[i])
        }
    }

    if (sessionStore.user.email === "jeremy.hall@horizonpwr.com") {
        // sortedApprovedUsers = boiseOnboarders.sort((u1, u2) => Number(u1.userId) < Number(u2.userId) ? 1 : -1)
        sortedApprovedUsers = kfOnboarders.sort((u1, u2) => Number(u1.userId) < Number(u2.userId) ? 1 : -1)
    } else if (sessionStore.user.email === "brandon.jackson@horizonpwr.com") {
        sortedApprovedUsers = kfOnboarders.sort((u1, u2) => Number(u1.userId) < Number(u2.userId) ? 1 : -1)
    } else if (sessionStore.user.email === "jacob.jones@horizonpwr.com" || sessionStore.user.email === "michael.lawrence@horizonpwr.com") {
        sortedApprovedUsers = ampOnboarders.sort((u1, u2) => Number(u1.userId) < Number(u2.userId) ? 1 : -1)
    } else if (sessionStore.user.email === "travis.lanham@horizonpwr.com" || sessionStore.user.email === "jameson.pasko@horizonpwr.com") {
        sortedApprovedUsers = medfordOnboarders.sort((u1, u2) => Number(u1.userId) < Number(u2.userId) ? 1 : -1)
    } else if (sessionStore.user.email === "preston.burt@horizonpwr.com") {
        sortedApprovedUsers = rexOnboarders.sort((u1, u2) => Number(u1.userId) < Number(u2.userId) ? 1 : -1)
    } else if (sessionStore.user.email === "blaine.mckee@horizonpwr.com") {
        sortedApprovedUsers = pocatelloOnboarders.sort((u1, u2) => Number(u1.userId) < Number(u2.userId) ? 1 : -1)

    } else if (sessionStore.user.email === "logan.swanson@horizonpwr.com") {
        sortedApprovedUsers = bendOnboarders.sort((u1, u2) => Number(u1.userId) < Number(u2.userId) ? 1 : -1)

    } else if (sessionStore.user.email === "cayden.larsen@horizonpwr.com") {

        // sortedUsers = kfOnboarders.sort((u1, u2) => Number(u1.userId) < Number(u2.userId) ? 1 : -1)
        sortedApprovedUsers = caydenRegion.sort((u1, u2) => Number(u1.userId) < Number(u2.userId) ? 1 : -1)
    } else {
        sortedApprovedUsers = approvedUsers.sort((u1, u2) => Number(u1.userId) < Number(u2.userId) ? 1 : -1)// higher IDs are more recent so we want them first as per the spec
    }


    if (sortBy) {
        sortedApprovedUsers = sortedApprovedUsers.sort((u1, u2) => sortBy ? (u1[sortBy] > u2[sortBy] ? 1 : -1) : 0)
        if (reverseSort) {
            sortedApprovedUsers = sortedApprovedUsers.reverse()
        }
    }
    if (userSearchString) {
        sortedApprovedUsers = sortedApprovedUsers.filter(user => {
            return ['firstName', 'lastName', 'email', 'phoneNumber', 'roleName', 'teamName'].some(field => {
                return user[field] && user[field].toLowerCase().includes(userSearchString.toLowerCase())
            })
        })
    }

    const headOptions = [
        {sortBy: 'lastName', label: 'Name'},
        {sortBy: 'startDate', label: 'Start Date'},
        {sortBy: 'teamName', label: 'Team'},
        {sortBy: 'roleName', label: 'Role'},
    ]

    function clickedDelete(userId) {
        emit.ClickedRowTrashBin({
            userToDelete: userId
        })
        if (selectedUser === userId) {
            emit.ClickedSelectUserCheckbox({
                userId: null
            })
        }
    }

    function clickedCheckbox(userId) {
        emit.ClickedSelectUserCheckbox({
            userId: userId
        })
        if (selectedUserToDelete === userId) {
            emit.ClickedRowTrashBin({
                userToDelete: null
            })
        } else if (selectedUser === userId) {
            emit.ClickedSelectUserCheckbox({
                userId: null
            })
        }
    }

    function openModal(userId) {
        // console.log("open modal ", userId)
        let selectionVal = document.getElementById('deactivation-type-' + userId).value
        // console.log("inputSelection selected " + selectionVal + userId)
        let activeListModal = document.getElementById("modal-active-delete")
        activeListModal.classList.add("in")
        emit.ClickedRowTrashBin({
            selectedReasonToDelete: selectionVal,
            userToDelete: userId,

        })

    }

    function promotionModal(userId, firstName) {
        // console.log("open modal promotion ", userId, firstName)
        let selectionVal = document.getElementById('promotion-' + userId).value
        // console.log("open modal promotion selected " + selectionVal + userId + firstName)
        let promotionModal = document.getElementById("promote-rep")
        promotionModal.classList.add("in")
        emit.SelectedRepToPromote({
            selectedNewPositon: selectionVal,
            userToPromoteFirstName: firstName,
            userToPromote: userId,

        })

    }

    // console.log("SES ",sessionStore.user.roleName)
    // console.log("sessionStore.user.roleId ", sessionStore.user.roleId)

    return (
        <ClunkyTable

            title={sessionStore.user.roleId <= 4 ? "PWRstation Members " : sessionStore.user.teamName + " Members"}
            modalType="active"
            searchString={userSearchString}
            onSearchStringChange={userSearchString => emit.ChangedUserSearchString({userSearchString})}
            onDelete={() => emit.ClickedDeleteUsers({
                // userIds: approvedUsers.filter(u => selectedUsers[u.userId]).map(u => u.userId)
                userId: selectedUserToDelete,
                reason: selectedReasonToDelete
            })}
            tableHead={
                <thead>
                <tr>
                    <th>
                        <div className="checkbox">
                                <span
                                    param="all"
                                    className={approvedUsers.length && approvedUsers.every(user => selectedUsers[user.userId]) ? 'checked' : ''}
                                    onClick={() => emit.ClickedSelectAllUsersCheckbox()}
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
                                    onClick={() => emit.SelectedUserSortBy({sortBy})}
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
                    sortedApprovedUsers.filter(user => user.deleted === false && user.email !== 'christopher.reyes@horizonpwr.com').map((user, idx) => {
                        // console.log("Users ", user)
                        let date = (user.startDate !== null ? user.startDate.split("T") : '')

                        rows = [
                            <tr key={user.userId} className={idx % 2 ? '' : 'even-column'}>
                                <td>
                                    <div className="checkbox">
                                            <span
                                                param="all"
                                                className={selectedUser === user.userId ? 'checked' : ''}
                                                // onClick={() => emit.ClickedSelectUserCheckbox({
                                                //     userId: user.userId,
                                                //     reason: user.userId + '-quit'
                                                // })}
                                                onClick={clickedCheckbox.bind(this, user.userId)}
                                            />
                                    </div>
                                </td>
                                <td style={{width: "21%"}}>
                                    <div className="profile-holder">
                                            <span className="username">
                                                {user.firstName} {user.lastName}&nbsp;
                                                {user.certify ?
                                                    <Link
                                                        to={user.certificationId === null ? '/home' : '/certification/' + user.certificationId}
                                                    >
                                                    <span className="svg-icon svg-icon-primary certify svg-icon-2x">
                                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                                // xmlns:xlink="http://www.w3.org/1999/xlink"
                                                                 width="24px"
                                                                 height="24px" viewBox="0 0 24 24"
                                                                 version="1.1">
                                                                <g stroke="none" strokeWidth="1" fill="none"
                                                                   fillRule="evenodd">
                                                                    <rect x="0" y="0" width="24" height="24"/>
                                                                    <path
                                                                        d="M12,15 C10.3431458,15 9,13.6568542 9,12 C9,10.3431458 10.3431458,9 12,9 C13.6568542,9 15,10.3431458 15,12 C15,13.6568542 13.6568542,15 12,15 Z"
                                                                        fill="#e79236" fillRule="nonzero"/>
                                                                    <path
                                                                        d="M19.5,10.5 L21,10.5 C21.8284271,10.5 22.5,11.1715729 22.5,12 C22.5,12.8284271 21.8284271,13.5 21,13.5 L19.5,13.5 C18.6715729,13.5 18,12.8284271 18,12 C18,11.1715729 18.6715729,10.5 19.5,10.5 Z M16.0606602,5.87132034 L17.1213203,4.81066017 C17.7071068,4.22487373 18.6568542,4.22487373 19.2426407,4.81066017 C19.8284271,5.39644661 19.8284271,6.34619408 19.2426407,6.93198052 L18.1819805,7.99264069 C17.5961941,8.57842712 16.6464466,8.57842712 16.0606602,7.99264069 C15.4748737,7.40685425 15.4748737,6.45710678 16.0606602,5.87132034 Z M16.0606602,18.1819805 C15.4748737,17.5961941 15.4748737,16.6464466 16.0606602,16.0606602 C16.6464466,15.4748737 17.5961941,15.4748737 18.1819805,16.0606602 L19.2426407,17.1213203 C19.8284271,17.7071068 19.8284271,18.6568542 19.2426407,19.2426407 C18.6568542,19.8284271 17.7071068,19.8284271 17.1213203,19.2426407 L16.0606602,18.1819805 Z M3,10.5 L4.5,10.5 C5.32842712,10.5 6,11.1715729 6,12 C6,12.8284271 5.32842712,13.5 4.5,13.5 L3,13.5 C2.17157288,13.5 1.5,12.8284271 1.5,12 C1.5,11.1715729 2.17157288,10.5 3,10.5 Z M12,1.5 C12.8284271,1.5 13.5,2.17157288 13.5,3 L13.5,4.5 C13.5,5.32842712 12.8284271,6 12,6 C11.1715729,6 10.5,5.32842712 10.5,4.5 L10.5,3 C10.5,2.17157288 11.1715729,1.5 12,1.5 Z M12,18 C12.8284271,18 13.5,18.6715729 13.5,19.5 L13.5,21 C13.5,21.8284271 12.8284271,22.5 12,22.5 C11.1715729,22.5 10.5,21.8284271 10.5,21 L10.5,19.5 C10.5,18.6715729 11.1715729,18 12,18 Z M4.81066017,4.81066017 C5.39644661,4.22487373 6.34619408,4.22487373 6.93198052,4.81066017 L7.99264069,5.87132034 C8.57842712,6.45710678 8.57842712,7.40685425 7.99264069,7.99264069 C7.40685425,8.57842712 6.45710678,8.57842712 5.87132034,7.99264069 L4.81066017,6.93198052 C4.22487373,6.34619408 4.22487373,5.39644661 4.81066017,4.81066017 Z M4.81066017,19.2426407 C4.22487373,18.6568542 4.22487373,17.7071068 4.81066017,17.1213203 L5.87132034,16.0606602 C6.45710678,15.4748737 7.40685425,15.4748737 7.99264069,16.0606602 C8.57842712,16.6464466 8.57842712,17.5961941 7.99264069,18.1819805 L6.93198052,19.2426407 C6.34619408,19.8284271 5.39644661,19.8284271 4.81066017,19.2426407 Z"
                                                                        fill="#e79236" fillRule="nonzero"
                                                                        opacity="0.3"/>
                                                                </g>
                                                            </svg>
                                                        </span>
                                                    </Link>
                                                    : ""}
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
                                    {user.teamName} &nbsp; {user.certify}
                                </td>
                                <td className="greyColor">
                                    {user.roleName}
                                </td>
                                <td className="greyColor text-center">
                                    {/*<Link*/}
                                    {/*    to={`/editUser/${user.userId}`}>*/}
                                    {/*        <span className="glyphicon glyphicon-edit"*/}
                                    {/*              style={{fontSize: "20px", marginRight: "10px"}}/>*/}
                                    {/*</Link>*/}
                                    {user.eligible && !user.certify ?
                                        <Link
                                            to={`/certify/${user.userId}`} style={{position: "relative"}}
                                            className="certify-icon">
                                            <span className="glyphicon glyphicon-star-empty"
                                                  style={{fontSize: "20px", marginRight: "10px", color: "#6a7580"}}/>
                                            <div className="popover fade left in"
                                                 style={{top: "-25px", left: "auto", right: "35px"}}>
                                                <div className="arrow"/>
                                                {/*<h3 className="popover-title" style={{color: "#333333"}}>Leads</h3>*/}
                                                <div className="popover-content" style={{color: "#333333"}}>
                                                    Certify {user.firstName}
                                                </div>
                                            </div>
                                        </Link>
                                        : ''}
                                    <span id={'delete-' + user.userId} className="glyphicon glyphicon-trash"
                                          style={selectedUserToDelete === user.userId ? {
                                              fontSize: "20px",
                                              float: "right",
                                              marginRight: "10px",
                                              pointerEvents: "none",
                                              color: "red"
                                          } : {
                                              fontSize: "20px",
                                              marginRight: "10px",
                                              cursor: "pointer",
                                              float: "right"
                                          }}
                                          onClick={clickedDelete.bind(this, user.userId)}
                                    />
                                </td>
                            </tr>
                        ]

                        rows.push(
                            <tr key={user.userId + "active-delete"}
                                style={selectedUserToDelete === user.userId ? {display: "table-row"} : {display: "none"}}>
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
                                                            onInput={openModal.bind(this, user.userId)}
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
                            <tr key={user.userId + "user-options"}
                                style={selectedUser === user.userId ? {display: "table-row"} : {display: "none"}}>
                                <td colSpan="6">
                                    {!user.promotionProcessing ?
                                        <div style={{maxWidth: "80%", margin: "auto"}}>
                                            <table style={{width: "100%", margin: "auto", height: "100%"}}>
                                                <tbody>
                                                <tr>
                                                    <td>
                                                        <label>Promote {user.firstName}</label>
                                                        <div className="form-group">
                                                            {/*<label className="p greyColor">*/}
                                                            {/*   Available positions*/}
                                                            {/*</label>*/}
                                                            <select id={"promotion-" + user.userId}
                                                                    className="form-control"
                                                                    onInput={promotionModal.bind(this, user.userId, user.firstName)}
                                                                    name={"promotion-" + user.userId}>
                                                                <option>Available Promotions...</option>
                                                                {
                                                                    user.roleId === 7 ?
                                                                        roleStore.roles.filter(role => role.roleId === 10 || role.roleId === 8).map(role => {
                                                                            return (
                                                                                <option key={role.roleId}
                                                                                        value={role.roleName}>{role.roleName}</option>
                                                                            )
                                                                        })
                                                                        :
                                                                        user.roleId === 8 ?
                                                                            roleStore.roles.filter(role => role.roleId === 10).map(role => {
                                                                                return (
                                                                                    <option key={role.roleId}
                                                                                            value={role.roleName}>{role.roleName}</option>
                                                                                )
                                                                            })
                                                                            :
                                                                            user.roleId === 10 ?
                                                                                roleStore.roles.filter(role => role.roleId === 9).map(role => {
                                                                                    return (
                                                                                        <option key={role.roleId}
                                                                                                value={role.roleName}>{role.roleName}</option>
                                                                                    )
                                                                                })
                                                                                :
                                                                                user.roleId === 9 ?
                                                                                    roleStore.roles.filter(role => role.roleId === 5).map(role => {
                                                                                        return (
                                                                                            <option key={role.roleId}
                                                                                                    value={role.roleName}>{role.roleName}</option>
                                                                                        )
                                                                                    })
                                                                                    :
                                                                                    null
                                                                }
                                                            </select>

                                                        </div>
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        :
                                        <div style={{maxWidth: "80%", margin: "auto"}}>
                                            <h3 style={{textAlign: "center"}}>An email was sent to {user.firstName} with
                                                the new position agreement. </h3>
                                        </div>
                                    }
                                </td>
                            </tr>
                        )

                        return (
                            rows
                        )
                    })
                }
                {
                    !approvedUsers.length ?
                        <tr>
                            <td colSpan="6">
                                No records found.
                            </td>
                        </tr>
                        : null
                }
                </tbody>

            }
        />
    )
})
