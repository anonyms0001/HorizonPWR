import React from 'react';
import {view} from '../framework'
import sessionStore from '../stores/sessionStore'


export default view(function ChangePassword() {


    return (
            <div className="row">
                <div className="col-md-3">
                </div>
                <div className="col-md-6" style={{background: "rgba(39, 37, 37, 0.64)", padding: "2em", borderRadius: "15px"}}>
                    <div >
                    <form id="changepasswordform" action="" method="POST" onSubmit={e => {
                        e.preventDefault()
                        emit.ClickedConfirmChangePassword({
                            userId: sessionStore.user.userId,
                            password: document.getElementById('newUserPassword').value,
                            verifyPassword: document.getElementById('newUserVerifyPassword').value,
                        })
                    }}>
                        <div className="col-md-12">
                            <div className="form-group">
                                <label className="p greyColor">
                                    <strong style={{color: "#fff"}}>Password<span className="text-danger">*</span></strong>
                                </label>
                                <input id="newUserPassword" type="password" name="first_name" className="form-control"
                                       placeholder="Enter a password" required/>
                            </div>
                        </div>
                        <div className="col-md-12">
                            <div className="form-group">
                                <label className="p greyColor">
                                    <strong style={{color: "#fff"}}>Verify Password<span className="text-danger">*</span></strong>
                                </label>
                                <input id="newUserVerifyPassword" type="password" name="last_name" className="form-control"
                                       placeholder="Re-enter your password" required/>
                            </div>
                        </div>
                        <div className="col-xs-12">
                            <div className="clear30"></div>
                            <button type="submit" name="submit" className="submitBtn">Change Password</button>
                        </div>
                    </form>
                    </div>
                </div>
                <div className="col-md-3">
                </div>
            </div>



    )
})