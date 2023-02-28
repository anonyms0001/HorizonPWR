import {emit, view} from "../../../framework"
import {MovableCardWrapper} from 'react-trello/dist/styles/Base'
import DeleteButton from 'react-trello/dist/widgets/DeleteButton'
import React from 'react'
import Board from 'react-trello'
import Tag from 'react-trello/dist/components/Card/Tag'
import fundingStore from "../../../stores/fundingStore"
import sessionStore from "../../../stores/sessionStore"

// import {CopyToClipboard} from 'react-copy-to-clipboard'

// const data = require('/src/client/views/support-tools/data/base')
@view
export default class GenerationsBoard extends React.Component {

    render() {
        const {selectedFundingCard, fundingBoardAlert, proposalFundingReloading, financialPartnersFunding, generationsExpanded} = fundingStore
        const {user} = sessionStore

        let fundingPayments = financialPartnersFunding.Generations
         //console.log("sunlightPendingFunding ", fundingPayments)

        if (fundingBoardAlert !== null && fundingBoardAlert !== "hide") {
            setTimeout(clearFundingBoardAlert, 15000)
        }

        function clearFundingBoardAlert() {
            emit.FundingReceivedAlert({alert: 'hide'})
        }

        // console.log('selectedFundingCard ', selectedFundingCard)

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

        const CustomCard = ({
                                onClick,
                                installScheduled,
                                name,
                                projectName,
                                financeType,
                                loanApproved,
                                loanSigned,
                                completionCertificateSigned,
                                firstAmount,
                                secondAmount,
                                invoiceSentGCU,
                                signedGCU,
                                approvedPTO,
                                address,
                                className,
                                cardStyle,
                                body,
                                cardColor,
                                subTitle,
                                tagStyle,
                                escalationText,
                                tags,
                                showDeleteButton,
                                onDelete,

                            }) => {
            const clickDelete = e => {
                onDelete()
                e.stopPropagation()
            }

            return (
                <MovableCardWrapper

                    style={cardStyle}
                    className={className}
                >
                    <header
                        style={{
                            borderBottom: '1px solid #eee',
                            padding: 5,
                            marginBottom: 10,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            color: cardColor
                        }}>
                        {/*<div style={{fontSize: 11, textAlign: "right"}}>{instalScheduled}</div>*/}
                        <div style={{fontSize: 14, fontWeight: 'bold'}}>{projectName}</div>

                        {showDeleteButton && <DeleteButton onClick={clickDelete}/>}
                    </header>
                    <div style={{fontSize: 12}}>
                        <div><b>Install Date:&nbsp;</b></div>
                        <div>
                            {installScheduled}
                        </div>
                           {/* <div><b>Finance Partner:&nbsp;</b></div>
                         <div>Sunlight</div> */}
                        {financeType !== 'Cash' && financeType !== 'Generations' ?
                            <div>
                                <div>
                                    <br/>
                                    <div>
                                        <b>Loan Documents Signed:&nbsp;
                                            {loanSigned ?
                                                <span className="glyphicon glyphicon glyphicon-ok"/> :
                                                <span className="glyphicon glyphicon glyphicon-remove"/>}
                                        </b>
                                    </div>
                                    <br/>
                                    <b>Loan Approved:&nbsp;
                                        {loanApproved ?
                                            <span class="glyphicon glyphicon glyphicon-ok"/> :
                                            <span className="glyphicon glyphicon glyphicon-remove"/>
                                        }
                                    </b>
                                </div>
                                <div>
                                    {
                                        completionCertificateSigned ?
                                            <div>
                                                <br/>
                                                <div>
                                                    <b>Completion Certificate Signed:&nbsp;</b>
                                                    <span className="glyphicon glyphicon glyphicon-ok"/>
                                                </div>
                                            </div>
                                            : ''
                                    }
                                </div>
                                <div>
                                    <div>
                                        <br/>
                                        <div>
                                            <b>PTO Approved:&nbsp;</b>
                                            {
                                                approvedPTO ?
                                                    <span className="glyphicon glyphicon glyphicon-ok"/>
                                                    :
                                                    <span className="glyphicon glyphicon glyphicon-remove"/>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            : financeType === 'Generations' ?
                                <div>
                                    <br/>
                                    <div>
                                        <b>Invoice Sent to GCU:</b>&nbsp;
                                        {invoiceSentGCU ?
                                            <span className="glyphicon glyphicon glyphicon-ok"/>
                                            :
                                            <span className="glyphicon glyphicon glyphicon-remove"/>
                                        }

                                    </div>
                                    <br/>
                                    <div>
                                        <b>GCU COC Signed:</b>&nbsp;
                                        {signedGCU ?
                                            <span className="glyphicon glyphicon glyphicon-ok"/>
                                            :
                                            <span className="glyphicon glyphicon glyphicon-remove"/>
                                        }

                                    </div>
                                </div>
                                : financeType === 'Sunlight' ?
                                    <div>
                                        <br/>
                                        <div>
                                            <b>PTO Approved:</b>&nbsp;
                                            {approvedPTO ?
                                                <span className="glyphicon glyphicon glyphicon-ok"/>
                                                :
                                                <span className="glyphicon glyphicon glyphicon-remove"/>
                                            }

                                        </div>
                                    </div>

                                    : ''
                        }

                        {/*<div><b>Loan Approved:&nbsp;{loanApproved ? <span class="glyphicon glyphicon glyphicon-ok"/> :*/}
                        {/*    <span className="glyphicon glyphicon glyphicon-remove"/>}</b></div>*/}
                        {/*<br/>*/}
                        {/*<div><b>Loan Documents Signed:&nbsp;{loanSigned ?*/}
                        {/*    <span class="glyphicon glyphicon glyphicon-ok"/> :*/}
                        {/*    <span className="glyphicon glyphicon glyphicon-remove"/>}</b></div>*/}
                        {/*<div></div>*/}
                        {/*{*/}
                        {/*    completionCertificateSigned ?*/}
                        {/*        <div>*/}
                        {/*            <br/>*/}
                        {/*            <div><b>Completion Certificate Signed:&nbsp;</b><span*/}
                        {/*                className="glyphicon glyphicon glyphicon-ok"/></div>*/}

                        {/*        </div>*/}
                        {/*        : ''*/}
                        {/*}*/}
                        {/*<br/>*/}
                        {firstAmount ?
                            <div>
                                <div>
                                    <br/>
                                    <b>1st Funding Payment Amount:&nbsp;</b></div>
                                <div>
                                    {firstAmount}
                                </div>
                            </div>
                            : ''}

                        {
                            secondAmount ?
                                <div>
                                    <br/>
                                    <div>
                                        <b>2nd Funding Payment Amount:&nbsp;</b>
                                    </div>
                                    <div>
                                        {secondAmount}
                                    </div>
                                </div>
                                : ''
                        }
                        {/*<div>*/}
                        {/*    <button className='btn btn-default'>Copy Address  &nbsp; <i*/}
                        {/*        className="glyphicon glyphicon glyphicon-copy"/></button>*/}
                        {/*</div>*/}
                        {/*<div>*/}
                        {/*    <button type="button" className="btn btn-primary"*/}
                        {/*    >*/}
                        {/*        Usage Fixed Start Drawing &nbsp;&nbsp; <i className="glyphicon glyphicon-pencil"/>*/}
                        {/*    </button>*/}
                        {/*</div>*/}
                        {/*<div>*/}
                        {/*    <button type="button" className="btn btn-warning"*/}
                        {/*    >*/}
                        {/*        Needs Usage &nbsp;&nbsp; <i className="glyphicon glyphicon-exclamation-sign"/>*/}
                        {/*    </button>*/}
                        {/*</div>*/}
                        <div style={{color: '#4C4C4C', fontWeight: 'bold'}}>{subTitle}</div>
                        <div style={{padding: '5px 0px'}}>
                            <i>{body}</i>
                        </div>
                        <div style={{
                            marginTop: 10,
                            textAlign: 'center',
                            color: cardColor,
                            fontSize: 15,
                            fontWeight: 'bold'
                        }}>{escalationText}</div>
                        {tags && (
                            <div
                                style={{
                                    borderTop: '1px solid #eee',
                                    paddingTop: 6,
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    flexDirection: 'row',
                                    flexWrap: 'wrap'
                                }}>
                                {tags.map(tag => (
                                    <Tag key={tag.title} {...tag} tagStyle={tagStyle} onClick={onClick}/>
                                ))}
                            </div>
                        )}
                    </div>
                </MovableCardWrapper>
            )
        }

        // console.log("fundingPayments ", fundingPayments)

        let today = new Date()
        // today.setHours(today.getHours() - 6)
        let todayToString = today.toISOString()
        let todayDate = todayToString.split('T')

        const data1 = {
            lanes: [
                {
                    id: 'fistPayment',
                    title: 'Need First Payment',
                    label: 0,
                    droppable: false,
                    style: {width: 280},
                    cards: []
                },
                {
                    id: 'secondPayment',
                    label: 0,
                    title: 'Need Second Payment',
                    droppable: false,
                    style: {width: 280},
                    cards: []
                },
                {
                    id: 'qc',
                    title: 'Funding Payments QC',
                    droppable: false,
                    style: {width: 280},
                    cards: []
                }
            ]
        }

        let needsUsageCount = 0
        let firstAmountCount = 0
        let secondAmountCount = 0
        for (let i = 0; i < fundingPayments.length; i++) {
            
            if (fundingPayments[i].Pending_Cancellation__c || fundingPayments[i].Project_Cancelled__c || fundingPayments[i].Install_Complete__c || fundingPayments[i].Install_Date__c > '2020-12-09 00:00:00') {
                continue;
            }
           

            // if (proposals[i].Proposal_Completed__c) continue
            let formattedDate = new Date(fundingPayments[i].Install_Date__c)
            formattedDate = (formattedDate.getMonth() + 1) + "/" + formattedDate.getDate() + "/" + formattedDate.getFullYear()
            // let sqlFormattedDate = proposals[i].Appointment_Date__c
            // let sqlFormattedDate = proposals[i].Appointment_Date__c.split("T")

            //First Payment
         
            if (!fundingPayments[i].X1st_Funding_Payment_Received__c  ) {

                if (fundingPayments[i].X1st_Funding_Payment_Amount__c !== 0)
                    firstAmountCount += fundingPayments[i].X1st_Funding_Payment_Amount__c

                data1.lanes[0].cards.push(
                    {
                        id: fundingPayments[i].Id,
                        draggable: false,
                        projectName: fundingPayments[i].Name,
                        installScheduled: formattedDate ,
                        financeType: fundingPayments[i].Finance_Partner__c,
                        // loanApproved: fundingPayments[i].Loan_Approved_Date_Time__c,
                        // loanSigned: fundingPayments[i].Loan_Docs_Signed_Date_Time__c,
                        invoiceSentGCU: fundingPayments[i].COC_sent_to_GCU__c,
                        signedGCU: fundingPayments[i].GCU_COC_Signed__c,
                        secondAmount: "$" + formatMoney(fundingPayments[i].X2nd_Funding_Payment_Amount__c),
                        completionCertificateSigned: fundingPayments[i].Completion_Certificate_Signed_Date_Time__c,
                        style: {
                            backgroundColor: "#fff"
                        },
                        description: "test",

                        metadata: {
                            id: fundingPayments[i].Id,
                            amount: fundingPayments[i].X1st_Funding_Payment_Amount__c,
                            nextStep: 'second_funding',
                            title: fundingPayments[i].Name
                        },

                        tags: [
                            {
                                id: fundingPayments[i].Id + "-tag",
                                title: "Log Second Funding Payment",
                                color: "#fff", bgcolor: "rgb(230 147 53)"

                            }

                        ]
                    }
                )
            }

            //Second Payment
            if (fundingPayments[i].X1st_Funding_Payment_Received__c && !fundingPayments[i].X2nd_Funding_Payment_Received__c && fundingPayments[i].Completion_Certificate_Signed_Date_Time__c && fundingPayments[i].Finance_Partner__c !== 'Generations') {
                if (fundingPayments[i].X2nd_Funding_Payment_Amount__c !== 0)
                    secondAmountCount += fundingPayments[i].X2nd_Funding_Payment_Amount__c

                data1.lanes[1].cards.push(
                    {
                        id: fundingPayments[i].Id,
                        draggable: false,
                        projectName: fundingPayments[i].Name,
                        installScheduled: formattedDate,
                        financeType: fundingPayments[i].Finance_Partner__c,
                        loanApproved: fundingPayments[i].Loan_Approved_Date_Time__c,
                        loanSigned: fundingPayments[i].Loan_Docs_Signed_Date_Time__c,
                        secondAmount: "$" + formatMoney(fundingPayments[i].X2nd_Funding_Payment_Amount__c),
                        approvedPTO: fundingPayments[i].PTO_Approved__c,
                        completionCertificateSigned: fundingPayments[i].Completion_Certificate_Signed_Date_Time__c,
                        style: {
                            backgroundColor: "#fff"
                        },
                        description: "test",

                        metadata: {
                            id: fundingPayments[i].Id,
                            amount: fundingPayments[i].X2nd_Funding_Payment_Amount__c,
                            nextStep: 'qc_funding',
                            title: fundingPayments[i].Name
                        },

                        tags: [
                            {
                                id: fundingPayments[i].Id + "-tag",
                                title: "Log Second Funding Payment",
                                color: "#fff", bgcolor: "rgb(230 147 53)"

                            }

                        ]
                    }
                )

            } else if (fundingPayments[i].X1st_Funding_Payment_Received__c && !fundingPayments[i].X2nd_Funding_Payment_Received__c && fundingPayments[i].Completion_Certificate_Signed_Date_Time__c && fundingPayments[i].Finance_Partner__c === 'Generations') {
                if (fundingPayments[i].X2nd_Funding_Payment_Amount__c !== 0)
                    secondAmountCount += fundingPayments[i].X2nd_Funding_Payment_Amount__c

                data1.lanes[1].cards.push(
                    {
                        id: fundingPayments[i].Id,
                        draggable: false,
                        projectName: fundingPayments[i].Name,
                        installScheduled: formattedDate,
                        financeType: fundingPayments[i].Finance_Partner__c,
                        // loanApproved: fundingPayments[i].Loan_Approved_Date_Time__c,
                        // loanSigned: fundingPayments[i].Loan_Docs_Signed_Date_Time__c,
                        invoiceSentGCU: fundingPayments[i].GCU_COC_Signed__c,
                        signedGCU: fundingPayments[i].COC_sent_to_GCU__c,
                        secondAmount: "$" + formatMoney(fundingPayments[i].X2nd_Funding_Payment_Amount__c),
                        completionCertificateSigned: fundingPayments[i].Completion_Certificate_Signed_Date_Time__c,
                        style: {
                            backgroundColor: "#fff"
                        },
                        description: "test",

                        metadata: {
                            id: fundingPayments[i].Id,
                            amount: fundingPayments[i].X2nd_Funding_Payment_Amount__c,
                            nextStep: 'qc_funding',
                            title: fundingPayments[i].Name
                        },

                        tags: [
                            {
                                id: fundingPayments[i].Id + "-tag",
                                title: "Log Second Funding Payment",
                                color: "#fff", bgcolor: "rgb(230 147 53)"

                            }

                        ]
                    }
                )
            }
            //Funding QC
            if (fundingPayments[i].X1st_Funding_Payment_Received__c && fundingPayments[i].X2nd_Funding_Payment_Received__c && !fundingPayments[i].Substantial_Completion_Submitted__c) {

                data1.lanes[2].cards.push(
                    {
                        id: fundingPayments[i].Id,
                        draggable: false,
                        projectName: fundingPayments[i].Name,
                        installScheduled: formattedDate,
                        financeType: fundingPayments[i].Finance_Partner__c,
                        loanApproved: fundingPayments[i].Loan_Approved_Date_Time__c,
                        loanSigned: fundingPayments[i].Loan_Docs_Signed_Date_Time__c,
                        firstAmount: "$" + formatMoney(fundingPayments[i].X1st_Funding_Payment_Amount__c),
                        secondAmount: "$" + formatMoney(fundingPayments[i].X2nd_Funding_Payment_Amount__c),
                        completionCertificateSigned: fundingPayments[i].Completion_Certificate_Signed_Date_Time__c,
                        style: {
                            backgroundColor: "#fff"
                        },
                        description: "test",

                        metadata: {
                            id: fundingPayments[i].Id,
                            nextStep: 'markedAsCompleted'

                        },

                        tags: [
                            {
                                id: fundingPayments[i].Id + "-tag",
                                title: "Mark as Completed",
                                color: "#fff", bgcolor: "rgb(92, 184, 92)"

                            }

                        ]
                    }
                )

            }
        }

        let firstColLabel = "$" + formatMoney(firstAmountCount)
        let secondColLabel = "$" + formatMoney(secondAmountCount)
        data1.lanes[0].label = firstColLabel
        data1.lanes[1].label = secondColLabel

        // console.log("firstAmountCount ", firstAmountCount)
        this.processCardNextStep = function (cardId, metadata, laneId) {
            // console.log("processCardNextStep ", cardId, metadata, laneId)

            if (metadata.nextStep === 'second_funding') {
                document.getElementById('modal-first-payment').classList.add("in")
                emit.ClickedSelectedFundingCard({metadata: metadata})
                // emit.StartProposalDrawing({leadId: cardId, accountId: user.accountId, now: todayDate[0]})
            } else if (metadata.nextStep === 'qc_funding') {
                emit.ClickedSelectedFundingCard({metadata: metadata})
                document.getElementById('modal-second-payment').classList.add("in")
            } else if (metadata.nextStep === 'markedAsCompleted') {
                emit.SubmitSubstantialCompletion({projectId: metadata.id})
            }
        }

        function closeModal() {
            document.getElementById('modal-first-payment').classList.remove("in")
            document.getElementById('modal-second-payment').classList.remove("in")

        }

        function setInputFilter(textbox, inputFilter) {
            ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function (event) {
                textbox.addEventListener(event, function () {
                    if (inputFilter(this.value)) {
                        this.oldValue = this.value;
                        this.oldSelectionStart = this.selectionStart;
                        this.oldSelectionEnd = this.selectionEnd;
                    } else if (this.hasOwnProperty("oldValue")) {
                        this.value = this.oldValue;
                        this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
                    } else {
                        this.value = "";
                    }
                });
            });
        }


        function checkFirstValidation(amount) {
            setInputFilter(document.getElementById("firstAmount"), function (value) {
                return /^[0-9]*\.?[0-9]*$/.test(value);
            });

            const re = /^[0-9\b]+$/
            let firstAmountVal = document.getElementById('firstAmount').value
            let comparedAmount = amount.toFixed(2)
            // console.log("firstAmountVal ", firstAmountVal, comparedAmount)
            if (firstAmountVal === re) {
                document.getElementById('firstAmount').value = firstAmountVal
            }

            if (firstAmountVal === comparedAmount) {
                document.getElementById('first-btn-submit').classList.remove("disabled")
            } else {
                document.getElementById('first-btn-submit').classList.add("disabled")
            }
        }

        function checkSecondValidation(amount) {
            setInputFilter(document.getElementById("secondAmount"), function (value) {
                return /^[0-9]*\.?[0-9]*$/.test(value);
            });

            let secondAmountVal = document.getElementById('secondAmount').value
            let comparedAmount = amount.toFixed(2)
            // console.log("secondAmountVal ", secondAmountVal, comparedAmount)
            if (secondAmountVal === comparedAmount) {
                document.getElementById('second-btn-submit').classList.remove("disabled")
            } else {
                document.getElementById('first-btn-submit').classList.add("disabled")
            }
        }

        function saveFirstAmount(metadata) {
            // console.log("saveFirstAmount ", metadata.id)
            document.getElementById('modal-first-payment').classList.remove("in")
            emit.ConfirmFirstFundingPayment({projectId: metadata.id})

        }

        function saveSecondAmount(metadata) {
            // console.log("saveSecondAmount ", metadata.id)
            emit.ConfirmSecondFundingPayment({projectId: metadata.id})
            document.getElementById('modal-second-payment').classList.remove("in")
        }

        function refreshFundingBoard() {
            emit.ClickedRefreshFundingBoardBtn()
            emit.ProcessRefreshFundingBoard()
        }

        function expandToogle() {
            if (generationsExpanded) {
                emit.ClickedExpandedBtn({financePartner: 'generations', selectedState: false})
            } else {
                emit.ClickedExpandedBtn({financePartner: 'generations', selectedState: true})
            }
        }


        return (
            <div>
                <div className="panel  panel-default" style={{margin: "0px", boxShadow: "none"}}>
                    <div className="panel-heading">
                        <div style={{display: "flex"}}>
                            <div style={{flex: "1", textAlign: "left", fontSize: "1.3em"}}>Generations Funding
                                Payments - Needs First Payment: {firstColLabel} - Needs Second Payment: {secondColLabel}
                            </div>
                            <button className="btn btn-default expand-btn" style={{border: "none"}} onClick={expandToogle.bind(this)}>
                                {generationsExpanded ?

                                    <svg xmlns="http://www.w3.org/2000/svg"
                                         width="24px" height="24px" viewBox="0 0 24 24" version="1.1"
                                         className="kt-svg-icon">
                                        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                            <polygon id="Shape" points="0 0 24 0 24 24 0 24"/>
                                            <path
                                                d="M6.70710678,15.7071068 C6.31658249,16.0976311 5.68341751,16.0976311 5.29289322,15.7071068 C4.90236893,15.3165825 4.90236893,14.6834175 5.29289322,14.2928932 L11.2928932,8.29289322 C11.6714722,7.91431428 12.2810586,7.90106866 12.6757246,8.26284586 L18.6757246,13.7628459 C19.0828436,14.1360383 19.1103465,14.7686056 18.7371541,15.1757246 C18.3639617,15.5828436 17.7313944,15.6103465 17.3242754,15.2371541 L12.0300757,10.3841378 L6.70710678,15.7071068 Z"
                                                id="Path-94" fill="#000000" fillRule="nonzero"/>
                                        </g>
                                    </svg>
                                    :
                                    <svg xmlns="http://www.w3.org/2000/svg"
                                         width="24px" height="24px"
                                         viewBox="0 0 24 24" version="1.1" className="kt-svg-icon">
                                        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                            <polygon id="Shape" points="0 0 24 0 24 24 0 24" fill="#fff0"/>
                                            <path
                                                d="M6.70710678,15.7071068 C6.31658249,16.0976311 5.68341751,16.0976311 5.29289322,15.7071068 C4.90236893,15.3165825 4.90236893,14.6834175 5.29289322,14.2928932 L11.2928932,8.29289322 C11.6714722,7.91431428 12.2810586,7.90106866 12.6757246,8.26284586 L18.6757246,13.7628459 C19.0828436,14.1360383 19.1103465,14.7686056 18.7371541,15.1757246 C18.3639617,15.5828436 17.7313944,15.6103465 17.3242754,15.2371541 L12.0300757,10.3841378 L6.70710678,15.7071068 Z"
                                                id="Path-94" fill="#000000" fillRule="nonzero"
                                                transform="translate(12.000003, 11.999999) rotate(-180.000000) translate(-12.000003, -11.999999) "/>
                                        </g>
                                    </svg>
                                }
                            </button>
                            {/*<div id="installer-calendar-options" style={{paddingRight: "0px"}}>*/}

                            {/*    <button className="btn btn-default" style={{border: "none"}}>*/}
                            {/*        <svg xmlns="http://www.w3.org/2000/svg"*/}
                            {/*             width="24px" height="24px"*/}
                            {/*             viewBox="0 0 24 24" version="1.1" className="kt-svg-icon">*/}
                            {/*            <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">*/}
                            {/*                <rect id="bound" x="0" y="0" width="24" height="24"/>*/}
                            {/*                <circle id="Oval-67" fill="#000000" cx="12" cy="5" r="2"/>*/}
                            {/*                <circle id="Oval-67-Copy" fill="#000000" cx="12" cy="12" r="2"/>*/}
                            {/*                <circle id="Oval-67-Copy-2" fill="#000000" cx="12" cy="19" r="2"/>*/}
                            {/*            </g>*/}
                            {/*        </svg>*/}
                            {/*    </button>*/}
                            {/*    <ul className="dropdown-menu">*/}
                            {/*        <li>*/}
                            {/*            <a tabIndex="2" style={{cursor: "pointer"}}*/}
                            {/*               onClick={refreshFundingBoard.bind(this)}*/}
                            {/*            > <i className="glyphicon glyphicon-refresh"/> Refresh Board</a>*/}
                            {/*        </li>*/}
                            {/*        /!*<li><a tabIndex="2" style={{cursor: "pointer"}}>Hide Calendar</a></li>*!/*/}
                            {/*    </ul>*/}
                            {/*</div>*/}
                        </div>
                    </div>
                    <div id='funding-body-panel' className="panel-body"
                         style={generationsExpanded ? {display: "block", padding: "0px"} : {display: "none"}}>
                        {fundingBoardAlert === null || fundingBoardAlert === 'hide' ?
                            ''
                            : <div id='alert-funding-start' className="alert alert-default">
                                <span className="glyphicon glyphicon-info-sign" style={{marginRight: "6px"}}/>
                                {fundingBoardAlert}
                            </div>
                        }
                        {/*<button onClick={this.completeMilkEvent} style={{margin: 5}}>*/}
                        {/*    Complete Buy Milk*/}
                        {/*</button>*/}
                        <Board style={{
                            backgroundImage: "linear-gradient(rgba(255, 255, 255, 0) 60%, rgb(6, 44, 69)), linear-gradient(70deg, rgb(231, 145, 54) 32%, rgba(6, 44, 69, 0.59))",
                            padding: "55px 5px", margin: "auto"
                        }}
                            // data={this.state.boardData}
                               data={data1}
                               components={{Card: CustomCard}}
                            // eventBusHandle={this.setEventBus}
                            //    onCardClick={(cardId, metadata, laneId) => alert(`Card with id:${cardId} clicked. Has metadata.id: ${metadata.id}. Card in lane: ${laneId}`)}
                            // onCardClick={cardModal.bind(this, metadata.id) }
                               onCardClick={(cardId, metadata, laneId) => this.processCardNextStep(cardId, metadata, laneId)}
                        />

                    </div>
                </div>

                <div id='modal-first-payment' className="modal fade ">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header" style={{borderBottom: "1px solid #ddd"}}>
                                <button type="button" style={{fontSize: "25px"}} className="close" data-dismiss="modal"
                                        onClick={closeModal.bind(this)}
                                        aria-hidden="true">&times;</button>
                                <h4 className="modal-title">
                                    {selectedFundingCard.metadata ? selectedFundingCard.metadata.title : ''} - First
                                    Funding Payment
                                </h4>
                            </div>
                            <div className="modal-body text-center">

                                {selectedFundingCard.metadata ?
                                    <div className='well'
                                         style={{background: "#f5f5f5", position: "relative", marginBottom: "0px"}}>
                                        <form id='form-first-payment' method="POST" onSubmit={e => {
                                            e.preventDefault()
                                            emit.ProposalUpdateIncompleReason({
                                                proposalId: selectedFundingCard.metadata.id,
                                                incompleteReason: document.getElementById('incomplete-reason').value

                                            })
                                        }}>

                                            <label htmlFor="firstAmount">
                                                Expected Funding Payment
                                            </label>
                                            <div className="input-group">
                                                <span className="input-group-addon">$</span>
                                                <input id="firstAmount" name="firstAmount"
                                                       placeholder={selectedFundingCard.metadata ? selectedFundingCard.metadata.amount.toFixed(2) : ''}
                                                       onInput={checkFirstValidation.bind(this, selectedFundingCard.metadata.amount)}
                                                       type="text" className="form-control" required/>
                                            </div>
                                        </form>
                                    </div>
                                    : ''}
                            </div>
                            <div className="modal-footer" style={{textAlign: "center", borderTop: "1px solid #ddd"}}>

                                <button type="button" className="btn btn-primary btn-lg disabled" id="first-btn-submit"
                                        onClick={saveFirstAmount.bind(this, selectedFundingCard.metadata)}
                                >
                                    Submit Received Funding Amount
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div id='modal-second-payment' className="modal fade ">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header" style={{borderBottom: "1px solid #ddd"}}>
                                <button type="button" style={{fontSize: "25px"}} className="close" data-dismiss="modal"
                                        onClick={closeModal.bind(this)}
                                        aria-hidden="true">&times;</button>
                                <h4 className="modal-title">
                                    {selectedFundingCard.metadata ? selectedFundingCard.metadata.title : ''} - Second
                                    Funding Payment
                                </h4>
                            </div>
                            <div className="modal-body text-center">

                                {selectedFundingCard.metadata ?
                                    <div className='well'
                                         style={{background: "#f5f5f5", position: "relative", marginBottom: "0px"}}>
                                        <form id='form-second-payment' method="POST" onSubmit={e => {
                                            e.preventDefault()
                                            emit.ProposalUpdateIncompleReason({
                                                proposalId: selectedFundingCard.metadata.id,
                                                incompleteReason: document.getElementById('incomplete-reason').value

                                            })
                                        }}>
                                            <label htmlFor="firstAmount">
                                                Expected Funding Payment
                                                {/*${selectedFundingCard.metadata ? selectedFundingCard.metadata.amount.toFixed(2) : ''}*/}
                                            </label>
                                            <div className="input-group">
                                                <span className="input-group-addon">$</span>
                                                <input id="secondAmount" name="secondAmount"
                                                       placeholder={selectedFundingCard.metadata ? selectedFundingCard.metadata.amount.toFixed(2) : ''}
                                                       onInput={checkSecondValidation.bind(this, selectedFundingCard.metadata.amount)}
                                                       type="text" className="form-control" required/>
                                            </div>
                                        </form>
                                    </div>
                                    : ''}
                            </div>
                            <div className="modal-footer" style={{textAlign: "center", borderTop: "1px solid #ddd"}}>
                                <button type="button" className="btn btn-primary btn-lg disabled" id="second-btn-submit"
                                        onClick={saveSecondAmount.bind(this, selectedFundingCard.metadata)}
                                >
                                    Submit Received Funding Amount
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}