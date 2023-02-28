import {emit, view} from "../../framework"
import salesforceStore from '../../stores/salesforceStore'
import sessionStore from '../../stores/sessionStore'


@view
export default class AssistEarningsWidget extends React.Component {

    state = {
        optionsPanelExpanded: true,
    }

    render() {
        const {residentialProjectsCommissions, currentWeekStartDate, currentWeekEndDate, SelectedPayDate, nextWeekStartDate, nextWeekEndDate} = salesforceStore
        const {user} = sessionStore

        let currentWeekTotal = 0
        let nextWeekTotal = 0
        let currentWeekCommissions = []
        let nextWeekCommissions = []
         let accountId = user.accountId === null ? "0013m000029RgdeAAC" : user.accountId

        // residentialProjectsCommissions.length > 0 ?
        residentialProjectsCommissions.filter(currentAssist => currentAssist.Field_Marketer1__c === accountId && currentAssist.Expected_Pay_Date__c > currentWeekStartDate && currentAssist.Expected_Pay_Date__c < currentWeekEndDate).map((currentAssist) => {
            currentWeekTotal += currentAssist.FM_Assist_Commission__c
            currentWeekCommissions.push(currentAssist)

        })
        residentialProjectsCommissions.filter(nextAssist => nextAssist.Field_Marketer1__c === accountId && nextAssist.Expected_Pay_Date__c > nextWeekStartDate && nextAssist.Expected_Pay_Date__c < nextWeekEndDate).map((nextAssist) => {
            nextWeekTotal += nextAssist.FM_Assist_Commission__c
            nextWeekCommissions.push(nextAssist)
        })
        // : 0


        return (
            <div className="panel  panel-default">
                <div className="panel-heading">
                    <div style={{display: "flex"}}>
                        <div style={{flex: "1", textAlign: "left"}}>
                            ASSISTS
                            <span
                                style={{cursor: "pointer", float: "right"}}
                                className={"glyphicon glyphicon-chevron-" + (this.state.optionsPanelExpanded ? 'down' : 'up')}
                                onClick={() => this.setState({optionsPanelExpanded: !this.state.optionsPanelExpanded})}>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="panel-body" style={{padding: "0px"}}>
                    <table className="table table-responsive table-striped"
                           style={this.state.optionsPanelExpanded ? {
                               display: "none",
                               marginBottom: "0px"
                           } : {display: "table", marginBottom: "0px"}}>
                        <thead style={{fontSize: "13px"}}>
                        <tr style={{background: "#e79236"}}>
                            <td colSpan='4' className="text-center " style={{color: "#fff"}}>This Week</td>
                        </tr>
                        <tr>
                            {/*<td>Residential Project Id</td>*/}
                            <td>Customer Name</td>
                            <td>Assist Commission</td>
                            {/*<td>FM</td>*/}
                            <td>Date</td>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            currentWeekCommissions.length > 0 ?
                                currentWeekCommissions.map((comAss) => {
                                    return (
                                        <tr>
                                            {/*<td>*/}
                                            {/*    {projectCommissions.Id}*/}
                                            {/*</td>*/}
                                            <td>
                                                {comAss.Name}
                                            </td>
                                            <td>
                                                ${comAss.FM_Assist_Commission__c ? comAss.FM_Assist_Commission__c.toFixed(2) : 0}
                                            </td>
                                            {/*<td>*/}
                                            {/*    {projectCommissions.Field_Marketer1__c}*/}
                                            {/*</td>*/}
                                            <td>
                                                {comAss.Expected_Pay_Date__c}
                                            </td>
                                        </tr>
                                    )
                                })
                                : <tr><td colSpan='4'  className="text-center">No Assists Found</td></tr>
                        }
                        </tbody>
                        <thead style={{fontSize: "13px"}}>
                        <tr style={{background: "#e79236"}}>
                            <td colSpan='4' className="text-center " style={{color: "#fff"}}>Next Week</td>
                        </tr>
                        <tr>
                            {/*<td>Residential Project Id</td>*/}
                            <td>Customer Name</td>
                            <td>Assist Commission</td>
                            {/*<td>FM</td>*/}
                            <td>Date</td>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            nextWeekCommissions.length > 0 ?
                                nextWeekCommissions.map((comNextAss) => {
                                    return (
                                        <tr>
                                            {/*<td>*/}
                                            {/*    {projectCommissions.Id}*/}
                                            {/*</td>*/}
                                            <td>
                                                {comNextAss.Name}
                                            </td>
                                            <td>
                                                ${comNextAss.FM_Assist_Commission__c ? comNextAss.FM_Assist_Commission__c.toFixed(2) : 0}
                                            </td>
                                            {/*<td>*/}
                                            {/*    {projectCommissions.Field_Marketer1__c}*/}
                                            {/*</td>*/}
                                            <td>
                                                {comNextAss.Expected_Pay_Date__c}
                                            </td>
                                        </tr>
                                    )
                                })
                                : <tr><td colSpan='4'  className="text-center">No Assists Found</td></tr>
                        }
                        </tbody>
                    </table>
                    <div style={(this.state.optionsPanelExpanded ? {display: "block"} : {
                        display: "none"
                    })}>
                        <br/>
                        <p style={{textAlign: "center", margin: "0px"}}>THIS WEEK</p>
                        <h1 className="small-qt">
                            ${currentWeekTotal > 0 ? currentWeekTotal.toFixed(2) : 0}
                        </h1>
                        <p style={{textAlign: "center", margin: "0px"}}>NEXT WEEK</p>
                        <h1 style={{
                            textAlign: "center",
                            fontWeight: "bold",
                            color: "#70899f",
                            margin: "0px"
                        }}>${nextWeekTotal > 0 ? nextWeekTotal.toFixed(2) : 0}</h1>
                        <br/>
                    </div>
                </div>
            </div>


        )
    }
}