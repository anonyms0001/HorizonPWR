import {Link} from 'react-router-dom'
import {view, emit} from '../framework'
import userStore from '../stores/userStore'
import certifyStore from '../stores/certifiedStore'
import teamStore from '../stores/teamStore'
// import {Redirect} from 'react-router-dom'


export default view(function CertificationOverview({match}) {

    console.log("certifyStore OVER ", certifyStore)

    // window.location.reload()
    const {certifications, submitCertificationEngaged} = certifyStore


    let {certificationId} = match.params
    const certification = certifications.find(certification => certification.id == certificationId)
    const certificationUserId = certification.userId
    console.log("cert user ID OVER ", certificationUserId)
    const {users} = userStore
    const user = users.find(user => user.userId === certification.userId)
    console.log("certification OVER ", certification)
    console.log("USER OV ", user)

    // if(certifyStore.certifications.length < 0){
    //     return <Redirect to={"/certify/" + userId} />
    // }
    // if(certifyStore.certifications.length < 0) {
    //     window.location.reload()
    //     const certification = certifyStore.certifications.find(certification => certification.userId == userId)
    // }


    // console.log("leadsCount ", leadsCount)
    function ratingValue(rating) {
        // console.log("inside ratingValue ", rating)
        return (rating === 5 ? 'Superb' : rating === 4 ? 'Very Good' : rating === 3 ? 'Good' : rating === 2 ? 'Fair' : rating === 1 ? 'Poor' : 'Not Rated Yet')
    }

    return (
        <section className="pwrstation-view-profile">
            {/*<div className="section-table-name">Certify {user.firstName} {user.lastName} </div>*/}
            {/*<div className="section-table-name">FM Certification Questions: </div>*/}
            {/*<div className="section-table-name">Please rate the following questions on a scale of 1-5(1 bad, 5 superb): </div>*/}
            <div className="shadowbox">
                <div id="resultbox"/>
                <div className="row">

                    <div className="col-xs-12">
                        <table className="table table-bordered table-striped">
                            <thead>
                            <tr>
                                <th>Attribute</th>
                                <th>Result</th>

                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <th>Work Ethic</th>
                                <th>{ratingValue(certification.work_ethic)}</th>
                            </tr>
                            <tr>
                                <th>Attitude</th>
                                <th>{ratingValue(certification.attitude)}</th>
                            </tr>
                            <tr>
                                <th>Sales Skills</th>
                                <th>{ratingValue(certification.sales_skills)}</th>
                            </tr>
                            <tr>
                                <th>Leadership Potential</th>
                                <th>{ratingValue(certification.leadership_potential)}</th>
                            </tr>
                            <tr>
                                <th>Likelihood of becoming EC</th>
                                <th>{ratingValue(certification.becoming_ec)}</th>
                            </tr>
                            <tr>
                                <th>How many days did {user.firstName} {user.lastName} worked?</th>
                                <th>{certification.work_days}</th>
                            </tr>
                            <tr>
                                <th>First Week Leads {user.firstName} {user.lastName} work?</th>
                                <th>{certification.leads_amount}</th>
                            </tr>
                            <tr>
                                <th> What do you like about {user.firstName} {user.lastName}?</th>
                                <th> {certification.rep_pros}</th>
                            </tr>
                            <tr>
                                <th> Weaknesses that can impede {user.firstName} {user.lastName}'s success</th>
                                <th> {certification.rep_con}</th>
                            </tr>
                            <tr>
                                <th> Contribute to a winning culture</th>
                                <th> {certification.culture_contribution ? "Yes" : "No"}</th>
                            </tr>
                            <tr>
                                <th> Certified team member:</th>
                                <th> {certification.certify ? "Yes" : "No"}</th>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="col-xs-12">
                        <div className="h5 greyColor text-center" style={{marginTop: "1.5em"}}>
                            {/*<button className="approveBtn" type="submit">Update</button>*/}
                            <Link className="btn btn-primary"
                                  to={"/certify/" + user.userId}
                            >
                                <i className="glyphicon glyphicon-edit"/>
                                &nbsp; Modify Certification
                                {/*<b>Modify Certification</b>*/}
                            </Link>
                            &nbsp;
                            &nbsp;
                            <Link className="btn btn-default"
                                  to={`/home`}
                            >

                                &nbsp; Go To Dashboard
                                {/*<b>Modify Certification</b>*/}
                            </Link>
                        </div>
                    </div>
                    <div className="clear20"/>
                </div>
            </div>
            <div className="clear30"/>
        </section>
    )
})

