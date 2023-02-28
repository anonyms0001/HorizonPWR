import {emit, view} from "../../framework"
import {MovableCardWrapper} from 'react-trello/dist/styles/Base'
import DeleteButton from 'react-trello/dist/widgets/DeleteButton'
import React from 'react'
import Board from 'react-trello'
import Tag from 'react-trello/dist/components/Card/Tag'
import proposalStore from "../../stores/proposalStore"
import sessionStore from "../../stores/sessionStore"
import {CopyToClipboard} from 'react-copy-to-clipboard'
import BootstrapSwitchButton from 'bootstrap-switch-button-react'
import CheckQCWizard from "./proposalWizard/checkQCWizard"

@view
export default class CustomCardsTest extends React.Component {


    render() {

        const CustomCard = ({
                                id,
                                metadata,
                                onClick,
                                dueOn,
                                name,
                                fm,
                                undo,
                                canvassStatus,
                                address,
                                columnPosition,
                                className,
                                cardStyle,
                                designer,
                                incompleteReason,
                                undoAction,
                                holdingNotes,
                                body,
                                qcBy,
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
                            paddingBottom: 6,
                            marginBottom: 10,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            color: cardColor
                        }}>

                        <div style={{fontSize: 11, textAlign: "right"}}>
                            {undo ?
                                <a style={{float: "left", cursor: "pointer", borderRadius: "15px", padding: "0px 9px"}}
                                   className='btn btn-default btn-sm' tabIndex="0"
                                   onClick={undoActionFunction.bind(this, undoAction, id)}>
                                    <svg id='undo-icon' xmlns="http://www.w3.org/2000/svg"
                                         width="14px" height="14px" viewBox="0 0 24 24" version="1.1"
                                         className="kt-svg-icon">
                                        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                            <rect id="bound" x="0" y="0" width="24" height="24"/>
                                            <path
                                                d="M21.4451171,17.7910156 C21.4451171,16.9707031 21.6208984,13.7333984 19.0671874,11.1650391 C17.3484374,9.43652344 14.7761718,9.13671875 11.6999999,9 L11.6999999,4.69307548 C11.6999999,4.27886191 11.3642135,3.94307548 10.9499999,3.94307548 C10.7636897,3.94307548 10.584049,4.01242035 10.4460626,4.13760526 L3.30599678,10.6152626 C2.99921905,10.8935795 2.976147,11.3678924 3.2544639,11.6746702 C3.26907199,11.6907721 3.28437331,11.7062312 3.30032452,11.7210037 L10.4403903,18.333467 C10.7442966,18.6149166 11.2188212,18.596712 11.5002708,18.2928057 C11.628669,18.1541628 11.6999999,17.9721616 11.6999999,17.7831961 L11.6999999,13.5 C13.6531249,13.5537109 15.0443703,13.6779456 16.3083984,14.0800781 C18.1284272,14.6590944 19.5349747,16.3018455 20.5280411,19.0083314 L20.5280247,19.0083374 C20.6363903,19.3036749 20.9175496,19.5 21.2321404,19.5 L21.4499999,19.5 C21.4499999,19.0068359 21.4451171,18.2255859 21.4451171,17.7910156 Z"
                                                id="Shape" fill="#000000" fillRule="nonzero"/>
                                        </g>
                                    </svg>
                                    {/*&nbsp;*/}
                                    {/*Undo*/}
                                </a>
                                :
                                ''
                            }
                            {dueOn}
                        </div>

                        {showDeleteButton && <DeleteButton onClick={clickDelete}/>}
                    </header>
                    <div style={{fontSize: 12}}>
                        <div style={{fontSize: 14, fontWeight: 'bold', marginTop: "10px"}}>{name}</div>
                        <div>
                            <br/>
                            <b>FM:&nbsp;</b>
                        </div>
                        <div>
                            {fm}
                        </div>
                        {canvassStatus ?
                            <div>
                                <br/>
                                <div><b>Canvass Status:&nbsp;</b></div>
                                <div>{canvassStatus} </div>
                            </div>
                            :
                            ''
                        }
                        {
                            designer ?
                                <div>
                                    <br/>
                                    <div><b>Designer:&nbsp;</b></div>
                                    <div>{designer} </div>
                                </div>
                                : ''
                        }
                        {address ?
                            <div>
                                <br/>
                                <div>
                                    <b>Address:&nbsp;</b>
                                </div>
                                <div className="input-group input-group-sm input-group-sm mb-3">
                                    <input type="text" className="form-control" style={{width: "163px"}}
                                           aria-label="Amount (to the nearest dollar)" value={address}/>
                                    <CopyToClipboard text={address}>
                                        <button onClick={copyAlert.bind(this)} className="btn btn-outline-secondary"
                                                type="button">
                                            <i style={{fontSize: "16px"}}
                                               className="glyphicon glyphicon glyphicon-copy"/>
                                        </button>
                                        {/*<span className="input-group-addon">*/}
                                        {/*    <i style={{fontSize: "16px"}}*/}
                                        {/*       className="glyphicon glyphicon glyphicon-copy"/>*/}
                                        {/*</span>*/}
                                    </CopyToClipboard>
                                </div>
                            </div>
                            : ''
                        }
                        {qcBy ?
                            <div>
                                <br/>
                                <b>QC by:&nbsp;</b>
                                <p>
                                    {qcBy}
                                </p>
                            </div>
                            : ''
                        }
                        {holdingNotes ?
                            <div>
                                <br/>
                                <div>
                                    <b>Usage Notes:&nbsp; </b>
                                    <br/>
                                    <p>
                                        {holdingNotes} &nbsp;
                                        <i onClick={moveToNeedsUsage.bind(this, metadata)}
                                           style={{cursor: "pointer"}} className='glyphicon glyphicon-pencil'/>
                                    </p>
                                </div>
                            </div>
                            : columnPosition === 3 && !holdingNotes ?
                                <div>
                                    <br/>
                                    <div>
                                        <b>Usage Notes:&nbsp; </b>
                                        <br/>
                                        <p>
                                            No Notes Added Yet &nbsp;
                                            <i onClick={moveToNeedsUsage.bind(this, metadata)}
                                               style={{cursor: "pointer"}} className='glyphicon glyphicon-pencil'/>
                                        </p>
                                    </div>
                                    <br/>
                                    <div style={{paddingBottom: "6px"}}>
                                        <b>Needs Usage:&nbsp;</b>
                                        <br/>
                                    </div>
                                    <BootstrapSwitchButton
                                        onstyle="danger"
                                        checked={true}
                                        onlabel='Yes'
                                        offlabel='No'
                                        size="sm"
                                        onChange={usageStatusChange.bind(this, id)}
                                    />
                                </div>
                                : ''
                        }
                        {
                            incompleteReason ?
                                <div>
                                    <br/>
                                    <div>
                                        <b>Reason Incomplete:&nbsp;</b>
                                    </div>
                                    <div>
                                        <p>
                                            {incompleteReason}&nbsp;&nbsp;
                                            <i onClick={moveToNeedsUsage.bind(this, metadata)}
                                               style={{cursor: "pointer"}} className='glyphicon glyphicon-pencil'/>
                                        </p>
                                    </div>

                                </div>
                                : ''
                        }

                        {
                            columnPosition === 1 ?
                                <div>
                                    <br/>
                                    <div>
                                        <div style={{marginBottom: "-12px"}}>
                                            <b>{incompleteReason ? "Issue Fixed & Drawing Finished: " : "Drawing Finished:"}</b>
                                        </div>
                                        <br/>
                                        <div className={id + '-switch-container'}>
                                            <BootstrapSwitchButton
                                                onstyle="success"
                                                checked={false}
                                                onlabel='Yes'
                                                offlabel='No'
                                                size="sm"
                                                onChange={proposalFinishedSwitch.bind(this, id)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                : ''
                        }
                        <br/>
                        <br/>
                        {
                            columnPosition === 0 ?
                                <div>
                                    <div style={{display: "flex"}}>
                                        <div style={{flex: "1"}}>
                                            <button key={id} type="button" className="btn btn-warning btn-sm"
                                                    style={{width: "105px"}}
                                                    onClick={moveToNeedsUsage.bind(this, metadata)}>
                                                Needs Usage &nbsp;&nbsp; <i
                                                className="glyphicon glyphicon-exclamation-sign"/>
                                            </button>
                                        </div>
                                        <div>

                                            <button type="button" className="btn btn-primary btn-sm"
                                                    style={{width: "105px"}}
                                                    onClick={startDrawingProposal.bind(this, id)}>
                                                Start Proposal
                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                    // xmlns:xlink="http://www.w3.org/1999/xlink"
                                                     width="15px" height="15px"
                                                     viewBox="0 0 24 24" version="1.1" className="kt-svg-icon">
                                                    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                                        <polygon id="Shape" points="0 0 24 0 24 24 0 24"/>
                                                        <path
                                                            d="M6.70710678,15.7071068 C6.31658249,16.0976311 5.68341751,16.0976311 5.29289322,15.7071068 C4.90236893,15.3165825 4.90236893,14.6834175 5.29289322,14.2928932 L11.2928932,8.29289322 C11.6714722,7.91431428 12.2810586,7.90106866 12.6757246,8.26284586 L18.6757246,13.7628459 C19.0828436,14.1360383 19.1103465,14.7686056 18.7371541,15.1757246 C18.3639617,15.5828436 17.7313944,15.6103465 17.3242754,15.2371541 L12.0300757,10.3841378 L6.70710678,15.7071068 Z"
                                                            id="Path-94" fill="#000000" fillRule="nonzero"
                                                            transform="translate(12.000003, 11.999999) rotate(-270.000000) translate(-12.000003, -11.999999) "/>
                                                    </g>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                : columnPosition === 1 && incompleteReason ?
                                <div>
                                    <button id={id + "-ready-qc"} type="button" style={{width: "100%"}}
                                            className="btn btn-primary btn-sm disabled"
                                            onClick={proposalReadyForQC.bind(this, id)}>
                                        Ready for QC
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                            // xmlns:xlink="http://www.w3.org/1999/xlink"
                                             width="15px" height="15px"
                                             viewBox="0 0 24 24" version="1.1" className="kt-svg-icon">
                                            <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                                <polygon id="Shape" points="0 0 24 0 24 24 0 24"/>
                                                <path
                                                    d="M6.70710678,15.7071068 C6.31658249,16.0976311 5.68341751,16.0976311 5.29289322,15.7071068 C4.90236893,15.3165825 4.90236893,14.6834175 5.29289322,14.2928932 L11.2928932,8.29289322 C11.6714722,7.91431428 12.2810586,7.90106866 12.6757246,8.26284586 L18.6757246,13.7628459 C19.0828436,14.1360383 19.1103465,14.7686056 18.7371541,15.1757246 C18.3639617,15.5828436 17.7313944,15.6103465 17.3242754,15.2371541 L12.0300757,10.3841378 L6.70710678,15.7071068 Z"
                                                    id="Path-94" fill="#000000" fillRule="nonzero"
                                                    transform="translate(12.000003, 11.999999) rotate(-270.000000) translate(-12.000003, -11.999999) "/>
                                            </g>
                                        </svg>
                                    </button>
                                </div>
                                : columnPosition === 1 && !incompleteReason ?
                                    <div>
                                        <div style={{display: "flex"}}>
                                            <div style={{flex: "1"}}>
                                                <button type="button" className="btn btn-warning btn-sm"
                                                        style={{width: "110px"}}
                                                        onClick={drawingNeedsUsage.bind(this, metadata)}>
                                                    Needs Usage &nbsp;&nbsp; <i
                                                    className="glyphicon glyphicon-exclamation-sign"/>
                                                </button>
                                            </div>
                                            <div>

                                                <button id={id + "-ready-qc"} type="button" style={{width: "110px"}}
                                                        className="btn btn-primary btn-sm disabled"
                                                        onClick={proposalReadyForQC.bind(this, id)}>
                                                    Ready for QC
                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                        // xmlns:xlink="http://www.w3.org/1999/xlink"
                                                         width="15px" height="15px"
                                                         viewBox="0 0 24 24" version="1.1" className="kt-svg-icon">
                                                        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                                            <polygon id="Shape" points="0 0 24 0 24 24 0 24"/>
                                                            <path
                                                                d="M6.70710678,15.7071068 C6.31658249,16.0976311 5.68341751,16.0976311 5.29289322,15.7071068 C4.90236893,15.3165825 4.90236893,14.6834175 5.29289322,14.2928932 L11.2928932,8.29289322 C11.6714722,7.91431428 12.2810586,7.90106866 12.6757246,8.26284586 L18.6757246,13.7628459 C19.0828436,14.1360383 19.1103465,14.7686056 18.7371541,15.1757246 C18.3639617,15.5828436 17.7313944,15.6103465 17.3242754,15.2371541 L12.0300757,10.3841378 L6.70710678,15.7071068 Z"
                                                                id="Path-94" fill="#000000" fillRule="nonzero"
                                                                transform="translate(12.000003, 11.999999) rotate(-270.000000) translate(-12.000003, -11.999999) "/>
                                                        </g>
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    : columnPosition === 2 && qcBy !== 'No one yet' ?
                                        <button type="button" style={{width: "100%"}}
                                                className="btn btn-info btn-sm disabled"
                                                onClick={startQcChecklist.bind(this, metadata)}>
                                             QC in Progress&nbsp;&nbsp;
                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                 width="17px" height="17px"
                                                 viewBox="0 0 24 24" version="1.1" className="kt-svg-icon">
                                                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                                    <rect id="bound" x="0" y="0" width="24" height="24"/>
                                                    <path
                                                        d="M8,3 L8,3.5 C8,4.32842712 8.67157288,5 9.5,5 L14.5,5 C15.3284271,5 16,4.32842712 16,3.5 L16,3 L18,3 C19.1045695,3 20,3.8954305 20,5 L20,21 C20,22.1045695 19.1045695,23 18,23 L6,23 C4.8954305,23 4,22.1045695 4,21 L4,5 C4,3.8954305 4.8954305,3 6,3 L8,3 Z"
                                                        id="Combined-Shape" fill="#000000" opacity="0.3"/>
                                                    <path
                                                        d="M10.875,15.75 C10.6354167,15.75 10.3958333,15.6541667 10.2041667,15.4625 L8.2875,13.5458333 C7.90416667,13.1625 7.90416667,12.5875 8.2875,12.2041667 C8.67083333,11.8208333 9.29375,11.8208333 9.62916667,12.2041667 L10.875,13.45 L14.0375,10.2875 C14.4208333,9.90416667 14.9958333,9.90416667 15.3791667,10.2875 C15.7625,10.6708333 15.7625,11.2458333 15.3791667,11.6291667 L11.5458333,15.4625 C11.3541667,15.6541667 11.1145833,15.75 10.875,15.75 Z"
                                                        id="check-path" fill="#000000"/>
                                                    <path
                                                        d="M11,2 C11,1.44771525 11.4477153,1 12,1 C12.5522847,1 13,1.44771525 13,2 L14.5,2 C14.7761424,2 15,2.22385763 15,2.5 L15,3.5 C15,3.77614237 14.7761424,4 14.5,4 L9.5,4 C9.22385763,4 9,3.77614237 9,3.5 L9,2.5 C9,2.22385763 9.22385763,2 9.5,2 L11,2 Z"
                                                        id="Combined-Shape" fill="#000000"/>
                                                </g>
                                            </svg>
                                        </button>
                                        : columnPosition === 2 && qcBy === 'No one yet' ?
                                            <button type="button" style={{width: "100%"}}
                                                    className="btn btn-info btn-sm "
                                                    onClick={startQcChecklist.bind(this, metadata)}>
                                                Start QC&nbsp;&nbsp;
                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                     width="17px" height="17px"
                                                     viewBox="0 0 24 24" version="1.1" className="kt-svg-icon">
                                                    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                                        <rect id="bound" x="0" y="0" width="24" height="24"/>
                                                        <path
                                                            d="M8,3 L8,3.5 C8,4.32842712 8.67157288,5 9.5,5 L14.5,5 C15.3284271,5 16,4.32842712 16,3.5 L16,3 L18,3 C19.1045695,3 20,3.8954305 20,5 L20,21 C20,22.1045695 19.1045695,23 18,23 L6,23 C4.8954305,23 4,22.1045695 4,21 L4,5 C4,3.8954305 4.8954305,3 6,3 L8,3 Z"
                                                            id="Combined-Shape" fill="#000000" opacity="0.3"/>
                                                        <path
                                                            d="M10.875,15.75 C10.6354167,15.75 10.3958333,15.6541667 10.2041667,15.4625 L8.2875,13.5458333 C7.90416667,13.1625 7.90416667,12.5875 8.2875,12.2041667 C8.67083333,11.8208333 9.29375,11.8208333 9.62916667,12.2041667 L10.875,13.45 L14.0375,10.2875 C14.4208333,9.90416667 14.9958333,9.90416667 15.3791667,10.2875 C15.7625,10.6708333 15.7625,11.2458333 15.3791667,11.6291667 L11.5458333,15.4625 C11.3541667,15.6541667 11.1145833,15.75 10.875,15.75 Z"
                                                            id="check-path" fill="#000000"/>
                                                        <path
                                                            d="M11,2 C11,1.44771525 11.4477153,1 12,1 C12.5522847,1 13,1.44771525 13,2 L14.5,2 C14.7761424,2 15,2.22385763 15,2.5 L15,3.5 C15,3.77614237 14.7761424,4 14.5,4 L9.5,4 C9.22385763,4 9,3.77614237 9,3.5 L9,2.5 C9,2.22385763 9.22385763,2 9.5,2 L11,2 Z"
                                                            id="Combined-Shape" fill="#000000"/>
                                                    </g>
                                                </svg>
                                            </button>
                                            : columnPosition === 3 ?
                                                <div>
                                                    <button type="button" style={{width: "100%"}} id={id + "-btn-usage"}
                                                            className="btn btn-warning btn-sm"
                                                            onClick={startDrawingProposal.bind(this, id)}>
                                                        Start Proposal
                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                            // xmlns:xlink="http://www.w3.org/1999/xlink"
                                                             width="15px" height="15px"
                                                             viewBox="0 0 24 24" version="1.1" className="kt-svg-icon">
                                                            <g stroke="none" strokeWidth="1" fill="none"
                                                               fillRule="evenodd">
                                                                <polygon id="Shape" points="0 0 24 0 24 24 0 24"/>
                                                                <path
                                                                    d="M6.70710678,15.7071068 C6.31658249,16.0976311 5.68341751,16.0976311 5.29289322,15.7071068 C4.90236893,15.3165825 4.90236893,14.6834175 5.29289322,14.2928932 L11.2928932,8.29289322 C11.6714722,7.91431428 12.2810586,7.90106866 12.6757246,8.26284586 L18.6757246,13.7628459 C19.0828436,14.1360383 19.1103465,14.7686056 18.7371541,15.1757246 C18.3639617,15.5828436 17.7313944,15.6103465 17.3242754,15.2371541 L12.0300757,10.3841378 L6.70710678,15.7071068 Z"
                                                                    id="Path-94" fill="#000000" fillRule="nonzero"
                                                                    transform="translate(12.000003, 11.999999) rotate(-270.000000) translate(-12.000003, -11.999999) "/>
                                                            </g>
                                                        </svg>
                                                    </button>
                                                </div>

                                                : ''
                        }

                        {/*<div style={{color: '#4C4C4C', fontWeight: 'bold'}}>{subTitle}</div>*/}
                        {/*<div style={{padding: '5px 0px'}}>*/}
                        {/*    <i>{body}</i>*/}
                        {/*/!*</div>*!/*/}
                        {/*<div style={{*/}
                        {/*    marginTop: 10,*/}
                        {/*    textAlign: 'center',*/}
                        {/*    color: cardColor,*/}
                        {/*    fontSize: 15,*/}
                        {/*    fontWeight: 'bold'*/}
                        {/*}}>{escalationText}</div>*/}
                        {/*{tags && (*/}
                        {/*    <div*/}
                        {/*        style={{*/}
                        {/*            borderTop: '1px solid #eee',*/}
                        {/*            paddingTop: 6,*/}
                        {/*            display: 'flex',*/}
                        {/*            justifyContent: 'flex-end',*/}
                        {/*            flexDirection: 'row',*/}
                        {/*            flexWrap: 'wrap'*/}
                        {/*        }}>*/}
                        {/*        {tags.map(tag => (*/}
                        {/*            <Tag key={tag.title} {...tag} tagStyle={tagStyle} onClick={onClick}/>*/}
                        {/*        ))}*/}
                        {/*    </div>*/}
                        {/*)}*/}
                    </div>
                </MovableCardWrapper>
            )
        }

        const {proposals, alert, selectedCard, proposalReloading, wizardStep} = proposalStore
        // console.log("wizardStep VIEW HERE ", wizardStep)
        const {user} = sessionStore

        // if (wizardStep === 8) {
        //     emit.ProposalQCFinished({leadId: selectedCard.metadata.id})
        // }

        function usageStatusChange(id) {
            if (document.getElementById(id + '-btn-usage').classList.contains('btn-warning')) {
                document.getElementById(id + '-btn-usage').classList.remove('btn-warning')
                document.getElementById(id + '-btn-usage').classList.add('btn-primary')
            } else {
                document.getElementById(id + '-btn-usage').classList.remove('btn-primary')
                document.getElementById(id + '-btn-usage').classList.add('btn-warning')
            }
        }

        function proposalFinishedSwitch(id) {
            if (document.getElementById(id + '-ready-qc').classList.contains('disabled')) {
                document.getElementById(id + '-ready-qc').classList.remove('disabled')
            } else {
                document.getElementById(id + '-ready-qc').classList.add('disabled')
            }

        }

        function startQcChecklist(metadata) {
            emit.ClickedSelectedCard({metadata: metadata})
            document.getElementById('modal-qc-checklist').classList.add("in")
            emit.ProposalQCStarted({leadId: metadata.id, accountId: user.accountId, now: todayDate[0]})
        }

        function drawingNeedsUsage(metadata) {
            emit.ClickedSelectedCard({metadata: metadata})
            document.getElementById('modal-drawing-id').classList.add("in")
        }

        function undoActionFunction(undoAction, id) {
            console.log("undoActionFunction ", undoAction, id)
            emit.UndoProposalAction({proposalId: id, undoAction: undoAction})

        }

        function proposalReadyForQC(id) {
            emit.ProposalFinished({leadId: id})
        }

        function startDrawingProposal(id) {
            emit.StartProposalDrawing({leadId: id, accountId: user.accountId})
        }

        let today = new Date()
        let todayToString = today.toISOString()
        let todayDate = todayToString.split('T')

        function startQcProposal(id) {
            emit.ProposalQCStarted({leadId: id, accountId: user.accountId, now: todayDate[0]})
        }

        function copyAlert() {
            console.log("Address Copied!")
            emit.ProposalReceivedAlert({alert: "Address Copied"})
        }

        function moveToNeedsUsage(metadata) {
            console.log("moveToNeedsUsage ", metadata)
            emit.ClickedSelectedCard({metadata: metadata})
            document.getElementById('modal-drawing-id').classList.add("in")

            // console.log("moveToNeedsUsage carId ", cardId)
            // emit.ProposalNeedsUsage({ leadId: cardId })
        }

        if (alert !== null && alert !== "hide") {
            setTimeout(clearAlert, 15000)
            // setTimeout(clearAlert, 1000000000000000000)
        }

        function clearAlert() {
            emit.ReceivedAlert({alert: 'hide'})
        }

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
            let address = (proposals[i].Street_Address__c ? proposals[i].Street_Address__c : '') + (proposals[i].City__c ? ", " + proposals[i].City__c : '') + (proposals[i].State__c ? ", " + proposals[i].State__c : '') + (proposals[i].Zip__c ? ", " + proposals[i].Zip__c : '')
            //NEW
            if (proposals[i].designer === null && !proposals[i].Need_Usage__c) {
                if (proposals[i].Proposal_Completed__c) continue

                let formattedDate = new Date(proposals[i].Appointment_Date__c)
                formattedDate = (formattedDate.getMonth() + 1) + "/" + formattedDate.getDate() + "/" + formattedDate.getFullYear()
                // let sqlFormattedDate = proposals[i].Appointment_Date__c
                let sqlFormattedDate = proposals[i].Appointment_Date__c.split("T")
                // let address =  proposals[i].Street_Address__c

                // console.log("address ", address)
                // sqlFormattedDate = sqlFormattedDate.getFullYear() + "-" + (sqlFormattedDate.getMonth() + 1) + "-" + sqlFormattedDate.getDate()
                // console.log("sqlFormattedDate ", sqlFormattedDate[0])
                data1.lanes[0].cards.push(
                    {
                        id: proposals[i].Id,
                        name: proposals[i].Name,
                        columnPosition: 0,
                        draggable: false,
                        dueOn: "Due " + (todayDate[0] === sqlFormattedDate[0] ? "today" : formattedDate),
                        // subTitle: 'SMS received at 12:13pm today',
                        style: {
                            backgroundColor: (proposals[i].Canvass_Status__c !== 'Appointment Scheduled' ? "#faebcc" : "#fff")
                        },
                        description: "FM: " + proposals[i].Field_Marketer__c + " " + proposals[i].Proposal_Completed__c + " " + proposals[i].designer + "\n\nCanvass Status: " + proposals[i].Canvass_Status__c + "\n\nAddress: " + address,
                        fm: proposals[i].Field_Marketer__c,
                        canvassStatus: proposals[i].Canvass_Status__c,
                        address: address,

                        metadata: {
                            id: proposals[i].Id,
                            title: proposals[i].Name,
                            description: "Appointment : " + proposals[i].Appointment_Date__c,
                            nextStep: "drawing",
                            holdingNotes: proposals[i].Reason_Proposal_Incomplete__c ? proposals[i].Reason_Proposal_Incomplete__c : '',
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
            if (proposals[i].designer !== null && !proposals[i].Proposal_Completed__c) {

                let formattedDate = new Date(proposals[i].Appointment_Date__c)
                formattedDate = (formattedDate.getMonth() + 1) + "/" + formattedDate.getDate() + "/" + formattedDate.getFullYear()
                let sqlFormattedDate = proposals[i].Appointment_Date__c.split("T")

                if (proposals[i].Reason_Proposal_Incomplete__c || proposals[i].Need_Usage__c) {
                    data1.lanes[1].cards.push(
                        {
                            id: proposals[i].Id,
                            name: proposals[i].Name,
                            draggable: false,
                            undo: true,
                            columnPosition: 1,
                            canvassStatus: proposals[i].Canvass_Status__c,
                            dueOn: "Due " + (todayDate[0] === sqlFormattedDate[0] ? "today" : formattedDate),
                            undoAction: proposals[i].Reason_Proposal_Incomplete__c ? 'removeIncompleteReason' : 'drawingToNew',
                            cardStyle: {
                                backgroundColor: (proposals[i].Reason_Proposal_Incomplete__c ? "#faebcc" : "#fff")
                            },
                            fm: proposals[i].Field_Marketer__c,
                            designer: proposals[i].designer,
                            address: address,
                            incompleteReason: proposals[i].Reason_Proposal_Incomplete__c ? proposals[i].Reason_Proposal_Incomplete__c : 0,

                            description: (proposals[i].Need_Usage__c ? "Needs Usage" : "") + "\nFM: " + proposals[i].Field_Marketer__c + "\nDesigner: " +
                                proposals[i].designer + (proposals[i].Reason_Proposal_Incomplete__c ? "\n\nReason Incomplete " + proposals[i].Reason_Proposal_Incomplete__c : ''),

                            metadata: {
                                id: proposals[i].Id,
                                title: proposals[i].Name,
                                description: "Appointment : " + formattedDate + " Designer: " + proposals[i].designer,
                                issues: (proposals[i].Reason_Proposal_Incomplete__c || proposals[i].Need_Usage__c ? "true" : "false"),
                                nextStep: (proposals[i].Reason_Proposal_Incomplete__c || proposals[i].Need_Usage__c ? "qc" : "beforeQC"),
                                holdingNotes: proposals[i].Reason_Proposal_Incomplete__c ? proposals[i].Reason_Proposal_Incomplete__c : '',
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
                } else {
                    data1.lanes[1].cards.unshift(
                        {
                            id: proposals[i].Id,
                            name: proposals[i].Name,
                            draggable: false,
                            undo: true,
                            columnPosition: 1,
                            address: address,
                            canvassStatus: proposals[i].Canvass_Status__c,
                            dueOn: "Due " + (todayDate[0] === sqlFormattedDate[0] ? "today" : formattedDate),
                            undoAction: proposals[i].Reason_Proposal_Incomplete__c ? 'removeIncompleteReason' :   'drawingToNew',
                            cardStyle: {
                                backgroundColor: (proposals[i].Reason_Proposal_Incomplete__c ? "#faebcc" : "#fff")
                            },
                            fm: proposals[i].Field_Marketer__c,
                            designer: proposals[i].designer,
                            incompleteReason: proposals[i].Reason_Proposal_Incomplete__c,
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
                formattedDate = (formattedDate.getMonth() + 1) + "/" + formattedDate.getDate() + "/" + formattedDate.getFullYear()
                let sqlFormattedDate = proposals[i].Appointment_Date__c.split("T")
                if (proposals[i].qc_guy === null) {
                    data1.lanes[2].cards.push(
                        {
                            id: proposals[i].Id,
                            name: proposals[i].Name ,
                            draggable: false,
                            undo: true,
                            columnPosition: 2,
                            dueOn: "Due " + (todayDate[0] === sqlFormattedDate[0] ? "today" : formattedDate),
                            designer: proposals[i].designer,
                            undoAction: proposals[i].qc_guy ? 'removeQCDesigner' : 'qcToDrawing',
                            address: address,
                            fm: proposals[i].Field_Marketer__c,
                            qcBy: (proposals[i].qc_guy !== null ? proposals[i].qc_guy : 'No one yet'),
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
                } else {
                    data1.lanes[2].cards.unshift(
                        {
                            id: proposals[i].Id,
                            name: proposals[i].Name,
                            draggable: false,
                            undo: true,
                            columnPosition: 2,
                            undoAction: proposals[i].qc_guy ? 'removeQCDesigner' : 'qcToDrawing',
                            dueOn: "Due " + (todayDate[0] === sqlFormattedDate[0] ? "today" : formattedDate),
                            description: "Appointment : " + formattedDate + "\n QC by: " + (proposals[i].qc_guy !== null ? proposals[i].qc_guy : 'No one yet'),
                            address: address,
                            fm: proposals[i].Field_Marketer__c,
                            qcBy: (proposals[i].qc_guy !== null ? proposals[i].qc_guy : 'No one yet'),
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
                formattedDate = (formattedDate.getMonth() + 1) + "/" + formattedDate.getDate() + "/" + formattedDate.getFullYear()
                let sqlFormattedDate = proposals[i].Appointment_Date__c.split("T")
                data1.lanes[3].cards.push(
                    {
                        id: proposals[i].Id,
                        name: proposals[i].Name,
                        draggable: false,
                        undo: true,
                        columnPosition: 3,

                        holdingNotes: proposals[i].Reason_Proposal_Incomplete__c ? proposals[i].Reason_Proposal_Incomplete__c : '',
                        canvassStatus: proposals[i].Canvass_Status__c,
                        undoAction: 'moveToNew',
                        address: address,
                        fm: proposals[i].Field_Marketer__c,
                        dueOn: "Due " + (todayDate[0] === sqlFormattedDate[0] ? "today" : formattedDate),
                        description: "Appointment : " + formattedDate + "\nFM: " + proposals[i].Field_Marketer__c,
                        metadata: {
                            id: proposals[i].Id,
                            title: proposals[i].Name,
                            description: "Appointment : " + proposals[i].Appointment_Date__c,
                            nextStep: "drawing",
                            holdingNotes: proposals[i].Reason_Proposal_Incomplete__c ? proposals[i].Reason_Proposal_Incomplete__c : '',
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
            // console.log("processCardNextStep ", cardId, metadata, laneId)
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
            document.getElementById('modal-drawing-id').classList.remove("in")
            document.getElementById('modal-qc-checklist').classList.remove("in")
        }

        function closeModalWizard(metadata) {
            document.getElementById('modal-drawing-id').classList.remove("in")
            document.getElementById('modal-qc-checklist').classList.remove("in")
            emit.UpdateWizardStep(0)
            undoActionFunction('removeQCDesigner', metadata.id)
        }

        function startDrawing(metadata) {
            // console.log("startDrawing bottom ", metadata)

            emit.StartProposalDrawing({leadId: metadata.id, accountId: user.accountId})
            document.getElementById('modal-drawing-id').classList.remove("in")
            document.getElementById('modal-usage-id').classList.remove("in")
        }

        function needsUsage(metadata) {
            console.log("needsUsage bottom ")
            // if(selectedCard.metadata.length >= 1){
            //     emit.StartProposalDrawing({leadId: selectedCard.metadata.id, accountId: user.accountId})
            // }else{
            //     alert("Ups! Something is off")
            // }
            // emit.ProposalNeedsUsage({leadId: metadata.id})
            document.getElementById('modal-drawing-id').classList.remove("in")
        }

        function usageFixed(metadata) {
            console.log("usageFixed ", metadata)
            emit.ProposalUsageFixed({leadId: metadata.id, accountId: user.accountId})
            document.getElementById('modal-usage-id').classList.remove("in")
        }

        function readyForQC(metadata) {
            emit.ProposalFinished({leadId: metadata.id})
            document.getElementById('modal-drawing-options').classList.remove("in")
        }

        function refreshBoard() {
            emit.ClickedRefreshBoard()
            emit.ClickedRefreshProposalBoard()
        }


        return (
            <section id='proposal-board-v2' className="pwrstation-view-profile" >

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

                                {/*<button onClick={this.completeMilkEvent} style={{margin: 5}}>*/}
                                {/*    Complete Buy Milk*/}
                                {/*</button>*/}
                                <Board style={{
                                    backgroundImage: "linear-gradient(180deg,hsla(0,0%,100%,0) 60%,#fff),linear-gradient(70deg,#dbedff 32%,#ebfff0)",
                                    padding: "40px 5px"
                                }}
                                    // data={this.state.boardData}
                                       data={data1}
                                       components={{Card: CustomCard}}
                                    // eventBusHandle={this.setEventBus}
                                    //    onCardClick={(cardId, metadata, laneId) => alert(`Card with id:${cardId} clicked. Has metadata.id: ${metadata.id}. Card in lane: ${laneId}`)}
                                    // onCardClick={cardModal.bind(this, metadata.id) }
                                       onCardClick={(cardId, metadata, laneId) => this.processCardNextStep(cardId, metadata, laneId)}
                                />
                                {alert === null || alert === 'hide' ?
                                    ''
                                    :
                                    <div id='alert-proposal-start' className="alert alert-info fadeInLeft">
                                        <strong>{alert}</strong>
                                    </div>
                                }
                            </div>
                        </div>

                    </div>
                </div>
                <div id='modal-drawing-id' className="modal fade "  >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal"
                                        onClick={closeModal.bind(this)}
                                        aria-hidden="true">&times;</button>
                                <h4 className="modal-title">Usage
                                    Options {selectedCard.metadata ? "for " + selectedCard.metadata.title : ''}</h4>
                            </div>
                            <div className="modal-body">
                                <form id='form-needs-usage-reason' method="POST" onSubmit={e => {
                                    e.preventDefault()
                                    emit.ProposalUpdateIncompleteReason({
                                        proposalId: selectedCard.metadata.id,
                                        incompleteReason: document.getElementById('incomplete-reason').value,
                                        updateField: (selectedCard.metadata.nextStep === 'drawing' ? "needsUsage" : "incompleteReason")
                                    })
                                }}>

                                    Needs Usage Reason

                                    {selectedCard.metadata ?
                                        (
                                            selectedCard.metadata.nextStep === 'drawing' ?
                                                " (if any)"
                                                :
                                                ""
                                        )
                                        : ''
                                    }
                                    {selectedCard.metadata ?
                                        (selectedCard.metadata.holdingNotes ?
                                                  <textarea style={{marginTop: "1em"}}
                                                          className="form-control"
                                                          id="incomplete-reason"
                                                          name="rep_pros" rows="3" placeholder="Type here with val" key={selectedCard.metadata.id}
                                                >
                                                 {selectedCard.metadata.holdingNotes}
                                            </textarea>
                                                 
                        
                                                :
                                                <textarea style={{marginTop: "1em"}}
                                                          className="form-control"
                                                          id="incomplete-reason"
                                                          name="rep_pros" rows="3" placeholder="Type here" key={selectedCard.metadata.id}
                                                >

                                            </textarea>
                                        )
                                        : ''
                                    }

                                </form>

                            </div>
                            <div className="modal-footer" style={{textAlign: "center"}}>

                                <button type="submit" className="btn btn-primary"
                                        form='form-needs-usage-reason'
                                        style={{padding: "7px 12px", fontSize: "13px"}}
                                        onClick={needsUsage.bind(this, selectedCard.metadata)}>
                                    {selectedCard.metadata ?
                                        (
                                            selectedCard.metadata.nextStep === 'drawing' ?
                                                "Update to Needs Usage"
                                                :
                                                "Save Incomplete Reason"
                                        )
                                        : ''
                                    }

                                    <svg xmlns="http://www.w3.org/2000/svg"
                                        // xmlns:xlink="http://www.w3.org/1999/xlink"
                                         width="20px" height="20px"
                                         viewBox="0 0 24 24" version="1.1" className="kt-svg-icon">
                                        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                            <polygon id="Shape" points="0 0 24 0 24 24 0 24"/>
                                            <path
                                                d="M6.70710678,15.7071068 C6.31658249,16.0976311 5.68341751,16.0976311 5.29289322,15.7071068 C4.90236893,15.3165825 4.90236893,14.6834175 5.29289322,14.2928932 L11.2928932,8.29289322 C11.6714722,7.91431428 12.2810586,7.90106866 12.6757246,8.26284586 L18.6757246,13.7628459 C19.0828436,14.1360383 19.1103465,14.7686056 18.7371541,15.1757246 C18.3639617,15.5828436 17.7313944,15.6103465 17.3242754,15.2371541 L12.0300757,10.3841378 L6.70710678,15.7071068 Z"
                                                id="Path-94" fill="#000000" fillRule="nonzero"
                                                transform="translate(12.000003, 11.999999) rotate(-270.000000) translate(-12.000003, -11.999999) "/>
                                        </g>
                                    </svg>
                                </button>


                            </div>
                        </div>
                    </div>
                </div>
                <div id='modal-qc-checklist' className="modal fade ">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal"
                                        onClick={closeModalWizard.bind(this, selectedCard.metadata)}
                                        aria-hidden="true">&times;</button>
                                <h4 className="modal-title"> QC
                                    Checklist {selectedCard.metadata ? "for " + selectedCard.metadata.title : ''}</h4>
                            </div>
                            <div className="modal-body" style={{padding: "0px", paddingBottom: "0px"}}>
                                {selectedCard.metadata ?
                                    <CheckQCWizard key={selectedCard.metadata.id}/>
                                    :
                                    ''
                                }

                            </div>

                        </div>
                    </div>
                </div>
            </section>

        )
    }
}