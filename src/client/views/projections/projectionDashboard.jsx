import {Link, Redirect} from 'react-router-dom'
import {view, emit} from '../../framework'
import ProjectionStore from "../../stores/projectionStore"
import userStore from "../../stores/userStore";

export default view(function ProjectionDashboard() {
    const {projections, projectionState, dashboardState} = ProjectionStore
    // console.log("projections ", projections)
    // console.log("projectionState ", projectionState)
    function changeProjectionState(state) {
        // console.log("state ", state)
        emit.ClickedChangeProjectionStatus({action: state})
    }

    console.log("before redirect ", dashboardState)

    if (dashboardState > 0) {
        return <Redirect to={"/projection/" + dashboardState}/>
    }

    function handleChange(evt) {
        const financialGoal = (evt.target.validity.valid) ? evt.target.value : this.state.financialGoal;
        this.setState({financialGoal});
    }

    function clickedBreakdown(start_date, end_date, projectionId) {
        // console.log("clickedBreakdown ", start_date, end_date, projectionId)
        emit.PrepareBreakdownPage({startDate: start_date, endDate: end_date, projectionId: projectionId})
    }

    let today = new Date()
    const absoluteToday = today.getFullYear() + '-' + ((today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1))

    return (
        <section className="pwrstation-view-profile">
            <div className="shadowbox">
                <div id="resultbox"/>
                <div className="row">
                    <div className="col-xs-12">
                        {
                            projections.length > 0 ?
                                <div>
                                    <div style={{display: "flex"}}>
                                        <div style={{flex: "1"}}>
                                            <h2>2020 Projections</h2>
                                        </div>
                                        <div>
                                            <button style={{float: "right", marginTop: "20px"}}
                                                    className="btn btn-success"
                                                    onClick={changeProjectionState.bind(this, "create")}>
                                                {/*<img className='svg-promote'*/}
                                                {/* src="../../../../assets/images/Chart-line%231.svg"/>*/}
                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                     width="24px" height="24px" viewBox="0 0 24 24" version="1.1"
                                                     className="kt-svg-icon">
                                                    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                                        <rect id="bound" x="0" y="0" width="24" height="24"/>
                                                        <path
                                                            d="M5,19 L20,19 C20.5522847,19 21,19.4477153 21,20 C21,20.5522847 20.5522847,21 20,21 L4,21 C3.44771525,21 3,20.5522847 3,20 L3,4 C3,3.44771525 3.44771525,3 4,3 C4.55228475,3 5,3.44771525 5,4 L5,19 Z"
                                                            id="Path-95" fill="#000000" fillRule="nonzero"/>
                                                        <path
                                                            d="M8.7295372,14.6839411 C8.35180695,15.0868534 7.71897114,15.1072675 7.31605887,14.7295372 C6.9131466,14.3518069 6.89273254,13.7189711 7.2704628,13.3160589 L11.0204628,9.31605887 C11.3857725,8.92639521 11.9928179,8.89260288 12.3991193,9.23931335 L15.358855,11.7649545 L19.2151172,6.88035571 C19.5573373,6.44687693 20.1861655,6.37289714 20.6196443,6.71511723 C21.0531231,7.05733733 21.1271029,7.68616551 20.7848828,8.11964429 L16.2848828,13.8196443 C15.9333973,14.2648593 15.2823707,14.3288915 14.8508807,13.9606866 L11.8268294,11.3801628 L8.7295372,14.6839411 Z"
                                                            id="Path-97" fill="#000000" fillRule="nonzero"
                                                            opacity="0.3"/>
                                                    </g>
                                                </svg>
                                                &nbsp;Create Projection
                                                {/*<b>Modify Certification</b>*/}
                                            </button>
                                        </div>
                                    </div>


                                    <table className="table table-bordered table-striped">
                                        <thead>
                                        <tr>
                                            <th>Month</th>
                                            <th>Company Target</th>
                                            <th>Company Projected</th>
                                            <th>Actions</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            projections.map((projection, key) => {
                                                const monthNames = ["January", "February", "March", "April", "May", "June",
                                                    "July", "August", "September", "October", "November", "December"
                                                ];
                                                const monthNumber = new Date(projection.start_date).getMonth()
                                                // const yearOnly = new Date(projection.start_date).getFullYear()
                                                // console.log(monthNumber)
                                                // let dateSplit = dateToString.split('T')
                                                return (
                                                    <tr>
                                                        <th>{monthNames[monthNumber]}</th>
                                                        <th>{projection.target_installs}</th>
                                                        <th>{projection.projected_installs}</th>
                                                        <th>
                                                            {/*<button className="btn button-primary">*/}
                                                            {/*    <i className="glyphicon glyphicon-edit"/>*/}
                                                            {/*    &nbsp;*/}
                                                            {/*    Edit*/}
                                                            {/*</button>*/}
                                                            &nbsp; &nbsp;
                                                            {/*<Link to={"/projection/" + projection.id}*/}
                                                            {/*      className="btn button-primary">*/}
                                                            {/*    See Breakdown*/}
                                                            {/*</Link>*/}
                                                            <button className="btn btn-primary"
                                                                    onClick={clickedBreakdown.bind(this, projection.start_date, projection.end_date, projection.id)}>
                                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                                     width="24px" height="24px" viewBox="0 0 24 24"
                                                                     version="1.1"
                                                                     className="kt-svg-icon">
                                                                    <g stroke="none" strokeWidth="1" fill="none"
                                                                       fillRule="evenodd">
                                                                        <rect id="bound" x="0" y="0" width="24"
                                                                              height="24"/>
                                                                        <path
                                                                            d="M5,19 L20,19 C20.5522847,19 21,19.4477153 21,20 C21,20.5522847 20.5522847,21 20,21 L4,21 C3.44771525,21 3,20.5522847 3,20 L3,4 C3,3.44771525 3.44771525,3 4,3 C4.55228475,3 5,3.44771525 5,4 L5,19 Z"
                                                                            id="Path-95" fill="#000000"
                                                                            fillRule="nonzero"/>
                                                                        <path
                                                                            d="M8.7295372,14.6839411 C8.35180695,15.0868534 7.71897114,15.1072675 7.31605887,14.7295372 C6.9131466,14.3518069 6.89273254,13.7189711 7.2704628,13.3160589 L11.0204628,9.31605887 C11.3857725,8.92639521 11.9928179,8.89260288 12.3991193,9.23931335 L15.358855,11.7649545 L19.2151172,6.88035571 C19.5573373,6.44687693 20.1861655,6.37289714 20.6196443,6.71511723 C21.0531231,7.05733733 21.1271029,7.68616551 20.7848828,8.11964429 L16.2848828,13.8196443 C15.9333973,14.2648593 15.2823707,14.3288915 14.8508807,13.9606866 L11.8268294,11.3801628 L8.7295372,14.6839411 Z"
                                                                            id="Path-97" fill="#000000"
                                                                            fillRule="nonzero"
                                                                            opacity="0.3"/>
                                                                    </g>
                                                                </svg>
                                                                &nbsp;
                                                                {monthNames[monthNumber]} Breakdown
                                                            </button>
                                                        </th>
                                                    </tr>
                                                )
                                            })
                                        }
                                        </tbody>
                                    </table>
                                </div>
                                :
                                <table>
                                    <tr>
                                        <th>No Projections Setup Yet</th>
                                    </tr>
                                </table>
                        }
                    </div>
                    <div className="col-xs-12">
                        <div className="h5 greyColor text-center">
                            {/*<button className="approveBtn" type="submit">Update</button>*/}
                            &nbsp;
                            {/*<Link style={{marginTop: "20px"}} className="btn btn-default"*/}
                            {/*      to={`/home`}*/}
                            {/*>*/}
                            {/*    &nbsp; Back To Dashboard*/}
                            {/*</Link>*/}
                            &nbsp; &nbsp;
                            <button
                                    className="btn btn-success"
                                    onClick={changeProjectionState.bind(this, "create")}>
                                {/*<img className='svg-promote'*/}
                                {/* src="../../../../assets/images/Chart-line%231.svg"/>*/}
                                <svg xmlns="http://www.w3.org/2000/svg"
                                     width="24px" height="24px" viewBox="0 0 24 24" version="1.1"
                                     className="kt-svg-icon">
                                    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                        <rect id="bound" x="0" y="0" width="24" height="24"/>
                                        <path
                                            d="M5,19 L20,19 C20.5522847,19 21,19.4477153 21,20 C21,20.5522847 20.5522847,21 20,21 L4,21 C3.44771525,21 3,20.5522847 3,20 L3,4 C3,3.44771525 3.44771525,3 4,3 C4.55228475,3 5,3.44771525 5,4 L5,19 Z"
                                            id="Path-95" fill="#000000" fillRule="nonzero"/>
                                        <path
                                            d="M8.7295372,14.6839411 C8.35180695,15.0868534 7.71897114,15.1072675 7.31605887,14.7295372 C6.9131466,14.3518069 6.89273254,13.7189711 7.2704628,13.3160589 L11.0204628,9.31605887 C11.3857725,8.92639521 11.9928179,8.89260288 12.3991193,9.23931335 L15.358855,11.7649545 L19.2151172,6.88035571 C19.5573373,6.44687693 20.1861655,6.37289714 20.6196443,6.71511723 C21.0531231,7.05733733 21.1271029,7.68616551 20.7848828,8.11964429 L16.2848828,13.8196443 C15.9333973,14.2648593 15.2823707,14.3288915 14.8508807,13.9606866 L11.8268294,11.3801628 L8.7295372,14.6839411 Z"
                                            id="Path-97" fill="#000000" fillRule="nonzero"
                                            opacity="0.3"/>
                                    </g>
                                </svg>
                                &nbsp;Create Projection
                                {/*<b>Modify Certification</b>*/}
                            </button>
                        </div>
                    </div>
                    <div id='createProjection'
                         className={projectionState === 'create' ? 'modal fade in' : 'modal fade'}>
                        <div className="modal-dialog modal-sm">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button type="button" style={{fontSize: "24px"}} className="close"
                                            data-dismiss="modal"
                                            onClick={changeProjectionState.bind(this, "dashboard")}
                                            aria-hidden="true">&times;</button>
                                    <h4 className="modal-title">New Company Projection</h4>
                                </div>
                                <div className="modal-body">
                                    <form id='create-projection-form' onSubmit={e => {
                                        e.preventDefault()
                                        emit.ClickedAddNewProjection({
                                            date: document.getElementById('date').value,
                                            target: document.getElementById('target').value,
                                            projection: document.getElementById('projection').value,
                                        })
                                    }}>
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="form-group">
                                                    <label className="p greyColor">
                                                        <strong>Select Month<span
                                                            className="text-danger">*</span></strong>
                                                    </label>
                                                    <input id='date' min={absoluteToday} type="month" name="start_date"
                                                           className="form-control"
                                                           placeholder="Projection Month" required/>
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="form-group">
                                                    <label className="p greyColor">
                                                        <strong>Company SI Target<span
                                                            className="text-danger">*</span></strong>
                                                    </label>
                                                    <input id="target" type="text" name="target"
                                                           onInput={handleChange.bind(this)}
                                                           className="form-control"
                                                           placeholder="ex. 98" required/>
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="form-group">
                                                    <label className="p greyColor">
                                                        <strong>Company SI Projection<span
                                                            className="text-danger">*</span></strong>
                                                    </label>
                                                    <input id="projection" type="text" name="target"
                                                           className="form-control"
                                                           placeholder="ex. 100" required/>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-default"
                                            onClick={changeProjectionState.bind(this, "dashboard")}>Cancel
                                    </button>
                                    <button type="submit" form='create-projection-form' value='submit'
                                            className="btn btn-primary">Submit
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="clear20"/>

                </div>
            </div>
            <div className="clear30"/>
        </section>
    )
})