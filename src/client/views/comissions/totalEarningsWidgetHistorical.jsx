import {emit, view} from "../../framework";
import salesforceStore from '../../stores/salesforceStore'
import sessionStore from "../../stores/sessionStore";

@view
export default class TotalEarningsHistorical extends React.Component {

    state = {
        optionsPanelExpanded: true,
    }

    render() {
        const {residentialProjectsCommissions, currentWeekStartDate, currentWeekEndDate, SelectedPayDate, nextWeekStartDate, nextWeekEndDate} = salesforceStore
        const {user} = sessionStore

        let ecCommissions = 0

        let totalCurrentWeekCommissions = 0
        let totalNextWeekCommissions = 0

        residentialProjectsCommissions.map((currentWeekTotalCommission) => {
            if (currentWeekTotalCommission.Account__c === user.accountId) {
                if (currentWeekTotalCommission.X2nd_Commission_Due_Date__c !== null && !currentWeekTotalCommission.X2nd_Commission_Paid_Date__c && currentWeekTotalCommission.X2nd_Commission_Due_Date__c > currentWeekStartDate && currentWeekTotalCommission.X2nd_Commission_Due_Date__c < currentWeekEndDate || currentWeekTotalCommission.X2nd_Commission_Paid__c && currentWeekTotalCommission.X2nd_Commission_Paid_Date__c >= currentWeekStartDate && currentWeekTotalCommission.X2nd_Commission_Paid_Date__c <= currentWeekEndDate) {
                    totalCurrentWeekCommissions = totalCurrentWeekCommissions + currentWeekTotalCommission.X2nd_Commission_Amount__c
                }
                if (currentWeekTotalCommission.X1st_Commission_Due_Date_new__c !== null && !currentWeekTotalCommission.X1st_Commission_Paid__c && currentWeekTotalCommission.X1st_Commission_Due_Date_new__c > currentWeekStartDate  && currentWeekTotalCommission.X1st_Commission_Due_Date_new__c <= currentWeekEndDate  || currentWeekTotalCommission.X1st_Commission_Paid__c  && currentWeekTotalCommission.X1st_Commission_Paid_Date__c >= currentWeekStartDate && currentWeekTotalCommission.X1st_Commission_Paid_Date__c <= currentWeekEndDate) {
                    totalCurrentWeekCommissions = totalCurrentWeekCommissions + currentWeekTotalCommission.X1st_Commission_Amount__c
                }
            } else if (currentWeekTotalCommission.Expected_Pay_Date__c > currentWeekStartDate && currentWeekTotalCommission.Expected_Pay_Date__c < currentWeekEndDate ) {
                if (currentWeekTotalCommission.Parent_Override__c && currentWeekTotalCommission.Parent_Override__c !== null && currentWeekTotalCommission.Completion_Certificate_Signed__c && currentWeekTotalCommission.Parent_Account__c === '0013m000026TCwEAAW' && user.accountId === '0013m000026TCwEAAW') {
                    totalCurrentWeekCommissions = totalCurrentWeekCommissions + currentWeekTotalCommission.Parent_Override__c
                } else if (currentWeekTotalCommission.Manager_2__c && currentWeekTotalCommission.Manager_2_Override__c !== null && currentWeekTotalCommission.Manager_2__c === '0011N00001sZUeBQAW' && user.accountId === currentWeekTotalCommission.Manager_2__c) {
                    totalCurrentWeekCommissions = totalCurrentWeekCommissions + currentWeekTotalCommission.Manager_2_Override__c
                } else if (currentWeekTotalCommission.Manager_3__c && currentWeekTotalCommission.Manager_3_Override__c !== null && currentWeekTotalCommission.Manager_3__c === user.accountId) {
                    totalCurrentWeekCommissions = totalCurrentWeekCommissions + currentWeekTotalCommission.Manager_3_Override__c
                }
            }
        })

        residentialProjectsCommissions.map((currentNextTotalCommission) => {
            if (currentNextTotalCommission.Account__c === user.accountId) {
                if (currentNextTotalCommission.X2nd_Commission_Due_Date__c !== null && !currentNextTotalCommission.X2nd_Commission_Paid__c && currentNextTotalCommission.X2nd_Commission_Due_Date__c > nextWeekStartDate && currentNextTotalCommission.X2nd_Commission_Due_Date__c < nextWeekEndDate || currentNextTotalCommission.X2nd_Commission_Paid__c && currentNextTotalCommission.X2nd_Commission_Paid_Date__c >= nextWeekStartDate && currentNextTotalCommission.X2nd_Commission_Paid_Date__c <= nextWeekEndDate) {
                    totalNextWeekCommissions = totalNextWeekCommissions + currentNextTotalCommission.X2nd_Commission_Amount__c
                }
                if (currentNextTotalCommission.X1st_Commission_Due_Date_new__c !== null && !currentNextTotalCommission.X1st_Commission_Paid__c && currentNextTotalCommission.X1st_Commission_Due_Date_new__c > nextWeekStartDate && currentNextTotalCommission.X1st_Commission_Due_Date_new__c < nextWeekEndDate || currentNextTotalCommission.X1st_Commission_Paid__c && currentNextTotalCommission.X1st_Commission_Paid_Date__c >= nextWeekStartDate && currentNextTotalCommission.X1st_Commission_Paid_Date__c <= nextWeekEndDate) {
                    totalNextWeekCommissions = totalNextWeekCommissions + currentNextTotalCommission.X1st_Commission_Amount__c
                }
            } else if (currentNextTotalCommission.Expected_Pay_Date__c > nextWeekStartDate && currentNextTotalCommission.Expected_Pay_Date__c < nextWeekEndDate) {
                if (currentNextTotalCommission.Parent_Override__c !== null && currentNextTotalCommission.Completion_Certificate_Signed__c && currentNextTotalCommission.Parent_Account__c === '0013m000026TCwEAAW' && user.accountId === '0013m000026TCwEAAW') {
                    totalNextWeekCommissions = totalNextWeekCommissions + currentNextTotalCommission.Parent_Override__c
                } else if (currentNextTotalCommission.Manager_2_Override__c !== null && currentNextTotalCommission.Manager_2__c === '0011N00001sZUeBQAW' && user.accountId === currentNextTotalCommission.Manager_2__c) {
                    totalNextWeekCommissions = totalNextWeekCommissions + currentNextTotalCommission.Manager_2_Override__c
                } else if (currentNextTotalCommission.Manager_3_Override__c !== null && currentNextTotalCommission.Manager_3__c === user.accountId) {
                    totalNextWeekCommissions = totalNextWeekCommissions + currentNextTotalCommission.Manager_3_Override__c
                }
            }
        })


        // console.log("totalNextWeekCommissions ", totalNextWeekCommissions)
        return (

            <div className="panel  panel-default">
                <div className="panel-heading">
                    <div style={{display: "flex"}}>
                        <div style={{flex: "1", textAlign: "left"}}>
                            TOTAL EARNINGS
                        </div>
                    </div>
                </div>
                <div className="panel-body"
                     style={(this.state.optionsPanelExpanded ? {display: "block"} : {display: "none"})}>
                    <p style={{textAlign: "center", margin: "0px"}}>THIS WEEK</p>
                    <h1 style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        color: "#e79236",
                        margin: "0px",
                        paddingBottom: "10px",
                        fontSize: "3.5em"
                    }}>${totalCurrentWeekCommissions ? totalCurrentWeekCommissions.toFixed(2) : 0}</h1>
                    <p style={{textAlign: "center", margin: "0px"}}>NEXT WEEK</p>
                    <h1 style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        color: "#70899f",
                        margin: "0px"
                    }}>
                        ${totalNextWeekCommissions ? totalNextWeekCommissions.toFixed(2) : 0}
                    </h1>
                </div>
            </div>
        )
    }
}
