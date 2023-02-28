import {emit, view} from "../../framework";
import salesforceStore from '../../stores/salesforceStore'


@view
export default class QSWidget extends React.Component {


    state = {
        optionsPanelExpanded: true,
    }

    render() {
        const {commissions, SelectedPayDate} = salesforceStore


        console.log("COM ", commissions)


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
            for (let i = 0; i < keys.length; i++) {
                let keyValue = keys[i]
                let today = new Date()
                // let payDate = new Date(commissions[i].PayDate)
                // if (today > payDate) {
                //     earned += commissions[i].Commission
                // }
                // else {
                //     pending += commissions[i].Commission
                // }


                // commissions[keyValue].CommissionInfo.forEach((commission) => {
                //
                //     if (commission.FMSitCom) {
                //         // let tempVal = commission.OpportunityId
                //         // if(tempVal !== commission.OpportunityId){
                //         console.log("commission FM ", commission)
                //
                //         // }
                //
                //     }
                // })
            }
        }

        let fmCom = 0


        return (

            <div className="panel  panel-default">
                <div className="panel-heading">
                    <div style={{display: "flex"}}>
                        <div style={{flex: "1", textAlign: "left"}}>
                            QUALITY SITS EARNINGS
                            <span
                                style={{cursor: "pointer", float: "right"}}
                                className={"glyphicon glyphicon-chevron-" + (this.state.optionsPanelExpanded ? 'down' : 'up')}
                                onClick={() => this.setState({optionsPanelExpanded: !this.state.optionsPanelExpanded})}>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="panel-body" style={{padding: "0px"}}>
                    <table className="table table-striped"
                           style={(this.state.optionsPanelExpanded ? {display: "none", marginBottom: "0px"} : {display: "table", marginBottom: "0px"})}>
                        <thead style={{fontSize: "13px"}}>
                        <tr>
                            {/*<th >FM Name</th>*/}
                            <th>Customer Name</th>
                            <th>Date</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            commissions ? keys.map((key, idx) => {
                                let today = new Date()
                                let currentMonth = today.getMonth() + 1
                                let payDate = new Date(key)
                                let payMonth = payDate.getMonth() + 1
                                let keyDate = new Date(key)
                                let tempId = ""
                                let currentWeekDate = new Date()
                                currentWeekDate.setDate(currentWeekDate.getDate() - currentWeekDate.getDay())
                                let now = new Date(currentWeekDate)
                                let currentWeekEnd = now.setDate(currentWeekDate.getDate() + 6)
                                // let  currentWeekEnd = now.toIsoString()
                                // console.log("start currentWeek ",  currentWeekDate, "end currentWeek ", currentWeekEnd )
                                //start next week
                                let nextStart = new Date(currentWeekDate)
                                nextStart.setDate(nextStart.getDate() + 7)
                                let nextEnd = new Date(nextStart)
                                nextEnd.setDate(nextEnd.getDate() + 6)
                                // console.log("start nextWeek ",  nextStart, "end nextWeek ", nextEnd )
                                // console.log("KEY ", commissions[key].ComissionInfo[0].CustomerName)
                                // console.log("payMonth ", payMonth)
                                // console.log("thisMonth ", currentMonth)
                                let rows = []


                                commissions[key].CommissionInfo.forEach((commission) => {

                                    if (commission.FMSitCom) {
                                        if (payDate > currentWeekDate && payDate < nextEnd) {

                                            if(tempId !==  commission.OpportunityId){
                                                fmCom += commission.FMSitCom
                                                tempId = commission.OpportunityId
                                            }




                                            console.log(" key qswid ", key)
                                            rows = [
                                                <tr key={key} className={idx % 2 ? '' : 'greyColor active'}>
                                                    {/*<td className="greyColor">{commission.FM}</td>*/}
                                                    <td className="greyColor">{commission.OpportunityName}</td>
                                                    {/*<td className="greyColor">{'$' + commission.FMCommission.toLocaleString()}</td>*/}
                                                    {/*<td className="greyColor"></td>*/}
                                                    <td className="greyColor">{key}</td>
                                                </tr>
                                            ]
                                        }
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
                        <h1 className="small-qt">${fmCom.toFixed(2)}</h1>
                    </div>
                </div>
            </div>
        )
    }
}
