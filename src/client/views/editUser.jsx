import {Link} from 'react-router-dom'
import {view, emit} from '../framework'
import userStore from '../stores/userStore'
import roleStore from '../stores/roleStore'
import teamStore from '../stores/teamStore'
import FileUpload from '../components/fileUpload'

export default view(function EditUser({match}) {

    let {userId} = match.params
    const user = userStore.users.find(user => user.userId == userId)
    const teams = teamStore.teams
    // const userStartTime = new Date(user.startDate)
    let userStartTime = user.startDate.split("T")
    userStartTime = userStartTime[0]

    return (
        <section className="pwrstation-view-profile">
            {
                teamStore.addTeamModalVisible ?
                    <div id="modal-addteam" className="modal-box" style={{display: 'inherit'}}>
                        <form id="addteamform" action="" method="POST" onSubmit={e => {
                            e.preventDefault()
                            emit.ClickedConfirmCreateTeam({
                                newTeamName: document.getElementById('newTeamName').value,
                            })
                        }}>
                            <p className="result-message"></p>
                            <div className="closebtn" onClick={() => {
                                emit.ClickedCancelNewTeam()
                            }}>
                                <img src="/assets/images/closebtn.png"/>
                            </div>
                            Team Name:
                            <input id="newTeamName" type="text" name="name" className="form-control"
                                   placeholder="Team Name Here" required/>
                            <button type="submit" className="addTeamBtnConfirm">Create Team</button>
                        </form>
                    </div>
                    : null
            }
            {
                teamStore.editTeamsModalVisible ?
                    <div id="modal-editteams" className="modal-box" style={{display: 'inherit'}}>
                        <div className="closebtn" onClick={() => {
                            emit.ClickedCancelEditTeams()
                        }}>
                            <img src="/assets/images/closebtn.png"/>
                        </div>
                        <h3 className="greyColor">Teams</h3>
                        <div>
                            {
                                teams.map((team) => {
                                    return (
                                        <div key={team.teamId}>
                                            <input id={team.teamId} type="text" className="form-control"
                                                   style={{marginBottom: "5px"}} onChange={(e) => {
                                                emit.TeamNameChanged({
                                                    team: {
                                                        teamId: team.teamId,
                                                        teamName: e.target.value
                                                    }
                                                })
                                            }} defaultValue={team.teamName}/>
                                            <button className="editTeamBtn btn btn-primary" onClick={() => {
                                                emit.ClickedConfirmEditTeam({team})
                                            }}>Change Team Name
                                            </button>
                                            {' '}
                                            <button className="deleteTeamBtn btn btn-primary" onClick={() => {
                                                emit.ClickedDeleteTeam({team})
                                            }}>Delete Team
                                            </button>
                                            <div className="clear20"/>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    : null
            }
            <div className="section-table-name">Profile</div>
            <div className="shadowbox">
                <div id="resultbox"/>
                <div className="row">
                    <div className="col-md-6">
                        <form id="edit-profile-form" action="" method="POST" onSubmit={e => {
                            e.preventDefault()
                            emit.SubmittedUserEdit({
                                userId,
                                email: user.email,
                                personalEmail: document.getElementById('personalEmail').value,
                                roleId: document.getElementById('roleSelect').value,
                                teamId: document.getElementById('teamSelect').value,
                                firstName: document.getElementById('firstNameInput').value,
                                lastName: document.getElementById('lastNameInput').value,
                                phoneNumber: document.getElementById('phoneNumberInput').value,
                                startDate: document.getElementById('startDateInput').value,
                            })
                        }}>
                            <input type="hidden" name="id" value={user.email} required/>
                            <div className="h5 greyColor">
                                <b>Email </b>
                                <br/>{user.email}
                                {/*<button id="test-email-btn" onClick={() => emit.ClickedTestEmail({ userId: user.userId })}>Test Email</button>*/}
                            </div>
                            <div className="clear20"/>
                            {user.agreement_signed ?
                            <div className="h5 greyColor">
                                <b>Position</b>
                                <br/>
                                <select className="form-control" name="position" id="roleSelect"
                                        defaultValue={user.roleId} disabled="disabled" style={{marginBottom:"0px"}}>
                                    <option value="">Select User Role</option>
                                    {
                                        roleStore.roles.map(role => {
                                            return (
                                                <option key={role.roleId} value={role.roleId}>{role.roleName}</option>
                                            )
                                        })
                                    }
                                </select>
                                <div style={{marginBottom:"35px", fontSize: "10px"}}>Agreement was signed already</div>
                            </div>
                                :
                                <div className="h5 greyColor">
                                    <b>Position</b>
                                    <br/>
                                    <select className="form-control" name="position" id="roleSelect"
                                            defaultValue={user.roleId} >
                                        <option value="">Select User Role</option>
                                        f
                                        {
                                            roleStore.roles.map(role => {
                                                return (
                                                    <option key={role.roleId} value={role.roleId}>{role.roleName}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                            }
                            <div className="h5 greyColor">
                                <b>Personal Email</b>
                                <br/>
                                <input type="text" name="personalEmail" defaultValue={user.personalEmail} required
                                       className="form-control" id="personalEmail"/>
                            </div>
                            <div className="h5 greyColor">
                                <b>Team</b>
                                 {/*<button type="button" className="addnewteambtn btn btn-primary" onClick={() => emit.ClickedCreateNewTeam()}>Create New Team</button>
                            
                                <button type="button" className="editteamsbtn btn btn-primary" onClick={() => emit.ClickedEditTeams()}>Edit Teams</button> */}
                                <br/>
                                <select className="form-control" name="team" id="teamSelect" defaultValue={user.teamId}>
                                    <option value="">Select Team</option>
                                    {
                                        teamStore.teams.map(team => {
                                            return (
                                                <option key={team.teamId} value={team.teamId}>
                                                    {team.teamName}
                                                </option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            {/*<div className="clear20"/>*/}
                            <div className="h5 greyColor">
                                <b>First Name</b>
                                <br/>
                                <input type="text" name="firstName" defaultValue={user.firstName} required
                                       className="form-control" id="firstNameInput"/>
                            </div>
                            <div className="h5 greyColor">
                                <b>Last Name</b>
                                <br/>
                                <input type="text" name="lastName" defaultValue={user.lastName} required
                                       className="form-control" id="lastNameInput"/>
                            </div>
                            <div className="clear20"/>
                            <div className="h5 greyColor">
                                <b>Phone Number</b>
                                <br/>
                                <input type="text" name="phone" id="phoneNumberInput" className="form-control"
                                       defaultValue={user.phoneNumber}/>
                            </div>
                            <div className="clear20"/>
                            <div className="h5 greyColor">
                                <b>Start Date</b>
                                <br/>
                                <input id="startDateInput" type="date" name="start_date" className="form-control"
                                       defaultValue={userStartTime}/>
                            </div>
                            <div className="clear50"/>
                            <div className="clear30"/>
                            <button className="approveBtn" type="submit">Update</button>
                            <Link to={`/home`}>
                                <button className="editBtn" type="button">Cancel</button>
                            </Link>
                        </form>
                    </div>
                    <div className="col-xs-6 pull-right profile-password-section">
                        {/* <img src={user.profileImageFile ?
                            `/hosted/users/${user.userId}/${user.profileImageFile}`
                            : '/assets/images/questionMark.png'} className="profile-img" id="prev-img"/>
                        <div className="clear10"/>
                        Select image to upload:
                        <FileUpload
                            onFiles={files => {
                                if (files.length > 1) {
                                    alert('please only upload 1 file')
                                    return
                                }
                                emit.UploadedImageFile({userId: user.userId, file: files[0]})
                            }}
                            inactiveText="Upload Image"
                            activeText="Drop image here..."
                        />
                        <div className="clear50"/>
                        <div className="h5 greyColor">
                            <b id="passload">Password</b>
                            <br/>
                            <button className="resetBtn" onClick={() => {
                                if (!confirm("Are you sure you want to reset this user's password? A new password will be emailed to them.")) {
                                    return
                                }
                                emit.ClickedResetPassword({userId: user.userId})
                            }}>
                                Reset Password
                            </button>
                        </div>
                        <div id="resetbox">
                            <form id="updatepassform" action="" method="POST">
                                <input type="hidden" name="user_id" value="<?php echo $data['account']['user_id']; ?>"/>
                                <p className="error text-danger"/>
                                <div className="form-group">
                                    <label>New Password <span>(Minimum of 6 characters)</span></label>
                                    <input type="password" name="pass1" className="form-control" minLength="6"
                                           required/>
                                </div>
                                <div className="form-group">
                                    <label>Confirm Password</label>
                                    <input type="password" name="pass2" className="form-control" minLength="6"
                                           required/>
                                </div>
                                <div className="form-group">
                                    <button type="submit" name="updatepass">Update Password</button>
                                </div>
                            </form>
                        </div> */}
                        <div className="clear50"/> 
                    </div>
                </div>
            </div>
        </section>
    )
})

