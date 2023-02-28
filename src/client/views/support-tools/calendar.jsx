import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import installersActivityStore from "../../stores/installersActivityStore"
import userStore from '../../stores/userStore'

import {view} from "../../framework";

@view
export default class Calendar extends React.Component {


    render() {
        const {installersActivity, installersState, installers, selectedInstallEvent} = installersActivityStore
        const {users} = userStore


        // console.log("installers HERE ", installers)
        // console.log("selectedInstallEvent HERE HERE  ", selectedInstallEvent, selectedInstallEvent.length)
        if (selectedInstallEvent.id) {
            // console.log("selectedInstallEvent HERE ", selectedInstallEvent.id)
            let undefinedModal = document.getElementById("modal-undefined")
            let definedModal = document.getElementById("modal-" + selectedInstallEvent.id)
            if (definedModal) {
                definedModal.classList.add("in")
            } else if (undefinedModal) {
                undefinedModal.classList.add("in")
            }

        }

        function closeModal(something) {
            // console.log('closeModal ', something)
            let definedModal = document.getElementById("modal-" + selectedInstallEvent.id)
            definedModal.classList.remove("in")
            emit.ClickedCalendarEvent({})
            // let modalActive = document.getElementById('modal-active-delete')
            // let modalOnboarder = document.getElementById('modal-onboarding-delete')
            // if (modalActive) {
            //     modalActive.classList.remove("in")
            // }
            // if (modalOnboarder) {
            //     modalOnboarder.classList.remove("in")
            // }
        }

        let installerId = ''
        if (installersState === 'boiseComet') {
            installerId = 'a0z3m00000AkyCdAAJ'
        } else if (installersState === 'winema') {
            installerId = 'a0z3m00000Al7CrAAJ'
        } else if (installersState === 'elemental') {
            installerId = 'a0z3m00000Al7CcAAJ'
        } else if (installersState === 'dog') {
            installerId = 'a0z3m00000ADdKXAA1'
        } else if (installersState === 'ericAdair') {
            installerId = 'a0z3m00000AkvplAAB'
        } else if (installersState === 'turnSolar') {
            installerId = 'a0z3m00000917NrAAI'
        } else if (installersState === 'horizonpwr') {
            installerId = 'a0z3m0000091UDGAA2'
        } else if (installersState === 'eastIdaho2') {
            installerId = 'a0z3m00000Eai2CAAR'
        } else if (installersState === 'horizonpwrBoise') {
            installerId = 'a0z3m00000BSEzOAAX'
        } else if (installersState === 'horizonpwrBoise2') {
            installerId = 'a0z3m00000AFxvsAAD'
        } else if (installersState === 'horizonpwrOregon') {
            installerId = 'a0z3m00000AFvPtAAL'
        } else if (installersState === 'horizonpwrOregon2') {
            installerId = 'a0z3m00000Eai2HAAR'
        } else if (installersState === 'powerTim') {
            installerId = 'a0z3m0000091FIOAA2'
        }

        let selectedInstallerValues = installers.find(installer => installer.Id === installerId)
        let blockedDates = selectedInstallerValues.Blocked_Dates != null ? JSON.parse(selectedInstallerValues.Blocked_Dates) : null
        // console.log("blockedDates calendar view ", blockedDates)

        let calendarEvents = []


        // if(blockedDates !== null){
        //     calendarEvents.push({
        //         start: blockedDate.StartDate,
        //         end: blockedDate.EndDate,
        //         display: 'background',
        //         color: '#ffe6e6'
        //     })
        // }
        {
            blockedDates !== null ?
                blockedDates.map(blockedDate => {
                    // console.log("blockedDates end ", blockedDate.EndDate)
                    calendarEvents.push({
                        start: blockedDate.StartDate,
                        // end: blockedDate.EndDate,
                        display: 'background',
                        color: 'rgb(247 183 183)'
                    })
                    calendarEvents.push({
                        // start: blockedDate.StartDate,
                        start: blockedDate.EndDate,
                        display: 'background',
                        color: 'rgb(247 183 183)',
                        extendedProps: {address: "Rexburg", Battery: "Yes"}
                    })
                })
                : null
        }
        // console.log("calendarEvents ", calendarEvents)

        installersActivity.filter(installer => installer.Installer__c === installerId && installer.Project_Cancelled__c !== true).map((installerItem) => {


            let repTeam = ''
            let projectName = ''
            // if (installerItem.Installer__c === 'a0z3m00000AkvplAAB') {
            //
            //     let installerItemRepName = installerItem.RepName.split(' ')
            //     let userData = users.find(user => user.firstName === installerItemRepName[0] && user.lastName === installerItemRepName[1])
            //     // repTeam = userData.teamName
            //
            //     if (userData !== undefined) {
            //         // console.log("installers item repname and team ", installerItemRepName[0]  )
            //         repTeam = userData.teamName === "Klamath Falls" || userData.teamName === "Bend" || userData.teamName === "Medford" || userData.teamName === "Boise" ? "BOI - " : userData.teamName === "Rexburg" || userData.teamName === "Pocatello" ? "EI - " : ""
            //     } else {
            //         repTeam = installerItemRepName[0] === "Blaine" ? "EI - " : ""
            //     }
            // }

            if (installerItem.Installer__c === 'a0z3m0000091UDGAA2') {
                projectName = installerItem.address.includes('Twin Falls') ? installerItem.Name + ' - TF' : installerItem.Name + ' - EI'
            }
            // console.log("repname vs team", installerItem.RepName, (userData.teamId === 2 ? "Boise" : "other"))
            // if (!istallerItem.Project_Cancelled__c ) {
            // Upgrade_Needed__c, Email_Address__c, Mobile_Phone__c, Battery_Back_Up_Type__c
            let formattedDate = installerItem.Install_Date__c.split('T')
            calendarEvents.push({
                id: installerItem.Id,
                title: projectName ? projectName : installerItem.Name,
                date: formattedDate[0],
                color: (installerItem.Ground_Mount__c && installerItem.Pending_Cancellation__c === false ? 'green' : installerItem.Pending_Cancellation__c === true ? 'red' : '#1E88E5'),
                extendedProps: {
                    backgroundHeader: installerItem.Ground_Mount__c && installerItem.Pending_Cancellation__c === false ? 'green' : installerItem.Pending_Cancellation__c === true ? 'red' : '#1E88E5',
                    address: installerItem.address ? installerItem.address : 'No Address Setup Yet',
                    battery: installerItem.Battery_Back_Up_Type__c ? installerItem.Battery_Back_Up_Type__c : '',
                    email: installerItem.Email_Address__c,
                    systemSize: installerItem.Final_System_Size__c ? installerItem.Final_System_Size__c : 'Not Defined Yet',
                    groundMount: installerItem.Ground_Mount__c ? installerItem.Ground_Mount__c : 'No',
                    upgradeNeeded: installerItem.Upgrade_Needed__c ? installerItem.Upgrade_Needed__c : 'No',
                    phone: installerItem.Mobile_Phone__c ? installerItem.Mobile_Phone__c : 'No Phone Setup Yet'
                }
            })
            // }
        })
        return (
            <div>
                <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    events={calendarEvents}
                    // eventRender={this.eventRender}
                    eventContent={renderEventContent}
                    eventClick={eventClick}
                />
                <div id={selectedInstallEvent.id ? 'modal-' + selectedInstallEvent.id : 'modal-undefined'}
                     className="modal fade unassigned">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal"
                                        aria-hidden="true" onClick={closeModal.bind(this)}>&times;</button>
                                <h4 className="modal-title">{selectedInstallEvent.title ? selectedInstallEvent.title : ''} Install
                                    Details</h4>
                            </div>
                            <div className="modal-body">
                                {
                                    selectedInstallEvent.description ?
                                        <div>
                                            <p>Address: {selectedInstallEvent.description.address}</p>
                                            <p>Email: {selectedInstallEvent.description.email}</p>
                                            <p>Phone Number: {selectedInstallEvent.description.phone}</p>
                                            <p>Final System Size: {selectedInstallEvent.description.systemSize}</p>
                                            <p>Ground
                                                Mount: {selectedInstallEvent.description.groundMount ? 'Yes' : 'No'}</p>
                                            <p>Upgrade: {selectedInstallEvent.description.upgradeNeeded}</p>
                                            <p>Battery: {selectedInstallEvent.description.battery}</p>
                                        </div>

                                        :
                                        'No Extra Info Provided Yet'
                                }
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default" onClick={closeModal.bind(this)}>Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        )
    }

}

function eventClick(info) {
    emit.ClickedCalendarEvent({id: info.event.id, title: info.event.title, description: info.event.extendedProps})

}

function renderEventContent(eventInfo) {
    return (
        <>
            <b>{eventInfo.event.title} </b>
        </>

    )
}
