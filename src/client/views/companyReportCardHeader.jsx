import {emit, view} from "../framework";

export default view(function ReportHeader() {

    function changeQuarter() {
        let timePeriod = document.getElementById('periodSelectChart').value
        console.log("change quarter ", timePeriod)
        emit.GetWeeksReport({quarter: timePeriod})
        // emit.GetWeeksReport({quarter: 'current'})
    }

    return (
        <div className="panel-heading" style={{paddingBottom: "0px", border: "none"}}>
            <div style={{display: "flex"}}>
                <div style={{flex: "1", textAlign: "left"}}>
                    <h4>Company Report Card </h4>
                </div>
                <div className="input-group" style={{maxWidth: "175px", flex: "1"}}>
                                    <span id="custom_date_btn" className="input-group-addon" style={{cursor: "pointer"}}
                                        // onClick={() => emit.DatePickerChange("custom_date")}
                                    >
                                        <div id="custom-popover" className="popover fade top in"
                                             style={{top: "-46px", left: "-44%"}}>
                                              <div className="arrow"/>
                                            {/*<h3 className="popover-title" style={{color: "#333333"}}>Scores</h3>*/}
                                            <div className="popover-content" style={{color: "#333333", padding: "9px"}}>
                                             Use Custom Date Selector
                                            </div>
                                        </div>
                                         <span className="glyphicon glyphicon-calendar"/>
                                    </span>
                    <select
                        className={"period form-control dropdown block"}
                        style={{display: "inline", float: "right", color: "black"}}
                        id="periodSelectChart"
                        onInput={changeQuarter.bind(this)}
                        defaultValue={'This Week'}
                    >
                        <option value="current">Current CQ</option>
                        <option value="previous and current">Previous and CQ</option>
                    </select>
                </div>


            </div>
        </div>

    )
})

