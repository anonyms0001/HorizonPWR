import {Redirect} from 'react-router-dom'
import {view, emit} from '../framework'
import teamStore from '../stores/teamStore'
import userStore from '../stores/userStore'
import roleStore from '../stores/roleStore'
import sessionStore from '../stores/sessionStore'
import { Link } from 'react-router-dom'


export default view(function CreateUser() {

    console.log("CREATE USER ", userStore.addUserRedirectEngaged)
    if (userStore.addUserRedirectEngaged) {
        return <Redirect to="/repsLeaderboard"/>
    }
    //     console.log("teams ", teamStore)
    // console.log("user redirect ", userStore.addUserRedirectEngaged)
    let today = new Date()
    const absoluteToday = today.getFullYear() + '-' + ((today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1)) + '-' + (today.getDate() < 10 ? '0' + today.getDate() : today.getDate())    
    return (
        <section className="pwrstation-table">
            <div className="shadowbox">
                {/*<button onClick={()=> emit.TestEmail(sessionStore.user.userId)}>test email</button>*/}
                {/*<button onClick={()=> emit.TestRedirect()}>test redirect</button>*/}
                <div id="resultbox"></div>
                <form id="add-user-form" action="" onSubmit={e => {
                    e.preventDefault()
                    emit.ClickedAddNewUser({
                        email: document.getElementById('newUserEmail').value,
                        // personalEmail       : document.getElementById('newUserPersonalEmail').value,
                        // comapanyEmail       : document.getElementById('newUserCompnayEmail').value,
                        roleId: document.getElementById('newUserRole').value,
                        firstName: document.getElementById('newUserFirstName').value,
                        lastName: document.getElementById('newUserLastName').value,
                        phoneNumber: document.getElementById('newUserPhoneNumber').value,
                        teamId: document.getElementById('newUserTeamId').value,
                        startDate: document.getElementById('newUserStartDate').value,
                        password: document.getElementById('newUserPassword').value,
                        verifyPassword: document.getElementById('newUserVerifyPassword').value,
                    })
                }}>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="p greyColor">
                                    <strong>Rep's Personal Email<span className="text-danger">*</span></strong>
                                </label>
                                <input
                                    id="newUserEmail"
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    placeholder="Enter Rep's Personal Email Address" required
                                />
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="p greyColor"><strong>Team<span className="text-danger">*</span></strong></label>
                                 <select id="newUserTeamId" className="form-control" name="team" required>
                                    <option value="">Select Rep's Team</option>
                                    {
                                        teamStore.teams.length > 1 ? teamStore.teams.map(team => {
                                          
                                                return (
                                                    <option key={team.teamId} value={team.teamId}>
                                                        {team.teamName}
                                                    </option>
                                                )
                                            
                                        })
                                            : <option  value='8'>Rexburg</option>
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="p greyColor">
                                    <strong>Rep's First Name<span className="text-danger">*</span></strong>
                                </label>
                                <input id="newUserFirstName" type="text" name="first_name" className="form-control"
                                       placeholder="Enter Rep's First Name" required/>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="p greyColor">
                                    <strong>Rep's Last Name<span className="text-danger">*</span></strong>
                                </label>
                                <input id="newUserLastName" type="text" name="last_name" className="form-control"
                                       placeholder="Enter Rep's Last Name" required/>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="p greyColor"><strong>Role<span
                                    className="text-danger">*</span></strong></label>
                                <select id="newUserRole" className="form-control" name="position" required>
                                    <option value="">Select Rep's User Role</option>
                                    {
                                        roleStore.roles.map(role => {
                                            if(role.roleId > 4) {
                                                return (
                                                    <option key={role.roleId}
                                                            value={role.roleId}>{role.roleName}</option>
                                                )
                                            }
                                        })

                                    }
                                </select>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="p greyColor">
                                    <strong>Rep's Phone Number<span className="text-danger">*</span></strong>
                                </label>
                                <input id="newUserPhoneNumber" type="text" name="phone" className="form-control"
                                       placeholder="Enter Rep's Phone Number" required/>
                            </div>

                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="p greyColor"><strong>Rep's Start Date<span className="text-danger">*</span></strong></label>
                                <input id="newUserStartDate" min={absoluteToday}  type="date" name="start_date" className="form-control"
                                       placeholder="Enter Rep's Start Date" required/>
                            </div>

                        </div>
                        <div className="col-md-6">

                        </div>
                        <div className="col-md-12">
                            <div className="col-md-6">
                                <div className="form-group">

                                    <input id="newUserPassword" type="hidden" name="first_name" className="form-control"
                                           defaultValue="password" required/>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <input id="newUserVerifyPassword" type="hidden" name="last_name"
                                           className="form-control" defaultValue="password" required/>
                                </div>
                            </div>
                        </div>
                        <div className="col-xs-12">

                            <button type="submit" name="submit" className="submitBtn" style={{marginRight: "15px"}}>Add Team Member</button>
                            <Link to={`/home`}>
                                <button className="editBtn" type="button">Cancel</button>
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    )
})
