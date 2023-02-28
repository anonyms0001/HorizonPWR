import {view, emit} from '../../framework'
import {Link} from 'react-router-dom'
import projectionStore from "../../stores/projectionStore"


export default view(function ProjectionBreakdown({match}) {
    const {projectionBreakdownState, dashboardState, processingRedirect, currentMonthProjections, projections} = projectionStore
    let {projectionId} = match.params
    console.log("PARAM ", projectionId)
    const projection = projections.find(projection => projection.id == projectionId)
    console.log("projection BREAK ", projection)


    console.log("currentMonthProjections ", currentMonthProjections)

    function changeBreakdownState(state) {
        // console.log("state ", state)
        emit.ClickedChangeBreakdownStatus({action: state})
    }

    emit.ResetDashStateVal()
    // console.log("projectionBreakdownState ", projectionBreakdownState)
    let today = new Date()
    const absoluteToday = today.getFullYear() + '-' + ((today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1))
    let monthDay = today.getDate()


    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]

    let monthNumber = new Date(projection.start_date).getMonth()
    monthNumber = monthNumber + 1

    let repsBreakdown = JSON.parse(projection.reps_projection)

    let rangeOptions = []
    let companyRangeOptions = []


    for (let i = 0; i <= 20; i++) {
        rangeOptions.push(i);
    }
    for (let i = 0; i <= 300; i++) {
        companyRangeOptions.push(i);
    }

    function submitCompanyForm() {
        console.log("tried to submit form", projection.id + "-company-target")
        // document.forms[projection.id + "-company-target"].submit()
        // document.getElementById(projection.id + '-company-form').submit()
        // document.getElementById(projection.id + '-submit-form').submit()
        document.getElementById(projection.id + '-submit-form').click()
    }

    function submitECForm(RepName, key) {
        console.log("submitECForm repname ", RepName, key)
        // const target = key + "-rep-target"
        // const projection = key + "-rep-projection"
        // console.log("target and projection", target, projection)
        let targetVal = document.getElementById(key + "-rep-target").value
        // let projectionVal = document.getElementById(key + "-rep-projection").value
        console.log("target and projection vals ", targetVal)
        let updatedGoals = []
        for (let i = 0; i < repsBreakdown.length; i++) {
            if (repsBreakdown[i].Name === RepName) {
                repsBreakdown[i].Target = targetVal
                updatedGoals.push(repsBreakdown[i])
            } else {
                updatedGoals.push(repsBreakdown[i])
            }
        }
        console.log("updatedGoals ", updatedGoals)
        emit.UpdateProjectionReps({projectionId: projection.id, updatedGoals: updatedGoals})
    }

    function businessDays(date) {
        // Copy date
        let t = new Date(date);
        console.log("t ", t)
        // Remember the month number
        let m = date.getMonth();
        let d = date.getDate();
        let daysPast = 0, daysToGo = 0;
        let day;

        // Count past days
        while (t.getMonth() == m) {
            day = t.getDay();
            daysPast += (day == 0 || day == 7) ? 0 : 1;
            t.setDate(--d);
        }

        // Reset and count days to come
        t = new Date(date);
        t.setDate(t.getDate() + 1);
        d = t.getDate();

        while (t.getMonth() == m) {
            day = t.getDay();
            daysToGo += (day == 0 || day == 7) ? 0 : 1;
            t.setDate(++d);
        }
        return [daysPast, daysToGo];
    }

    console.log("business days ", businessDays(today))
    let projectionDays = businessDays(today)
    let daysUsed = projectionDays[0]
    let remainingDays = projectionDays[1]


    return (
        <section id='projection-breakdown' className="pwrstation-view-profile ">
            <div className="shadowbox">
                <div id="resultbox"/>
                <div className="row">
                    <div className="col-md-12">
                        <h1 style={{float: "left"}}>Company {monthNames[monthNumber]} Projection </h1>
                        <h4 style={{float: "right", paddingTop: "18px"}}>Day {daysUsed} out
                            of {remainingDays + daysUsed}</h4>
                        <form id={projection.id + '-company-form'} name={projection.id + '-company-form'} action=""
                              onSubmit={e => {
                                  e.preventDefault()
                                  emit.UpdateProjectionCompany({
                                      projectionId: projection.id,
                                      target: document.getElementById(projection.id + "-company-target").value,
                                      // projection: document.getElementById(projection.id + "-company-projection").value,
                                  })
                              }}
                        >
                            <div >
                                <table id='company-projection-table' className="table table-bordered table-striped">
                                    <thead>
                                    <tr>
                                        <th> Target SI</th>
                                        <th>Pace</th>

                                        <th>MTD SI</th>
                                        <th>Need Today</th>
                                        {/*<th>Actions</th>*/}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <th>
                                            <div className="form-group">
                                                <select id={projection.id + "-company-target"} className="form-control"
                                                        defaultValue={projection.target_installs}
                                                        onInput={submitCompanyForm.bind(this)}>
                                                    {
                                                        companyRangeOptions.map((companyOption) => {
                                                            return (
                                                                <option>
                                                                    {companyOption}
                                                                </option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                            </div>
                                        </th>
                                        <th>
                                            {((projection.mtd / (daysUsed - 1)) * (daysUsed + remainingDays)).toFixed(0)}
                                        </th>
                                        <th>{projection.mtd}
                                            <button style={{display: "none"}} id={projection.id + '-submit-form'}
                                                    type="submit">submit
                                            </button>
                                        </th>
                                       <th>{remainingDays > 0 ?  ((projection.target_installs - projection.mtd) / ((daysUsed + remainingDays) - (daysUsed))).toFixed(0) : (projection.target_installs - projection.mtd)}</th>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </form>
                        <h1>Closers {monthNames[monthNumber]} Projection </h1>
                        <div style={{overflowX: "auto"}}>
                            <form id={projection.id + '-ec-form'} name={projection.id + '-ec-form'} action=""
                                  onSubmit={e => {
                                      e.preventDefault()
                                      emit.UpdateProjectionReps({
                                          // projectionId: projection.id,
                                          // target: document.getElementById(projection.id + "-company-target").value,
                                          // projection: document.getElementById(projection.id + "-company-projection").value,
                                      })
                                  }}
                            >
                                <table id='reps-projection-table' className="table table-bordered table-striped">
                                    <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th> Target SI</th>
                                        <th style={{textAlign: "center"}}>Pace</th>
                                        <th style={{textAlign: "center"}}>MTD SI</th>
                                        <th style={{textAlign: "center"}}>Need Today</th>
                                    </tr>
                                    </thead>
                                    {
                                        repsBreakdown.length > 0 ?
                                            repsBreakdown.map((rep, key) => {
                                                return (
                                                    <tbody>

                                                    <tr key={key}>
                                                        <th>{rep.Name} <i style={{opacity: "0.1"}}
                                                                          className='glyphicon glyphicon-envelope'/>
                                                        </th>
                                                        <th>
                                                            <div className="form-group">
                                                                <select id={key + "-rep-target"}
                                                                        className="form-control"
                                                                        defaultValue={rep.Target}
                                                                        onInput={submitECForm.bind(this, rep.Name, key)}
                                                                >
                                                                    {
                                                                        rangeOptions.map((option) => {
                                                                            return (
                                                                                <option value={option}>
                                                                                    {option}
                                                                                </option>
                                                                            )
                                                                        })
                                                                    }
                                                                </select>
                                                            </div>
                                                        </th>
                                                        <th style={{textAlign: "center"}}>
                                                           {((rep.MTD / daysUsed) * (daysUsed + remainingDays)).toFixed(2)}
                                                        </th>
                                                        <th style={{textAlign: "center"}}>
                                                            {rep.MTD}
                                                            <button style={{display: "none"}} type='submit'
                                                                    form={projection.id + '-company-form'}>s
                                                            </button>
                                                        </th>
                                                        <th style={{textAlign: "center"}}>
                                                        {remainingDays > 0 ? ((rep.Target - rep.MTD) / ((daysUsed + remainingDays) - (daysUsed))).toFixed(2) : (rep.Target - rep.MTD)}
                                                        </th>
                                                    </tr>
                                                    </tbody>
                                                )
                                            })
                                            : null
                                    }
                                </table>
                            </form>
                        </div>
                        <br/>
                        {/*<button className='btn btn-success' onClick={changeBreakdownState.bind(this, "create")}>Add Rep*/}
                        {/*    Info*/}
                        {/*</button>*/}
                        {/*<Link style={{marginTop: "20px"}} className="btn btn-default"*/}
                        {/*      to={`/projectionDash`}*/}
                        {/*>*/}
                        {/*    &nbsp; Go To Dashboard*/}
                        {/*</Link>*/}
                    </div>
                </div>
            </div>
        </section>
    )
})

