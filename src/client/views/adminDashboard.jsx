import { view } from '../framework'
import sessionStore from '../stores/sessionStore'
import ApprovedUsers from './approvedUsers'
import ApprovedUsersManagers from './approvedUsersManagers'
import UnapprovedUsers from './unapprovedUsers'
import OnboarderDashboard from "./onboarderDashboard";
import promotionStore from '../stores/promotionStore'
// import Commissions from './commissions'


export default view(function AdminDashboard() {

    let modalNewPosition = promotionStore.proposedPromotion[0]
    let modalFirstName = promotionStore.proposedPromotion[1]
    let modalUserId = promotionStore.proposedPromotion[2]

    if (!sessionStore.user.isOnboarder) {
        return null
    }
      function closeModal() {
        let modalActive = document.getElementById('promote-rep')
            modalActive.classList.remove("in")
    }

    return (
        <section className="pwrstation-table">
            <ApprovedUsersManagers />
             <div id='promote-rep' className="modal fade" onClick={closeModal.bind(this)}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header" style={{background: "#062c45", color: "#fff"}}>
                            <button type="button" className="close" data-dismiss="modal" onClick={closeModal.bind(this)}
                                    aria-hidden="true">&times;</button>
                            <h4 className="modal-title">HorizonPWR Promotion</h4>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to promote {modalFirstName} to {modalNewPosition}?</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" onClick={closeModal.bind(this)}>Not now
                            </button>
                            <button type="button" className="btn btn-primary" onClick={() => emit.PromoteUser({modalUserId, modalNewPosition})} >Promote
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/*{ sessionStore.user.isAdmin ? <ApprovedUsersManagers />  : <ApprovedUsersManagers />}*/}
             <div className="clear100" />
            {/*{ sessionStore.user.isAdmin ?  <UnapprovedUsers /> : <OnboarderDashboard /> }*/}
            <OnboarderDashboard />
            <div className="clear100" />
        </section>
    )
})

