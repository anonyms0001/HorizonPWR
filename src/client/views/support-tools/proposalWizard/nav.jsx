// import {emit, view} from "../../../framework"
import React from 'react';
/* eslint react/prop-types: 0 */
// import styles from 'assets/less/nav.less';
import StepWizard from 'react-step-wizard'
import proposalStore from "../../../stores/proposalStore";
// @view
// const {wizardStep} = proposalStore
const Nav = (props) => {
    // console.log("NAV VIEW total steps ", props.totalSteps)
    // console.log("nav currentStep ", props.currentStep)
    // // const dots = [];
    // for (let i = 1; i <= props.totalSteps; i += 1) {
    //     const isActive = props.currentStep === i;
    // dots.push((
    //     <span
    //         key={`step-${i}`}
    //         // className={`${styles.dot} ${isActive ? styles.active : ''}`}
    //         onClick={() => props.goToStep(i)}
    //     >&bull;</span>
    // ));
    // }
    // if (wizardStep === 0 ) {
    //     console.log("wizard step is 0")
    //     props.goToStep(1)
    // }else{
    //     console.log("nav init comparation ", wizardStep)
    // }
    return (
        <div>
            {/*<p>{props.currentStep}</p>*/}
            <div className="btn-group btn-group-justified" id='wizard-nav'>
                <div className="btn-group">
                    <button type="button" className={"btn btn-default " + props.currentStep + "test"}
                            style={props.currentStep >= 1 ? {
                                fontSize: "11px",
                                fontWeight: "600",
                                background: "#062c45",
                                borderColor: "#37474F"
                            } : {fontSize: "11px", fontWeight: "600"}}>
                        Consumption&nbsp;
                        {props.currentStep > 1 ? <i style={{
                            color: "green",
                            fontSize: "17px",
                            fontWeight: "600",
                            position: "relative",
                            top: "3px"
                        }} className='glyphicon glyphicon-ok-circle'/> : ''}
                    </button>
                </div>
                <div className="btn-group">
                    <button type="button" className={"btn btn-default " + props.currentStep + "test"}
                            style={props.currentStep >= 2 ? {
                                fontSize: "11px",
                                fontWeight: "600",
                                background: "#062c45",
                                borderColor: "#37474F"
                            } : {fontSize: "11px", fontWeight: "600"}}>Home Design&nbsp;
                        {props.currentStep > 2 ? <i style={{
                            color: "green",
                            fontSize: "17px",
                            fontWeight: "600",
                            position: "relative",
                            top: "3px"
                        }} className='glyphicon glyphicon-ok-circle'/> : ''}
                    </button>
                </div>
                <div className="btn-group">
                    <button type="button" className={"btn btn-default " + props.currentStep + "test"}
                            style={props.currentStep >= 3 ? {
                                fontSize: "11px",
                                fontWeight: "600",
                                background: "#062c45",
                                borderColor: "#37474F"
                            } : {fontSize: "11px", fontWeight: "600"}}>
                        Panel Layout&nbsp;
                        {props.currentStep > 3 ? <i style={{
                            color: "green",
                            fontSize: "17px",
                            fontWeight: "600",
                            position: "relative",
                            top: "3px"
                        }} className='glyphicon glyphicon-ok-circle'/> : ''}
                    </button>
                </div>
                <div className="btn-group" style={{width: "4px"}}>
                    <button type="button" className={"btn btn-default " + props.currentStep + "test"}
                            style={props.currentStep >= 4 ? {
                                fontSize: "11px",
                                fontWeight: "600",
                                background: "#062c45",
                                borderColor: "#37474F"
                            } : {fontSize: "11px", fontWeight: "600"}}>
                        Trees&nbsp;
                        {props.currentStep > 4 ? <i style={{
                            color: "green",
                            fontSize: "17px",
                            fontWeight: "600",
                            position: "relative",
                            top: "3px"
                        }} className='glyphicon glyphicon-ok-circle'/> : ''}
                    </button>
                </div>
                <div className="btn-group">
                    <button type="button" className={"btn btn-default " + props.currentStep + "test"}
                            style={props.currentStep >= 5 ? {
                                fontSize: "11px",
                                fontWeight: "600",
                                background: "#062c45",
                                borderColor: "#37474F"
                            } : {fontSize: "11px", fontWeight: "600"}}>
                        Pricing&nbsp;
                        {props.currentStep > 5 ? <i style={{
                            color: "green",
                            fontSize: "17px",
                            fontWeight: "600",
                            position: "relative",
                            top: "3px"
                        }} className='glyphicon glyphicon-ok-circle'/> : ''}
                    </button>
                </div>
                <div className="btn-group" style={{width: "6px"}}>
                    <button type="button" className={"btn btn-default " + props.currentStep + "test"}
                            style={props.currentStep >= 6 ? {
                                fontSize: "11px",
                                fontWeight: "600",
                                background: "#062c45",
                                borderColor: "#37474F"
                            } : {fontSize: "11px", fontWeight: "600"}}>
                        Financing&nbsp;
                        {props.currentStep > 6 ? <i style={{
                            color: "green",
                            fontSize: "17px",
                            fontWeight: "600",
                            position: "relative",
                            top: "3px"
                        }} className='glyphicon glyphicon-ok-circle'/> : ''}
                    </button>
                </div>
                <div className="btn-group">
                    <button type="button" className={"btn btn-default " + props.currentStep + "test"}
                            style={props.currentStep >= 7 ? {
                                fontSize: "11px",
                                fontWeight: "600",
                                background: "#062c45",
                                borderColor: "#37474F"
                            } : {fontSize: "11px", fontWeight: "600"}}>
                        Proposal Template&nbsp;
                        {props.currentStep > 7 ? <i style={{
                            color: "green",
                            fontSize: "17px",
                            fontWeight: "600",
                            position: "relative",
                            top: "3px"
                        }} className='glyphicon glyphicon-ok-circle'/> : ''}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Nav;
