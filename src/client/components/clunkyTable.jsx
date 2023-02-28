import Link from './link'

function closeModal() {
    let modalActive = document.getElementById('modal-active-delete')
    let modalOnboarder = document.getElementById('modal-onboarding-delete')
    if (modalActive) {
        modalActive.classList.remove("in")
    }
    if (modalOnboarder) {
        modalOnboarder.classList.remove("in")
    }
}

export default function ClunkyTable({
    title,
    searchString,
    onSearchStringChange,
    onDelete,
    tableHead,
    tableBody, 
    modalType,
}) {
    
    // The grid layout that was used before requires the head and body to be define twice.
    // I think it's necessary for spacing purposes?
    // Don't ask me why but it works and looks alright, so leaving it for now.

    return (
        <div>
            <div className="section-table-name">{title}</div>
            <div className="row">
                <div className="col-xs-6 bulk-buttons">                      
                    <input
                        type="text"
                        name="pwr_search"
                        placeholder="Search..."
                        onChange={e => onSearchStringChange(e.target.value)}
                        value={searchString}
                    />
                     {/*<button*/}
                    {/*    className="deleteSelectedBtn"*/}
                    {/*    onClick={() => onDelete()}*/}
                    {/*>Deactivate Selected*/}
                    {/*</button>*/}
                </div>
                <div className="col-xs-6 alignRight">
                    <a target="_blank" href="https://pwrstation-prod.horizonpwr.com/applicants/new">
                        <button className="addUserBtn">
                            Add Team Member
                        </button>
                    </a>
                </div>
            </div>
            <div className="clear30" />
            <div className="table-container admin-dashboard">
                <div className="table-header">
                    <table className="table" param="pwrstation">
                        {tableHead}
                        {/*{tableBody}*/}
                    </table>
                </div>
                <div className="table-content">
                    <table className="table" style={{marginBottom: "0px" }}>
                        {tableHead}
                        {tableBody}
                    </table>
                </div>
            </div>
            <div id={'modal-' + modalType + '-delete'} className="modal fade" onClick={closeModal.bind(this)}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" onClick={closeModal.bind(this)}
                                    aria-hidden="true">&times;</button>
                            <h4 className="modal-title">HorizonPWR User Protection</h4>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to deactivate this user from the company</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" onClick={closeModal.bind(this)}>Not now
                            </button>
                            <button type="button" className="btn btn-primary" onClick={() => onDelete()}>Deactivate
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
