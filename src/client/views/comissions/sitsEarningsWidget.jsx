import {emit, view} from "../../framework";
import salesforceStore from '../../stores/salesforceStore'



@view
export default class SitsEarningWidget extends React.Component {


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


        return (

            <div className="panel  panel-default">
                <div className="panel-heading">
                    <div style={{display: "flex"}}>
                        <div style={{flex: "1", textAlign: "left"}}>
                            QUALITY SIT EARNINGS
                            <span
                                style={{cursor: "pointer", float: "right"}}
                                className={"glyphicon glyphicon-chevron-" + (this.state.optionsPanelExpanded ? 'down' : 'up')}
                                onClick={() => this.setState({optionsPanelExpanded: !this.state.optionsPanelExpanded})}>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="panel-body" style={(this.state.optionsPanelExpanded ? { display : "block" } : {display : "none"})}>
                   <table>
                       <tbody>
                       {
                           commissions ? keys.map((key, idx) => {
                               let today = new Date()
                               let currentMonth = today.getMonth() + 1
                               let payDate = new Date(key)
                               let payMonth = payDate.getMonth() + 1
                               // console.log("KEY ", commissions[key].ComissionInfo[0].CustomerName)
                               console.log("payMonth ", payMonth)
                               console.log("thisMonth ", currentMonth)
                               const rows = [
                                   <tr key={key} className={idx % 2 ? '' : 'even-column'} onClick={() => {emit.ClickedCommissionsRow({ PayDate: key })}}>
                                       <td className="greyColor">{commissions[key].ComissionInfo[0].CustomerName}</td>
                                       <td className="greyColor">{currentMonth === payMonth ? key : ""} </td>
                                       <td className="greyColor">{'$ ' + commissions[key].TotalCommissions.toLocaleString()}</td>
                                       <td className="greyColor"></td>
                                       <td className="greyColor"></td>

                                   </tr>
                               ]

                               if (key === SelectedPayDate) {


                                   const details = Object.values(commissions[key].ComissionInfo)

                                   commissions[key].ComissionInfo.forEach((commission) => {
                                       rows.push(
                                           <tr key={key} className={idx % 2 ? '' : 'greyColor active'} onClick={() => {emit.ClickedCommissionsRow({ PayDate: key })}}>
                                               <td className="greyColor"></td>
                                               <td className="greyColor">{'$' + commission.Commission.toLocaleString()}</td>
                                               <td className="greyColor">{commission.CustomerName}</td>
                                               <td className="greyColor">{commission.SystemSize + 'kW'}</td>
                                               <td className="greyColor">{commission.Deductions ? commission.Deductions : '0'}</td>
                                           </tr>
                                       )
                                   })
                               }
                               return (
                                   rows
                               )
                           }) : null
                       }
                       </tbody>
                   </table>
                </div>
            </div>
        )
    }
}
