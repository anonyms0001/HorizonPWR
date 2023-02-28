import {view, emit} from '../../framework'
import installersActivityStore from "../../stores/installersActivityStore"
import Calendar from "../support-tools/calendar"
import teamStore from "../../stores/teamStore";


export default view(function InstallersCalendarSettings() {

    const {installersActivity, installersState, installerSettings, installers} = installersActivityStore

    // console.log("installersState ", installersState)
    console.log("installerSettings ", installerSettings)

    // console.log("installersActivity view in ", installersActivity)

    // function InstallerStateChange(installer) {
    //     // console.log("installer ", installer)
    //     emit.ClickedInstallersTab(installer)
    // }

    function SettingsStateChange(setting) {
        // console.log("setting ", setting)
        emit.ClickedBlockDates(setting)
    }

    function closeModal() {
        document.getElementById('modal-' + installersState + '-comment').classList.remove("in")
        emit.ClickedBlockDates('dates')
    }

    let selectedInstaller = installersState === 'comet' ? 'East Idaho Comet' : installersState === 'boiseComet' ? 'Comet Energy' : installersState === 'winema' ? 'Winema Electric' : installersState === 'elemental' ? ' Elemental Energy' : installersState === 'dog' ? 'Big Dog' : installersState === 'turnSolar' ? 'Turn 2 Solar' : installersState === 'horizonpwr' ? 'HorizonPWR' : installersState === 'horizonpwrBoise' ? 'HorizonPWR Boise' : installersState === 'powerTim' ? 'Power By Tim' : ''

    let today = new Date()
    let formattedToday = today.getFullYear() + '-' + ((today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1)) + '-' + (today.getDate() < 10 ? '0' + today.getDate() : today.getDate())

    const absoluteToday = today.getFullYear() + '-' + ((today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1)) + '-' + (today.getDate() < 10 ? '0' + today.getDate() : today.getDate())

    let installerId = ''
    if (installersState === 'comet') {
        installerId = 'a0z3m00000Al1sVAAR'
    } else if (installersState === 'boiseComet') {
        installerId = 'a0z3m00000AkyCdAAJ'
    } else if (installersState === 'winema') {
        installerId = 'a0z3m00000Al7CrAAJ'
    } else if (installersState === 'elemental') {
        installerId = 'a0z3m00000Al7CcAAJ'
    } else if (installersState === 'dog') {
        installerId = 'a0z3m00000ADdKXAA1'
    } else if (installersState === 'ericAdair') {
        installerId = 'a0z3m00000AkvplAAB'
    }else if (installersState === 'turnSolar') {
        installerId = 'a0z3m00000917NrAAI'
    }else if (installersState === 'horizonpwr') {
        installerId = 'a0z3m0000091UDGAA2'
    }else if (installersState === 'horizonpwrBoise') {
        installerId = 'a0z3m00000BSEzOAAX'
    }else if (installersState === 'powerTim') {
        installerId = 'a0z3m0000091FIOAA2'
    }

    let selectedInstallerValues = installers.find(installer => installer.Id === installerId)
    let blockedDates = JSON.parse(selectedInstallerValues.Blocked_Dates)
    console.log("blockedDates ", blockedDates)

    return (
        <div id={'modal-' + installersState + '-comment'} className="modal fade">
            <div
                className="modal-dialog">
                < div
                    className="modal-content">
                    < div
                        className="modal-header">
                        < button
                            type="button"
                            className="close"
                            onClick={closeModal.bind(this)}
                        ><span style={{fontWeight: "bold"}}>&times;</span>
                        </button>
                        <h4 className="modal-title">{selectedInstaller} Calendar Settings</h4>
                    </div>
                    <div className="modal-body" style={{paddingTop: '0px'}}>

                        <table className="table table-condensed" style={{fontSize: "12px"}}>
                            <thead style={{fontSize: "12px"}}>
                            <tr style={{background: '#fff'}}>
                                <th>
                                    {installerSettings === 'dates' ? 'Blocked ' : 'Blocking '}
                                    Dates
                                </th>
                                <th style={{paddingRight: "0px"}}>
                                    <button className='btn btn-default'
                                            onClick={SettingsStateChange.bind(this, 'form')}
                                            style={installerSettings === 'dates' ? {
                                                float: "right",
                                                padding: "5px",
                                                fontWeight: "5px",
                                                display: "block"
                                            } : {display: "none"}}>
                                        Block Dates &nbsp;
                                        <i style={{color: "#29cc29"}} className='glyphicon glyphicon-plus'/>
                                    </button>
                                    <form id={installersState + '-update-dates'}
                                          style={installerSettings === 'form' ? {
                                              display: "block"
                                          } : {display: "none"}}
                                          onSubmit={e => {
                                              e.preventDefault()
                                              emit.UpdateInstallerBlockDates({
                                                  installerId: installerId,
                                                  startBlockDate: document.getElementById('startDate').value,
                                                  endBlockDate: document.getElementById('endDate').value
                                              })
                                          }}
                                    >
                                        <div className="input-group" style={installerSettings === 'form' ? {
                                            float: "right",
                                            maxWidth: "328px",
                                            display: "table"
                                        } : {display: "none"}}>
                                            <input id="startDate" type="date" name="start_date"
                                                   style={{
                                                       padding: "10px 2px 4px 7px",
                                                       color: "#000000",
                                                       maxWidth: "133px",
                                                       border: " 1px solid #dddddd"
                                                   }}
                                                   defaultValue={formattedToday} min={absoluteToday}
                                                   required='required'/>
                                            <input id="endDate" type="date" name="end_date"
                                                   style={{
                                                       padding: "10px 2px 4px 7px",
                                                       color: "#000000",
                                                       maxWidth: "133px",
                                                       border: " 1px solid #dddddd"
                                                   }}
                                                   defaultValue={formattedToday} min={absoluteToday}
                                                   required='required'/>
                                            <span className="input-group-btn">
                                                    <button className="btn btn-default" type="submit"
                                                            name="submit"
                                                            form={installersState + '-update-dates'}>Block</button>
                                            </span>
                                        </div>
                                    </form>
                                </th>
                            </tr>
                            <tr>
                                <th style={{textAlign: "center"}}>Start Date</th>
                                <th style={{textAlign: "center"}}>End Date</th>
                            </tr>
                            </thead>
                            <tbody>

                            {
                                blockedDates !== null ?
                                    blockedDates.map(blockedDate => {
                                        return (
                                            <tr>
                                                <th style={{textAlign: "center"}}>{blockedDate.StartDate}</th>
                                                <th style={{textAlign: "center"}}>{blockedDate.EndDate}</th>
                                            </tr>
                                        )
                                    })
                                    : <tr>
                                        <th colSpan='2' style={{textAlign: "center"}}>No Blocked Dates Yet</th>
                                    </tr>
                            }


                            </tbody>
                        </table>

                    </div>
                </div>
            </div>
        </div>
    )
})

