import {emit, view} from "../../framework"
import salesforceStore from '../../stores/salesforceStore'
import sessionStore from "../../stores/sessionStore";
import Link from "../../components/link";

@view
export default class FMSitsWidget extends React.Component {

    state = {
        optionsPanelExpanded: true,
    }

    render() {
        const {opportunityCommissions, currentWeekStartDate, currentWeekEndDate, SelectedPayDate, nextWeekStartDate, nextWeekEndDate, nextNextWeekStartDate, nextNextWeekEndDate, fmFirstPayDate, fmFirstBonusPayDate, fmSecondBonusPayDate} = salesforceStore
        const {user} = sessionStore

        // console.log("fmFirstPayDate HERE ", fmFirstPayDate)
        // console.log("user HERE ", user)
        // console.log("HERE HRE ", fmFirstBonusPayDate, fmSecondBonusPayDate)

        let currentTotalSitCommissions
        let nextTotalSitCommissions
        let currentWeekSitsCommissions = []
        let nextWeekCommissions = []
        let currentCommissionsLength = 0
        let nextCommissionsLength = 0
        let accountId = user.accountId === null ? "0013m000029RgdeAAC" : user.accountId

        opportunityCommissions.filter(currentFMCommission => currentFMCommission.Field_Marketer1__c === accountId && currentFMCommission.FM_Expected_Pay_Date_New__c > currentWeekStartDate && currentFMCommission.FM_Expected_Pay_Date_New__c < currentWeekEndDate).map((currentFMCommission, index) => {
            currentCommissionsLength = index + 1
            currentWeekSitsCommissions.push(currentFMCommission)
        })

        opportunityCommissions.filter(nextFMCommission => nextFMCommission.Field_Marketer1__c === accountId && nextFMCommission.FM_Expected_Pay_Date_New__c > nextWeekStartDate && nextFMCommission.FM_Expected_Pay_Date_New__c < nextWeekEndDate).map((nextFMCommission, index) => {
            nextCommissionsLength = index + 1
            nextWeekCommissions.push(nextFMCommission)
        })
        let currentWeekCommissionRate = 0
        let nextWeekCommissionRate = 0

        // console.log(' nextCommissionsLength ', nextCommissionsLength)

        if (user.roleId === '7') {
            // let currentWeekCommissionRate = currentCommissionsLength >= 6 && currentCommissionsLength <= 7 ? 80 : currentCommissionsLength >= 8 && currentCommissionsLength <= 9 ? 90 : currentCommissionsLength >= 10 ? 100 : 0
            currentWeekCommissionRate = currentCommissionsLength >= 6 && currentCommissionsLength <= 7 ? 80 : currentCommissionsLength >= 8 && currentCommissionsLength <= 9 ? 90 : currentCommissionsLength >= 10 ? 100 : 60
            nextWeekCommissionRate = nextCommissionsLength >= 6 && nextCommissionsLength <= 7 ? 80 : nextCommissionsLength >= 8 && nextCommissionsLength <= 9 ? 90 : nextCommissionsLength >= 10 ? 100 : 60
        } else if (user.roleId === '8') {
            currentWeekCommissionRate = currentCommissionsLength >= 6 && currentCommissionsLength <= 7 ? 90 : currentCommissionsLength >= 8 && currentCommissionsLength <= 9 ? 100 : currentCommissionsLength >= 10 ? 110 : 80
            nextWeekCommissionRate = nextCommissionsLength >= 6 && nextCommissionsLength <= 7 ? 90 : nextCommissionsLength >= 8 && nextCommissionsLength <= 9 ? 100 : nextCommissionsLength >= 10 ? 110 : 80
        }

        // totals
        currentTotalSitCommissions = currentWeekCommissionRate * currentCommissionsLength
        nextTotalSitCommissions = nextWeekCommissionRate * nextCommissionsLength

        if (fmFirstPayDate > currentWeekStartDate && fmFirstPayDate <  currentWeekEndDate) {
            currentTotalSitCommissions = currentTotalSitCommissions + 480
        } else if (fmFirstPayDate > nextWeekStartDate && fmFirstPayDate < nextWeekEndDate) {
            nextTotalSitCommissions = nextTotalSitCommissions + 480
        }

        if (fmFirstBonusPayDate > currentWeekStartDate && fmFirstBonusPayDate < currentWeekEndDate ) {
            currentTotalSitCommissions = currentTotalSitCommissions + 250
        } else if (fmFirstBonusPayDate > nextWeekStartDate && fmFirstBonusPayDate < nextWeekEndDate) {
            nextTotalSitCommissions = nextTotalSitCommissions + 250
        }

        if (fmSecondBonusPayDate > currentWeekStartDate && fmSecondBonusPayDate < currentWeekEndDate) {
            currentTotalSitCommissions = currentTotalSitCommissions + 500
        } else if (fmSecondBonusPayDate > nextWeekStartDate && fmSecondBonusPayDate < nextWeekEndDate) {
            nextTotalSitCommissions = nextTotalSitCommissions + 500
        }

        return (
            <div className="panel  panel-default">
                <div className="panel-heading">
                    <div style={{display: "flex"}}>
                        <div style={{flex: "1", textAlign: "left"}}>
                            SITS
                            <span id="fm-sit"
                                  style={{cursor: "pointer", float: "right"}}
                                  className={"glyphicon glyphicon-chevron-" + (this.state.optionsPanelExpanded ? 'down' : 'up')}
                                  onClick={() => this.setState({optionsPanelExpanded: !this.state.optionsPanelExpanded})}>
                            </span>
                            {/*<div className="popover fade top in"*/}
                            {/*     style={{top: "-29px", right: "-22px", left: "auto"}}>*/}
                            {/*    <div className="arrow"></div>*/}
                            {/*    /!*<h3 className="popover-title" style={{color: "#333333"}}>Scores</h3>*!/*/}
                            {/*    <div className="popover-content" style={{color: "#333333", padding: "9px"}}>*/}
                            {/*        {(this.state.optionsPanelExpanded ? "See detailed info" : "See Overall Number")}*/}
                            {/*    </div>*/}
                            {/*</div>*/}
                        </div>
                    </div>
                </div>
                <div className="panel-body" style={{padding: "0px"}}>
                    <table className="table table-striped"
                           style={(this.state.optionsPanelExpanded ? {display: "none", marginBottom: "0px"} : {
                               display: "table", marginBottom: "0px"
                           })}>
                        <thead style={{fontSize: "13px"}}>
                        <tr style={{background: "#e79236"}}>
                            <td colSpan='4' className="text-center " style={{color: "#fff"}}>This Week</td>
                        </tr>
                        {fmFirstPayDate > currentWeekStartDate && fmFirstPayDate < currentWeekStartDate ?
                            <tr style={{background: "#b3b3b3"}}>
                                <td colSpan='2' className="text-center " style={{color: "#fff"}}>Initial Pay</td>
                                <td colSpan='1' className="text-center " style={{color: "#fff"}}>$300.00</td>
                                <td colSpan='1' className="text-center "
                                    style={{color: "#fff"}}>fmFirstPayDate
                                </td>
                            </tr>
                            : ''}
                        <tr>
                            {/*<td>Opportunity Id</td>*/}
                            {/*<td>FM Name</td>*/}
                            <td>#</td>
                            <td>Customer Name</td>
                            <td>Commission</td>
                            <td>Date</td>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            currentCommissionsLength > 0 ?
                                currentWeekSitsCommissions.map((commission, index) => {
                                    return (
                                        <tr>
                                            {/*<td>*/}
                                            {/*    {sitsCommissions.Id}*/}
                                            {/*</td>*/}
                                            {/*<td>*/}
                                            {/*    {sitsCommissions.Field_Marketer1__c}*/}
                                            {/*</td>*/}
                                            {/*<td>*/}
                                            {/*    {sitsCommissions.Name}*/}
                                            {/*</td>*/}
                                            <td>
                                                {index + 1}
                                            </td>
                                            <td>
                                                {commission.Name}
                                            </td>
                                            <td>
                                                ${currentWeekCommissionRate.toFixed(2)}
                                            </td>
                                            <td>
                                                {commission.FM_Expected_Pay_Date_New__c}
                                            </td>
                                        </tr>
                                    )
                                }) : <tr>
                                    <td colSpan='4' className="text-center">No Sits Found</td>
                                </tr>
                        }
                        {fmFirstPayDate > currentWeekStartDate && fmFirstPayDate < currentWeekEndDate ?
                            <tr style={{background: "rgb(241 241 241)"}}>
                                <td>
                                    {/*<i className="glyphicon glyphicon-star"></i>*/}
                                    <span className="svg-icon svg-icon-primary certify svg-icon-2x">
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                            // xmlns:xlink="http://www.w3.org/1999/xlink"
                                             width="24px"
                                             height="24px" viewBox="0 0 24 24"
                                             version="1.1">
                                            <g stroke="none" strokeWidth="1" fill="none"
                                               fillRule="evenodd">
                                                <rect x="0" y="0" width="24" height="24"/>
                                                <path
                                                    d="M12,15 C10.3431458,15 9,13.6568542 9,12 C9,10.3431458 10.3431458,9 12,9 C13.6568542,9 15,10.3431458 15,12 C15,13.6568542 13.6568542,15 12,15 Z"
                                                    fill="#e79236" fillRule="nonzero"/>
                                                <path
                                                    d="M19.5,10.5 L21,10.5 C21.8284271,10.5 22.5,11.1715729 22.5,12 C22.5,12.8284271 21.8284271,13.5 21,13.5 L19.5,13.5 C18.6715729,13.5 18,12.8284271 18,12 C18,11.1715729 18.6715729,10.5 19.5,10.5 Z M16.0606602,5.87132034 L17.1213203,4.81066017 C17.7071068,4.22487373 18.6568542,4.22487373 19.2426407,4.81066017 C19.8284271,5.39644661 19.8284271,6.34619408 19.2426407,6.93198052 L18.1819805,7.99264069 C17.5961941,8.57842712 16.6464466,8.57842712 16.0606602,7.99264069 C15.4748737,7.40685425 15.4748737,6.45710678 16.0606602,5.87132034 Z M16.0606602,18.1819805 C15.4748737,17.5961941 15.4748737,16.6464466 16.0606602,16.0606602 C16.6464466,15.4748737 17.5961941,15.4748737 18.1819805,16.0606602 L19.2426407,17.1213203 C19.8284271,17.7071068 19.8284271,18.6568542 19.2426407,19.2426407 C18.6568542,19.8284271 17.7071068,19.8284271 17.1213203,19.2426407 L16.0606602,18.1819805 Z M3,10.5 L4.5,10.5 C5.32842712,10.5 6,11.1715729 6,12 C6,12.8284271 5.32842712,13.5 4.5,13.5 L3,13.5 C2.17157288,13.5 1.5,12.8284271 1.5,12 C1.5,11.1715729 2.17157288,10.5 3,10.5 Z M12,1.5 C12.8284271,1.5 13.5,2.17157288 13.5,3 L13.5,4.5 C13.5,5.32842712 12.8284271,6 12,6 C11.1715729,6 10.5,5.32842712 10.5,4.5 L10.5,3 C10.5,2.17157288 11.1715729,1.5 12,1.5 Z M12,18 C12.8284271,18 13.5,18.6715729 13.5,19.5 L13.5,21 C13.5,21.8284271 12.8284271,22.5 12,22.5 C11.1715729,22.5 10.5,21.8284271 10.5,21 L10.5,19.5 C10.5,18.6715729 11.1715729,18 12,18 Z M4.81066017,4.81066017 C5.39644661,4.22487373 6.34619408,4.22487373 6.93198052,4.81066017 L7.99264069,5.87132034 C8.57842712,6.45710678 8.57842712,7.40685425 7.99264069,7.99264069 C7.40685425,8.57842712 6.45710678,8.57842712 5.87132034,7.99264069 L4.81066017,6.93198052 C4.22487373,6.34619408 4.22487373,5.39644661 4.81066017,4.81066017 Z M4.81066017,19.2426407 C4.22487373,18.6568542 4.22487373,17.7071068 4.81066017,17.1213203 L5.87132034,16.0606602 C6.45710678,15.4748737 7.40685425,15.4748737 7.99264069,16.0606602 C8.57842712,16.6464466 8.57842712,17.5961941 7.99264069,18.1819805 L6.93198052,19.2426407 C6.34619408,19.8284271 5.39644661,19.8284271 4.81066017,19.2426407 Z"
                                                    fill="#e79236" fillRule="nonzero"
                                                    opacity="0.3"/>
                                            </g>
                                        </svg>
                                    </span>
                                </td>
                                <td
                                    style={{color: "#000"}}>Initial Pay
                                </td>
                                <td
                                    style={{color: "#000"}}>$480.00
                                </td>
                                <td
                                    style={{color: "#000"}}>{fmFirstPayDate}
                                </td>
                            </tr>
                            :
                            fmFirstBonusPayDate > currentWeekStartDate && fmFirstBonusPayDate < currentWeekEndDate ?
                                <tr style={{background: "rgb(241 241 241)"}}>
                                    <td>
                                        {/*<i className="glyphicon glyphicon-star"></i>*/}
                                        <span className="svg-icon svg-icon-primary certify svg-icon-2x">
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                            // xmlns:xlink="http://www.w3.org/1999/xlink"
                                             width="24px"
                                             height="24px" viewBox="0 0 24 24"
                                             version="1.1">
                                            <g stroke="none" strokeWidth="1" fill="none"
                                               fillRule="evenodd">
                                                <rect x="0" y="0" width="24" height="24"/>
                                                <path
                                                    d="M12,15 C10.3431458,15 9,13.6568542 9,12 C9,10.3431458 10.3431458,9 12,9 C13.6568542,9 15,10.3431458 15,12 C15,13.6568542 13.6568542,15 12,15 Z"
                                                    fill="#e79236" fillRule="nonzero"/>
                                                <path
                                                    d="M19.5,10.5 L21,10.5 C21.8284271,10.5 22.5,11.1715729 22.5,12 C22.5,12.8284271 21.8284271,13.5 21,13.5 L19.5,13.5 C18.6715729,13.5 18,12.8284271 18,12 C18,11.1715729 18.6715729,10.5 19.5,10.5 Z M16.0606602,5.87132034 L17.1213203,4.81066017 C17.7071068,4.22487373 18.6568542,4.22487373 19.2426407,4.81066017 C19.8284271,5.39644661 19.8284271,6.34619408 19.2426407,6.93198052 L18.1819805,7.99264069 C17.5961941,8.57842712 16.6464466,8.57842712 16.0606602,7.99264069 C15.4748737,7.40685425 15.4748737,6.45710678 16.0606602,5.87132034 Z M16.0606602,18.1819805 C15.4748737,17.5961941 15.4748737,16.6464466 16.0606602,16.0606602 C16.6464466,15.4748737 17.5961941,15.4748737 18.1819805,16.0606602 L19.2426407,17.1213203 C19.8284271,17.7071068 19.8284271,18.6568542 19.2426407,19.2426407 C18.6568542,19.8284271 17.7071068,19.8284271 17.1213203,19.2426407 L16.0606602,18.1819805 Z M3,10.5 L4.5,10.5 C5.32842712,10.5 6,11.1715729 6,12 C6,12.8284271 5.32842712,13.5 4.5,13.5 L3,13.5 C2.17157288,13.5 1.5,12.8284271 1.5,12 C1.5,11.1715729 2.17157288,10.5 3,10.5 Z M12,1.5 C12.8284271,1.5 13.5,2.17157288 13.5,3 L13.5,4.5 C13.5,5.32842712 12.8284271,6 12,6 C11.1715729,6 10.5,5.32842712 10.5,4.5 L10.5,3 C10.5,2.17157288 11.1715729,1.5 12,1.5 Z M12,18 C12.8284271,18 13.5,18.6715729 13.5,19.5 L13.5,21 C13.5,21.8284271 12.8284271,22.5 12,22.5 C11.1715729,22.5 10.5,21.8284271 10.5,21 L10.5,19.5 C10.5,18.6715729 11.1715729,18 12,18 Z M4.81066017,4.81066017 C5.39644661,4.22487373 6.34619408,4.22487373 6.93198052,4.81066017 L7.99264069,5.87132034 C8.57842712,6.45710678 8.57842712,7.40685425 7.99264069,7.99264069 C7.40685425,8.57842712 6.45710678,8.57842712 5.87132034,7.99264069 L4.81066017,6.93198052 C4.22487373,6.34619408 4.22487373,5.39644661 4.81066017,4.81066017 Z M4.81066017,19.2426407 C4.22487373,18.6568542 4.22487373,17.7071068 4.81066017,17.1213203 L5.87132034,16.0606602 C6.45710678,15.4748737 7.40685425,15.4748737 7.99264069,16.0606602 C8.57842712,16.6464466 8.57842712,17.5961941 7.99264069,18.1819805 L6.93198052,19.2426407 C6.34619408,19.8284271 5.39644661,19.8284271 4.81066017,19.2426407 Z"
                                                    fill="#e79236" fillRule="nonzero"
                                                    opacity="0.3"/>
                                            </g>
                                        </svg>
                                    </span>
                                    </td>
                                    <td
                                        style={{color: "#000"}}>Week 1 Bonus
                                    </td>
                                    <td
                                        style={{color: "#000"}}>$250.00
                                    </td>
                                    <td
                                        style={{color: "#000"}}>{fmSecondBonusPayDate}
                                    </td>
                                </tr>
                                :
                                fmSecondBonusPayDate > currentWeekStartDate && fmSecondBonusPayDate < currentWeekEndDate ?
                                    <tr style={{background: "rgb(241 241 241)"}}>
                                        <td>
                                            {/*<i className="glyphicon glyphicon-star"></i>*/}
                                            <span className="svg-icon svg-icon-primary certify svg-icon-2x">
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                            // xmlns:xlink="http://www.w3.org/1999/xlink"
                                             width="24px"
                                             height="24px" viewBox="0 0 24 24"
                                             version="1.1">
                                            <g stroke="none" strokeWidth="1" fill="none"
                                               fillRule="evenodd">
                                                <rect x="0" y="0" width="24" height="24"/>
                                                <path
                                                    d="M12,15 C10.3431458,15 9,13.6568542 9,12 C9,10.3431458 10.3431458,9 12,9 C13.6568542,9 15,10.3431458 15,12 C15,13.6568542 13.6568542,15 12,15 Z"
                                                    fill="#e79236" fillRule="nonzero"/>
                                                <path
                                                    d="M19.5,10.5 L21,10.5 C21.8284271,10.5 22.5,11.1715729 22.5,12 C22.5,12.8284271 21.8284271,13.5 21,13.5 L19.5,13.5 C18.6715729,13.5 18,12.8284271 18,12 C18,11.1715729 18.6715729,10.5 19.5,10.5 Z M16.0606602,5.87132034 L17.1213203,4.81066017 C17.7071068,4.22487373 18.6568542,4.22487373 19.2426407,4.81066017 C19.8284271,5.39644661 19.8284271,6.34619408 19.2426407,6.93198052 L18.1819805,7.99264069 C17.5961941,8.57842712 16.6464466,8.57842712 16.0606602,7.99264069 C15.4748737,7.40685425 15.4748737,6.45710678 16.0606602,5.87132034 Z M16.0606602,18.1819805 C15.4748737,17.5961941 15.4748737,16.6464466 16.0606602,16.0606602 C16.6464466,15.4748737 17.5961941,15.4748737 18.1819805,16.0606602 L19.2426407,17.1213203 C19.8284271,17.7071068 19.8284271,18.6568542 19.2426407,19.2426407 C18.6568542,19.8284271 17.7071068,19.8284271 17.1213203,19.2426407 L16.0606602,18.1819805 Z M3,10.5 L4.5,10.5 C5.32842712,10.5 6,11.1715729 6,12 C6,12.8284271 5.32842712,13.5 4.5,13.5 L3,13.5 C2.17157288,13.5 1.5,12.8284271 1.5,12 C1.5,11.1715729 2.17157288,10.5 3,10.5 Z M12,1.5 C12.8284271,1.5 13.5,2.17157288 13.5,3 L13.5,4.5 C13.5,5.32842712 12.8284271,6 12,6 C11.1715729,6 10.5,5.32842712 10.5,4.5 L10.5,3 C10.5,2.17157288 11.1715729,1.5 12,1.5 Z M12,18 C12.8284271,18 13.5,18.6715729 13.5,19.5 L13.5,21 C13.5,21.8284271 12.8284271,22.5 12,22.5 C11.1715729,22.5 10.5,21.8284271 10.5,21 L10.5,19.5 C10.5,18.6715729 11.1715729,18 12,18 Z M4.81066017,4.81066017 C5.39644661,4.22487373 6.34619408,4.22487373 6.93198052,4.81066017 L7.99264069,5.87132034 C8.57842712,6.45710678 8.57842712,7.40685425 7.99264069,7.99264069 C7.40685425,8.57842712 6.45710678,8.57842712 5.87132034,7.99264069 L4.81066017,6.93198052 C4.22487373,6.34619408 4.22487373,5.39644661 4.81066017,4.81066017 Z M4.81066017,19.2426407 C4.22487373,18.6568542 4.22487373,17.7071068 4.81066017,17.1213203 L5.87132034,16.0606602 C6.45710678,15.4748737 7.40685425,15.4748737 7.99264069,16.0606602 C8.57842712,16.6464466 8.57842712,17.5961941 7.99264069,18.1819805 L6.93198052,19.2426407 C6.34619408,19.8284271 5.39644661,19.8284271 4.81066017,19.2426407 Z"
                                                    fill="#e79236" fillRule="nonzero"
                                                    opacity="0.3"/>
                                            </g>
                                        </svg>
                                    </span>
                                        </td>
                                        <td
                                            style={{color: "#000"}}>Week 2 Bonus
                                        </td>
                                        <td
                                            style={{color: "#000"}}>$500.00
                                        </td>
                                        <td
                                            style={{color: "#000"}}>{fmSecondBonusPayDate}
                                        </td>
                                    </tr>
                                    : ''
                        }
                        </tbody>
                        <thead style={{fontSize: "13px"}}>
                        <tr style={{background: "#e79236"}}>
                            <td colSpan='4' className="text-center " style={{color: "#fff"}}>Next Week</td>
                        </tr>
                        <tr>
                            {/*<td>Opportunity Id</td>*/}
                            {/*<td>FM Name</td>*/}
                            <td>#</td>
                            <td>Customer Name</td>
                            <td>Commission</td>
                            <td>Date</td>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            nextCommissionsLength > 0 ?
                                nextWeekCommissions.map((nextWeekCommission, index) => {
                                    return (
                                        <tr>
                                            {/*<td>*/}
                                            {/*    {sitsCommissions.Id}*/}
                                            {/*</td>*/}
                                            {/*<td>*/}
                                            {/*    {sitsCommissions.Field_Marketer1__c}*/}
                                            {/*</td>*/}
                                            {/*<td>*/}
                                            {/*    {sitsCommissions.Name}*/}
                                            {/*</td>*/}
                                            <td>
                                                {index + 1}
                                            </td>
                                            <td>
                                                {nextWeekCommission.Name}
                                            </td>
                                            <td>
                                                ${nextWeekCommissionRate.toFixed(2)}
                                            </td>
                                            <td>
                                                {nextWeekCommission.FM_Expected_Pay_Date_New__c}
                                            </td>
                                        </tr>
                                    )
                                }) : <tr>
                                    <td colSpan='4' className="text-center">No Sits Found</td>
                                </tr>
                        }
                        {fmFirstPayDate > nextWeekStartDate && fmFirstPayDate < nextWeekEndDate ?
                            <tr style={{background: "rgb(241 241 241)"}}>
                                <td>
                                    {/*<i className="glyphicon glyphicon-star"></i>*/}
                                    <span className="svg-icon svg-icon-primary certify svg-icon-2x">
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                            // xmlns:xlink="http://www.w3.org/1999/xlink"
                                             width="24px"
                                             height="24px" viewBox="0 0 24 24"
                                             version="1.1">
                                            <g stroke="none" strokeWidth="1" fill="none"
                                               fillRule="evenodd">
                                                <rect x="0" y="0" width="24" height="24"/>
                                                <path
                                                    d="M12,15 C10.3431458,15 9,13.6568542 9,12 C9,10.3431458 10.3431458,9 12,9 C13.6568542,9 15,10.3431458 15,12 C15,13.6568542 13.6568542,15 12,15 Z"
                                                    fill="#e79236" fillRule="nonzero"/>
                                                <path
                                                    d="M19.5,10.5 L21,10.5 C21.8284271,10.5 22.5,11.1715729 22.5,12 C22.5,12.8284271 21.8284271,13.5 21,13.5 L19.5,13.5 C18.6715729,13.5 18,12.8284271 18,12 C18,11.1715729 18.6715729,10.5 19.5,10.5 Z M16.0606602,5.87132034 L17.1213203,4.81066017 C17.7071068,4.22487373 18.6568542,4.22487373 19.2426407,4.81066017 C19.8284271,5.39644661 19.8284271,6.34619408 19.2426407,6.93198052 L18.1819805,7.99264069 C17.5961941,8.57842712 16.6464466,8.57842712 16.0606602,7.99264069 C15.4748737,7.40685425 15.4748737,6.45710678 16.0606602,5.87132034 Z M16.0606602,18.1819805 C15.4748737,17.5961941 15.4748737,16.6464466 16.0606602,16.0606602 C16.6464466,15.4748737 17.5961941,15.4748737 18.1819805,16.0606602 L19.2426407,17.1213203 C19.8284271,17.7071068 19.8284271,18.6568542 19.2426407,19.2426407 C18.6568542,19.8284271 17.7071068,19.8284271 17.1213203,19.2426407 L16.0606602,18.1819805 Z M3,10.5 L4.5,10.5 C5.32842712,10.5 6,11.1715729 6,12 C6,12.8284271 5.32842712,13.5 4.5,13.5 L3,13.5 C2.17157288,13.5 1.5,12.8284271 1.5,12 C1.5,11.1715729 2.17157288,10.5 3,10.5 Z M12,1.5 C12.8284271,1.5 13.5,2.17157288 13.5,3 L13.5,4.5 C13.5,5.32842712 12.8284271,6 12,6 C11.1715729,6 10.5,5.32842712 10.5,4.5 L10.5,3 C10.5,2.17157288 11.1715729,1.5 12,1.5 Z M12,18 C12.8284271,18 13.5,18.6715729 13.5,19.5 L13.5,21 C13.5,21.8284271 12.8284271,22.5 12,22.5 C11.1715729,22.5 10.5,21.8284271 10.5,21 L10.5,19.5 C10.5,18.6715729 11.1715729,18 12,18 Z M4.81066017,4.81066017 C5.39644661,4.22487373 6.34619408,4.22487373 6.93198052,4.81066017 L7.99264069,5.87132034 C8.57842712,6.45710678 8.57842712,7.40685425 7.99264069,7.99264069 C7.40685425,8.57842712 6.45710678,8.57842712 5.87132034,7.99264069 L4.81066017,6.93198052 C4.22487373,6.34619408 4.22487373,5.39644661 4.81066017,4.81066017 Z M4.81066017,19.2426407 C4.22487373,18.6568542 4.22487373,17.7071068 4.81066017,17.1213203 L5.87132034,16.0606602 C6.45710678,15.4748737 7.40685425,15.4748737 7.99264069,16.0606602 C8.57842712,16.6464466 8.57842712,17.5961941 7.99264069,18.1819805 L6.93198052,19.2426407 C6.34619408,19.8284271 5.39644661,19.8284271 4.81066017,19.2426407 Z"
                                                    fill="#e79236" fillRule="nonzero"
                                                    opacity="0.3"/>
                                            </g>
                                        </svg>
                                    </span>
                                </td>
                                <td
                                    style={{color: "#000"}}>Initial Pay
                                </td>
                                <td
                                    style={{color: "#000"}}>$480.00
                                </td>
                                <td
                                    style={{color: "#000"}}>{fmFirstPayDate}
                                </td>
                            </tr>
                            :
                            fmFirstBonusPayDate > nextWeekStartDate && fmFirstBonusPayDate < nextWeekEndDate ?
                                <tr style={{background: "rgb(241 241 241)"}}>
                                    <td>
                                        {/*<i className="glyphicon glyphicon-star"></i>*/}
                                        <span className="svg-icon svg-icon-primary certify svg-icon-2x">
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                            // xmlns:xlink="http://www.w3.org/1999/xlink"
                                             width="24px"
                                             height="24px" viewBox="0 0 24 24"
                                             version="1.1">
                                            <g stroke="none" strokeWidth="1" fill="none"
                                               fillRule="evenodd">
                                                <rect x="0" y="0" width="24" height="24"/>
                                                <path
                                                    d="M12,15 C10.3431458,15 9,13.6568542 9,12 C9,10.3431458 10.3431458,9 12,9 C13.6568542,9 15,10.3431458 15,12 C15,13.6568542 13.6568542,15 12,15 Z"
                                                    fill="#e79236" fillRule="nonzero"/>
                                                <path
                                                    d="M19.5,10.5 L21,10.5 C21.8284271,10.5 22.5,11.1715729 22.5,12 C22.5,12.8284271 21.8284271,13.5 21,13.5 L19.5,13.5 C18.6715729,13.5 18,12.8284271 18,12 C18,11.1715729 18.6715729,10.5 19.5,10.5 Z M16.0606602,5.87132034 L17.1213203,4.81066017 C17.7071068,4.22487373 18.6568542,4.22487373 19.2426407,4.81066017 C19.8284271,5.39644661 19.8284271,6.34619408 19.2426407,6.93198052 L18.1819805,7.99264069 C17.5961941,8.57842712 16.6464466,8.57842712 16.0606602,7.99264069 C15.4748737,7.40685425 15.4748737,6.45710678 16.0606602,5.87132034 Z M16.0606602,18.1819805 C15.4748737,17.5961941 15.4748737,16.6464466 16.0606602,16.0606602 C16.6464466,15.4748737 17.5961941,15.4748737 18.1819805,16.0606602 L19.2426407,17.1213203 C19.8284271,17.7071068 19.8284271,18.6568542 19.2426407,19.2426407 C18.6568542,19.8284271 17.7071068,19.8284271 17.1213203,19.2426407 L16.0606602,18.1819805 Z M3,10.5 L4.5,10.5 C5.32842712,10.5 6,11.1715729 6,12 C6,12.8284271 5.32842712,13.5 4.5,13.5 L3,13.5 C2.17157288,13.5 1.5,12.8284271 1.5,12 C1.5,11.1715729 2.17157288,10.5 3,10.5 Z M12,1.5 C12.8284271,1.5 13.5,2.17157288 13.5,3 L13.5,4.5 C13.5,5.32842712 12.8284271,6 12,6 C11.1715729,6 10.5,5.32842712 10.5,4.5 L10.5,3 C10.5,2.17157288 11.1715729,1.5 12,1.5 Z M12,18 C12.8284271,18 13.5,18.6715729 13.5,19.5 L13.5,21 C13.5,21.8284271 12.8284271,22.5 12,22.5 C11.1715729,22.5 10.5,21.8284271 10.5,21 L10.5,19.5 C10.5,18.6715729 11.1715729,18 12,18 Z M4.81066017,4.81066017 C5.39644661,4.22487373 6.34619408,4.22487373 6.93198052,4.81066017 L7.99264069,5.87132034 C8.57842712,6.45710678 8.57842712,7.40685425 7.99264069,7.99264069 C7.40685425,8.57842712 6.45710678,8.57842712 5.87132034,7.99264069 L4.81066017,6.93198052 C4.22487373,6.34619408 4.22487373,5.39644661 4.81066017,4.81066017 Z M4.81066017,19.2426407 C4.22487373,18.6568542 4.22487373,17.7071068 4.81066017,17.1213203 L5.87132034,16.0606602 C6.45710678,15.4748737 7.40685425,15.4748737 7.99264069,16.0606602 C8.57842712,16.6464466 8.57842712,17.5961941 7.99264069,18.1819805 L6.93198052,19.2426407 C6.34619408,19.8284271 5.39644661,19.8284271 4.81066017,19.2426407 Z"
                                                    fill="#e79236" fillRule="nonzero"
                                                    opacity="0.3"/>
                                            </g>
                                        </svg>
                                    </span>
                                    </td>
                                    <td
                                        style={{color: "#000"}}>Week 1 Bonus
                                    </td>
                                    <td
                                        style={{color: "#000"}}>$250.00
                                    </td>
                                    <td
                                        style={{color: "#000"}}>{fmSecondBonusPayDate}
                                    </td>
                                </tr>
                                :
                                fmSecondBonusPayDate > nextWeekStartDate && fmSecondBonusPayDate < nextWeekEndDate ?
                                    <tr style={{background: "rgb(241 241 241)"}}>
                                        <td>
                                            {/*<i className="glyphicon glyphicon-star"></i>*/}
                                            <span className="svg-icon svg-icon-primary certify svg-icon-2x">
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                            // xmlns:xlink="http://www.w3.org/1999/xlink"
                                             width="24px"
                                             height="24px" viewBox="0 0 24 24"
                                             version="1.1">
                                            <g stroke="none" strokeWidth="1" fill="none"
                                               fillRule="evenodd">
                                                <rect x="0" y="0" width="24" height="24"/>
                                                <path
                                                    d="M12,15 C10.3431458,15 9,13.6568542 9,12 C9,10.3431458 10.3431458,9 12,9 C13.6568542,9 15,10.3431458 15,12 C15,13.6568542 13.6568542,15 12,15 Z"
                                                    fill="#e79236" fillRule="nonzero"/>
                                                <path
                                                    d="M19.5,10.5 L21,10.5 C21.8284271,10.5 22.5,11.1715729 22.5,12 C22.5,12.8284271 21.8284271,13.5 21,13.5 L19.5,13.5 C18.6715729,13.5 18,12.8284271 18,12 C18,11.1715729 18.6715729,10.5 19.5,10.5 Z M16.0606602,5.87132034 L17.1213203,4.81066017 C17.7071068,4.22487373 18.6568542,4.22487373 19.2426407,4.81066017 C19.8284271,5.39644661 19.8284271,6.34619408 19.2426407,6.93198052 L18.1819805,7.99264069 C17.5961941,8.57842712 16.6464466,8.57842712 16.0606602,7.99264069 C15.4748737,7.40685425 15.4748737,6.45710678 16.0606602,5.87132034 Z M16.0606602,18.1819805 C15.4748737,17.5961941 15.4748737,16.6464466 16.0606602,16.0606602 C16.6464466,15.4748737 17.5961941,15.4748737 18.1819805,16.0606602 L19.2426407,17.1213203 C19.8284271,17.7071068 19.8284271,18.6568542 19.2426407,19.2426407 C18.6568542,19.8284271 17.7071068,19.8284271 17.1213203,19.2426407 L16.0606602,18.1819805 Z M3,10.5 L4.5,10.5 C5.32842712,10.5 6,11.1715729 6,12 C6,12.8284271 5.32842712,13.5 4.5,13.5 L3,13.5 C2.17157288,13.5 1.5,12.8284271 1.5,12 C1.5,11.1715729 2.17157288,10.5 3,10.5 Z M12,1.5 C12.8284271,1.5 13.5,2.17157288 13.5,3 L13.5,4.5 C13.5,5.32842712 12.8284271,6 12,6 C11.1715729,6 10.5,5.32842712 10.5,4.5 L10.5,3 C10.5,2.17157288 11.1715729,1.5 12,1.5 Z M12,18 C12.8284271,18 13.5,18.6715729 13.5,19.5 L13.5,21 C13.5,21.8284271 12.8284271,22.5 12,22.5 C11.1715729,22.5 10.5,21.8284271 10.5,21 L10.5,19.5 C10.5,18.6715729 11.1715729,18 12,18 Z M4.81066017,4.81066017 C5.39644661,4.22487373 6.34619408,4.22487373 6.93198052,4.81066017 L7.99264069,5.87132034 C8.57842712,6.45710678 8.57842712,7.40685425 7.99264069,7.99264069 C7.40685425,8.57842712 6.45710678,8.57842712 5.87132034,7.99264069 L4.81066017,6.93198052 C4.22487373,6.34619408 4.22487373,5.39644661 4.81066017,4.81066017 Z M4.81066017,19.2426407 C4.22487373,18.6568542 4.22487373,17.7071068 4.81066017,17.1213203 L5.87132034,16.0606602 C6.45710678,15.4748737 7.40685425,15.4748737 7.99264069,16.0606602 C8.57842712,16.6464466 8.57842712,17.5961941 7.99264069,18.1819805 L6.93198052,19.2426407 C6.34619408,19.8284271 5.39644661,19.8284271 4.81066017,19.2426407 Z"
                                                    fill="#e79236" fillRule="nonzero"
                                                    opacity="0.3"/>
                                            </g>
                                        </svg>
                                    </span>
                                        </td>
                                        <td
                                            style={{color: "#000"}}>Week 2 Bonus
                                        </td>
                                        <td
                                            style={{color: "#000"}}>$500.00
                                        </td>
                                        <td
                                            style={{color: "#000"}}>{fmSecondBonusPayDate}
                                        </td>
                                    </tr>
                                    : ''
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
                            ${currentTotalSitCommissions ? currentTotalSitCommissions.toFixed(2) : 0}
                        </h1>
                        <p style={{textAlign: "center", margin: "0px"}}>NEXT WEEK</p>
                        <h1 style={{
                            textAlign: "center",
                            fontWeight: "bold",
                            color: "#70899f",
                            margin: "0px"
                        }}>${nextTotalSitCommissions > 0 ? nextTotalSitCommissions.toFixed(2) : 0}</h1>
                        <br/>
                    </div>
                </div>
            </div>
        )
    }
}
