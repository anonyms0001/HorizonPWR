import {emit, view} from "../../framework"
import sessionStore from '../../stores/sessionStore'
import salesforceStore from '../../stores/salesforceStore'


@view
export default class UpfrontCommissionHistorical extends React.Component {


    state = {
        optionsPanelExpanded: true,
    }

    render() {
        const {residentialProjectsCommissions, currentWeekStartDate, currentWeekEndDate, SelectedPayDate, nextWeekStartDate, nextWeekEndDate} = salesforceStore
        const {user} = sessionStore

        let ecCommissions = 0
        let currentWeekCommissions = []
        let pastWeekCommissions = []
        let nextWeekCommissions = []
        // let commissionsLength = 0
        let pastTotalCommissions = 0
        let currentTotalCommissions = 0
        let nextTotalCommissions = 0

        // residentialProjectsCommissions.filter(currentWeekUpfrontCommission => currentWeekUpfrontCommission.Account__c === user.accountId && currentWeekUpfrontCommission.X1st_Commission_Due_Date__c > currentWeekStartDate && currentWeekUpfrontCommission.X1st_Commission_Due_Date__c < currentWeekEndDate && currentWeekUpfrontCommission.X1st_Commission_Paid_Date__c > currentWeekStartDate && currentWeekUpfrontCommission.X1st_Commission_Paid_Date__c < currentWeekEndDate).map((currentWeekUpfrontCommission) => {
        residentialProjectsCommissions.filter(currentWeekUpfrontCommission => currentWeekUpfrontCommission.Account__c === user.accountId && currentWeekUpfrontCommission.X1st_Commission_Due_Date_new__c < currentWeekEndDate && currentWeekUpfrontCommission.X1st_Commission_Amount__c != null).map((currentWeekUpfrontCommission) => {
            if (currentWeekUpfrontCommission.X1st_Commission_Due_Date_new__c > currentWeekStartDate) {
                currentTotalCommissions += currentWeekUpfrontCommission.X1st_Commission_Amount__c
                currentWeekCommissions.push({
                    Name: currentWeekUpfrontCommission.Name,
                    Commission: currentWeekUpfrontCommission.X1st_Commission_Amount__c != null ? '$' + currentWeekUpfrontCommission.X1st_Commission_Amount__c.toFixed(2) : '$0',
                    Date: currentWeekUpfrontCommission.X1st_Commission_Due_Date_new__c
                })
            } else {
                pastTotalCommissions += currentWeekUpfrontCommission.X1st_Commission_Amount__c
                console.log("currentWeekUpfrontCommission.X1st_Commission_Amount__c ", currentWeekUpfrontCommission.X1st_Commission_Amount__c)
                pastWeekCommissions.push({
                    Name: currentWeekUpfrontCommission.Name,
                    Commission: currentWeekUpfrontCommission.X1st_Commission_Amount__c != null ? '$' + currentWeekUpfrontCommission.X1st_Commission_Amount__c.toFixed(2) : '$0',
                    Date: currentWeekUpfrontCommission.X1st_Commission_Due_Date_new__c
                })
            }
        })

        residentialProjectsCommissions.filter(nextWeekUpfrontCommission => nextWeekUpfrontCommission.Account__c === user.accountId && !nextWeekUpfrontCommission.X1st_Commission_Paid__c && nextWeekUpfrontCommission.X1st_Commission_Due_Date_new__c > nextWeekStartDate && nextWeekUpfrontCommission.X1st_Commission_Due_Date_new__c < nextWeekEndDate || nextWeekUpfrontCommission.Account__c === user.accountId && nextWeekUpfrontCommission.X1st_Commission_Paid__c && nextWeekUpfrontCommission.X1st_Commission_Paid_Date__c > nextWeekStartDate && nextWeekUpfrontCommission.X1st_Commission_Paid_Date__c < nextWeekEndDate).map((nextWeekUpfrontCommission) => {
            nextTotalCommissions += nextWeekUpfrontCommission.X1st_Commission_Amount__c
            nextWeekCommissions.push({
                Name: nextWeekUpfrontCommission.Name,
                Commission: '$' + nextWeekUpfrontCommission.X1st_Commission_Amount__c.toFixed(2),
                Date: nextWeekUpfrontCommission.X1st_Commission_Due_Date_new__c
            })
        })

        return (
            <div className="panel  panel-default">
                <div className="panel-heading">
                    <div style={{display: "flex"}}>
                        <div style={{flex: "1", textAlign: "left"}}>
                            UPFRONT
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
                            <td colSpan='5' className="text-center " style={{color: "#fff"}}>Previous Weeks</td>
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
                        <tr>
                            <td colSpan='4' style={{padding: "0px"}}>
                                <div style={{height: "260px", overflow: "auto"}}>
                                    <table className="table table-striped"
                                           style={(this.state.optionsPanelExpanded ? {
                                               display: "none",
                                               marginBottom: "0px"
                                           } : {
                                               display: "table", marginBottom: "0px"
                                           })}>
                                        <tbody>
                                        {
                                            pastWeekCommissions.length > 0 ?
                                                pastWeekCommissions.sort(function (a, b) {
                                                    a = a.Date;
                                                    b = b.Date;
                                                    return a > b ? 1 : a < b ? -1 : 0;
                                                }).map((pastWeekCommission, index) => {
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
                                                                {pastWeekCommission.Name}
                                                            </td>
                                                            <td>
                                                                {pastWeekCommission.Commission}
                                                            </td>
                                                            {/*<td>*/}
                                                            {/*    {projectCommissions.Field_Marketer1__c}*/}
                                                            {/*</td>*/}
                                                            <td>
                                                                {pastWeekCommission.Date}
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
                                </div>
                            </td>
                        </tr>
                        </tbody>
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
                                currentWeekCommissions.map((currentWeekCommission, index) => {
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
                                                {currentWeekCommission.Name}
                                            </td>
                                            <td>
                                                {currentWeekCommission.Commission}
                                            </td>
                                            {/*<td>*/}
                                            {/*    {projectCommissions.Field_Marketer1__c}*/}
                                            {/*</td>*/}
                                            <td>
                                                {currentWeekCommission.Date}
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
                                nextWeekCommissions.map((nextWeekCommissions, index) => {
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
                                                {nextWeekCommissions.Name}
                                            </td>
                                            <td>
                                                {nextWeekCommissions.Commission}
                                            </td>
                                            {/*<td>*/}
                                            {/*    {projectCommissions.Field_Marketer1__c}*/}
                                            {/*</td>*/}
                                            <td>
                                                {nextWeekCommissions.Date}
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
                        <p style={{textAlign: "center", margin: "0px"}}>PREVIOUS WEEKS</p>
                        <h1 style={{
                            textAlign: "center",
                            fontWeight: "bold",
                            color: "#5099d3",
                            margin: "0px 0px 5px 0px"
                        }}>
                            ${pastTotalCommissions ? pastTotalCommissions.toFixed(2) : 0}
                        </h1>
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