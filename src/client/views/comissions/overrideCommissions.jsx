import {emit, view} from "../../framework"
import sessionStore from '../../stores/sessionStore'
import salesforceStore from '../../stores/salesforceStore'

@view
export default class OverrideCommissions extends React.Component {

    state = {
        optionsPanelExpanded: true,
    }

    render() {
        const {residentialProjectsCommissions, currentWeekStartDate, currentWeekEndDate, SelectedPayDate, nextWeekStartDate, nextWeekEndDate} = salesforceStore
        const {user} = sessionStore

        let ecCommissions = 0
        let currentOverrideWeekCommissions = []
        let nextWeekOverrideCommissions = []
        let currentWeekTotalCommissions = 0
        let nextWeekTotalOverrideCommissions = 0
        residentialProjectsCommissions.filter(proj => proj.Id === "a003m00002TKgzXAAT").map((proj) => {
            console.log("OVERRIDE HRE ", proj)
        })


        residentialProjectsCommissions.filter(projectCurrentOverrideCommission => projectCurrentOverrideCommission.Account__c !== user.accountId && projectCurrentOverrideCommission.Expected_Pay_Date__c > currentWeekStartDate && projectCurrentOverrideCommission.Expected_Pay_Date__c < currentWeekEndDate).map((projectCurrentOverrideCommission, index) => {
            if (projectCurrentOverrideCommission.Parent_Account__c === '0013m000026TCwEAAW' && user.accountId === '0013m000026TCwEAAW' && projectCurrentOverrideCommission.Completion_Certificate_Signed__c && projectCurrentOverrideCommission.Parent_Override__c > 0) {
                currentWeekTotalCommissions = currentWeekTotalCommissions + projectCurrentOverrideCommission.Parent_Override__c
                currentOverrideWeekCommissions.push({
                    Name: projectCurrentOverrideCommission.Name,
                    Commission: '$ ' + projectCurrentOverrideCommission.Parent_Override__c.toFixed(2),
                    Type: 'Parent',
                    Date: projectCurrentOverrideCommission.Parent_Override_Paid_Date__c ? projectCurrentOverrideCommission.Parent_Override_Paid_Date__c : projectCurrentOverrideCommission.Expected_Pay_Date__c ? projectCurrentOverrideCommission.Expected_Pay_Date__c  : '-'
                })
            } else if (projectCurrentOverrideCommission.Manager_2_Override__c !== null && projectCurrentOverrideCommission.Manager_2__c === '0011N00001sZUeBQAW' && user.accountId === projectCurrentOverrideCommission.Manager_2__c && projectCurrentOverrideCommission.Manager_2_Override__c) {
                currentWeekTotalCommissions = currentWeekTotalCommissions + projectCurrentOverrideCommission.Manager_2_Override__c
                currentOverrideWeekCommissions.push({
                    Name: projectCurrentOverrideCommission.Name,
                    Commission: '$ ' + projectCurrentOverrideCommission.Manager_2_Override__c.toFixed(2),
                    Type: 'Manager 2',
                    Date: projectCurrentOverrideCommission.Expected_Pay_Date__c ? projectCurrentOverrideCommission.Expected_Pay_Date__c : '-'
                })
            } else if (projectCurrentOverrideCommission.Manager_3_Override__c !== null && projectCurrentOverrideCommission.Manager_3__c === user.accountId && projectCurrentOverrideCommission.Manager_3_Override__c) {
                currentWeekTotalCommissions = currentWeekTotalCommissions + projectCurrentOverrideCommission.Manager_3_Override__c
                currentOverrideWeekCommissions.push({
                    Name: projectCurrentOverrideCommission.Name,
                    Commission: '$ ' + projectCurrentOverrideCommission.Manager_3_Override__c.toFixed(2),
                    Type: 'Manager 3',
                    Date: projectCurrentOverrideCommission.Expected_Pay_Date__c ? projectCurrentOverrideCommission.Expected_Pay_Date__c : '-'
                })
            }
        })

        residentialProjectsCommissions.filter(nextWeekOverrideCommission => nextWeekOverrideCommission.Account__c !== user.accountId && nextWeekOverrideCommission.Expected_Pay_Date__c > nextWeekStartDate && nextWeekOverrideCommission.Expected_Pay_Date__c < nextWeekEndDate).map((nextWeekOverrideCommission, index) => {
            if (nextWeekOverrideCommission.Parent_Account__c === '0013m000026TCwEAAW' && user.accountId === '0013m000026TCwEAAW' && nextWeekOverrideCommission.Completion_Certificate_Signed__c && nextWeekOverrideCommission.Parent_Override__c > 0) {
                nextWeekTotalOverrideCommissions = nextWeekTotalOverrideCommissions + nextWeekOverrideCommission.Parent_Override__c
                nextWeekOverrideCommissions.push({
                    Name: nextWeekOverrideCommission.Name,
                    Commission: '$ ' + nextWeekOverrideCommission.Parent_Override__c.toFixed(2),
                    Type: 'Parent',
                    Date: nextWeekOverrideCommission.Expected_Pay_Date__c ? nextWeekOverrideCommission.Expected_Pay_Date__c : '-'
                })
            } else if ( user.accountId === nextWeekOverrideCommission.Manager_2__c && nextWeekOverrideCommission.Manager_2_Override__c > 0 ) {
                nextWeekTotalOverrideCommissions = nextWeekTotalOverrideCommissions + nextWeekOverrideCommission.Parent_Override__c
                nextWeekOverrideCommissions.push({
                    Name: nextWeekOverrideCommission.Name,
                    Commission: '$ ' + nextWeekOverrideCommission.Manager_2_Override__c.toFixed(2),
                    Type: 'Manager 2',
                    Date: nextWeekOverrideCommission.Expected_Pay_Date__c ? nextWeekOverrideCommission.Expected_Pay_Date__c : '-'
                })
            } else if (nextWeekOverrideCommission.Manager_3_Override__c !== null && nextWeekOverrideCommission.Manager_3__c === user.accountId && nextWeekOverrideCommission.Manager_3_Override__c > 0) {
                nextWeekTotalOverrideCommissions = nextWeekTotalOverrideCommissions + nextWeekOverrideCommission.Manager_3_Override__c
                nextWeekOverrideCommissions.push({
                    Name: nextWeekOverrideCommission.Name,
                    Commission: '$ ' + nextWeekOverrideCommission.Manager_3_Override__c.toFixed(2),
                    Type: 'Manager 3',
                    Date: nextWeekOverrideCommission.Expected_Pay_Date__c ? nextWeekOverrideCommission.Expected_Pay_Date__c : '-'
                })
            }
        })


        return (

            <div className="panel  panel-default">
                <div className="panel-heading">
                    <div style={{display: "flex"}}>
                        <div style={{flex: "1", textAlign: "left"}}>
                            OVERRIDES
                            <span id="fm-sit"
                                  style={{cursor: "pointer", float: "right"}}
                                  className={"glyphicon glyphicon-chevron-" + (this.state.optionsPanelExpanded ? 'down' : 'up')}
                                  onClick={() => this.setState({optionsPanelExpanded: !this.state.optionsPanelExpanded})}>
</span>
                        </div>
                    </div>
                </div>
                <div className="panel-body" style={{padding: "0px", overflowX: "auto"}}>
                    {/*{ currentWeekEarnings.length === 0 && nextWeekEarnings.length === 0 ? <h4 style={{paddingLeft: "15px"}}>No Commissions</h4> : '' }*/}
                    {/*{*/}
                    {/*    currentWeekEarnings.length > 0 ?*/}
                    {/*        <div>*/}
                    {/*<h5>This Week Commissions</h5>*/}
                    <table className="table table-striped"
                           style={(this.state.optionsPanelExpanded ? {display: "none", marginBottom: "0px"} : {
                               display: "table", marginBottom: "0px"
                           })}>
                        <thead style={{fontSize: "13px"}}>
                        <tr style={{background: "#e79236"}}>
                            <td colSpan='5' className="text-center " style={{color: "#fff"}}>This Week</td>
                        </tr>
                        <tr>
                            {/*<td>Id</td>*/}
                            {/*<td>EC</td>*/}
                            <td>#</td>
                            <td>Customer Name</td>
                            <td>Type</td>
                            <td>Amount</td>
                            <td>Paid Date</td>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            currentOverrideWeekCommissions.length > 0 ?
                                currentOverrideWeekCommissions.map((currentWeekOverrideCom, index) => {
                                    // ecCommissions += projectCommissions.FM_Assist_Commission__c
                                    return (
                                        <tr>
                                            <td>
                                                {index + 1}
                                            </td>
                                            {/*<td>*/}
                                            {/*    {projectCommissions.Id}*/}
                                            {/*</td>*/}
                                            {/*<td>*/}
                                            {/*    {projectCommissions.Account__c}*/}
                                            {/*</td>*/}
                                            <td>
                                                {currentWeekOverrideCom.Name}
                                            </td>
                                            <td>
                                                {currentWeekOverrideCom.Type}
                                            </td>
                                            <td>
                                                {currentWeekOverrideCom.Commission}
                                            </td>
                                            {/*<td>*/}
                                            {/*    {projectCommissions.Field_Marketer1__c}*/}
                                            {/*</td>*/}
                                            <td>
                                                {currentWeekOverrideCom.Date}
                                            </td>
                                        </tr>
                                    )
                                })
                                : <tr>
                                    <td colSpan='5' className="text-center">No Commissions Found</td>
                                </tr>
                        }
                        </tbody>
                        <thead style={{fontSize: "13px"}}>
                        <tr style={{background: "#e79236"}}>
                            <td colSpan='5' className="text-center " style={{color: "#fff"}}>Next Week</td>
                        </tr>
                        <tr>
                            {/*<td>Id</td>*/}
                            {/*<td>EC</td>*/}
                            <td>#</td>
                            <td>Customer Name</td>
                            <td>Type</td>
                            <td>Amount</td>
                            <td>Commission Date</td>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            nextWeekOverrideCommissions.length > 0 ?
                                nextWeekOverrideCommissions.map((nextWeekOverrideCom, index) => {
                                    // ecCommissions += projectCommissions.FM_Assist_Commission__c
                                    return (
                                        <tr>
                                            <td>
                                                {index + 1}
                                            </td>
                                            {/*<td>*/}
                                            {/*    {projectCommissions.Id}*/}
                                            {/*</td>*/}
                                            {/*<td>*/}
                                            {/*    {projectCommissions.Account__c}*/}
                                            {/*</td>*/}
                                            <td>
                                                {nextWeekOverrideCom.Name}
                                            </td>
                                            <td>
                                                {nextWeekOverrideCom.Type}
                                            </td>
                                            <td>
                                                {nextWeekOverrideCom.Commission}
                                            </td>
                                            {/*<td>*/}
                                            {/*    {projectCommissions.Field_Marketer1__c}*/}
                                            {/*</td>*/}
                                            <td>
                                                {nextWeekOverrideCom.Date}
                                            </td>
                                        </tr>
                                    )
                                })
                                : <tr>
                                    <td colSpan='5' className="text-center">No Commissions Found</td>
                                </tr>
                        }
                        </tbody>
                    </table>
                    <div style={(this.state.optionsPanelExpanded ? {display: "block", padding: "0px"} : {
                        display: "none",
                        padding: "0px"
                    })}>
                        <br/>
                        <p style={{textAlign: "center", margin: "0px"}}>THIS WEEK</p>
                        <h1 className="small-qt">
                            ${currentWeekTotalCommissions ? currentWeekTotalCommissions.toFixed(2) : 0}
                        </h1>
                        <p style={{textAlign: "center", margin: "0px"}}>NEXT WEEK</p>
                        <h1 style={{
                            textAlign: "center",
                            fontWeight: "bold",
                            color: "#70899f",
                            margin: "0px"
                        }}>
                            ${nextWeekTotalOverrideCommissions ? nextWeekTotalOverrideCommissions.toFixed(2) : 0}
                        </h1>
                        <br/>
                    </div>
                </div>
            </div>
        )
    }
}