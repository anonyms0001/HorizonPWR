import {view} from "../framework"
import sessionStore from "../stores/sessionStore"
import routeStore from "../stores/routeStore"
import userStore from "../stores/userStore"

export default view(function TopTitle() {

    let user = ''
    let routeToSplit = routeStore.pathname.split('/')
    let evalUserId = 0
    // console.log("routeToSplit top ", routeToSplit)
    if(routeToSplit[2] > 0){
        evalUserId = routeToSplit[2]
         user = userStore.users.find(user => user.userId == evalUserId)
    }else{
        evalUserId = 0
    }
    // console.log("routeStore top ", evalUserId)
    // console.log("user ", user)



    return (
        sessionStore.isActive ?
            <div className="container">
                {/*<h1 className="dash-title">{routeStore.pathname === "/home" ? "ADMIN DASHBOARD" : routeStore.pathname === "/leaderboard" ? "LEADERBOARD" : routeStore.pathname === "/repsLeaderboard" ? "LEADERBOARD": routeStore.pathname === "/commissions" ? "COMMISSIONS DASHBOARD": ""}</h1> */}
                <h1 className="dash-title" style={sessionStore.isNewUser ? {display: "block"} : {display: "block"}}>{routeStore.pathname === "/home" ? "ADMIN DASHBOARD" : routeStore.pathname === "/leaderboard" ? "LEADERBOARD" : routeStore.pathname === "/repsLeaderboard" ? "LEADERBOARD":  routeStore.pathname === "/commissions" ? "COMMISSIONS": routeStore.pathnameString === "/createUser/" ? "ADD NEW USER" :  routeStore.pathnameString === "/certify/"+evalUserId ?  user.firstName.toUpperCase() + " " + user.lastName.toUpperCase() +" EVALUATION " :  routeStore.pathname === "/reports" ? "REPORT": routeStore.pathname === "/installers-calendar" ? "INSTALLERS CALENDAR":""}</h1>
            </div>
            : null


    )
})