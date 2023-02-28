import {emit, view} from "../framework";
import unapprovedUserStore from '../stores/unapprovedUserStore'
import userStore from '../stores/userStore'

export default view(function InteractiveBanner() {
    const {  users } = userStore
    const {unapprovedUsers } = unapprovedUserStore
    // console.log("user form user store ib ", userStore.users)
    // console.log("unapprovedUsers unaprovedstore ", unapprovedUsers)
    let rexburgCount = 0
    let newHireRex = []
    let kfCount = 0
    let newHireKF = []
    let boiseCount = 0
    let newHireBoise = []
    let startContestDate = new Date("2020-05-24")
    let endContestDate = new Date("2020-06-30")

    // console.log("START and END date ", startContestDate, endContestDate)

   for (let i = 0; i < users.length; i++) {
        let startDate = new Date(users[i].startDate)
        // console.log("date inside loop ", startDate)
        if (startDate > startContestDate && startDate < endContestDate) {
            if (users[i].isApproved) {
                if (users[i].teamName === "Rexburg") {
                    // console.log("user name ", users[i].firstName + " " + users[i].lastName)
                    newHireRex.push(users[i].firstName + " " + users[i].lastName)
                    rexburgCount++
                } else if (users[i].teamName === "Boise" || users[i].teamName === "Wolf") {
                    // console.log("user name ", users[i].firstName)
                    newHireBoise.push(users[i].firstName + " " + users[i].lastName)
                    boiseCount++
                } else if (users[i].teamName === "Klamath Falls" || users[i].teamName === "Fox") {
                    // console.log("user name ", users[i].firstName)
                    newHireKF.push(users[i].firstName + " " + users[i].lastName)
                    kfCount++
                }
            }else if(users[i].inviteResent){
                if (users[i].teamName === "Rexburg") {
                    // console.log("user name ", users[i].firstName + " " + users[i].lastName)
                    newHireRex.push(users[i].firstName + " " + users[i].lastName)
                    rexburgCount++
                }
            }
        }
    }
    // console.log("COUNT ", idahoCount, oregonCount)
    return (
        <div className="col-sm-12" style={{marginBottom: "2em", float: "none"}}>
            <div className="row" style={{background: "#e79436"}}>
                <div className="col-sm-4 mobile-hide" style={{paddingLeft: "0px"}}>
                    <img src="/assets/images/b01.png" style={{maxWidth: "340px", width: "100%"}}/>
                </div>
                <div className="col-sm-4 col-xs-6 text-center ">
                    <img src="/assets/images/b02.png"
                         style={{width: "100%", maxWidth: "201px", padding: "15px 0"}}/>
                    <p style={{
                        textAlign: "center",
                        fontSize: "14px",
                        color: "#0a2e44",
                        fontWeight: "500px",
                        maxWidth: "255px",
                        margin: "auto"
                    }}>SPRINTING TO DOUBLE THE SIZE OF YOUR TEAM BY JUNE 30TH </p>
                </div>
                <div className="col-sm-4 col-xs-6 text-center">
                    <h4 style={{marginBottom: "0px", marginTop: "17px", fontWeight: "600px"}}>CURRENT<br/> SCOREBOARD
                    </h4>
                    <img src="/assets/images/divider.png" style={{maxWidth: "235px", width: "100%"}}/>
                    <div className="row text-center" style={{marginTop: "-16px"}}>
                        <div className="col-xs-12" style={{marginTop: "10px"}}>
                            {/*<img src="/assets/images/fox-label.png" style={{maxWidth: "64px"}}/>*/}
                            <p className="contest-label">
                                K-FALLS <div id="kf-stat" style={{
                                color: "#fff",
                                fontWeight: "500",
                                float: "right",
                                marginRight: "10px"
                            }}>{kfCount > 0 ? kfCount : 0}</div>
                                <div className="popover fade left in"
                                     style={{ position: "absolute", left: "25%"}}>
                                    <div className="arrow" style={{top: "10%"}}/>
                                    <div className="popover-content">
                                        {
                                            newHireKF.map((repName, index) => (
                                                <p>{repName}</p>
                                            ))
                                        }
                                    </div>
                                </div>
                            </p>
                        </div>
                        <div className="col-xs-12">
                            {/*<img src="/assets/images/fox-label.png" style={{maxWidth: "64px"}}/>*/}
                            <p className="contest-label">BOISE <div id="boise-stat" style={{
                                color: "#fff",
                                fontWeight: "500",
                                float: "right",
                                marginRight: "10px"
                            }}>{boiseCount > 0 ? boiseCount : 0}</div>
                            <div className="popover fade left in"
                                     style={{ position: "absolute", left: "30%"}}>
                                    <div className="arrow" style={{top: "7%"}}/>
                                    <div className="popover-content">
                                        {
                                            newHireBoise.map((repName, index) => (
                                                <p>{repName}</p>
                                            ))
                                        }
                                    </div>
                            </div>
                            </p>
                        </div>
                        <div className="col-xs-12" style={{marginBottom: "10px"}}>
                            {/*<img src="/assets/images/fox-label.png" style={{maxWidth: "64px"}}/>*/}
                            <p className="contest-label">REXBURG <div id="rex-stat" style={{
                                color: "#fff",
                                fontWeight: "500",
                                float: "right",
                                marginRight: "10px"
                            }}>{rexburgCount > 0 ? rexburgCount : 0}</div>
                            <div className="popover fade left in"
                                     style={{ position: "absolute", left: "27%"}}>
                                    <div className="arrow" style={{top: "10%"}}/>
                                    <div className="popover-content">
                                        {
                                            newHireRex.map((repName, index) => (
                                                <p>{repName}</p>
                                            ))
                                        }
                                    </div>
                            </div>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
})