import { store, emit } from '../framework'


export default store({

    installersActivity: [],
    installers: [],
    selectedInstallEvent: [],
    calendarReloading: false,
    alert: null,
    installersState: 'horizonpwr',
    installerSettings: 'dates',
    postState: 'posted',

    eventListeners: {
        LoginConfirmed({ entities }) {
            const { installSchedule, installers } = entities
            // console.log("installersActivity Store ", installSchedule)
            this.installersActivity = installSchedule
            this.installers = installers
        },
        RouteChanged({pathname}) {

        },
       ClickedCalendarEvent(event){
            // console.log("ClickedCalendarEvent HERE HERE HERE ", event)
            const eventToSend = event
            emit.SendSelectedEvent(eventToSend)
        },
        SendSelectedEvent(eventToSend){
            // console.log("ClickedCalendarEvent HERE HERE HERE ", eventToSend)
            this.selectedInstallEvent = eventToSend
        },
        ClickedInstallersTab(installer){
            this.installersState = installer
        },
        ClickedBlockDates(setting){
            this.installerSettings = setting
        },
        ClickedEditPost(action, installerId){
            this.postState = action
        },
         ClickedRefreshCalendar(){
            this.calendarReloading = true
        },
       ReceivedUpdatedInstalls({activityInstalls}){
            const setCalendarData = this.installersActivity = activityInstalls
            emit.EmitCalendarRefreshedData({setCalendarData})
            this.calendarReloading = false
        },
        EmitCalendarRefreshedData({setCalendarData}){
            this.installersActivity = setCalendarData
        },
        InstallsReceivedAlert({alert}){
            this.alert = alert
        },
        EmitInstallerStateBasedOnId(lastInstallerId){
            if (lastInstallerId === 'a0z3m00000AkyCdAAJ' ) {
                this.installersState = 'boiseComet'
            } else if (lastInstallerId === 'a0z3m00000Al7CrAAJ' ) {
                this.installersState = 'winema'
            } else if (lastInstallerId === 'a0z3m00000Al7CcAAJ') {
                this.installersState = 'elemental'
            } else if (lastInstallerId === 'a0z3m00000ADdKXAA1') {
                this.installersState = 'dog'
            }else{
                installersState: 'boiseComet'
            }
        },
        EmitUpdatedInstallers(updatedInstallers){
            // console.log("EmitUpdatedInstallers ", updatedInstallers)
            this.installers = updatedInstallers
        },
        ReceivedUpdateInstallers({updatedInstallers, lastInstallerId}){
            alert('Instructions Updated')
            // console.log(" updatedInstaller ", updatedInstaller)
            // const updatedInstallers =  this.installersState = updatedInstaller
            emit.EmitUpdatedInstallers(updatedInstallers)
            emit.ClickedEditPost('posted')
            emit.EmitInstallerStateBasedOnId(lastInstallerId)

        },
        ReceivedBlockedDates({updatedInstallers, lastInstallerId}){
            alert('Block Dates Added')
            emit.EmitUpdatedInstallers(updatedInstallers)
            emit.ClickedBlockDates('dates')
        },
    }
})


