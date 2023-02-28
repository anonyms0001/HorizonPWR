const jetpack = require('fs-jetpack')
const path = require('path')
const config = require('../../../config')
const dbService = require('./dbService')
const cryptoService = require('./cryptoService')
const emailService = require('./emailService')
const teamService = require('./teamService')
const roleService = require('./roleService')
let querystring = require('querystring')
const requester = require('../requester')


async function getOnboardingData() {
    //gets onboarding users from local database
    const localOnboardingUsers = await dbService.query('SELECT email, percentComplete FROM user WHERE deleted = 0 AND isApproved = 0 ')
    // console.log(localOnboardingUsers.length)
    // console.log(localOnboardingUsers[0].percentComplete)
    //if there are onboarding users update onboarding progress

    if(localOnboardingUsers.length > 0){
        // console.log(localOnboardingUsers[0].email)
        //iterate through the local onboarding users

        const credentialsUrl = 'https://login.salesforce.com/services/oauth2/token'
        let authData = { grant_type: 'password',
            client_id: '3MVG9mclR62wycM2QCvilyDrGjq8DvpGohXz.nJsA8n7MAA2ntKXGwqv2jOXapE3dHIbaxIe2vix7M5emxMj1',
            client_secret: 'E4B116D1D3BC3A56259361F17EB4395748D96F5B95CCDE496198C85C83BD6B94',
            username: 'horizonpwr.salesforce@gmail.com',
            password: '$Horizon$2020%' }
        authData = querystring.stringify(authData)
        const authHeaders = { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': "*/*", 'Connection': 'keep-alive' }
        const { access_token, instance_url } = await requester.post(credentialsUrl, authData, { authHeaders })
        const queryHeaders = { headers: { 'Authorization': 'Bearer ' + access_token, 'Content-Type': 'application/json' } }
        const queryUrl = instance_url + "/services/data/v47.0/query/?q=SELECT  Personal_Email__c, Onboarding_Complete_Percent__c FROM Account WHERE Status__c = 'Onboarding'"
        const onboardersSF = await requester.get(queryUrl, queryHeaders)

        // console.log(onboardersSF.records[0])
        //         // console.log(onboardersSF.records.length)
        // let localOnboardingUser = ''

        if(onboardersSF.records.length > 0){
            for (let i = 0; i < localOnboardingUsers.length; i++) {
                localOnboardingUser = localOnboardingUsers[i].email
                for (let j = 0; j < onboardersSF.records.length; j++) {
                    if(localOnboardingUser == onboardersSF.records[j].Personal_Email__c){
                        // console.log("found "+localOnboardingUser)
                        if(localOnboardingUsers[i].percentComplete === onboardersSF.records[j].Onboarding_Complete_Percent__c  ){
                           // console.log(localOnboardingUser + " same as SF no db query is going to run")
                        }else{
                            await dbService.query('UPDATE user SET percentComplete = ? WHERE email = ?', [onboardersSF.records[j].Onboarding_Complete_Percent__c, localOnboardingUser])
                        }


                    }
                }
            }
        }

    }
}

async function getEligibility() {
   // let
    const users = await dbService.query('SELECT startDate, userId, email, firstName, lastName, eligible FROM user WHERE deleted = 0')
    for (let i = 0; i < users.length; i++) {
        //if user was added more than 2 weeks for today forget omit
        const startDate = new Date(users[i].startDate)
        const todaysDate = new Date()
        let dateDifference = todaysDate.getTime() - startDate.getTime()
        dateDifference = dateDifference / (1000 * 3600 * 24)
        // console.log("users  ", users[i].email, userse)

        if(dateDifference < 6 && dateDifference > 0){

            const userFullName = users[i].firstName + " " + users[i].lastName
            let leadCount = await dbService.query('SELECT COUNT(*) FROM _lead WHERE Field_Marketer__c = ?', [userFullName])
            leadCount = leadCount[0]['COUNT(*)']
            // console.log("userFullName first week ", userFullName, users[i].eligible)

            // if(leadCount >= 2){
                if(!users[i].eligible) {
                    console.log("userFullName ", userFullName)
                    await dbService.query('UPDATE user SET eligible = ? WHERE userId = ?', [1, users[i].userId])
                }
            // }
        }
        if(dateDifference > 6){
            const userFullName = users[i].firstName + " " + users[i].lastName
            let leadCount = await dbService.query('SELECT COUNT(*) FROM _lead WHERE Field_Marketer__c = ?', [userFullName])
            leadCount = leadCount[0]['COUNT(*)']
            // if(leadCount >= 5){
                // console.log("userFullName 2 week ", userFullName, users[i].eligible)
                if(!users[i].eligible) {
                    console.log("userFullName ", userFullName)
                    await dbService.query('UPDATE user SET eligible = ? WHERE userId = ?', [1, users[i].userId])
                }
            // }
        }
        // if(dateDifference < 21 && dateDifference > 14){
        //     const userFullName = users[i].firstName + " " + users[i].lastName
        //     let leadCount = await dbService.query('SELECT COUNT(*) FROM _lead WHERE Field_Marketer__c = ?', [userFullName])
        //     leadCount = leadCount[0]['COUNT(*)']
        //     if(leadCount >= 6){
        //         // console.log("userFullName 2 week ", userFullName, users[i].eligible)
        //         if(!users[i].eligible) {
        //             console.log("userFullName ", userFullName)
        //             await dbService.query('UPDATE user SET eligible = ? WHERE userId = ?', [1, users[i].userId])
        //         }
        //     }
        // }

    }

}


const getUsersQuery = `
    SELECT
        userId,
        account.Id as accountId,
        firstName,
        lastName,
        personalEmail,
        email,
        startDate,
        phoneNumber,
        isApproved,
        deleted,
        percentComplete,
        inviteResent,
        personal_info,
        agreement_signed,
        tax_signed,
        direct_deposit,
        directDepositImage,
        user.teamId,
        profileImageFile,
        certify,
        eligible,
        promotionProcessing,
        team.teamName,
        user.roleId,
        role.roleName,
        role.isAdmin,
        role.isOnboarder,
        account.Report_Start_Date__c as reportStartDate,
        account.1st_FM_Bonus as firstBonus,
        account.2nd_FM_Bonus as secondBonus
    FROM
        user
    LEFT JOIN
        team
    ON
        user.teamId = team.teamId
    LEFT JOIN
        role
    ON
        user.roleId = role.roleId
    LEFT JOIN
        account 
    ON
        user.email = account.Company_Email__c
    WHERE
        deleted IS NOT NULL
`
const testCertification =
    `
    SELECT
        u.userId,
        a.Id as accountId,
        u.firstName,
        u.lastName,
        u.personalEmail,
        u.email,
        u.startDate,
        u.phoneNumber,
        u.isApproved,
        u.deleted,
        u.percentComplete,
        u.inviteResent,
        u.personal_info,
        u.agreement_signed,
        u.tax_signed,
        u.direct_deposit,
        u.directDepositImage,
        u.teamId,
        u.profileImageFile,
        u.certify,
        u.eligible,
        u.promotionProcessing,
        u.teamId,
        c.id AS certificationId,
        r.roleId,
         r.roleName,
        r.isAdmin,
        r.isOnboarder,
        t.teamName
    FROM
        user u
      LEFT JOIN certification c ON u.userId = c.userId
      LEFT JOIN role r ON u.roleId = r.roleId
      LEFT JOIN team t ON u.teamId = t.teamId
     LEFT JOIN
        account a
    ON
        u.email = a.Company_Email__c
      WHERE
       u.deleted IS NOT NULL
`

async function getUser(userId) {
    await getEligibility()
    const [ user ] = await dbService.query(`
    
        ${getUsersQuery}
        AND userId = ?

    `, [ userId ])
    return user
}

async function getUsers() {
    // const users = await dbService.query(getUsersQuery)
    const testUsers = await dbService.query(testCertification)
    // console.log(testUsers)
    // return users
    return testUsers
}

async function createUser({
    email,
    roleId,
    firstName,
    lastName,
    phoneNumber,
    teamId,
    startDate,
    password,
    profileImageFile = null,
}) {
     const companyEmail = firstName.trim().toLowerCase() + "." + lastName.trim().toLowerCase() + "@horizonpwr.com"
      let userApproved = await dbService.query('SELECT isApproved from user where email = ?', [companyEmail])
    // console.log("userApproved ", userApproved[0].isApproved)
    if(userApproved[0]){
        throw new Error('User already exists, verify the email')
    }
    const salt = cryptoService.getRandomSalt()
    const hash = cryptoService.getHash(password, salt)
    const { insertId } = await dbService.query('INSERT INTO user (firstName, lastName, roleId, email, phoneNumber, teamId, profileImageFile, startDate, passwordHash, passwordSalt, personalEmail) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [ firstName, lastName, roleId, companyEmail, phoneNumber, teamId, profileImageFile, startDate, hash, salt, email ])
    const userId = insertId
     let managerEmail = ( teamId === '7' ? 'brandon.jacksonn@horizonpwr.com' :  teamId === '8' ?  'preston.burt@horizonpwr.com' : teamId === '12' ?  'jacob.jones@gmail.com' : teamId === '15' ? 'blaine.mckee@horizonpwr.com' : teamId === '14' ? 'logan.swanson@horizonpwr.com' : teamId === '2' ? 'jeremy.hall@horizonpwr.com' :  'ben.sanchez@horizonpwr.com' )
    let teamName = ( teamId === '2' ? 'Boise' : teamId === '7' ? 'Fox/Klamath Falls' :  teamId === '8' ?  'Rexburg' : teamId === '9' ? 'Wolf' : teamId === '10' ? 'Fox' : teamId === '12' ? 'Amp' : teamId === '15' ? 'Pocatello' : teamId === '14' ? 'Bend' : 'No Team')
    let roleName = ( roleId === '7' ? "Field Marketer" : roleId === '8' ? "Field Marketer Elite" : roleId === '9' ? "Sr Energy Consultant" : roleId === '10' ?  "Senior Energy Consultant" : "No Position")
    // console.log("userId ", userId)
    const user = { companyEmail: companyEmail, personalEmail: email, roleId: roleId, firstName: firstName, lastName: lastName, phoneNumber: phoneNumber, teamId: teamId, startDate: startDate, managerEmail: managerEmail, teamName: teamName, roleName: roleName }
    //create SF account
    // await createAccount(user) 
    //sent welcome email
    
     //    await emailService.reachingEmail({user})
    
     // await emailService.newOnboarderNotification({user})
    
    //await resetPassword({ userId })
}

async function editUser({
                            userId,
                            email,
                            personalEmail,
                            roleId,
                            teamId,
                            firstName,
                            lastName,
                            phoneNumber,
                            startDate,
                        }) {
    console.log("user service edituser", userId, email, roleId, teamId, firstName, lastName, phoneNumber, startDate)
    let teamName = await dbService.query("SELECT teamName FROM team WHERE teamId = '" + teamId + "'")
    teamName = teamName[0].teamName
    let roleName = await dbService.query("SELECT roleName FROM role WHERE roleId = '" + roleId + "'")
    roleName = roleName[0].roleName

    const fullName = firstName + " " + lastName

    console.log("teamName and roleName ", teamName, roleName)

    const credentialsUrl = 'https://login.salesforce.com/services/oauth2/token'
    let authData = {
        grant_type: 'password',
        client_id: '3MVG9mclR62wycM2QCvilyDrGjq8DvpGohXz.nJsA8n7MAA2ntKXGwqv2jOXapE3dHIbaxIe2vix7M5emxMj1',
        client_secret: 'E4B116D1D3BC3A56259361F17EB4395748D96F5B95CCDE496198C85C83BD6B94',
        username: 'horizonpwr.salesforce@gmail.com',
        password: '$Horizon$2020%'
    }
    authData = querystring.stringify(authData)
    const authHeaders = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': "*/*",
        'Connection': 'keep-alive'
    }
    const {access_token, instance_url} = await requester.post(credentialsUrl, authData, {authHeaders})
    const queryHeaders = {headers: {'Authorization': 'Bearer ' + access_token, 'Content-Type': 'application/json'}}

    const queryUrl = instance_url + "/services/data/v47.0/query/?q=SELECT Id FROM Account WHERE Company_Email__c = '" + email + "'"

    const totalSize = await requester.get(queryUrl, queryHeaders)
    // console.log("queryUrl ", queryUrl)


    // console.log("TOTAL SIZE ", totalSize)
    if (totalSize) {
        // console.log("TOTAL SIZE ", totalSize.records[0].attributes.url)
        const accountUrl = instance_url + totalSize.records[0].attributes.url
        // const accountUrl = instance_url + "/services/data/v47.0/sobjects/Account/"
        let accountData = {
            Name: firstName+ ' ' + lastName,
            Position__c: roleName,
            Phone: phoneNumber,
            Team__c: teamName,
            Personal_Email__c: personalEmail,
            Start_Date__c: startDate,
        }

        const response = await requester.patch(accountUrl, accountData, queryHeaders)
        // console.log("RESPONSE ", response)

        await dbService.query('UPDATE user SET roleId = ?, teamId = ?, firstName = ?, lastName = ?, phoneNumber = ?, startDate = ?, personalEmail = ? WHERE userId = ?', [roleId, teamId, firstName, lastName, phoneNumber, startDate,  personalEmail, userId])

        await dbService.query('UPDATE account SET Name = ?, Position__c = ?, Team__c = ? WHERE Company_Email__c = ? ', [fullName, roleName, teamName, email])
    }
}

async function activateRep(user) {
    console.log(user.onboarderEmail)

    const credentialsUrl = 'https://login.salesforce.com/services/oauth2/token'
    let authData = { grant_type: 'password',
        client_id: '3MVG9mclR62wycM2QCvilyDrGjq8DvpGohXz.nJsA8n7MAA2ntKXGwqv2jOXapE3dHIbaxIe2vix7M5emxMj1',
        client_secret: 'E4B116D1D3BC3A56259361F17EB4395748D96F5B95CCDE496198C85C83BD6B94',
        username: 'horizonpwr.salesforce@gmail.com',
        password: '$Horizon$2022' }
    authData = querystring.stringify(authData)
    const authHeaders = { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': "*/*", 'Connection': 'keep-alive' }
    const { access_token, instance_url } = await requester.post(credentialsUrl, authData, { authHeaders })
    const queryHeaders = { headers: { 'Authorization': 'Bearer ' + access_token, 'Content-Type': 'application/json' } }

    const queryUrl = instance_url + "/services/data/v47.0/query/?q=SELECT Id FROM Account WHERE Company_Email__c = '" + user.onboarderEmail + "'"
    // const queryUrl = instance_url + "/services/data/v47.0/query/?q=SELECT Id FROM Account WHERE Name = 'Giorgio Moroder'"
    const  totalSize  = await requester.get(queryUrl, queryHeaders)

    if (totalSize) {
        // console.log("TOTAL SIZE ", totalSize.records[0].attributes.url)
        const accountUrl = instance_url + totalSize.records[0].attributes.url

        let accountData = {
            Email_Setup__c: 'true',
            Slack_Set_Up__c: 'true',
            Canvass_Set_Up__c: 'true',
            Lessonly_Set_Up__c: 'true',
            Status__c : 'Active',
            Onboarding_Complete__c: 'true',
            Direct_Deposit__c: 'true'

        }

        // let accountData = {
        //     Email_Setup__c: 'false',
        //     Slack_Set_Up__c: 'false',
        //     Spotio_Set_Up__c: 'false',
        //     Status__c : 'Onboarding',
        //     Onboarding_Complete__c: 'false'
        // }

           await requester.patch(accountUrl, accountData, queryHeaders)
        // console.log("RESPONSE ", response)

        // if(response){
        //     console.log("RESPONSE ", response)
        //edit local database
        await dbService.query('UPDATE user SET percentComplete =  ?, isApproved = ? WHERE email = ?', [100, 1,  user.onboarderEmail])
            //email to the login pwrstation page
            await emailService.repCredentials( user.onboarderEmail)

        // }

    }
}
async function deleteUser({ userId }) {
    await dbService.query('UPDATE user SET deleted = 1 WHERE userId = ?', [userId])
}

async function setProfileImage({ userId, filename, fileBuffer }) {
    // maybe break out hosted dir location into a util or a service or osmething?
    jetpack.write(path.resolve(__dirname, `../../../hosted/users/${userId}/${filename}`), fileBuffer)
    await dbService.query('UPDATE user SET profileImageFile = ?', [filename])
}

async function changePassword({ userId, password }) {
    console.log(password)
    const salt = cryptoService.getRandomSalt()
    const hash = cryptoService.getHash(password, salt)
    await dbService.query('UPDATE user SET passwordHash = ?, passwordSalt = ? WHERE userId = ?', [ hash, salt, userId ])
}

async function resetPassword({ userId }) {
    const [ row ] = await dbService.query('SELECT email FROM user WHERE userId = ?', [userId])
    if (!row) {
        throw new Error(`User with id "${userId}" could not be found`)
    }
    const { email } = row
    const salt = cryptoService.getRandomSalt()
    const password = cryptoService.getRandomSalt()
    const hash = cryptoService.getHash(password, salt)
    await dbService.query('UPDATE user SET passwordHash = ?, passwordSalt = ? WHERE userId = ?', [hash, salt, userId])
    await emailService.sendEmail({
        from: 'noreply@' + config.domainName,
        to: email,
        subject: 'password update',
        body: `
Your password has been updated.

Your new password is: ${password}
`
    })
}

async function createAccount(user) {
    const roles = await roleService.getRoles()
    let role = ''
    for (let i = 0; i < roles.length; i++) {
        if (roles[i].roleId == user.roleId) {
            role = roles[i].roleName
        }
    }
    const teams = await teamService.getTeams()
    let team = ''
    for (let i = 0; i < teams.length; i++) {
        if (teams[i].teamId == user.teamId) {
            team = teams[i].teamName
        }
    }

    const credentialsUrl = 'https://login.salesforce.com/services/oauth2/token'
    let authData = { grant_type: 'password', 
                   client_id: '3MVG9mclR62wycM2QCvilyDrGjq8DvpGohXz.nJsA8n7MAA2ntKXGwqv2jOXapE3dHIbaxIe2vix7M5emxMj1',
                    client_secret: 'E4B116D1D3BC3A56259361F17EB4395748D96F5B95CCDE496198C85C83BD6B94',
                    username: 'horizonpwr.salesforce@gmail.com',
                    password: '$Horizon$2022' }
    authData = querystring.stringify(authData)
    const authHeaders = { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': "*/*", 'Connection': 'keep-alive' }
    const { access_token, instance_url } = await requester.post(credentialsUrl, authData, { authHeaders })
    const queryHeaders = { headers: { 'Authorization': 'Bearer ' + access_token, 'Content-Type': 'application/json' } }

    const queryUrl = instance_url + "/services/data/v47.0/query/?q=SELECT Id FROM Account WHERE Name = '" + user.firstName + ' ' + user.lastName + "'"
    const { totalSize } = await requester.get(queryUrl, queryHeaders)

    if (totalSize === 0) {
        const accountUrl = instance_url + "/services/data/v47.0/sobjects/Account/"
        let accountData = {
            Name: user.firstName + ' ' + user.lastName,
            Position__c: role,
            Personal_Email__c: user.personalEmail,
            Company_Email__c: user.companyEmail,
            Phone: user.phoneNumber,
            Team__c: team,
            Start_Date__c: user.startDate,
            Status__c : 'Onboarding',
            User_Password_Hash__c: '$2a$12$7jvahS7N38dlyH0bbxOyiNJwzBy7L|$2a$12$7jvahS7N38dlyH0bbxOyi.AqAAeDFfC1Gfb5sAKdjpC07em79y0Bu',
            Welcome_Email_Sent__c: 'true',
            Direct_Deposit_IMG_Uploaded__c: true,
            Photo_ID_Uploaded__c: true
        }
    
        const response = await requester.post(accountUrl, accountData, queryHeaders)
    }
}

async function Register({signUpEmail}){

    // console.log("USER SERVICE ", signUpEmail)
    const [ row ] = await dbService.query('SELECT userId, deleted, passwordSalt, passwordHash FROM user WHERE email = ?', [signUpEmail])
    const [ rowAccount ] = await dbService.query('SELECT Name, Position__c, Team__c, created_date, Company_Email__c FROM account WHERE Company_Email__c = ?', [signUpEmail])
    // let newUser = false
    if (row ) {
         // console.log(row.deleted)
         if(row.deleted){
            // console.log(row.userId)
            await dbService.query('UPDATE user SET deleted =  ? WHERE userId = ?',  [0, row.userId])
            let userId = row.userId
            let password = "password"

            await changePassword({userId, password})
            
        }else{
            throw new Error('User exists in users table try to log in instead')
        }

       
        // console.log("success")
    } else if( rowAccount){
        // throw new Error('Go ahead create user')
        //
        let [roleIdQuery] = await dbService.query('SELECT roleId FROM role WHERE roleName = ?', [rowAccount.Position__c])

        let roleId = roleIdQuery.roleId
        let name = rowAccount.Name.split(" ")
        let firstName = name[0]
        let lastName = name[1]
        let phoneNumber = ""
        let teamId = ""
        if(rowAccount.Team__c === "Fox"){
             teamId = "7"
        }else if(rowAccount.Team__c === "Wolf" || rowAccount.Team__c === "Boise"){
              teamId = "2"
        }else if(rowAccount.Team__c === "Rexburg" ){
              teamId = "8"
        }else{
            teamId = " "
        }

        let startDate = rowAccount.created_date
        let password = "password"
        let profileImageFile = ""

        // console.log(signUpEmail)
        // console.log(roleId)
        // console.log(fistName)
        // console.log(lastName)
        // console.log(teamId)
        // console.log(startDate)
        // console.log(password)
        // throw new Error('Go ahead create user')
        const salt = cryptoService.getRandomSalt()
        const hash = cryptoService.getHash(password, salt)
        const registerQuery = await dbService.query('INSERT INTO user (firstName, lastName, roleId, email, phoneNumber, teamId, profileImageFile, startDate, passwordHash, passwordSalt, isApproved) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [ firstName, lastName, roleId, signUpEmail, phoneNumber, teamId, profileImageFile, startDate, hash, salt, 1  ])

        if(registerQuery){
           console.log("registerQuery true")
        }else{
            throw new Error('Error creating the user')
        }

    }else{
        throw new Error('Email was not found in account table nor users ')
    }

    // return { newUser }
}

async function sfDeleteUpdate({userId, reason}) {
    console.log("user service ", userId, reason)

    let getEmail = await dbService.query("SELECT email FROM user WHERE userId = '" + userId + "'")
    getEmail = getEmail[0].email

    console.log("getEmail ", getEmail)

    const credentialsUrl = 'https://login.salesforce.com/services/oauth2/token'
    let authData = {
        grant_type: 'password',
        client_id: '3MVG9mclR62wycM2QCvilyDrGjq8DvpGohXz.nJsA8n7MAA2ntKXGwqv2jOXapE3dHIbaxIe2vix7M5emxMj1',
        client_secret: 'E4B116D1D3BC3A56259361F17EB4395748D96F5B95CCDE496198C85C83BD6B94',
        username: 'horizonpwr.salesforce@gmail.com',
        password: '$Horizon$2022'
    }
    authData = querystring.stringify(authData)
    const authHeaders = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': "*/*",
        'Connection': 'keep-alive'
    }
    const {access_token, instance_url} = await requester.post(credentialsUrl, authData, {authHeaders})
    const queryHeaders = {headers: {'Authorization': 'Bearer ' + access_token, 'Content-Type': 'application/json'}}

    const queryUrl = instance_url + "/services/data/v47.0/query/?q=SELECT Id FROM Account WHERE Company_Email__c = '" +  getEmail + "'"

    const totalSize = await requester.get(queryUrl, queryHeaders)
    console.log("queryUrl ", queryUrl)

    let today = new Date()
    console.log("TOTAL SIZE ", totalSize)
    if (totalSize) {
        // console.log("TOTAL SIZE ", totalSize.records[0].attributes.url)
        const accountUrl = instance_url + totalSize.records[0].attributes.url
        // const accountUrl = instance_url + "/services/data/v47.0/sobjects/Account/"
        let accountData = {
            Status__c: 'Inactive',
            Termination_Date__c: today,
            Reason_Inactive__c: reason,

        }


        const response = await requester.patch(accountUrl, accountData, queryHeaders)
        console.log("RESPONSE ", response)

        // if(response){
        //     console.log("RESPONSE ", response)
        //edit local database
        // await dbService.query('UPDATE user SET percentComplete =  ?, isApproved = ? WHERE email = ?', [100, 1, user.onboarderEmail])
        //email to the login pwrstation page
        // await emailService.loginEmail(user.onboarderEmail)
        //         }
    }


}

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
        await dbService.query('UPDATE certification SET userId = ?, work_ethic = ?, attitude = ?, leadership_potential = ?, sales_skills = ?, becoming_ec = ?, work_days = ?, leads_amount = ?, culture_contribution = ?, certify = ?, rep_con = ?, rep_pros = ?, completed = ?', [userId, work_ethic, attitude, leadership_potential, sales_skills, becoming_ec, work_days, leads_amount, culture_contribution, certify, rep_con, rep_pros, certify])
        //if not certify don't change the user status

    } else {
        console.log("Insert")
        await dbService.query('INSERT IGNORE INTO certification (userId, work_ethic, attitude, leadership_potential, sales_skills, becoming_ec, work_days, leads_amount, culture_contribution, certify, rep_con, rep_pros, completed ) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [userId, work_ethic, attitude, leadership_potential, sales_skills, becoming_ec, work_days, leads_amount, culture_contribution, certify, rep_con, rep_pros, certify])
        //if not certify don't change the user status

    }
    await dbService.query('UPDATE user SET certify = ? WHERE userId = ?', [certify, userId])
    await emailService.certification(userId)

}

async function promoteRep({userId, newPosition}) {
    console.log("user service promote rep ", userId, newPosition)
    //look for roleId and previous position
    let roleId = await dbService.query('SELECT roleId FROM role WHERE roleName = ?', [newPosition])
    let previousPosition = await dbService.query('SELECT roleId, email, firstName, lastName FROM user WHERE userId = ?', [userId])
   
    // console.log("user service promote rep ", userId, newPosition, roleId, previousPosition)
    let workEmail = previousPosition[0].email
    // console.log("workEmail HERE ", workEmail)
    let repName = previousPosition[0].firstName + ' ' + previousPosition[0].lastName
    let sfIdQuery = await dbService.query('SELECT Id FROM account WHERE Company_Email__c = ?', [workEmail])
    // console.log("sfId HERE ", sfIdQuery)
    let sfId = sfIdQuery[0].Id
    if( previousPosition[0].roleId === '7' && roleId[0].roleId === 10 || previousPosition[0].roleId === '7' && roleId[0].roleId === 9 ||  previousPosition[0].roleId === '8' && roleId[0].roleId === 9 || previousPosition[0].roleId === '8' && roleId[0].roleId === 10 ){
    // console.log("some fm to ec")
          await dbService.query('UPDATE user SET promotionProcessing = ? WHERE userId = ?', [1, userId])
          await emailService.newAgreementEmail(userId, newPosition, workEmail, repName, sfId)
      }

    if( previousPosition[0].roleId === '7' && roleId[0].roleId === 8 ){

        const credentialsUrl = 'https://login.salesforce.com/services/oauth2/token'
    let authData = {
        grant_type: 'password',
        client_id: '3MVG9mclR62wycM2QCvilyDrGjq8DvpGohXz.nJsA8n7MAA2ntKXGwqv2jOXapE3dHIbaxIe2vix7M5emxMj1',
        client_secret: 'E4B116D1D3BC3A56259361F17EB4395748D96F5B95CCDE496198C85C83BD6B94',
        username: 'horizonpwr.salesforce@gmail.com',
        password: '$Horizon$2020%'
    }
    authData = querystring.stringify(authData)
    const authHeaders = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': "*/*",
        'Connection': 'keep-alive'
    }
    const {access_token, instance_url} = await requester.post(credentialsUrl, authData, {authHeaders})
    const queryHeaders = {headers: {'Authorization': 'Bearer ' + access_token, 'Content-Type': 'application/json'}}

    const queryUrl = instance_url + "/services/data/v47.0/query/?q=SELECT Id FROM Account WHERE Company_Email__c = '" + previousPosition[0].email + "'"

    const totalSize = await requester.get(queryUrl, queryHeaders)
    // console.log("queryUrl ", queryUrl)


    // console.log("TOTAL SIZE ", totalSize)
    if (totalSize) {
        console.log("TOTAL SIZE ", totalSize.records[0].attributes.url)
        const accountUrl = instance_url + totalSize.records[0].attributes.url
        // const accountUrl = instance_url + "/services/data/v47.0/sobjects/Account/"
        let accountData = {
            Position__c: 'Field Marketer Elite',
        }

        const response = await requester.patch(accountUrl, accountData, queryHeaders)
        console.log("fm1 to fm2")
        await dbService.query('UPDATE user SET roleId = ? WHERE userId = ?', [8, userId])
    }


    // }else if( previousPosition[0].roleId === '7' && roleId[0].roleId === 8 ){
    //     
    //     
    // }



}
}

async function finishRepPromo(userId) {
    console.log("FinishRepPromo ", userId)
    const rowAccount = await dbService.query('SELECT Company_Email__c  FROM account WHERE Id = ?', [userId])
    console.log("result query top ", rowAccount[0].Company_Email__c)
    await dbService.query('UPDATE user SET promotionProcessing = ?, roleId = ? WHERE email = ?', [0,  10, rowAccount[0].Company_Email__c ])
    await dbService.query('UPDATE account SET Position__c = ? WHERE Company_Email__c = ?', ['Jr Energy Consultant', rowAccount[0].Company_Email__c ])

    await emailService.upgradeLessonly(userId)

    const credentialsUrl = 'https://login.salesforce.com/services/oauth2/token'
    let authData = {
        grant_type: 'password',
        client_id: '3MVG9mclR62wycM2QCvilyDrGjq8DvpGohXz.nJsA8n7MAA2ntKXGwqv2jOXapE3dHIbaxIe2vix7M5emxMj1',
        client_secret: 'E4B116D1D3BC3A56259361F17EB4395748D96F5B95CCDE496198C85C83BD6B94',
        username: 'horizonpwr.salesforce@gmail.com',
        password: '$Horizon$2020%'
    }
    authData = querystring.stringify(authData)
    const authHeaders = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': "*/*",
        'Connection': 'keep-alive'
    }
    const {access_token, instance_url} = await requester.post(credentialsUrl, authData, {authHeaders})
    const queryHeaders = {headers: {'Authorization': 'Bearer ' + access_token, 'Content-Type': 'application/json'}}

    const queryUrl = instance_url + "/services/data/v47.0/query/?q=SELECT Id FROM Account WHERE Company_Email__c = '" + rowAccount[0].Company_Email__c + "'"

    const totalSize = await requester.get(queryUrl, queryHeaders)
    // console.log("queryUrl ", queryUrl)


    // console.log("TOTAL SIZE ", totalSize)
    if (totalSize) {
        // console.log("TOTAL SIZE ", totalSize.records[0].attributes.url)
        const accountUrl = instance_url + totalSize.records[0].attributes.url
        // const accountUrl = instance_url + "/services/data/v47.0/sobjects/Account/"
        let accountData = {
            Position__c: 'Jr Energy Consultant',
        }

        const response = await requester.patch(accountUrl, accountData, queryHeaders)
    }
    // console.log("user service promote rep ", userId, newPosition)
    // //look for roleId and previous position
    // let roleId = await dbService.query('SELECT roleId FROM role WHERE roleName = ?', [newPosition])
    // let previousPosition = await dbService.query('SELECT roleId FROM user WHERE userId = ?', [userId])
    // console.log("user service promote rep ", userId, newPosition, roleId, previousPosition)
    // if( previousPosition[0].roleId === '7' && roleId[0].roleId === 10 || previousPosition[0].roleId === '7' && roleId[0].roleId === 9 ){
    //     await dbService.query('UPDATE user SET promotionProcessing = ? WHERE userId = ?', [1, userId])
    //     await emailService.newAgreementEmail(userId, newPosition)
    // }else if( previousPosition === '7' && roleId[0].roleId === 10 || previousPosition === '7' && roleId[0].roleId === 9 ){
    //     await dbService.query('UPDATE user SET promotionProcessing = ? WHERE userId = ?', [1, userId])
    // }
}





module.exports = {
    getUser,
    getUsers,
    createUser,
    editUser,
    activateRep,
    setProfileImage,
    resetPassword,
    deleteUser,
    changePassword,
    Register,
    sfDeleteUpdate,
    certifyUser,
    promoteRep,
    finishRepPromo
}
