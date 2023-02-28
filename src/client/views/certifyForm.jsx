import {Link, Redirect} from 'react-router-dom'
import {view, emit} from '../framework'
import userStore from '../stores/userStore'
import certifyStore from '../stores/certifiedStore'
import teamStore from '../stores/teamStore'

export default view(function CertifyForm({match}) {

    let {userId} = match.params
    let certification = {}
    // let certification = {}
    // console.log("userId ", userId)
    // console.log("certify store in view ", certifyStore.certifications)
    const user = userStore.users.find(user => user.userId == userId)

    if (certifyStore.certifications.length > 0) {
        // console.log("length ", certifyStore.certifications.length)
        certification = certifyStore.certifications.find(certification => certification.userId == userId)
        if (!certification) {
            certification = {}
        }
    }
    // console.log("certification ", certification)

    if (certifyStore.submitCertificationEngaged) {
        return <Redirect to={"/certification/" + certification.id}/>
    }

    const teams = teamStore.teams
    // const userStartTime = new Date(user.startDate)
    let userStartTime = user.startDate.split("T")
    userStartTime = userStartTime[0]

    let rateOptions = [1, 2, 3, 4, 5]
    let workDays = [1, 2, 3, 4, 5, 6]

    let leadsCount = []
    for (let i = 0; i <= 20; i++) {
        leadsCount.push(i)
    }

    return (
        <section className="pwrstation-view-profile">
            {/*<div className="section-table-name">Certify {user.firstName} {user.lastName} </div>*/}
            {/*<div className="section-table-name">FM Certification Questions: </div>*/}
            {/*<div className="section-table-name">Please rate the following questions on a scale of 1-5(1 bad, 5 superb): </div>*/}

            <div className="shadowbox">
                <div id="resultbox"/>
                <form id="certify-form" action="" method="POST" onSubmit={e => {
                    e.preventDefault()
                    emit.SubmittedFMCertification({
                        userId: userId,
                        work_ethic: document.getElementById('work_ethic').value,
                        attitude: document.getElementById('attitude').value,
                        leadership_potential: document.getElementById('leadership_potential').value,
                        sales_skills: document.getElementById('sales_skills').value,
                        becoming_ec: document.getElementById('becoming_ec').value,
                        work_days: document.getElementById('work_days').value,
                        leads_amount: document.getElementById('leads_amount').value,
                        culture_contribution: document.getElementById('culture_contribution').value,
                        certify: document.getElementById('certify').value,
                        rep_con: document.getElementById('rep_con').value,
                        rep_pros: document.getElementById('rep_pros').value,

                    })
                }}>
                    <div className="row">
                        <div className="col-xs-12">
                            <div className="h5 greyColor">
                                <b>Please rate the following questions on a scale of 1-5 (1 bad, 5
                                    superb): {user.certify}</b>
                            </div>

                        </div>
                        <div className="clear50"/>
                        <div className="col-md-6">
                            {/*<input type="hidden" name="id" value={user.email} required/>*/}
                            <div className="h5 greyColor" style={{fontWeight: "500"}}>
                                {user.firstName} work ethic<span className="text-danger">*</span>
                                <br/>
                                <select id="work_ethic" className="form-control" name="work_ethic" required
                                        defaultValue={certification.work_ethic}>
                                    <option value="">Select scale</option>
                                    {
                                        rateOptions.map(val => {
                                            return (
                                                <option key={val}
                                                        value={val}>{val}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            <div className="h5 greyColor" style={{fontWeight: "500"}}>
                                {user.firstName} attitude<span className="text-danger">*</span>
                                <br/>
                                <select id="attitude" className="form-control" name="attitude" required
                                        defaultValue={certification.attitude}>
                                    <option value="">Select scale</option>
                                    {
                                        rateOptions.map(val => {
                                            return (
                                                <option key={val}
                                                        value={val}>{val}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            <div className="h5 greyColor" style={{fontWeight: "500"}}>
                                {user.firstName} leadership potential<span className="text-danger">*</span>
                                <br/>
                                <select id="leadership_potential" className="form-control"
                                        name="leadership_potential" defaultValue={certification.leadership_potential}
                                        required>
                                    <option value="">Select scale</option>
                                    {
                                        rateOptions.map(val => {
                                            return (
                                                <option key={val}
                                                        value={val}>{val}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="h5 greyColor" style={{fontWeight: "500"}}>
                                {user.firstName} sales skills<span className="text-danger">*</span>
                                <br/>
                                <select id="sales_skills" className="form-control" name="sales_skills"
                                        defaultValue={certification.sales_skills} required>
                                    <option value="">Sales scale</option>
                                    {
                                        rateOptions.map(val => {
                                            return (
                                                <option key={val}
                                                        value={val}>{val}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            <div className="h5 greyColor" style={{fontWeight: "500"}}>
                                {user.firstName} likelihood of becoming an EC<span className="text-danger">*</span>
                                <br/>
                                <select id="becoming_ec" className="form-control" name="becoming_ec"
                                        defaultValue={certification.becoming_ec} required>
                                    <option value="">Sales scale</option>
                                    {
                                        rateOptions.map(val => {
                                            return (
                                                <option key={val}
                                                        value={val}>{val}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="clear50"/>
                    <div className="row">
                        <div className="col-xs-12">
                            <div className="h5 greyColor">
                                <b>Answer the following:</b>
                            </div>
                        </div>
                        <div className="clear50"/>
                        <div className="col-md-6">
                            <div className="h5 greyColor" style={{fontWeight: "500"}}>
                                How many days did {user.firstName} work in week 1?<span
                                className="text-danger">*</span>
                                <br/>
                                <select id="work_days" className="form-control" name="work_days"
                                        defaultValue={certification.work_days} required>
                                    <option value="">Select days</option>
                                    {
                                        workDays.map(val => {
                                            return (
                                                <option key={val}
                                                        value={val}>{val}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>

                            <div id="inputBottomPadding" className="h5 greyColor" style={{fontWeight: "500"}}>
                                What do you like about {user.firstName}?<span className="text-danger">*</span>
                                <br/>
                                <div id="extraPaddingDesk"/>
                                <textarea style={{marginTop: "1em"}} className="form-control" id="rep_pros"
                                          name="rep_pros" rows="2" placeholder="Type here" required>
                                         {certification.rep_pros ? certification.rep_pros : ''}
                                    </textarea>
                            </div>
                            <div className="clear30"/>
                            <div className="h5 greyColor" style={{fontWeight: "500"}}>
                                Does {user.firstName} contribute to a winning
                                culture? {certification.culture_contribution}<span
                                className="text-danger">*</span>
                                <br/>
                                <select id="culture_contribution" className="form-control"
                                        name="culture_contribution"
                                        defaultValue={certification.culture_contribution ? 1 : ''}
                                        required>
                                    <option value="">Select...</option>
                                    <option value="1">Yes</option>
                                    <option value="0">No</option>

                                </select>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="h5 greyColor" style={{fontWeight: "500"}}>
                                How many leads did {user.firstName} get in week 1?<span
                                className="text-danger">*</span>
                                <br/>
                                <select id="leads_amount" className="form-control" name="leads_amount"
                                        defaultValue={certification.leads_amount} required>
                                    <option value="">Select days</option>
                                    {
                                        leadsCount.map(val => {
                                            return (
                                                <option key={val}
                                                        value={val}>{val}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>

                            <div className="h5 greyColor" style={{fontWeight: "500"}}>
                                What weaknesses do you see that might impede {user.firstName}’s success?<span
                                className="text-danger">*</span>
                                <br/>
                                <textarea style={{marginTop: "1em"}} className="form-control" id="rep_con"
                                          name="rep_con" rows="2" placeholder="Type here" required>
                                        {certification.rep_con ? certification.rep_con : ''}
                                    </textarea>
                            </div>
                            <div className="clear30"/>
                            <div className="h5 greyColor" style={{fontWeight: "500"}}>
                                Do you certify {user.firstName} to be a member of your team? <span
                                className="text-danger">*</span>
                                <br/>
                                <select id="certify" className="form-control" name="certify"
                                        defaultValue={certification.certify ? 1 : ''} required>
                                    <option value="">Select...</option>
                                    <option value="1">Yes</option>
                                    <option value="0">No</option>

                                </select>
                            </div>
                        </div>
                        <div className="col-xs-12">
                            <div className="clear50"/>
                            <div className="clear30"/>
                            <button className="approveBtn" type="submit">Submit Evaluation</button>
                            <Link to={`/home`} className="editBtn">
                                Back to dashboard
                                {/*<button  type="button">Back to dashboard</button>*/}
                            </Link>

                        </div>
                    </div>
                </form>
            </div>


            <div className="clear30"/>
        </section>
    )
})

