import {emit, view} from "../../framework"
import sessionStore from '../../stores/sessionStore'
import salesforceStore from '../../stores/salesforceStore'

@view
export default class TotalEarningsFM extends React.Component {

    state = {
        optionsPanelExpanded: true,
    }

    render() {
        const {opportunityCommissions, residentialProjectsCommissions, currentWeekStartDate, currentWeekEndDate, SelectedPayDate, nextWeekStartDate, nextWeekEndDate, fmFirstPayDate, fmFirstBonusPayDate, fmSecondBonusPayDate} = salesforceStore
        const {user} = sessionStore

        let currentTotalAssistCommission = 0
        let nextTotalAssistCommission = 0
        let currentSitCommissionsLength = 0
        let nextSitCommissionsLength = 0

        // opportunityCommissions.length > 0 ?
        opportunityCommissions.filter(currentSitCom => currentSitCom.Field_Marketer1__c === user.accountId && currentSitCom.FM_Expected_Pay_Date_New__c > currentWeekStartDate && currentSitCom.FM_Expected_Pay_Date_New__c < currentWeekEndDate).map((currentSitCom, index) => {
            currentSitCommissionsLength = index + 1
        })
        opportunityCommissions.filter(nextSitCom => nextSitCom.Field_Marketer1__c === user.accountId && nextSitCom.FM_Expected_Pay_Date_New__c > nextWeekStartDate && nextSitCom.FM_Expected_Pay_Date_New__c < nextWeekEndDate).map((nextSitCom, index) => {
            nextSitCommissionsLength = index + 1
        })
        // : 0

        let currentWeekCommissionRate = 0
        let nextWeekCommissionRate = 0

        if (user.roleId === '7') {
            // let currentWeekCommissionRate = currentCommissionsLength >= 6 && currentCommissionsLength <= 7 ? 80 : currentCommissionsLength >= 8 && currentCommissionsLength <= 9 ? 90 : currentCommissionsLength >= 10 ? 100 : 0
            currentWeekCommissionRate = currentSitCommissionsLength >= 6 && currentSitCommissionsLength <= 7 ? 80 : currentSitCommissionsLength >= 8 && currentSitCommissionsLength <= 9 ? 90 : currentSitCommissionsLength >= 10 ? 100 : 60
            nextWeekCommissionRate = nextSitCommissionsLength >= 6 && nextSitCommissionsLength <= 7 ? 80 : nextSitCommissionsLength >= 8 && nextSitCommissionsLength <= 9 ? 90 : nextSitCommissionsLength >= 10 ? 100 : 60
        } else if (user.roleId === '8') {
            currentWeekCommissionRate = currentSitCommissionsLength >= 6 && currentSitCommissionsLength <= 7 ? 90 : currentSitCommissionsLength >= 8 && currentSitCommissionsLength <= 9 ? 100 : currentSitCommissionsLength >= 10 ? 110 : 80
            nextWeekCommissionRate = nextSitCommissionsLength >= 6 && nextSitCommissionsLength <= 7 ? 90 : nextSitCommissionsLength >= 8 && nextSitCommissionsLength <= 9 ? 100 : nextSitCommissionsLength >= 10 ? 110 : 80
        }

        let currentTotalSitCommissions = currentWeekCommissionRate * currentSitCommissionsLength
        let nextTotalSitCommissions = nextWeekCommissionRate * nextSitCommissionsLength

        // console.log("currentSitCommissionsLength ", currentSitCommissionsLength)

        residentialProjectsCommissions.filter(currentAssCom => currentAssCom.Field_Marketer1__c === user.accountId && currentAssCom.Expected_Pay_Date__c > currentWeekStartDate && currentAssCom.Expected_Pay_Date__c < currentWeekEndDate).map((currentAssCom) => {
            currentTotalAssistCommission += currentAssCom.FM_Assist_Commission__c
        })
        residentialProjectsCommissions.filter(nextAssCom => nextAssCom.Field_Marketer1__c === user.accountId && nextAssCom.Expected_Pay_Date__c > nextWeekStartDate && nextAssCom.nextWeekEndDate < currentWeekEndDate).map((nextAssCom) => {
            nextTotalAssistCommission += nextAssCom.FM_Assist_Commission__c
        })
        let weekTotalCommission = currentTotalAssistCommission + currentTotalSitCommissions
        let nextTotalCommission = nextTotalAssistCommission + nextTotalSitCommissions

        if (fmFirstPayDate > currentWeekStartDate && fmFirstPayDate < currentWeekEndDate) {
            weekTotalCommission = weekTotalCommission + 480
        } else if (fmFirstPayDate > nextWeekStartDate && fmFirstPayDate < nextWeekEndDate) {
            nextTotalCommission = nextTotalSitCommissions + 480
        }

        if (fmFirstBonusPayDate > currentWeekStartDate && fmFirstBonusPayDate < currentWeekEndDate) {
            weekTotalCommission = weekTotalCommission + 250
        } else if (fmFirstBonusPayDate > nextWeekStartDate && fmFirstBonusPayDate < nextWeekEndDate) {
            nextTotalCommission = nextTotalCommission + 250
        }

        if (fmSecondBonusPayDate > currentWeekStartDate && fmSecondBonusPayDate < currentWeekEndDate) {
            weekTotalCommission = weekTotalCommission + 500
        } else if (fmSecondBonusPayDate > nextWeekStartDate && fmSecondBonusPayDate < nextWeekEndDate) {
            nextTotalCommission = nextTotalCommission + 500
        }

        return (
            <div className="panel  panel-default">
                <div className="panel-heading">
                    <div style={{display: "flex"}}>
                        <div style={{flex: "1", textAlign: "left"}}>
                            TOTAL EARNINGS
                            {/*<span*/}
                            {/*    style={{cursor: "pointer", float: "right"}}*/}
                            {/*    className={"glyphicon glyphicon-chevron-" + (this.state.optionsPanelExpanded ? 'down' : 'up')}*/}
                            {/*    onClick={() => this.setState({optionsPanelExpanded: !this.state.optionsPanelExpanded})}>*/}
                            {/*</span>*/}
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
                    }}>
                        ${weekTotalCommission ? weekTotalCommission.toFixed(2) : 0}
                    </h1>
                    <p style={{textAlign: "center", margin: "0px"}}>NEXT WEEK</p>
                    <h1 style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        color: "#70899f",
                        margin: "0px"
                    }}>${nextTotalCommission ? nextTotalCommission.toFixed(2) : 0}</h1>
                </div>
            </div>
        )
    }
}
