const dbService = require('./dbService')
const emailService = require('./emailService')

async function certifyUser({
                               userId,
                               work_ethic,
                               attitude,
                               leadership_potential,
                               sales_skills,
                               becoming_ec,
                               work_days,
                               leads_amount,
                               culture_contribution,
                               certify,
                               rep_con,
                               rep_pros
                           }) {
    // console.log("certify ", certify.toString())
    //console.log("certify ", userId, work_ethic, leadership_potential, parseInt(sales_skills), becoming_ec, work_days, leads_amount, leads_amount, culture_contribution, certify, rep_con, rep_pros)
    // const salesSkills = parseInt(sales_skills)
    const userCertified = await dbService.query('SELECT userId FROM certification WHERE userId = ? ', [userId])

    console.log("completedCertification ", userCertified)

    if (userCertified.length > 0) {
        console.log("Update")
        await dbService.query('UPDATE certification SET  work_ethic = ?, attitude = ?, leadership_potential = ?, sales_skills = ?, becoming_ec = ?, work_days = ?, leads_amount = ?, culture_contribution = ?, certify = ?, rep_con = ?, rep_pros = ?, completed = ? WHERE userId = ?', [work_ethic, attitude, leadership_potential, sales_skills, becoming_ec, work_days, leads_amount, culture_contribution, certify, rep_con, rep_pros, certify, userId])
        //if not certify don't change the user status

    } else {
        console.log("Insert")
        await dbService.query('INSERT IGNORE INTO certification (userId, work_ethic, attitude, leadership_potential, sales_skills, becoming_ec, work_days, leads_amount, culture_contribution, certify, rep_con, rep_pros, completed ) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [userId, work_ethic, attitude, leadership_potential, sales_skills, becoming_ec, work_days, leads_amount, culture_contribution, certify, rep_con, rep_pros, certify])
        //if not certify don't change the user status

    }
    await dbService.query('UPDATE user SET certify = ? WHERE userId = ?', [certify, userId])
    await emailService.certification(userId)

}
async function getCertifications() {
    const certifications = await dbService.query('SELECT * FROM certification')
    return certifications
}

module.exports = {
    getCertifications,
    certifyUser
}
