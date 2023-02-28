import {emit, view} from "../../../framework"
import React from 'react'
import StepWizard from 'react-step-wizard'
import Nav from "./nav"
import proposalStore from "../../../stores/proposalStore"

@view
export default class CheckQCWizard extends React.Component {

    render() {

        const {wizardStep, selectedCard} = proposalStore
        // console.log("wizardStep VIEW HERE ", wizardStep)

        // const Wizard = () => {
        //     const [state, updateState] = useState({
        //         form: {},
        //     }
        //         transitions: {
        //             enterRight: `${transitions.animated} ${transitions.enterRight}`,
        //             enterLeft: `${transitions.animated} ${transitions.enterLeft}`,
        //             exitRight: `${transitions.animated} ${transitions.exitRight}`,
        //             exitLeft: `${transitions.animated} ${transitions.exitLeft}`,
        //             intro: `${transitions.animated} ${transitions.intro}`,
        //         },
        //         // demo: true, // uncomment to see more
        //     });
        const onStepChange = (stats) => {
            emit.UpdateWizardStep(stats.activeStep)
            if (stats.activeStep === 8) {
                // document.getElementById('modal-qc-checklist').classList.remove("in")
            }

        };

        const Update = props => {
            const update = (e) => {
                props.update(e.target.name, e.target.value);
            };
        }

        const NextStep = ({
                              nextStep,
                              step,
                              totalSteps
                          }) => (
            <div>
                {step < totalSteps ?
                    <button id={step + '-step-btn'} className='btn btn-primary btn-block disabled'
                            onClick={nextStep}>
                        Next
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
                    : wizardStep === 2 ?
                        <button>hey</button>
                        :
                        <button className='btn btn-success btn-block' style={{fontSize: "14px"}}
                                onClick={nextStep}>Finish</button>
                }

            </div>
        )

        const First = props => {

            const update = (e) => {
                const checkConsumption = document.getElementById('check_consumption').checked
                const checkPowerCompany = document.getElementById('check_power_company').checked
                const checkEscalation = document.getElementById('check_escalation').checked

                // console.log("checkConsumption ", checkConsumption, "checkPowerCompany ", checkPowerCompany, "checkEscalation ", checkEscalation)
                if (checkConsumption && checkEscalation && checkPowerCompany) {
                    document.getElementById("1-step-btn").classList.remove("disabled")
                } else {
                    document.getElementById("1-step-btn").classList.add("disabled")
                }
            };
            return (
                <div>
                    <div id='first-step' className='well wizard-steps-checklist' style={{margin: "0px"}}>

                        <div className="checklist-group-container">
                            <div className="checklist-item">
                                <input type="checkbox" id="check_consumption" name="check_consumption"
                                       onChange={update}
                                />
                                <label htmlFor="check_consumption">
                                    <svg xmlns="http://www.w3.org/2000/svg"
                                         width="24px" height="24px" viewBox="0 0 24 24" version="1.1"
                                         className="kt-svg-icon">
                                        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                            <rect id="bound" x="0" y="0" width="24" height="24"/>
                                            <circle id="Oval-5" fill="#000000" opacity="0.3" cx="12" cy="12"
                                                    r="10"/>
                                            <path
                                                d="M16.7689447,7.81768175 C17.1457787,7.41393107 17.7785676,7.39211077 18.1823183,7.76894473 C18.5860689,8.1457787 18.6078892,8.77856757 18.2310553,9.18231825 L11.2310553,16.6823183 C10.8654446,17.0740439 10.2560456,17.107974 9.84920863,16.7592566 L6.34920863,13.7592566 C5.92988278,13.3998345 5.88132125,12.7685345 6.2407434,12.3492086 C6.60016555,11.9298828 7.23146553,11.8813212 7.65079137,12.2407434 L10.4229928,14.616916 L16.7689447,7.81768175 Z"
                                                id="Path-92" fill="#000000" fillRule="nonzero"/>
                                        </g>
                                    </svg>
                                    &nbsp;&nbsp;&nbsp;Check the consumption against the bill the rep provided
                                </label>
                            </div>
                            <div className="checklist-item">
                                <input type="checkbox" id="check_power_company" name="check_power_company"
                                       onChange={update}
                                />
                                <label htmlFor="check_power_company">
                                    <svg xmlns="http://www.w3.org/2000/svg"
                                         width="24px" height="24px" viewBox="0 0 24 24" version="1.1"
                                         className="kt-svg-icon">
                                        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                            <rect id="bound" x="0" y="0" width="24" height="24"/>
                                            <circle id="Oval-5" fill="#000000" opacity="0.3" cx="12" cy="12"
                                                    r="10"/>
                                            <path
                                                d="M16.7689447,7.81768175 C17.1457787,7.41393107 17.7785676,7.39211077 18.1823183,7.76894473 C18.5860689,8.1457787 18.6078892,8.77856757 18.2310553,9.18231825 L11.2310553,16.6823183 C10.8654446,17.0740439 10.2560456,17.107974 9.84920863,16.7592566 L6.34920863,13.7592566 C5.92988278,13.3998345 5.88132125,12.7685345 6.2407434,12.3492086 C6.60016555,11.9298828 7.23146553,11.8813212 7.65079137,12.2407434 L10.4229928,14.616916 L16.7689447,7.81768175 Z"
                                                id="Path-92" fill="#000000" fillRule="nonzero"/>
                                        </g>
                                    </svg>
                                    &nbsp;&nbsp;&nbsp;Make sure the correct power company is
                                    selected <b>(Don’t assume)</b>
                                </label>
                            </div>
                            <div className="checklist-item">
                                <input type="checkbox" id="check_escalation" name="check_escalation"
                                       onChange={update}
                                />
                                <label htmlFor="check_escalation">
                                    <svg xmlns="http://www.w3.org/2000/svg"
                                         width="24px" height="24px" viewBox="0 0 24 24" version="1.1"
                                         className="kt-svg-icon">
                                        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                            <rect id="bound" x="0" y="0" width="24" height="24"/>
                                            <circle id="Oval-5" fill="#000000" opacity="0.3" cx="12" cy="12"
                                                    r="10"/>
                                            <path
                                                d="M16.7689447,7.81768175 C17.1457787,7.41393107 17.7785676,7.39211077 18.1823183,7.76894473 C18.5860689,8.1457787 18.6078892,8.77856757 18.2310553,9.18231825 L11.2310553,16.6823183 C10.8654446,17.0740439 10.2560456,17.107974 9.84920863,16.7592566 L6.34920863,13.7592566 C5.92988278,13.3998345 5.88132125,12.7685345 6.2407434,12.3492086 C6.60016555,11.9298828 7.23146553,11.8813212 7.65079137,12.2407434 L10.4229928,14.616916 L16.7689447,7.81768175 Z"
                                                id="Path-92" fill="#000000" fillRule="nonzero"/>
                                        </g>
                                    </svg>
                                    &nbsp;&nbsp;&nbsp;Make sure escalation is set at 4
                                </label>
                            </div>
                        </div>
                    </div>

                    <NextStep step={1} {...props}/>
                </div>
            )
        }

        const Second = props => {

            const update = (e) => {
                const checkPin = document.getElementById('check_pin').checked
                const checkLidar = document.getElementById('check_lidar').checked
                const checkPanels = document.getElementById('check_panels').checked

                // console.log("checkConsumption ", checkConsumption, "checkPowerCompany ", checkPowerCompany, "checkEscalation ", checkEscalation)
                if (checkPin && checkLidar && checkPanels) {
                    document.getElementById("2-step-btn").classList.remove("disabled")
                } else {
                    document.getElementById("2-step-btn").classList.add("disabled")
                }
            };

            return (
                <div>
                    <div id='second-step' className='well wizard-steps-checklist' style={{margin: "0px"}}>
                        <div className="checklist-group-container">
                            <div className="checklist-item">
                                <input type="checkbox" id="check_pin" name="check_pin"
                                       onChange={update}
                                />
                                <label htmlFor="check_pin">
                                    <svg xmlns="http://www.w3.org/2000/svg"
                                         width="24px" height="24px" viewBox="0 0 24 24" version="1.1"
                                         className="kt-svg-icon">
                                        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                            <rect id="bound" x="0" y="0" width="24" height="24"/>
                                            <circle id="Oval-5" fill="#000000" opacity="0.3" cx="12" cy="12"
                                                    r="10"/>
                                            <path
                                                d="M16.7689447,7.81768175 C17.1457787,7.41393107 17.7785676,7.39211077 18.1823183,7.76894473 C18.5860689,8.1457787 18.6078892,8.77856757 18.2310553,9.18231825 L11.2310553,16.6823183 C10.8654446,17.0740439 10.2560456,17.107974 9.84920863,16.7592566 L6.34920863,13.7592566 C5.92988278,13.3998345 5.88132125,12.7685345 6.2407434,12.3492086 C6.60016555,11.9298828 7.23146553,11.8813212 7.65079137,12.2407434 L10.4229928,14.616916 L16.7689447,7.81768175 Z"
                                                id="Path-92" fill="#000000" fillRule="nonzero"/>
                                        </g>
                                    </svg>
                                    &nbsp;&nbsp;&nbsp; Make sure Aurora put the pin on the right
                                    house. (Good to check the address in Google)
                                </label>
                            </div>
                        </div>
                        <div className="checklist-group-container">
                            <div className="checklist-item">
                                <input type="checkbox" id="check_lidar" name="check_lidar"
                                       onChange={update}
                                />
                                <label htmlFor="check_lidar">
                                    <svg xmlns="http://www.w3.org/2000/svg"
                                         width="24px" height="24px" viewBox="0 0 24 24" version="1.1"
                                         className="kt-svg-icon">
                                        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                            <rect id="bound" x="0" y="0" width="24" height="24"/>
                                            <circle id="Oval-5" fill="#000000" opacity="0.3" cx="12" cy="12"
                                                    r="10"/>
                                            <path
                                                d="M16.7689447,7.81768175 C17.1457787,7.41393107 17.7785676,7.39211077 18.1823183,7.76894473 C18.5860689,8.1457787 18.6078892,8.77856757 18.2310553,9.18231825 L11.2310553,16.6823183 C10.8654446,17.0740439 10.2560456,17.107974 9.84920863,16.7592566 L6.34920863,13.7592566 C5.92988278,13.3998345 5.88132125,12.7685345 6.2407434,12.3492086 C6.60016555,11.9298828 7.23146553,11.8813212 7.65079137,12.2407434 L10.4229928,14.616916 L16.7689447,7.81768175 Z"
                                                id="Path-92" fill="#000000" fillRule="nonzero"/>
                                        </g>
                                    </svg>
                                    &nbsp;&nbsp;&nbsp; Check LIDAR or Google Maps/Earth street
                                    view, is the house accurately designed? (Pitch, Height,
                                    Obstructions)
                                </label>
                            </div>
                        </div>
                        <div className="checklist-group-container">
                            <div className="checklist-item">
                                <input type="checkbox" id="check_panels" name="check_panels"
                                       onChange={update}
                                />
                                <label htmlFor="check_panels">
                                    <svg xmlns="http://www.w3.org/2000/svg"
                                         width="24px" height="24px" viewBox="0 0 24 24" version="1.1"
                                         className="kt-svg-icon">
                                        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                            <rect id="bound" x="0" y="0" width="24" height="24"/>
                                            <circle id="Oval-5" fill="#000000" opacity="0.3" cx="12" cy="12"
                                                    r="10"/>
                                            <path
                                                d="M16.7689447,7.81768175 C17.1457787,7.41393107 17.7785676,7.39211077 18.1823183,7.76894473 C18.5860689,8.1457787 18.6078892,8.77856757 18.2310553,9.18231825 L11.2310553,16.6823183 C10.8654446,17.0740439 10.2560456,17.107974 9.84920863,16.7592566 L6.34920863,13.7592566 C5.92988278,13.3998345 5.88132125,12.7685345 6.2407434,12.3492086 C6.60016555,11.9298828 7.23146553,11.8813212 7.65079137,12.2407434 L10.4229928,14.616916 L16.7689447,7.81768175 Z"
                                                id="Path-92" fill="#000000" fillRule="nonzero"/>
                                        </g>
                                    </svg>
                                    &nbsp;&nbsp;&nbsp; Look closely at the house, are all the roof
                                    faces drawn correctly? If you move the panels out of the way, do you see
                                    obstructions that were missed on the roof?
                                </label>
                            </div>
                        </div>
                    </div>

                    <NextStep step={2} {...props}/>
                </div>
            )
        }

        const Third = props => {

            const update = (e) => {
                const checkLandscape = document.getElementById('check_landscape').checked
                const checkArrays = document.getElementById('check_arrays').checked
                const checkDesign = document.getElementById('check_design').checked
                const checkPanelOption = document.getElementById('check_panel_option').checked
                const checkGroundMount = document.getElementById('check_ground_mount').checked

                // console.log("checkConsumption ", checkConsumption, "checkPowerCompany ", checkPowerCompany, "checkEscalation ", checkEscalation)
                if (checkLandscape && checkArrays && checkDesign && checkPanelOption && checkGroundMount) {
                    document.getElementById("3-step-btn").classList.remove("disabled")
                } else {
                    document.getElementById("3-step-btn").classList.add("disabled")
                }
            }

            return (
                <div>
                    <div id='third-step' className='well wizard-steps-checklist' style={{margin: "0px"}}>
                        <div className="checklist-group-container">
                            <div className="checklist-item">
                                <input type="checkbox" id="check_landscape" name="check_landscape"
                                       onChange={update}
                                />
                                <label htmlFor="check_landscape">
                                    <svg xmlns="http://www.w3.org/2000/svg"
                                         width="24px" height="24px" viewBox="0 0 24 24" version="1.1"
                                         className="kt-svg-icon">
                                        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                            <rect id="bound" x="0" y="0" width="24" height="24"/>
                                            <circle id="Oval-5" fill="#000000" opacity="0.3" cx="12" cy="12"
                                                    r="10"/>
                                            <path
                                                d="M16.7689447,7.81768175 C17.1457787,7.41393107 17.7785676,7.39211077 18.1823183,7.76894473 C18.5860689,8.1457787 18.6078892,8.77856757 18.2310553,9.18231825 L11.2310553,16.6823183 C10.8654446,17.0740439 10.2560456,17.107974 9.84920863,16.7592566 L6.34920863,13.7592566 C5.92988278,13.3998345 5.88132125,12.7685345 6.2407434,12.3492086 C6.60016555,11.9298828 7.23146553,11.8813212 7.65079137,12.2407434 L10.4229928,14.616916 L16.7689447,7.81768175 Z"
                                                id="Path-92" fill="#000000" fillRule="nonzero"/>
                                        </g>
                                    </svg>
                                    &nbsp;&nbsp;&nbsp; Are the panels landscape when they
                                    could be portrait?
                                </label>
                            </div>
                        </div>
                        <div className="checklist-group-container">
                            <div className="checklist-item">
                                <input type="checkbox" id="check_arrays" name="check_arrays"
                                       onChange={update}
                                />
                                <label htmlFor="check_arrays">
                                    <svg xmlns="http://www.w3.org/2000/svg"
                                         width="24px" height="24px" viewBox="0 0 24 24" version="1.1"
                                         className="kt-svg-icon">
                                        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                            <rect id="bound" x="0" y="0" width="24" height="24"/>
                                            <circle id="Oval-5" fill="#000000" opacity="0.3" cx="12" cy="12"
                                                    r="10"/>
                                            <path
                                                d="M16.7689447,7.81768175 C17.1457787,7.41393107 17.7785676,7.39211077 18.1823183,7.76894473 C18.5860689,8.1457787 18.6078892,8.77856757 18.2310553,9.18231825 L11.2310553,16.6823183 C10.8654446,17.0740439 10.2560456,17.107974 9.84920863,16.7592566 L6.34920863,13.7592566 C5.92988278,13.3998345 5.88132125,12.7685345 6.2407434,12.3492086 C6.60016555,11.9298828 7.23146553,11.8813212 7.65079137,12.2407434 L10.4229928,14.616916 L16.7689447,7.81768175 Z"
                                                id="Path-92" fill="#000000" fillRule="nonzero"/>
                                        </g>
                                    </svg>
                                    &nbsp;&nbsp;&nbsp;  Are there different arrays (An array
                                    is a cluster of panels) scattered all over the home when it could be
                                    consolidated into fewer arrays?
                                </label>
                            </div>
                        </div>
                        <div className="checklist-group-container">
                            <div className="checklist-item">
                                <input type="checkbox" id="check_design" name="check_design"
                                       onChange={update}
                                />
                                <label htmlFor="check_design">
                                    <svg xmlns="http://www.w3.org/2000/svg"
                                         width="24px" height="24px" viewBox="0 0 24 24" version="1.1"
                                         className="kt-svg-icon">
                                        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                            <rect id="bound" x="0" y="0" width="24" height="24"/>
                                            <circle id="Oval-5" fill="#000000" opacity="0.3" cx="12" cy="12"
                                                    r="10"/>
                                            <path
                                                d="M16.7689447,7.81768175 C17.1457787,7.41393107 17.7785676,7.39211077 18.1823183,7.76894473 C18.5860689,8.1457787 18.6078892,8.77856757 18.2310553,9.18231825 L11.2310553,16.6823183 C10.8654446,17.0740439 10.2560456,17.107974 9.84920863,16.7592566 L6.34920863,13.7592566 C5.92988278,13.3998345 5.88132125,12.7685345 6.2407434,12.3492086 C6.60016555,11.9298828 7.23146553,11.8813212 7.65079137,12.2407434 L10.4229928,14.616916 L16.7689447,7.81768175 Z"
                                                id="Path-92" fill="#000000" fillRule="nonzero"/>
                                        </g>
                                    </svg>
                                    &nbsp;&nbsp;&nbsp; Is this design going too far out of
                                    setbacks? (If in Oregon, it’s okey to go out a bit)
                                </label>
                            </div>
                        </div>
                        <div className="checklist-group-container">
                            <div className="checklist-item">
                                <input type="checkbox" id="check_panel_option" name="check_panel_option"
                                       onChange={update}
                                />
                                <label htmlFor="check_panel_option">
                                    <svg xmlns="http://www.w3.org/2000/svg"
                                         width="24px" height="24px" viewBox="0 0 24 24" version="1.1"
                                         className="kt-svg-icon">
                                        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                            <rect id="bound" x="0" y="0" width="24" height="24"/>
                                            <circle id="Oval-5" fill="#000000" opacity="0.3" cx="12" cy="12"
                                                    r="10"/>
                                            <path
                                                d="M16.7689447,7.81768175 C17.1457787,7.41393107 17.7785676,7.39211077 18.1823183,7.76894473 C18.5860689,8.1457787 18.6078892,8.77856757 18.2310553,9.18231825 L11.2310553,16.6823183 C10.8654446,17.0740439 10.2560456,17.107974 9.84920863,16.7592566 L6.34920863,13.7592566 C5.92988278,13.3998345 5.88132125,12.7685345 6.2407434,12.3492086 C6.60016555,11.9298828 7.23146553,11.8813212 7.65079137,12.2407434 L10.4229928,14.616916 L16.7689447,7.81768175 Z"
                                                id="Path-92" fill="#000000" fillRule="nonzero"/>
                                        </g>
                                    </svg>
                                    &nbsp;&nbsp;&nbsp;  Do you see a shop or another spot you
                                    could do panels so you could preemptively provide another option for the
                                    rep??
                                </label>
                            </div>
                        </div>
                        <div className="checklist-group-container">
                            <div className="checklist-item">
                                <input type="checkbox" id="check_ground_mount" name="check_ground_mount"
                                       onChange={update}
                                />
                                <label htmlFor="check_ground_mount">
                                    <svg xmlns="http://www.w3.org/2000/svg"
                                         width="24px" height="24px" viewBox="0 0 24 24" version="1.1"
                                         className="kt-svg-icon">
                                        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                            <rect id="bound" x="0" y="0" width="24" height="24"/>
                                            <circle id="Oval-5" fill="#000000" opacity="0.3" cx="12" cy="12"
                                                    r="10"/>
                                            <path
                                                d="M16.7689447,7.81768175 C17.1457787,7.41393107 17.7785676,7.39211077 18.1823183,7.76894473 C18.5860689,8.1457787 18.6078892,8.77856757 18.2310553,9.18231825 L11.2310553,16.6823183 C10.8654446,17.0740439 10.2560456,17.107974 9.84920863,16.7592566 L6.34920863,13.7592566 C5.92988278,13.3998345 5.88132125,12.7685345 6.2407434,12.3492086 C6.60016555,11.9298828 7.23146553,11.8813212 7.65079137,12.2407434 L10.4229928,14.616916 L16.7689447,7.81768175 Z"
                                                id="Path-92" fill="#000000" fillRule="nonzero"/>
                                        </g>
                                    </svg>
                                    &nbsp;&nbsp;&nbsp;  Do you see a spot where we could
                                    potentially add a ground mount to provide a better offset for the
                                    customer?
                                </label>
                            </div>
                        </div>
                    </div>

                    <NextStep step={3} {...props}/>
                </div>
            )
        }

        const Fourth = props => {

            const update = (e) => {
                const checkDrawnTrees = document.getElementById('check_drawn_trees').checked
                const checkLidarMatch = document.getElementById('check_lidar_match').checked

                if (checkLidarMatch && checkDrawnTrees) {
                    document.getElementById("4-step-btn").classList.remove("disabled")
                } else {
                    document.getElementById("4-step-btn").classList.add("disabled")
                }
            }

            return (
                <div>
                    <div id='fourth-step' className='well wizard-steps-checklist' style={{margin: "0px"}}>
                        <div className="checklist-group-container">
                            <div className="checklist-item">
                                <input type="checkbox" id="check_drawn_trees" name="check_drawn_trees"
                                       onChange={update}
                                />
                                <label htmlFor="check_drawn_trees">
                                    <svg xmlns="http://www.w3.org/2000/svg"
                                         width="24px" height="24px" viewBox="0 0 24 24" version="1.1"
                                         className="kt-svg-icon">
                                        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                            <rect id="bound" x="0" y="0" width="24" height="24"/>
                                            <circle id="Oval-5" fill="#000000" opacity="0.3" cx="12" cy="12"
                                                    r="10"/>
                                            <path
                                                d="M16.7689447,7.81768175 C17.1457787,7.41393107 17.7785676,7.39211077 18.1823183,7.76894473 C18.5860689,8.1457787 18.6078892,8.77856757 18.2310553,9.18231825 L11.2310553,16.6823183 C10.8654446,17.0740439 10.2560456,17.107974 9.84920863,16.7592566 L6.34920863,13.7592566 C5.92988278,13.3998345 5.88132125,12.7685345 6.2407434,12.3492086 C6.60016555,11.9298828 7.23146553,11.8813212 7.65079137,12.2407434 L10.4229928,14.616916 L16.7689447,7.81768175 Z"
                                                id="Path-92" fill="#000000" fillRule="nonzero"/>
                                        </g>
                                    </svg>
                                    &nbsp;&nbsp;&nbsp;  Are the trees drawn accurately?
                                </label>
                            </div>
                        </div>
                        <div className="checklist-group-container">
                            <div className="checklist-item">
                                <input type="checkbox" id="check_lidar_match" name="check_lidar_match"
                                       onChange={update}
                                />
                                <label htmlFor="check_lidar_match">
                                    <svg xmlns="http://www.w3.org/2000/svg"
                                         width="24px" height="24px" viewBox="0 0 24 24" version="1.1"
                                         className="kt-svg-icon">
                                        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                            <rect id="bound" x="0" y="0" width="24" height="24"/>
                                            <circle id="Oval-5" fill="#000000" opacity="0.3" cx="12" cy="12"
                                                    r="10"/>
                                            <path
                                                d="M16.7689447,7.81768175 C17.1457787,7.41393107 17.7785676,7.39211077 18.1823183,7.76894473 C18.5860689,8.1457787 18.6078892,8.77856757 18.2310553,9.18231825 L11.2310553,16.6823183 C10.8654446,17.0740439 10.2560456,17.107974 9.84920863,16.7592566 L6.34920863,13.7592566 C5.92988278,13.3998345 5.88132125,12.7685345 6.2407434,12.3492086 C6.60016555,11.9298828 7.23146553,11.8813212 7.65079137,12.2407434 L10.4229928,14.616916 L16.7689447,7.81768175 Z"
                                                id="Path-92" fill="#000000" fillRule="nonzero"/>
                                        </g>
                                    </svg>
                                    &nbsp;&nbsp;&nbsp;  Do we have LIDAR? If so, does it match up? If not, compare to
                                    Google.
                                </label>
                            </div>
                        </div>
                    </div>
                    <NextStep step={4} {...props}/>
                </div>
            )
        }

        const Fifth = props => {

            const update = (e) => {
                const ppwAccuracy = document.getElementById('ppw_accuracy').checked

                if (ppwAccuracy) {
                    document.getElementById("5-step-btn").classList.remove("disabled")
                } else {
                    document.getElementById("5-step-btn").classList.add("disabled")
                }
            }

            return (
                <div>
                    <div id='fifth-step' className='well wizard-steps-checklist' style={{margin: "0px"}}>
                        <div className="checklist-group-container">
                            <div className="checklist-item">
                                <input type="checkbox" id="ppw_accuracy" name="ppw_accuracy"
                                       onChange={update}
                                />
                                <label htmlFor="ppw_accuracy">
                                    <svg xmlns="http://www.w3.org/2000/svg"
                                         width="24px" height="24px" viewBox="0 0 24 24" version="1.1"
                                         className="kt-svg-icon">
                                        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                            <rect id="bound" x="0" y="0" width="24" height="24"/>
                                            <circle id="Oval-5" fill="#000000" opacity="0.3" cx="12" cy="12"
                                                    r="10"/>
                                            <path
                                                d="M16.7689447,7.81768175 C17.1457787,7.41393107 17.7785676,7.39211077 18.1823183,7.76894473 C18.5860689,8.1457787 18.6078892,8.77856757 18.2310553,9.18231825 L11.2310553,16.6823183 C10.8654446,17.0740439 10.2560456,17.107974 9.84920863,16.7592566 L6.34920863,13.7592566 C5.92988278,13.3998345 5.88132125,12.7685345 6.2407434,12.3492086 C6.60016555,11.9298828 7.23146553,11.8813212 7.65079137,12.2407434 L10.4229928,14.616916 L16.7689447,7.81768175 Z"
                                                id="Path-92" fill="#000000" fillRule="nonzero"/>
                                        </g>
                                    </svg>
                                    &nbsp;&nbsp;&nbsp;  Is the PPW accurate
                                </label>
                                <ul style={{paddingLeft: "100px", fontSize: "17px"}}>
                                    <li>Trenching Included?</li>
                                    <li>Consumption Meter?</li>
                                    <li>Ground Mount?</li>
                                    <li>$4.45/W in Oregon; $4.10/W in Idaho</li>
                                    <li>$.50/W added for ground mounts</li>
                                    <li>$650 added for consumption meter</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <NextStep step={5} {...props}/>
                </div>
            )
        }

        const Sixth = props => {

            const update = (e) => {
                const checkIncentives = document.getElementById('check_incentives').checked

                if (checkIncentives) {
                    document.getElementById("6-step-btn").classList.remove("disabled")
                } else {
                    document.getElementById("6-step-btn").classList.add("disabled")
                }
            }

            return (
                <div>
                    <div id='sixth-step' className='well wizard-steps-checklist' style={{margin: "0px"}}>
                        <div className="checklist-group-container">
                            <div className="checklist-item">
                                <input type="checkbox" id="check_incentives" name="check_incentives"
                                       onChange={update}
                                />
                                <label htmlFor="check_incentives">
                                    <svg xmlns="http://www.w3.org/2000/svg"
                                         width="24px" height="24px" viewBox="0 0 24 24" version="1.1"
                                         className="kt-svg-icon">
                                        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                            <rect id="bound" x="0" y="0" width="24" height="24"/>
                                            <circle id="Oval-5" fill="#000000" opacity="0.3" cx="12" cy="12"
                                                    r="10"/>
                                            <path
                                                d="M16.7689447,7.81768175 C17.1457787,7.41393107 17.7785676,7.39211077 18.1823183,7.76894473 C18.5860689,8.1457787 18.6078892,8.77856757 18.2310553,9.18231825 L11.2310553,16.6823183 C10.8654446,17.0740439 10.2560456,17.107974 9.84920863,16.7592566 L6.34920863,13.7592566 C5.92988278,13.3998345 5.88132125,12.7685345 6.2407434,12.3492086 C6.60016555,11.9298828 7.23146553,11.8813212 7.65079137,12.2407434 L10.4229928,14.616916 L16.7689447,7.81768175 Z"
                                                id="Path-92" fill="#000000" fillRule="nonzero"/>
                                        </g>
                                    </svg>
                                    &nbsp;&nbsp;&nbsp;   Incentives are accurate
                                </label>
                                <ul style={{paddingLeft: "100px", fontSize: "17px"}}>
                                    <li>26% Federal ITC (22% beginning in 2021)</li>
                                    <li>$0.30/W Rebate for Pacific Power customers (Oregon)</li>
                                    <li>21 Yr Loan & Cash Financing options are selected</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <NextStep step={6} {...props}/>
                </div>
            )
        }

        const Seventh = props => {

            const update = (e) => {
                const checkTemplates= document.getElementById('check_templates').checked

                if (checkTemplates) {
                    document.getElementById("7-step-btn").classList.remove("disabled")
                } else {
                    document.getElementById("7-step-btn").classList.add("disabled")
                }
            }

            return (
                <div>

                    <div id='seventh-step' className='well wizard-steps-checklist' style={{margin: "0px"}}>
                        <div className="checklist-group-container">
                            <div className="checklist-item">
                                <input type="checkbox" id="check_templates" name="check_templates"
                                       onChange={update}
                                />
                                <label htmlFor="check_templates">
                                    <svg xmlns="http://www.w3.org/2000/svg"
                                         width="24px" height="24px" viewBox="0 0 24 24" version="1.1"
                                         className="kt-svg-icon">
                                        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                            <rect id="bound" x="0" y="0" width="24" height="24"/>
                                            <circle id="Oval-5" fill="#000000" opacity="0.3" cx="12" cy="12"
                                                    r="10"/>
                                            <path
                                                d="M16.7689447,7.81768175 C17.1457787,7.41393107 17.7785676,7.39211077 18.1823183,7.76894473 C18.5860689,8.1457787 18.6078892,8.77856757 18.2310553,9.18231825 L11.2310553,16.6823183 C10.8654446,17.0740439 10.2560456,17.107974 9.84920863,16.7592566 L6.34920863,13.7592566 C5.92988278,13.3998345 5.88132125,12.7685345 6.2407434,12.3492086 C6.60016555,11.9298828 7.23146553,11.8813212 7.65079137,12.2407434 L10.4229928,14.616916 L16.7689447,7.81768175 Z"
                                                id="Path-92" fill="#000000" fillRule="nonzero"/>
                                        </g>
                                    </svg>
                                    &nbsp;&nbsp;&nbsp;    Is the correct templated selected?
                                </label>
                                <ul style={{paddingLeft: "100px", fontSize: "17px"}}>
                                    <li>If Idaho, the Idaho 21 Year Analysis</li>
                                    <li>If Pacific Power customer, the Pacific Power 21 Year Analysis</li>
                                    <li>(This is important so the rebate shows on the proposals.)</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <NextStep step={7} {...props}/>
                </div>
            )
        }

        const Finished = props => {

             const submit = () => {

                document.getElementById('modal-qc-checklist').classList.remove("in")
                emit.ProposalQCFinished({leadId: selectedCard.metadata.id})
            };

            return (
                <div>
                    <div className='well' style={{margin: "0px", textAlign: "center"}}>

                       <div className='col-md-6 col-md-offset-3'>
                                <h3 className='text-center' style={{paddingTop: "0.5em", fontWeight: "bold"}}>
                                    Looks like you're done
                                </h3>
                                <img src="/assets/images/thumb-up.png" width="118" height="156" alt=""  />
                            </div>
                    </div>
                    <NextStep step={8} {...props} nextStep={submit}/>
                </div>
            )
        }

        function transitionsListening() {
            console.log("transition")
        }

        return (
            <StepWizard
                onStepChange={onStepChange.bind(this)}
                // isHashEnabled
                transitions={transitionsListening.bind(this)} // comment out for default transitions
                nav={<Nav/>}
                // instance={setInstance}
            >
                <First/>
                <Second/>
                <Third/>
                <Fourth/>
                <Fifth/>
                <Sixth/>
                <Seventh/>
                <Finished/>
            </StepWizard>
        )

        // }
    }
}