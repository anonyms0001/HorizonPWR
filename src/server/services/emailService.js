const nodemailer = require('nodemailer')
//Ben added this code
const hbs = require('nodemailer-express-handlebars')
const fs = require('fs')
const dbService = require('./dbService')

// create reusable transporter object using the default SMTP transport
// const transporter = nodemailer.createTransport({
//     host: 'email-smtp.us-west-2.amazonaws.com',
//     port: 587,
//     secure: false, // true for 465, false for other ports ("Secure email delivery using TLS/STARTTLS")
//     auth: {
//         user: 'AKIASQSCL2DWDX2JCK75',
//         pass: 'BBirsFHfRP9IYXixkjQY/T6qmgTSpFdX+pX2/OCSP1Lm'
//     }
// })

//start old transporter
// const transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 587,
//     secure: false, // true for 465, false for other ports ("Secure email delivery using TLS/STARTTLS")
//     auth: {
//         user: 'mtthwbaer@gmail.com',
//         pass: 'Captain487!'
//     }
// })
//end old transporter

//start new transporter
const transporter = nodemailer.createTransport({
    host: 'email-smtp.us-west-2.amazonaws.com',
    port: 465,
    secure: true, // true for 465, false for other ports ("Secure email delivery using TLS/STARTTLS")
    auth: {
         user: 'AKIASQSCL2DWEVNCPWMS',
        pass: 'BGRi+hgml/M3XNqsAZ00wqtY7lL1OCIbtc/VQXgdZlUE'
    }
})

const handlebarOptions = {
    viewEngine: {
        extname: '.hbs',
        layoutsDir: './src/client/views/email/',
        partialsDir: './src/client/views/partials/',
        defaultLayout: '',
    },
    viewPath: './src/client/views/email/',
    extName: '.hbs'
};

transporter.use('compile', hbs(handlebarOptions))
//end new transporter

async function sendEmail({ from, to, subject, body, plainText = false }) {
    const info = await transporter.sendMail({
        from,
        to,
        subject,
        text: plainText ? body : '',
        html: plainText ? '' : body,
    })
    // if necessary, we can return fields from $info,
    // but let's not return the whole object so we don't create an implementation dependency.
}

//sent password(created on pwrstation) and username(Personal_Email__c is SF) to templates
// async function reachingEmail({user}){
async function reachingEmail({user}) {

    // const mailList = [
    //    'danb.sanchez@gmail.com',
    //     'ben.sanchez@horizonpwr.com',
    // ]

    const mailOptions = {
        from: 'welcome@panel.horizonpwr.com',
        to: user.personalEmail,
        cc: 'ben.sanchez@horizonpwr.com', 
        subject: 'Welcome to the HorizonPWR Team!',
        // text: 'Is it really working?',
        template: 'onboarding',
        context: {
            email: user.companyEmail,
            pageLink: 'https://onboarding.horizonpwr.com/validate?email=' + user.companyEmail,
            textURL: 'onboarding.horizonpwr.com',
            // email: 'danb.sanchez@gmail.com',
            // password: user.password
            password: 'password'
        }
    }

    await transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log("Error: ", err)
        } else {
            "Message sent"
        }
    })

}
async function newOnboarderNotification({user}) {
    const mailOptions = {
        from: 'onboarderstatus@panel.horizonpwr.com',
        // to: 'ben.sanchez@horizonpwr.com',
        to: user.managerEmail,
         cc: 'ben.sanchez@horizonpwr.com',
        subject: user.firstName + " " + user.lastName +' Onboarding Information',
        // text: 'Is it really working?',
        template: 'new-onboarder',
        context: {

            firstName: user.firstName,
            lastName: user.lastName,
            personalEmail: user.personalEmail,
            companyEmail: user.companyEmail,
            teamName: user.teamName,
            phone: user.phoneNumber,
            startDate: user.startDate,
            roleName: user.roleName,
        }
    }

    await transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log("Error: ", err)
        } else {
            "Message sent"
        }
    })

}

async function loginEmail(companyEmail) {

    const mailOptions = {
        // from: 'welcome@horizonpwr.com',
        // to: user.personalEmail,
        to: user.personalEmail,
         cc: 'ben.sanchez@horizonpwr.com',
        subject: 'Welcome to the HorizonPWR Team!',
        // text: 'Is it really working?',
        template: 'index',
        context: {
            email: companyEmail,
            // pageLink: 'http://pwrstation.horizonpwr.com/horizonpwr/#/login',
            // textURL: 'pwrstation.horizon.com',
            // email: 'danb.sanchez@gmail.com',
            // password: user.password
            password: 'password'
        }
    }

    await transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log("Error: ", err)
        } else {
            "Message sent"
        }
    })

}

async function onboardingInviteAgain({userId}) {

    console.log("onboardingInviteAgain email service ", userId)
    let selectedUser = await dbService.query('SELECT firstName, lastName, personalEmail, email FROM user WHERE userId = ?', [userId])
    console.log("selectedUser ", selectedUser)

    const mailOptions = {
        from: 'welcome@panel.horizonpwr.com',
        // to: user.personalEmail,
        to: selectedUser[0].personalEmail,
        cc: 'ben.sanchez@horizonpwr.com',
        subject: 'Welcome to the HorizonPWR Team!',
        // text: 'Is it really working?',
        template: 'onboarding',
        context: {
            email: selectedUser[0].email,
            pageLink: 'https://onboarding.horizonpwr.com/validate?email=' + selectedUser[0].email,
            textURL: 'onboarding.horizonpwr.com',
            // email: 'danb.sanchez@gmail.com',
            // password: user.password
            password: 'password'
        }
    }

    await transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log("Error: ", err)
        } else {
            "Message sent"
        }
    })

    await dbService.query('UPDATE user SET inviteResent = ? where userId = ? ', [1, userId])

}

async function deactivateNotification({userId, managerId}) {
    console.log("email service ",userId , managerId)
    let selectedUser = await dbService.query('SELECT firstName, lastName FROM user WHERE userId = ?', [userId])
    let selectedManager = await dbService.query('SELECT firstName, lastName FROM user WHERE userId = ?', [managerId])

    let selectedUserName = selectedUser[0].firstName + " " + selectedUser[0].lastName
    let selectedManagerName = selectedManager[0].firstName + " " + selectedManager[0].lastName

        console.log("selectedUser ", selectedUserName, selectedManagerName)

    const mailOptions = {
        from: 'PWRstation@panel.horizonpwr.com',
        to: 'support@horizonpwr.com',
        // to: user.managerEmail,
         cc: 'ben.sanchez@horizonpwr.com',
        subject: 'Remove ' + selectedUserName + ' company subscriptions',
        // text: 'Is it really working?',
        template: 'deactivate-account',
        context: {

            repName: selectedUserName,
           manager: selectedManagerName
        }
    }

    await transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log("Error: ", err)
        } else {
            "Message sent"
        }
    })

}

async function certification(userId) {
    // console.log("userId ", userId)
    let selectedUser = await dbService.query('SELECT firstName, lastName FROM user WHERE userId = ?', [userId])
    let certification = await dbService.query('SELECT * FROM certification WHERE userId = ?', [userId])
    // console.log("selectedUser ", selectedUser)
    let repName = selectedUser[0].firstName + " " + selectedUser[0].lastName

    const workEthicVal = certification[0].work_ethic


    const mailOptions = {
        from: 'PWRstation@panel.horizonpwr.com',
        // to: user.personalEmail,
        to: 'ben.sanchez@horizonpwr.com',
        // cc: 'ben.sanchez@horizonpwr.com',
        // cc: 'ben.sanchez@horizonpwr.com',
        subject: repName + ' Certification Rating',
        // text: 'Is it really working?',
        template: 'rep-certification',
        context: {
            repName: repName,
            workEthic: workEthicVal,
            attitude: certification[0].attitude,
            leadershipPotential: certification[0].leadership_potential,
            salesSkills: certification[0].sales_skills,
            becomingEc: certification[0].becoming_ec,
            workDays: certification[0].work_days,
            leadsAmount: certification[0].leads_amount,
            cultureContribution: (certification[0].culture_contribution ? "Yes" : "No"),
            certify: (certification[0].certify ? "Yes" : "No"),
            repCon: certification[0].rep_con,
            repPros: certification[0].rep_pros,

        }
    }

    await transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log("Error: ", err)
        } else {
            "Message sent"
        }
    })

}
async function repCredentials(userEmail) {
    console.log("userId from repcredentials ", userEmail)
    let selectedUser = await dbService.query('SELECT firstName, lastName, personalEmail FROM user WHERE email = ?', [userEmail])

    // console.log("selectedUser ", selectedUser)
    let repName = selectedUser[0].firstName + " " + selectedUser[0].lastName
    let personalEmail = selectedUser[0].personalEmail
    // const mailList = [
    //    user.email,
    //    user.managerEmail,
    // ]

    const mailOptions = {
        from: 'PWRstation@panel.horizonpwr.com',
        to: personalEmail,
        // to: 'ben.sanchez@horizonpwr.com',
        cc: 'ben.sanchez@horizonpwr.com',
        subject: 'HorizonPWR Apps Access',
        template: 'credentials',
        context: {
            repName: repName,
            companyEmail: userEmail,

        }
    }

    await transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log("Error: ", err)
        } else {
            "Message sent"
        }
    })

}
async function newAgreementEmail(userId, newPosition, workEmail, repName, sfId) {
    console.log("userId from process promotion ", userId, workEmail, repName, sfId)
    // let selectedUser = await dbService.query('SELECT firstName, lastName, teamId, email FROM user WHERE userId = ?', [userId])
    
    // let repName = selectedUser[0].firstName + " " + selectedUser[0].lastName
    // const mailList = [
    //    user.email,
    //    user.managerEmail,
    // ]
    // let link = "https://onboarding.horizonpwr.com/energy-consultant-agreement-" + ( selectedUser[0].teamId === 2 ? "wolf" : selectedUser[0].teamId === 7 ? "fox" : selectedUser[0].teamId === "8" ? "rex" : ""  ) + "/?origin=pwrstation?id=" + userId
    let link = "https://onboarding.horizonpwr.com/energy-consultant-agreement?origin=pwrstation&id=" + sfId

    // console.log(link)

    const mailOptions = {
        from: 'PWRstation@panel.horizonpwr.com',
        to: workEmail,
        // to: 'support@horizonpwr.com',
        cc: 'ben.sanchez@horizonpwr.com',
        // cc: 'ben.sanchez@horizonpwr.com',
        // cc: 'ben.sanchez@horizonpwr.com',
        subject: repName + 'Promotion',
        // text: 'Is it really working?',
        template: 'rep-promotion',
        context: {
            repName: repName,
            link: link,
            newPosition: newPosition
        }
    }

    await transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log("Error: ", err)
        } else {
            "Message sent"
        }
    })

}
async function upgradeLessonly(userId) {
    console.log("userId from process promotion ", userId)
    let selectedUser = await dbService.query('SELECT Name FROM account WHERE Id = ?', [userId])
    // let sfId = await dbService.query('SELECT Id FROM account WHERE Company_Email__c = ?', [selectedUser[0].email])
    console.log("selectedUser ", selectedUser)
    let repName = selectedUser[0].Name 
    
    const mailOptions = {
        from: 'PWRstation@panel.horizonpwr.com',
        // to: selectedUser[0].email,
        to: 'support@horizonpwr.com',
        cc: 'ben.sanchez@horizonpwr.com',
        // cc: 'ben.sanchez@horizonpwr.com',
        subject: repName + ' Lessonly Update Notification',
        // text: 'Is it really working?',
        template: 'lessonly-update',
        context: {
            repName: repName,
        }
    }

    await transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log("Error: ", err)
        } else {
            "Message sent"
        }
    })

}

module.exports = {
    sendEmail,
    reachingEmail,
    newOnboarderNotification,
    deactivateNotification,
    onboardingInviteAgain,
    certification,
    repCredentials,
    newAgreementEmail,
    upgradeLessonly
}
