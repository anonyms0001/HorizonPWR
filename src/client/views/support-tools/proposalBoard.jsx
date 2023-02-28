import {emit, view} from "../../framework"
import React from 'react'
import Board from 'react-trello'
import proposalStore from "../../stores/proposalStore"
import sessionStore from "../../stores/sessionStore"
import {CopyToClipboard} from 'react-copy-to-clipboard'

// const data = require('/src/client/views/support-tools/data/base')
@view
export default class ProposalBoard extends React.Component {


    render() {

        const {proposals, alert, selectedCard, proposalReloading} = proposalStore
        const {user} = sessionStore

        // console.log("alert ", alert)

        if (alert !== null && alert !== "hide") {
            setTimeout(clearAlert, 15000)
        }

        function clearAlert() {
            emit.ReceivedAlert({alert: 'hide'})
        }

        // console.log("proposals ", proposals)
        // console.log("user ", user)
        console.log("selectedCard Top ", selectedCard)
        let today = new Date()
        // today.setHours(today.getHours() - 6)
        let todayToString = today.toISOString()
        let todayDate = todayToString.split('T')
        // console.log("todayDate ", todayDate[0])

        // console.log("todayToString ", todayToString)
        const data1 = {
            lanes: [
                {
                    id: 'new',
                    title: 'New',
                    droppable: false,
                    style: {width: 280},
                    cards: []
                },
                {
                    id: 'drawing',
                    title: 'Drawing',
                    droppable: false,
                    style: {width: 280},
                    cards: []
                },
                {
                    id: 'qc',
                    title: 'QC',
                    droppable: false,
                    style: {width: 280},
                    cards: []
                },
                {
                    id: 'needs',
                    title: 'Needs Usage',
                    droppable: false,
                    style: {width: 280},
                    cards: []
                }
            ]
        }


        let needsUsageCount = 0
        for (let i = 0; i < proposals.length; i++) {
            //NEW
             if (proposals[i].designer === null && !proposals[i].Need_Usage__c) {
                if (proposals[i].Proposal_Completed__c) continue
                let formattedDate = new Date(proposals[i].Appointment_Date__c)
                formattedDate = (formattedDate.getMonth() + 1) + "/" + (formattedDate.getDate() + 1 )  + "/" + formattedDate.getFullYear()
                // let sqlFormattedDate = proposals[i].Appointment_Date__c
                let sqlFormattedDate = proposals[i].Appointment_Date__c.split("T")
                   let address = (proposals[i].Street_Address__c ? proposals[i].Street_Address__c + ", " : '')  + ( proposals[i].City__c ? proposals[i].City__c + ", " : '') + ( proposals[i].State__c ? proposals[i].State__c + ", " : '') + ( proposals[i].Zip__c ? proposals[i].Zip__c + ", " : '')
                // sqlFormattedDate = sqlFormattedDate.getFullYear() + "-" + (sqlFormattedDate.getMonth() + 1) + "-" + sqlFormattedDate.getDate()
                // console.log("sqlFormattedDate ", sqlFormattedDate[0])
                data1.lanes[0].cards.push(
                    {
                        id: proposals[i].Id,
                        draggable: false,
                        title: proposals[i].Name,
                        label: "Due " + (todayDate[0] === sqlFormattedDate[0] ? "today" : formattedDate),
                        description: "FM: " + proposals[i].Field_Marketer__c  + "\n\nCanvass Status: " + proposals[i].Canvass_Status__c + "\n\nAddress: " + address,
                        metadata: {
                            id: proposals[i].Id,
                            title: proposals[i].Name,
                            description: "Appointment : " + proposals[i].Appointment_Date__c,
                            nextStep: "drawing",
                             address: address
                        },
                        tags: [
                            {
                                id: proposals[i].Id + "-tag",
                                title: "Start Proposal",
                                color: "#fff", bgcolor: "rgb(30, 136, 229)"
                            }

                        ]
                    },
                )
            }
            //DRAWING
             if (proposals[i].designer !== null && !proposals[i].Proposal_Completed__c ) {
                let formattedDate = new Date(proposals[i].Appointment_Date__c)
                formattedDate = (formattedDate.getMonth() + 1) + "/" + ( formattedDate.getDate() + 1 ) + "/" + formattedDate.getFullYear()
                let sqlFormattedDate = proposals[i].Appointment_Date__c.split("T")
                 if(proposals[i].Reason_Proposal_Incomplete__c || proposals[i].Need_Usage__c) {
                    data1.lanes[1].cards.push(
                        {
                            id: proposals[i].Id,
                            draggable: false,
                            title: proposals[i].Name,
                            label: "Due " + (todayDate[0] === sqlFormattedDate[0] ? "today" : formattedDate),
                            style: {
                                backgroundColor: (proposals[i].Reason_Proposal_Incomplete__c ? "#faebcc" : "#fff")
                            },
                            description: (proposals[i].Need_Usage__c ? "Needs Usage" : "") + "\nFM: " + proposals[i].Field_Marketer__c + "\nDesigner: " +
                                proposals[i].designer + (proposals[i].Reason_Proposal_Incomplete__c ? "\n\nReason Incomplete " + proposals[i].Reason_Proposal_Incomplete__c : ''),

                            metadata: {
                                id: proposals[i].Id,
                                title: proposals[i].Name,
                                description: "Appointment : " + formattedDate + " Designer: " + proposals[i].designer,
                                issues: (proposals[i].Reason_Proposal_Incomplete__c || proposals[i].Need_Usage__c ? "true" : "false"),
                                nextStep: (proposals[i].Reason_Proposal_Incomplete__c || proposals[i].Need_Usage__c ? "qc" : "beforeQC"),
                            },

                            tags: [
                                {
                                    id: proposals[i].Id + "-tag",
                                    title: (proposals[i].Reason_Proposal_Incomplete__c ? "Issues Fixed Ready for QC" : "Drawing Options"),

                                    color: "#fff", bgcolor: "#5cb85c"

                                }

                            ]
                        },
                    )
                }else{
                    data1.lanes[1].cards.unshift(
                        {
                            id: proposals[i].Id,
                            draggable: false,
                            title: proposals[i].Name,
                            label: "Due " + (todayDate[0] === sqlFormattedDate[0] ? "today" : formattedDate),
                            style: {
                                backgroundColor: (proposals[i].Reason_Proposal_Incomplete__c ? "#faebcc" : "#fff")
                            },
                            description: (proposals[i].Need_Usage__c ? "Needs Usage" : "") + "\nFM: " + proposals[i].Field_Marketer__c + "\nDesigner: " +
                                proposals[i].designer + (proposals[i].Reason_Proposal_Incomplete__c ? "\n\nReason Incomplete " + proposals[i].Reason_Proposal_Incomplete__c : ''),

                            metadata: {
                                id: proposals[i].Id,
                                title: proposals[i].Name,
                                description: "Appointment : " + formattedDate + " Designer: " + proposals[i].designer,
                                issues: (proposals[i].Reason_Proposal_Incomplete__c || proposals[i].Need_Usage__c ? "true" : "false"),
                                nextStep: (proposals[i].Reason_Proposal_Incomplete__c || proposals[i].Need_Usage__c ? "qc" : "beforeQC"),
                            },

                            tags: [
                                {
                                    id: proposals[i].Id + "-tag",
                                    title: (proposals[i].Reason_Proposal_Incomplete__c ? "Issues Fixed Ready for QC" : "Drawing Options"),

                                    color: "#fff", bgcolor: "#5cb85c"

                                }

                            ]
                        },
                    )
                }
            }
            //QC
            if (proposals[i].Proposal_Completed__c && proposals[i].Proposal_QC_s_Date_Time__c === null) {
                let formattedDate = new Date(proposals[i].Appointment_Date__c)
                formattedDate = (formattedDate.getMonth() + 1) + "/" + (formattedDate.getDate() +  1) + "/" + formattedDate.getFullYear()
                let sqlFormattedDate = proposals[i].Appointment_Date__c.split("T")
                if(proposals[i].qc_guy === null) {
                    data1.lanes[2].cards.push(
                        {
                            id: proposals[i].Id,
                            draggable: false,
                            title: proposals[i].Name,
                            label: "Due " + (todayDate[0] === sqlFormattedDate[0] ? "today" : formattedDate),
                            description: "Appointment : " + formattedDate + "\n QC by: " + (proposals[i].qc_guy !== null ? proposals[i].qc_guy : 'No one yet'),
                            metadata: {
                                id: proposals[i].Id,
                                title: proposals[i].Name,
                                description: "Appointment : " + proposals[i].Appointment_Date__c,
                                nextStep: (proposals[i].qc_guy !== null ? "qcFinished" : "setQCGuy")
                            },
                            tags: [
                                {
                                    id: proposals[i].Id + "-tag",
                                    title: (proposals[i].qc_guy !== null ? "Mark QC as Finished" : "Start QC"),
                                    color: "#fff",
                                    bgcolor: (proposals[i].qc_guy !== null ? "#5bc0de" : "rgb(30, 136, 229)"),
                                }

                            ]
                        },
                    )
                }else{
                    data1.lanes[2].cards.unshift(
                        {
                            id: proposals[i].Id,
                            draggable: false,
                            title: proposals[i].Name,
                            label: "Due " + (todayDate[0] === sqlFormattedDate[0] ? "today" : formattedDate),
                            description: "Appointment : " + formattedDate + "\n QC by: " + (proposals[i].qc_guy !== null ? proposals[i].qc_guy : 'No one yet'),
                            metadata: {
                                id: proposals[i].Id,
                                title: proposals[i].Name,
                                description: "Appointment : " + proposals[i].Appointment_Date__c,
                                nextStep: (proposals[i].qc_guy !== null ? "qcFinished" : "setQCGuy")
                            },
                            tags: [
                                {
                                    id: proposals[i].Id + "-tag",
                                    title: (proposals[i].qc_guy !== null ? "Mark QC as Finished" : "Start QC"),
                                    color: "#fff",
                                    bgcolor: (proposals[i].qc_guy !== null ? "#5bc0de" : "rgb(30, 136, 229)"),
                                }

                            ]
                        },
                    )
                }
            }
            //NEEDS USAGE
            if (proposals[i].Need_Usage__c && proposals[i].designer === null) {
                let formattedDate = new Date(proposals[i].Appointment_Date__c)
                formattedDate = (formattedDate.getMonth() + 1) + "/" + (formattedDate.getDate() +  1) + "/" + formattedDate.getFullYear()
                let sqlFormattedDate = proposals[i].Appointment_Date__c.split("T")
                data1.lanes[3].cards.push(
                    {
                        id: proposals[i].Id,
                        draggable: false,
                        title: proposals[i].Name,
                        label: (todayDate[0] === sqlFormattedDate[0] ? "due today" : ""),
                        description: "Appointment : " + formattedDate + "\nFM: " + proposals[i].Field_Marketer__c,
                        metadata: {
                            id: proposals[i].Id,
                            title: proposals[i].Name,
                            description: "Appointment : " + proposals[i].Appointment_Date__c,
                            nextStep: "noUsage"
                        },
                        tags: [
                            {
                                id: proposals[i].Id + "-tag",
                                title: "Usage Options",
                                color: "#fff", bgcolor: "#f0ad4e"
                            }

                        ]
                    },
                )
            }
        }

        // console.log("data 1 ", data1.lanes[3])

        this.processCardNextStep = function (cardId, metadata, laneId) {
            console.log("processCardNextStep ", cardId, metadata, laneId)
            // console.log("todayDate ", todayDate[0])
            //
            // this.startProposal()
            if (metadata.nextStep === 'drawing') {
                document.getElementById('modal-drawing-id').classList.add("in")
                emit.ClickedSelectedCard({metadata: metadata})
                // emit.StartProposalDrawing({leadId: cardId, accountId: user.accountId, now: todayDate[0]})
            } else if (metadata.nextStep === 'beforeQC') {
                document.getElementById('modal-drawing-options').classList.add("in")
                emit.ClickedSelectedCard({metadata: metadata})
                // console.log("setQCGuy trying ", user.accountId)
                // emit.ProposalFinished({leadId: cardId})
            } else if (metadata.nextStep === 'qc') {
                // document.getElementById('modal-drawing-options').classList.add("in")
                // emit.ClickedSelectedCard({metadata: metadata})
                // console.log("setQCGuy trying ", user.accountId)
                // emit.ProposalFinished({leadId: cardId})
                // emit.ClickedSelectedCard({metadata: metadata})
                emit.ProposalFinished({leadId: cardId})
            } else if (metadata.nextStep === 'setQCGuy') {
                // console.log("setQCGuy trying ", user.accountId)
                emit.ProposalQCStarted({leadId: cardId, accountId: user.accountId, now: todayDate[0]})
            } else if (metadata.nextStep === 'qcFinished') {
                emit.ProposalQCFinished({leadId: cardId})
            } else if (metadata.nextStep === 'noUsage') {
                document.getElementById('modal-usage-id').classList.add("in")
                emit.ClickedSelectedCard({metadata: metadata})
                // emit.StartProposalDrawing({leadId: cardId, accountId: user.accountId})
            }
        }

        function closeModal() {
             resetCopyBtn()
            document.getElementById('modal-drawing-id').classList.remove("in")
            document.getElementById('modal-usage-id').classList.remove("in")
            document.getElementById('modal-drawing-options').classList.remove("in")
        }

        function startDrawing(metadata) {
            // console.log("startDrawing bottom ", metadata)
             resetCopyBtn()
            emit.StartProposalDrawing({leadId: metadata.id, accountId: user.accountId})
            document.getElementById('modal-drawing-id').classList.remove("in")
            document.getElementById('modal-usage-id').classList.remove("in")
        }

        function needsUsage(metadata) {
            // console.log("needsUsage bottom " )
            // if(selectedCard.metadata.length >= 1){
            //     emit.StartProposalDrawing({leadId: selectedCard.metadata.id, accountId: user.accountId})
            // }else{
            //     alert("Ups! Something is off")
            // }
            resetCopyBtn()
            emit.ProposalNeedsUsage({leadId: metadata.id})
            document.getElementById('modal-drawing-id').classList.remove("in")
        }

        function usageFixed(metadata) {
            console.log("usageFixed ", metadata)
            emit.ProposalUsageFixed({leadId: metadata.id, accountId: user.accountId})
            document.getElementById('modal-usage-id').classList.remove("in")
        }

        function readyForQC(metadata) {
            resetCopyBtn()
                emit.ProposalFinished({leadId: metadata.id})
            document.getElementById('modal-drawing-options').classList.remove("in")
        }

        function refreshBoard() {
            emit.ClickedRefreshBoard()
            emit.ClickedRefreshProposalBoard()
        }

        function insertReason() {

        }
        function resetCopyBtn() {
            console.log("reset Btn")
            let copyBtn = document.getElementById('copy-icon-btn')
            let checkBtn = document.getElementById('check-icon-btn')
            copyBtn.style.display = 'block'
            checkBtn.style.display = 'none'
        }

        function copyAddress(address) {
           let copyBtn = document.getElementById('copy-icon-btn')
            let checkBtn = document.getElementById('check-icon-btn')
            copyBtn.style.display = 'none'
            checkBtn.style.display = 'block'

        }

        return (
            <section id='proposal-board' className="pwrstation-view-profile" style={{paddingTop: "2em"}}>
            
                {/*<div id='alert-proposal-start' className="alert alert-info" style={alert !== null ? { display: "block", position: "absolute", top: "80px", right: "7%", width: "30%"} : {display: "none"}}>{alert}</div>*/}
                <div id="resultbox"/>
                <div className="row">
                    <div className="col-xs-12">
                        {proposalReloading ? <div id='loading-overlay'><img id="spinner" style={{
                            height: "40%",
                            maxHeight: "70px",
                            margin: "0"
                        }} src="/assets/images/spinner.gif"/></div> : ''}
                        <div className="panel  panel-default">
                            <div className="panel-heading">
                                <div style={{display: "flex"}}>
                                    <div style={{flex: "1", textAlign: "left", fontSize: "1.3em"}}>Proposal Board</div>
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
                                                   onClick={refreshBoard.bind(this)}
                                                > <i className="glyphicon glyphicon-refresh"/> Refresh Board</a>
                                            </li>
                                            {/*<li><a tabIndex="2" style={{cursor: "pointer"}}>Hide Calendar</a></li>*/}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="panel-body" style={{padding: "0px"}}>
                               {
                                    alert === null || alert === 'hide' ? ''
                                    : <div id='alert-proposal-start' className="alert alert-info">
                                         <span className="glyphicon glyphicon-info-sign" style={{marginRight: "6px"}}/>
                                        {alert}
                                    </div>
                                }
                                <Board style={{
                                    backgroundImage: "linear-gradient(180deg,hsla(0,0%,100%,0) 60%,#fff),linear-gradient(70deg,#dbedff 32%,#ebfff0)",
                                    padding: "80px 5px"
                                }}
                                    // data={this.state.boardData}
                                       data={data1}
                                    // eventBusHandle={this.setEventBus}
                                    //    onCardClick={(cardId, metadata, laneId) => alert(`Card with id:${cardId} clicked. Has metadata.id: ${metadata.id}. Card in lane: ${laneId}`)}
                                    // onCardClick={cardModal.bind(this, metadata.id) }
                                       onCardClick={(cardId, metadata, laneId) => this.processCardNextStep(cardId, metadata, laneId)}
                                />
                            </div>
                        </div>

                    </div>
                </div>
                <div id='modal-drawing-id' className="modal fade ">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal"
                                        onClick={closeModal.bind(this)}
                                        aria-hidden="true">&times;</button>
                                <h4 className="modal-title">Starting
                                    Options {selectedCard.metadata ? "for " + selectedCard.metadata.title : ''}</h4>
                            </div>
                              <div className="modal-body text-center">
                                {selectedCard.metadata ?
                                    <div className='well'
                                         style={{background: "#f5f5f5", position: "relative", marginBottom: "0px"}}>
                                         <CopyToClipboard text={selectedCard.metadata.address}>
                                             <button id='copy-icon-btn' className="btn btn-default" style={{
                                                position: "absolute",
                                                right: "-1px",
                                                top: "-1px",
                                                padding: "3px 8px"
                                            }} onClick={copyAddress.bind(this, selectedCard.metadata.address)}>
                                                <i style={{fontSize: "21px"}}
                                                   className="glyphicon glyphicon glyphicon-copy"/>
                                            </button>
                                         </CopyToClipboard>
                                         <button id='check-icon-btn' className="btn btn-default" style={{
                                            position: "absolute",
                                            right: "-1px",
                                            top: "-1px",
                                            padding: "3px 8px"
                                        }}>
                                            <i style={{fontSize: "21px"}}
                                               className="glyphicon glyphicon-ok"/>
                                         </button>
                                        {/*<h5>Click button to copy address</h5>*/}
                                        {/*<button className='btn btn-default' style={{margin: 5}}>*/}
                                        <input id="address-input" type="hidden" value={selectedCard.metadata.address}/>
                                        <span>
                                                <img src="/assets/images/placeholder-filled-point.png" width="15"
                                                     style={{
                                                         margin: "-2px 5px 5px 0px"
                                                     }}
                                                     height="20" alt="" className="wp-image-26 alignnone size-full"/>
                                            {selectedCard.metadata.address}
                                        </span>

                                        {/*</button>*/}
                                    </div>
                                    : ''}
                            </div>
                            <div className="modal-footer" style={{textAlign: "center"}}>
                                <button type="button" className="btn btn-primary"
                                        onClick={startDrawing.bind(this, selectedCard.metadata)}>
                                    Draw Proposal &nbsp;&nbsp; <i className="glyphicon glyphicon-pencil"/>
                                </button>
                                &nbsp;&nbsp;&nbsp;
                                <button type="button" className="btn btn-warning"
                                        onClick={needsUsage.bind(this, selectedCard.metadata)}>
                                    Needs Usage &nbsp;&nbsp; <i className="glyphicon glyphicon-exclamation-sign"/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div id='modal-usage-id' className="modal fade ">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal"
                                        onClick={closeModal.bind(this)}
                                        aria-hidden="true">&times;</button>
                                <h4 className="modal-title"> Needs Usage
                                    Options {selectedCard.metadata ? "for " + selectedCard.metadata.title : ''}</h4>
                            </div>
                            {/*<div className="modal-body">*/}
                            {/*    <button className='btn btn-default' onClick={this.startProposal}*/}
                            {/*            style={{margin: 5}}>*/}
                            {/*        Start Proposal*/}
                            {/*    </button>*/}
                            {/*</div>*/}
                            <div className="modal-footer" style={{textAlign: "center"}}>
                                <button type="button" className="btn btn-primary"
                                        onClick={usageFixed.bind(this, selectedCard.metadata)}>
                                    Usage Fixed Start Drawing &nbsp;&nbsp; <i className="glyphicon glyphicon-pencil"/>
                                </button>
                                &nbsp;&nbsp;&nbsp;
                                <button type="button" className="btn btn-warning"
                                        onClick={startDrawing.bind(this, selectedCard.metadata)}>
                                    Draw Proposal Despite Usage &nbsp;&nbsp; <i
                                    className="glyphicon glyphicon-exclamation-sign"/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div id='modal-drawing-options' className="modal fade ">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal"
                                        onClick={closeModal.bind(this)}
                                        aria-hidden="true">&times;</button>
                                <h4 className="modal-title">Drawing
                                    Options {selectedCard.metadata ? "for " + selectedCard.metadata.title : ''}</h4>
                            </div>
                            <div className="modal-body">
                                <form id='form-incomplete-reason' method="POST" onSubmit={e => {
                                    e.preventDefault()
                                    emit.ProposalUpdateIncompleReason({
                                        proposalId: selectedCard.metadata.id,
                                        incompleteReason:  document.getElementById('incomplete-reason').value

                                    })
                                }} >

                                    If drawing couldn't be finished write down the reason
                                    <textarea style={{marginTop: "1em"}} className="form-control" id="incomplete-reason"
                                              name="rep_pros" rows="2" placeholder="Type here" required>
                                    </textarea>
                                </form>

                            </div>
                            <div className="modal-footer" style={{textAlign: "center"}}>
                                <button id='drawing-ready-btn' type="button" className="btn btn-primary"
                                        onClick={readyForQC.bind(this, selectedCard.metadata)}>
                                    Drawing Completed Ready for QC &nbsp;&nbsp; <i
                                    className="glyphicon glyphicon-ok-sign"/>
                                </button>
                                &nbsp;&nbsp;&nbsp;
                                <button type="submit" className="btn btn-warning"   onClick={closeModal.bind(this)}
                                        form='form-incomplete-reason'>
                                    Insert Reason Incomplete &nbsp;&nbsp; <i
                                    className="glyphicon glyphicon-warning-sign"/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        )
    }
}