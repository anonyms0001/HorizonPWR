import {emit, view} from "../../framework"
import sessionStore from '../../stores/sessionStore'
import salesforceStore from '../../stores/salesforceStore'


@view
export default class BackendCommission extends React.Component {


    state = {
        optionsPanelExpanded: true,
    }

    render() {
        const {residentialProjectsCommissions, currentWeekStartDate, currentWeekEndDate, SelectedPayDate, nextWeekStartDate, nextWeekEndDate} = salesforceStore
        const {user} = sessionStore

        let ecCommissions = 0
        let currentWeekCommissions = []
        let nextWeekCommissions = []
        // let commissionsLength = 0
        let currentTotalCommissions = 0
        let nextTotalCommissions = 0


        residentialProjectsCommissions.filter(currentWeekBackCommission => currentWeekBackCommission.Account__c === user.accountId && !currentWeekBackCommission.X2nd_Commission_Paid__c && currentWeekBackCommission.X2nd_Commission_Due_Date__c >= currentWeekStartDate && currentWeekBackCommission.X2nd_Commission_Due_Date__c <= currentWeekEndDate || currentWeekBackCommission.Account__c === user.accountId && currentWeekBackCommission.X2nd_Commission_Paid__c && currentWeekBackCommission.X2nd_Commission_Paid_Date__c >= currentWeekStartDate && currentWeekBackCommission.X2nd_Commission_Paid_Date__c <= currentWeekEndDate).map((currentWeekBackCommission) => {
            currentTotalCommissions += currentWeekBackCommission.X2nd_Commission_Amount__c
            currentWeekCommissions.push({
                Name: currentWeekBackCommission.Name,
                Commission: currentWeekBackCommission.X2nd_Commission_Amount__c ? '$ ' + currentWeekBackCommission.X2nd_Commission_Amount__c.toFixed(2) : 0,
                Date: currentWeekBackCommission.X2nd_Commission_Paid_Date__c != null ? currentWeekBackCommission.X2nd_Commission_Paid_Date__c : currentWeekBackCommission.X2nd_Commission_Due_Date__c
            })
        })

        residentialProjectsCommissions.filter(nextWeekBackCommission => nextWeekBackCommission.Account__c === user.accountId && !nextWeekBackCommission.X2nd_Commission_Paid__c && nextWeekBackCommission.X2nd_Commission_Due_Date__c >= nextWeekStartDate && nextWeekBackCommission.X2nd_Commission_Due_Date__c <= nextWeekEndDate || nextWeekBackCommission.Account__c === user.accountId && nextWeekBackCommission.X2nd_Commission_Paid__c && nextWeekBackCommission.X2nd_Commission_Paid_Date__c >= nextWeekStartDate && nextWeekBackCommission.X2nd_Commission_Paid_Date__c <= nextWeekEndDate).map((nextWeekBackCommission) => {
            nextTotalCommissions += nextWeekBackCommission.X2nd_Commission_Amount__c
            nextWeekCommissions.push({
                Name: nextWeekBackCommission.Name,
                Commission:  nextWeekBackCommission.X2nd_Commission_Amount__c ? '$ ' + nextWeekBackCommission.X2nd_Commission_Amount__c.toFixed(2) : 0,
                Date: nextWeekBackCommission.X2nd_Commission_Paid_Date__c != null ? nextWeekBackCommission.X2nd_Commission_Paid_Date__c : nextWeekBackCommission.X2nd_Commission_Due_Date__c
            })
        })


        return (

            <div className="panel  panel-default">
                <div className="panel-heading">
                    <div style={{display: "flex"}}>
                        <div style={{flex: "1", textAlign: "left"}}>
                            BACKEND
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
                            <td>Amount</td>
                            <td>Commission Date</td>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            currentWeekCommissions.length > 0 ?
                                currentWeekCommissions.map((currentBackWeekCommission, index) => {
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
                                                {currentBackWeekCommission.Name}
                                            </td>
                                            <td>
                                                {currentBackWeekCommission.Commission}
                                            </td>
                                            {/*<td>*/}
                                            {/*    {projectCommissions.Field_Marketer1__c}*/}
                                            {/*</td>*/}
                                            <td>
                                                {currentBackWeekCommission.Date}
                                            </td>
                                        </tr>
                                    )
                                })
                                : <tr>
                                    <td colSpan='4' className="text-center">No Commissions Found</td>
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
                            <td>Amount</td>
                            <td>Commission Date</td>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            nextWeekCommissions.length > 0 ?
                                nextWeekCommissions.map((nextBackWeekCommissions, index) => {
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
                                                {nextBackWeekCommissions.Name}
                                            </td>
                                            <td>
                                                {nextBackWeekCommissions.Commission}
                                            </td>
                                            {/*<td>*/}
                                            {/*    {projectCommissions.Field_Marketer1__c}*/}
                                            {/*</td>*/}
                                            <td>
                                                {nextBackWeekCommissions.Date}
                                            </td>
                                        </tr>
                                    )
                                })
                                : <tr>
                                    <td colSpan='4' className="text-center">No Commissions Found</td>
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
                            ${currentTotalCommissions ? currentTotalCommissions.toFixed(2) : 0}
                        </h1>
                        <p style={{textAlign: "center", margin: "0px"}}>NEXT WEEK</p>
                        <h1 style={{
                            textAlign: "center",
                            fontWeight: "bold",
                            color: "#70899f",
                            margin: "0px"
                        }}>
                            ${nextTotalCommissions ? nextTotalCommissions.toFixed(2) : 0}
                        </h1>
                        <br/>
                    </div>
                </div>
            </div>
        )
    }
}