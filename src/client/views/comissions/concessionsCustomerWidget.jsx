import {emit, view} from "../../framework";
import salesforceStore from '../../stores/salesforceStore'



@view
export default class CustomerConcessions extends React.Component {


    state = {
        optionsPanelExpanded: true,
    }

    render() {
        const { commissions, SelectedPayDate } = salesforceStore

        // console.log("COM ", commissions)


        let earned = 0
        let pending = 0
        let keys = {}
        if (commissions !== null) {
            keys = Object.keys(commissions)
            keys.sort((a, b) => {
                if (a > b) {
                    return -1;
                }
                if (a < b) {
                    return 1;
                }

                return 0;
            })
            // console.log(keys)
            for (let i = 0; i < commissions.length; i++) {
                let today = new Date()
                let payDate = new Date(commissions[i].PayDate)
                if (today > payDate) {
                    earned += commissions[i].Commission
                }
                else {
                    pending += commissions[i].Commission
                }
            }
        }

        let currentWeekDate = new Date()
        currentWeekDate.setDate(currentWeekDate.getDate() - currentWeekDate.getDay())
        let now = new Date(currentWeekDate)
        now.setDate(currentWeekDate.getDate() + 6)
        let currentWeekEnd = now.toIsoString()
        // console.log("start currentWeek ",  currentWeekDate, "end currentWeek ", currentWeekEnd )
        //start next week
        let nextStart = new Date(currentWeekDate)
        nextStart.setDate(nextStart.getDate() + 7)
        let nextEnd = new Date(nextStart)
        nextEnd.setDate(nextEnd.getDate() + 6)
        // console.log("start nextWeek ",  nextStart, "end nextWeek ", nextEnd )
        let concessionsAmount = 0


        return (

            <div className="panel  panel-default">
                <div className="panel-heading">
                    <div style={{display: "flex"}}>
                        <div style={{flex: "1", textAlign: "left"}}>
                            CUSTOMER CONCESSIONS
                            <span id="concessions"
                                style={{cursor: "pointer", float: "right"}}
                                className={"glyphicon glyphicon-chevron-" + (this.state.optionsPanelExpanded ? 'down' : 'up')}
                                onClick={() => this.setState({optionsPanelExpanded: !this.state.optionsPanelExpanded})}>
                                <div className="popover fade top in"
                                     style={ this.state.optionsPanelExpanded ? {top: "-44px", right: "-59px", left: "auto", width: "132px"}  : {top: "-44px", right: "-65px", left: "auto", width: "140px"}  }>
                                <div className="arrow"></div>
                                    {/*<h3 className="popover-title" style={{color: "#333333"}}>Scores</h3>*/}
                                    <div className="popover-content" style={{color: "#333333", padding: "9px"}}>
                                    {(this.state.optionsPanelExpanded ? "See detailed info"  : "See Overall Number" )}
                                </div>
                            </div>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="panel-body" style={{  padding: "0px" }}>

                   <table className="table table-striped"  style={(this.state.optionsPanelExpanded ? {display: "none", marginBottom: "0px"} : {
                       display: "table", marginBottom: "0px"
                   })}>
                       <thead style={{fontSize: "13px"}}>
                           <tr>
                                <th >Customer Name</th>
                                <th > Amount</th>
                           </tr>
                       </thead>
                       <tbody>
                       {
                           commissions ? keys.map((key, idx) => {
                               let today = new Date()
                               let currentMonth = today.getMonth() + 1
                               let payDate = new Date(key)
                               let payMonth = payDate.getMonth() + 1
                               let rows = []

                               commissions[key].CommissionInfo.forEach((commission) => {
                                   // console.log("commission.Concessions ", commission.Concessions)
                                   if (payDate > currentWeekDate && payDate < nextEnd) {
                                       // if(expectedPayDate && expectedPayDate < nextEnd ) {
                                       // console.log("expectedPayDate and nextend", expectedPayDate, nextEnd)
                                       concessionsAmount += commission.Concessions
                                       // console.log("concessionsAmount ", concessionsAmount)

                                       rows = [
                                           <tr key={key} className={idx % 2 ? '' : 'even-column'} onClick={() => {
                                               emit.ClickedCommissionsRow({PayDate: key})
                                           }}>
                                               <td className="greyColor">{commission.CustomerName }</td>
                                               {/*<td className="greyColor">{'$' + commission.Commission.toLocaleString()}</td> */}
                                               <td className="greyColor">${ commission.Concessions !== null ? commission.Concessions.toFixed(2) : "0" }</td>
                                           </tr>
                                       ]
                                   }
                               })

                               return (
                                   rows
                               )
                           }) : null
                       }
                       </tbody>
                   </table>
                    <div style={(this.state.optionsPanelExpanded ? {display: "block"} : {
                        display: "none"
                    })}>
                        <h1 className="small-qt">-${concessionsAmount.toFixed(2)}</h1>
                    </div>
                </div>
            </div>
        )
    }
}
