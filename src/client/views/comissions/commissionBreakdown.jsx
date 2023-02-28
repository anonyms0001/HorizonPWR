import {emit, view} from "../../framework"
import sessionStore from '../../stores/sessionStore'
import salesforceStore from '../../stores/salesforceStore'


@view
export default class CommissionBreakdown extends React.Component {


    state = {
        optionsPanelExpanded: true,
    }

    render() {
        const {residentialProjectsCommissions, currentWeekStartDate, currentWeekEndDate, SelectedPayDate} = salesforceStore
        const {user} = sessionStore

        let ecCommissions = 0
        let currentWeekCommissions = []
        // let commissionsLength = 0
        let totalCommissions = 0

        {
            residentialProjectsCommissions.length > 0 ?
                residentialProjectsCommissions.filter(projectCommission => projectCommission.X1st_Commission_Due_Date_new__c > currentWeekStartDate && projectCommission.X1st_Commission_Due_Date_new__c < currentWeekEndDate || projectCommission.X2nd_Commission_Due_Date__c > currentWeekStartDate && projectCommission.X2nd_Commission_Due_Date__c < currentWeekEndDate).map((projectCommission, index) => {
                    if (projectCommission.Account__c === user.accountId) {
                        if (projectCommission.X2nd_Commission_Due_Date__c !== null) {
                            currentWeekCommissions.push({
                                Name: projectCommission.Name,
                                Type: '2nd Installment',
                                Commission: '$ ' + projectCommission.X2nd_Commission_Amount__c.toFixed(2),
                                Deductions: projectCommission.Commission_Deductions__c ? projectCommission.Commission_Deductions__c : '-',
                                Date: projectCommission.X2nd_Commission_Due_Date__c

                            })
                        } else if (projectCommission.X1st_Commission_Due_Date_new__c !== null) {
                            currentWeekCommissions.push({
                                Name: projectCommission.Name,
                                Type: '1st Installment',
                                Commission: '$ ' + projectCommission.X1st_Commission_Amount__c.toFixed(2),
                                Deductions: projectCommission.Commission_Deductions__c ? projectCommission.Commission_Deductions__c : '-',
                                Date: projectCommission.X1st_Commission_Due_Date_new__c

                            })
                        }
                    } else if (projectCommission.Expected_Pay_Date__c > currentWeekStartDate && projectCommission.Expected_Pay_Date__c < currentWeekEndDate) {
                        if (projectCommission.Parent_Override__c !== null && projectCommission.Completion_Certificate_Signed__c && projectCommission.Parent_Account__c === '0013m000026TCwEAAW' && user.accountId === '0013m000026TCwEAAW') {
                            currentWeekCommissions.push({
                                Name: projectCommission.Name,
                                Type: 'Parent Override',
                                Commission: '$ ' + projectCommission.Parent_Override__c.toFixed(2),
                                Deductions: '-',
                                Date: projectCommission.Expected_Pay_Date__c ? projectCommission.Expected_Pay_Date__c : '-'
                            })
                        } else if (projectCommission.Manager_2_Override__c !== null && projectCommission.Manager_2__c === '0011N00001sZUeBQAW' && user.accountId === projectCommission.Manager_2__c) {
                            currentWeekCommissions.push({
                                Name: projectCommission.Name,
                                Type: 'Manager 2 Override',
                                Commission: '$ ' + projectCommission.Manager_2_Override__c.toFixed(2),
                                Deductions: '-',
                                Date: projectCommission.Expected_Pay_Date__c ? projectCommission.Expected_Pay_Date__c : '-'
                            })
                        } else if (projectCommission.Manager_3_Override__c !== null && projectCommission.Manager_3__c === user.accountId) {
                            currentWeekCommissions.push({
                                Name: projectCommission.Name,
                                Type: 'Manager 3 Override',
                                Commission: '$ ' + projectCommission.Manager_3_Override__c.toFixed(2),
                                Deductions: '-',
                                Date: projectCommission.Expected_Pay_Date__c ? projectCommission.Expected_Pay_Date__c : '-'
                            })
                        }
                    }


                }) : 0
        }
        // console.log("currentWeekCommissions ", currentWeekCommissions)
        return (

            <div className="panel  panel-default">
                <div className="panel-heading">
                    <div style={{display: "flex"}}>
                        <div style={{flex: "1", textAlign: "left"}}>
                            COMMISSION BREAKDOWN
                        </div>
                    </div>
                </div>
                <div className="panel-body" style={{padding: "0px", overflowX: "auto"}}>
                    {/*{ currentWeekEarnings.length === 0 && nextWeekEarnings.length === 0 ? <h4 style={{paddingLeft: "15px"}}>No Commissions</h4> : '' }*/}
                    {/*{*/}
                    {/*    currentWeekEarnings.length > 0 ?*/}
                    {/*        <div>*/}
                    {/*<h5>This Week Commissions</h5>*/}
                    <table className="table table-striped">
                        <thead style={{fontSize: "13px"}}>
                        {/*<tr>*/}
                        {/*    <td colSpan='6' style={{textAlign: "center", background: "#b3b3b3", padding: "2px"}}>This*/}
                        {/*        Week*/}
                        {/*    </td>*/}
                        {/*</tr>*/}
                        <tr>
                            {/*<td>Id</td>*/}
                            {/*<td>EC</td>*/}
                            <td>#</td>
                            <td>Customer Name</td>
                            <td>Type</td>
                            <td>Commission</td>
                            <td>Deductions</td>
                            <td>Commission Date</td>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            currentWeekCommissions.length > 0 ?
                                currentWeekCommissions.map((commission, index) => {
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
                                                {commission.Name}
                                            </td>
                                            <td>{commission.Type}</td>
                                            <td>
                                                {commission.Commission}
                                            </td>
                                            {/*<td>*/}
                                            {/*    {projectCommissions.Field_Marketer1__c}*/}
                                            {/*</td>*/}
                                            <td>
                                                {commission.Deductions}
                                            </td>
                                            <td>
                                                {commission.Date}
                                            </td>
                                        </tr>
                                    )
                                })
                                : 'Something went wrong'
                        }
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}