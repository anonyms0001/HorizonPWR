import {view, emit} from '../../framework'
import SunlightBoard from './fundingBoards/sunlightBoard'
import LoanPalBoard from './fundingBoards/loanpalBoard'
import GenerationsBoard from "./fundingBoards/generationsBoard"
import CashBoard from "./fundingBoards/cashBoard"
import React from 'react'
import fundingStore from "../../stores/fundingStore"


export default view(function FundingPage() {

    const {fundingPayments} = fundingStore

    function refreshFundingBoard() {
        emit.ClickedRefreshFundingBoardBtn()
        emit.ProcessRefreshFundingBoard()
    }

    function formatMoney(amount, decimalCount = 2, decimal = ".", thousands = ",") {
        try {
            decimalCount = Math.abs(decimalCount);
            decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

            const negativeSign = amount < 0 ? "-" : "";

            let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
            let j = (i.length > 3) ? i.length % 3 : 0;

            return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
        } catch (e) {
            // console.log(e)
        }
    }

    let firstAmountCount = 0
    let secondAmountCount = 0

    for (let i = 0; i < fundingPayments.length; i++) {
        if (fundingPayments[i].Pending_Cancellation__c || fundingPayments[i].Project_Cancelled__c || fundingPayments[i].Install_Date__c > '2020-11-13 00:00:00') {
            continue;
        }
        if (!fundingPayments[i].X1st_Funding_Payment_Received__c && fundingPayments[i].Loan_Docs_Signed_Date_Time__c) {
            if (fundingPayments[i].X1st_Funding_Payment_Amount__c !== 0)
                firstAmountCount += fundingPayments[i].X1st_Funding_Payment_Amount__c

        }
        if (fundingPayments[i].X1st_Funding_Payment_Received__c && !fundingPayments[i].X2nd_Funding_Payment_Received__c && fundingPayments[i].Completion_Certificate_Signed_Date_Time__c) {
            if (fundingPayments[i].X2nd_Funding_Payment_Amount__c !== 0)
                secondAmountCount += fundingPayments[i].X2nd_Funding_Payment_Amount__c
        }
    }
    let firstColLabel = "$" + formatMoney(firstAmountCount)
    let secondColLabel = "$" + formatMoney(secondAmountCount)

    console.log("firstColLabel and secondColLabel ", firstColLabel, secondColLabel)

    return (
        <section className="funding-page">
            <div className="row">
                <div className="col-xs-12">
                    <div className="panel  panel-default" style={{marginTop: "2em"}} >
                        <div className="panel-heading">
                            <div style={{display: "flex"}}>
                                <div style={{flex: "1", textAlign: "left", fontSize: "1.3em", fontWeight: "600"}}><span
                                    style={{
                                        fontSize: "1.5em",
                                        fontWeight: "600",
                                        color: "#e69335"
                                    }}>Funding Payments </span> - Needs First Payment: {firstColLabel} - Needs Second Payment:&nbsp;
                                    {secondColLabel}
                                </div>
                                {/*<button  className="btn btn-default expand-btn" style={{border: "none"}}>*/}
                                {/*    <svg xmlns="http://www.w3.org/2000/svg"*/}
                                {/*         width="24px" height="24px"*/}
                                {/*         viewBox="0 0 24 24" version="1.1" className="kt-svg-icon">*/}
                                {/*        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">*/}
                                {/*            <polygon id="Shape" points="0 0 24 0 24 24 0 24" fill="#fff0"/>*/}
                                {/*            <path d="M6.70710678,15.7071068 C6.31658249,16.0976311 5.68341751,16.0976311 5.29289322,15.7071068 C4.90236893,15.3165825 4.90236893,14.6834175 5.29289322,14.2928932 L11.2928932,8.29289322 C11.6714722,7.91431428 12.2810586,7.90106866 12.6757246,8.26284586 L18.6757246,13.7628459 C19.0828436,14.1360383 19.1103465,14.7686056 18.7371541,15.1757246 C18.3639617,15.5828436 17.7313944,15.6103465 17.3242754,15.2371541 L12.0300757,10.3841378 L6.70710678,15.7071068 Z" id="Path-94" fill="#000000" fillRule="nonzero" transform="translate(12.000003, 11.999999) rotate(-180.000000) translate(-12.000003, -11.999999) "/>*/}
                                {/*        </g>*/}
                                {/*    </svg>*/}
                                {/*</button>*/}
                                <div id="installer-calendar-options" style={{paddingRight: "0px"}}>

                                    <button className="btn btn-default" style={{border: "none"}}>
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                             width="24px" height="24px"
                                             viewBox="0 0 24 24" version="1.1" className="kt-svg-icon">
                                            <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                                <rect id="bound" x="0" y="0" width="24" height="24"/>
                                                <circle id="Oval-67" fill="#000000" cx="12" cy="5" r="2"/>
                                                <circle id="Oval-67-Copy" fill="#000000" cx="12" cy="12" r="2"/>
                                                <circle id="Oval-67-Copy-2" fill="#000000" cx="12" cy="19" r="2"/>
                                            </g>
                                        </svg>
                                    </button>
                                    <ul className="dropdown-menu">
                                        <li>
                                            <a tabIndex="2" style={{cursor: "pointer"}}
                                               onClick={refreshFundingBoard.bind(this)}
                                            > <i className="glyphicon glyphicon-refresh"/> Refresh Funding Data</a>
                                        </li>
                                        {/*<li><a tabIndex="2" style={{cursor: "pointer"}}>Hide Calendar</a></li>*/}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div id='partner-items' className="panel-body" style={{padding: "0px"}}>
                            <SunlightBoard/>
                            <LoanPalBoard/>
                            <GenerationsBoard/>
                            <CashBoard/>
                        </div>
                    </div>
                </div>
                <div className="clear20"/>
            </div>

            <div className="clear30"/>
        </section>
    )
})

