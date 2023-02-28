


import {emit, view} from "../../framework";
import salesforceStore from '../../stores/salesforceStore'
import projectionStore from "../../stores/projectionStore"
import sessionStore from "../../stores/sessionStore";

export default view(function PerformanceWidget() {
    // const {fmStats, sortByFM} = fmStore
    const {fieldMarketers, staticSort, reverseSort} = salesforceStore
    const {projections} = projectionStore
    const {user} = sessionStore

    let fullName = user.firstName + " " + user.lastName

    // console.log("projections ", projections)

    let today = new Date()

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]

    const monthNumber = today.getMonth()

    let repsBreakdown = JSON.parse(projections[18].reps_projection)

    console.log("repsBreakdown ", repsBreakdown)

    function businessDays(date) {
        // Copy date
        let t = new Date(date);
        // console.log("t ", t)
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

    // console.log("business days ", businessDays(today))
    let projectionDays = businessDays(today)
    let daysUsed = projectionDays[0]
    let remainingDays = projectionDays[1]
    console.log("daysUsed and remainingDays ", daysUsed, remainingDays)

    return (
        <div className="panel  panel-default" style={{boxShadow: "0 1px 24px 0 rgba(0,0,0,.25)"}}>
            <div className="panel-heading">
                <div style={{display: "flex"}}>
                    <div style={{
                        flex: "1",
                        textAlign: "left"
                    }}>{monthNames[monthNumber]} {today.getFullYear()} Projection
                    </div>
                    <div style={{flex: "1", textAlign: "right"}}>Day {daysUsed} out of {remainingDays + daysUsed}</div>
                </div>
            </div>
            <div id="projection-body" className="panel-body" style={{padding: "0px"}}>
                <table style={{width: "100%", textAlign: "center"}}>
                    <thead style={{fontSize: "13px"}}>

                    <tr>
                        <th colSpan='4' style={{textAlign: "center", background: "rgb(231, 146, 54)", color: "#fff", padding: "2px"}}>Company Scheduled Installs
                        </th>
                    </tr>
                    <tr style={{background: "#b3b3b3"}}>
                        <th style={{textAlign: "center"}}>Target</th>
                        <th style={{textAlign: "center"}}>MTD</th>
                        <th style={{textAlign: "center"}}>Pace</th>
                        <th style={{textAlign: "center"}}>Need Today</th>
                    </tr>
                    </thead>
                    {   
                        projections.length > 0 ?
                            projections.filter(item => item.start_date === "2022-01-01T00:00:00.000Z").map((item) => {
                                return (
                                    <tbody>
                                        <tr>
                                            <th style={{textAlign: "center"}}>{item.target_installs}</th>
                                            <th style={{textAlign: "center"}}>{ item.mtd }</th>
                                            <th style={{textAlign: "center"}}>{((item.mtd / (daysUsed )) * (daysUsed + remainingDays)).toFixed(0)}</th>
                                            <th style={{textAlign: "center"}}>{remainingDays > 0 ? ((item.target_installs - item.mtd) / ((daysUsed + remainingDays) - (daysUsed))).toFixed(0) : (item.target_installs - item.mtd)}</th>
                                        </tr>
                                    </tbody>
                                )
                            })
                            : null
                    }
                </table>
                {
                    repsBreakdown.length > 0 ?
                            repsBreakdown.filter(rep => rep.Name === fullName).map((rep) => {
                          return(
                              <table style={{width: "100%", textAlign: "center"}}>
                                  <thead style={{fontSize: "13px"}}>

                                  <tr>
                                      <th colSpan='4' style={{textAlign: "center", background: "rgb(231, 146, 54)", color: "#fff", padding: "2px"}}>Personal Scheduled Installs
                                      </th>
                                  </tr>
                                  <tr style={{background: "#b3b3b3"}}>
                                      <th style={{textAlign: "center"}}>Target</th>
                                      <th style={{textAlign: "center"}}>MTD</th>
                                      <th style={{textAlign: "center"}}>Pace</th>
                                      <th style={{textAlign: "center"}}>Need Today</th>
                                  </tr>
                                  </thead>
                                  <tbody>
                                      <tr>
                                          <th style={{textAlign: "center"}}>{rep.Target}</th>
                                          <th style={{textAlign: "center"}}>{rep.MTD}</th>
                                          <th style={{textAlign: "center"}}>{((rep.MTD / daysUsed ) * (daysUsed + remainingDays)).toFixed(0)}</th>
                                         <th style={{textAlign: "center"}}>{remainingDays > 0 ? ((rep.Target - rep.MTD) / ((daysUsed + remainingDays) - (daysUsed))).toFixed(0) : (rep.Target - rep.MTD)}</th>
                                      </tr>
                                  </tbody>
                              </table>
                          )
                        })
                        : null
                }

                {/*<div className="row">*/}

                {/*    <div className="col-md-4">*/}
                {/*        Target: <strong></strong>*/}
                {/*    </div>*/}
                {/*    <div className="col-md-4">*/}
                {/*        Pace:*/}
                {/*    </div>*/}
                {/*    <div className="col-md-4">*/}
                {/*        Need Today:*/}
                {/*    </div>*/}
                {/*</div>*/}
            </div>
        </div>
    )
})