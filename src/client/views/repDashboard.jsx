import { view } from '../framework'
import sessionStore from '../stores/sessionStore'
import Commissions from './commissions'

export default view(function RepDashboard() {

    if (sessionStore.user.isAdmin) {
        return null
    }   

    return (
        <section className="pwrstation-view-dashboard">
            {
                sessionStore.isNewUser ?
                    <section className="pwrstation-table">
                        <div className="section-table-name">Change Password</div>
                        <div className="clear50"></div>   
                        <div className="shadowbox">
                            <div id="resultbox"></div>
                            <form id="changepasswordform" action="" method="POST" onSubmit={e => {
                                    e.preventDefault()
                                    emit.ClickedConfirmChangePassword({
                                        userId: sessionStore.user.userId,
                                        password: document.getElementById('newUserPassword').value,
                                        verifyPassword: document.getElementById('newUserVerifyPassword').value,
                                    })
                                }}>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="p greyColor">
                                                <strong>Password<span className="text-danger">*</span></strong>
                                            </label>
                                            <input id="newUserPassword" type="password" name="first_name" className="form-control" placeholder="Enter a password" required />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="p greyColor">
                                                <strong>Verify Password<span className="text-danger">*</span></strong>
                                            </label>
                                            <input  id="newUserVerifyPassword" type="password" name="last_name" className="form-control" placeholder="Re-enter your password" required />
                                        </div>
                                    </div> 
                                    <div className="col-xs-12">
                                        <div className="clear30"></div>
                                        <button type="submit" name="submit" className="submitBtn">Change Password</button>
                                    </div> 
                            </form>
                        </div>
                    </section>
                : <Commissions />
            }
           
        </section> 
    )
})