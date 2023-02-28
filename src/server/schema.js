const schemaQueries = [
// 'alter table account add column 1st_FM_Bonus tinyint(1) DEFAULT NULL',
// 'alter table account add column 2nd_FM_Bonus tinyint(1) DEFAULT NULL'   
     //'alter table install_schedule add column Street_Address__c varchar(255), add column City__c varchar(50), add column State__c varchar(100), add column Zip__c varchar(25), add column Upgrade_Needed__c varchar(10), add column Email_Address__c varchar(60), add column Battery_Back_Up_Type__c varchar(255) , add column Mobile_Phone__c varchar(255)',
    // 'alter table funding_payment drop Install_Complete__c tinyint(1)',
    // 'alter table install_schedule add Install_Complete__c tinyint(1)',
// 'alter table funding_payment add PTO_Approved__c tinyint(1)',
// 'alter table funding_payment drop 2nd_Funding_Payment_Amount__c',
// 'alter table funding_payment add column X2nd_Funding_Payment_Amount__c float DEFAULT NULL',
// `drop table funding_payment`,
// `create table funding_payment (
//     Id varchar(150)  NOT NULL primary key,
//     X1st_Funding_Payment_Amount__c float NOT NULL,
//     X2nd_Funding_Payment_Amount__c float DEFAULT NULL,
//     X1st_Funding_Received_Date2__c date DEFAULT NULL,
//     Loan_Approved_Date_Time__c datetime DEFAULT NULL,
//     Loan_Docs_Signed_Date_Time__c datetime DEFAULT NULL,
//     X2nd_Funding_Payment_Received_Date__c date DEFAULT NULL,
//     Funding_Updates__c text,
//     Signing_Updates__c text,
//     Finance_Partner__c varchar(150) DEFAULT NULL,
//     Completion_Certificate_Signed_Date_Time__c datetime DEFAULT NULL,
//     X1st_Funding_Payment_Received__c tinyint(1) DEFAULT NULL,
//     X2nd_Funding_Payment_Received__c tinyint(1) DEFAULT NULL,
//     COC_sent_to_GCU__c tinyint(1) DEFAULT NULL,
//     GCU_COC_Signed__c tinyint(1) DEFAULT NULL,
//     Substantial_Completion_Submitted__c tinyint(1) DEFAULT NULL
//  )`,

// `create table lead_address (
//     opportunity_id varchar(40)  NOT NULL primary key,
//     Street_Address__c varchar(200),
//     City__c varchar(100),
//     State__c varchar(100),
//     Zip__c int(20)
//  )`,

 // `create table lead_address (
 //     opportunity_id varchar(40)  NOT NULL primary key,
 //     Street_Address__c varchar(200),
 //     City__c varchar(100),
 //     State__c varchar(100),
 //     Zip__c int(20)
 //  )`,
// 'alter table _lead add column Canvass_Status__c varchar(200)',
// 'alter table _lead add column Reason_Proposal_Incomplete__c text',
// 'alter table _lead add column Proposal_Due_Date__c datetime',
// 'alter table _lead add column Drawing_Starting_Date_Time__c datetime',
// 'alter table _lead add column Proposal_Completed__c tinyint(1)',
// 'alter table _lead add column Proposal_QC_s_Date_Time__c datetime',
// 'alter table _lead add column Need_Usage__c tinyint(1)',
// 'alter table _lead add column Designer__c varchar(25)',
// 'alter table _lead add column Proposal_QC_d_By__c varchar(25)',
  // 'alter table _lead add column Appointment_Date__c date',
 // `create table canvass_appointment (
 //     appointment_id varchar(255)  NOT NULL primary key,
 //     appointment_data json
 //  )`,
 // `create table installer (
 //     Id varchar(255)  NOT NULL primary key,
 //     Name varchar(255),
 //     IsDeleted tinyint(1),
 //     Instructions text,
 //     Blocked_Dates json
 //  )`,
 // `create table install_schedule (
 //     Id varchar(255)  NOT NULL primary key,
 //     Installer__c varchar(255) NOT NULL, 
 //     Name varchar(255) NOT NULL,
 //     Install_Date__c date NOT NULL,
 //     Final_System_Size__c float,
 //     Ground_Mount__c tinyint(1)
 //  )`,
  // `alter table canvass_appointment add title varchar(255)`,
// `alter table week_stats add column ec_leads int(4)`,
// 'alter table install_schedule add column Pending_Cancellation__c tinyint(1)',
// 'alter table install_schedule add column Project_Cancelled__c tinyint(1)',
    // `create table week_stats (
    //   id int unsigned not null primary key auto_increment,
    //   start_date date NOT NULL,
    //   end_date date NOT NULL,
    //   fms_number int(11)  NOT NULL,
    //   fm_leads int(4) NOT NULL,
    //   fm_leads_pra float  NOT NULL,
    //   fm_leads_score float  NOT NULL,
    //   fm_qs int(4) NOT NULL,
    //   fm_qs_pra float  NOT NULL,
    //   fm_qs_score float  NOT NULL,
    //   fm_ass int(4) NOT NULL,
    //   fm_ass_pra float  NOT NULL,
    //   fm_ass_score float  NOT NULL,
    //   ecs_number int(4)  NOT NULL,
    //   ec_sits int(4) NOT NULL,
    //   ec_sits_pra float  NOT NULL,
    //   ec_sits_score float  NOT NULL,
    //   ec_closes int(4) NOT NULL,
    //   ec_closes_pra float  NOT NULL,
    //   ec_closes_score float  NOT NULL,
    //   ec_scheduled_installs int(4) NOT NULL,
    //   ec_scheduled_installs_pra float  NOT NULL,
    //   ec_scheduled_installs_score float  NOT NULL,
    //   fm_unit_score float  NOT NULL,
    //   ec_unit_score float  NOT NULL,
    //   week_score float  NOT NULL,
    //   team_numbers json  NOT NULL
    // )`,

    // `create table month_projection (
    //   id int unsigned not null primary key auto_increment,
    //   start_date date NOT NULL,
    //   end_date date NOT NULL,
    //   target_installs int(11) NOT NULL,
    //   mtd int(4),
    //   reps_projection json
    // )`,
    // 'alter table qs add column Sat_Date__c DATE',
   // 'alter table account add column Start_Date__c DATE',
   // 'alter table account add column Report_Start_Date__c DATE',
        // 'alter table _lead drop eligibility',
    // 'alter table _lead add column Name varchar(60)',
    // 'alter table certification add column userId int(3) not null',
    // 'alter table certification add column work_ethic int(1) not null',
    // 'alter table certification add column attitude int(1) not null',
    // 'alter table certification add column leadership_potential int(1) not null',
    // 'alter table certification add column sales_skills int(1) not null',
    // 'alter table certification add column becoming_ec int(1) not null',
    // 'alter table certification add column work_days int(1) not null',
    // 'alter table certification add column leads_amount int(1) not null',
    // 'alter table certification add column culture_contribution tinyint(1) not null',
    // 'alter table certification add column certify tinyint(1) not null',
    // 'alter table certification add column rep_con te     xt not null',
    // 'alter table certification add column rep_pros text not null',
    // 'alter table certification add column completed tinyint(1) not null',
    // 'alter table user add column promotionProcessing tinyint(1)',
    // 'alter table user add inviteResent tinyint(1) NOT NULL DEFAULT 0',
    // 'alter table user add agreement_signed tinyint(1)',
    // 'alter table user add  tinyint(1)',
    // 'alter table user add directDepositImage tinyint(1)',
    // `create table user (
    //     id int unsigned not null primary key auto_increment,
    //     email varchar(255),
    //     passwordHash varchar(255),
    //     passwordSalt varchar(255)
    // )`,
    // `create table certification (
    //     id int(11) unsigned not null  primary key auto_increment
    // )`
    // 'ALTER TABLE `user` CHANGE COLUMN `id` `userId` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT',
    // 'alter table user add column firstName varchar(255), add column lastName varchar(255)',
    // 'alter table user add column role varchar(255)',
    // 'alter table user add column phoneNumber varchar(255)',
    // 'alter table user add column teamId varchar(255)',
    // 'alter table user add column roleId varchar(255)',
    // 'alter table user drop column role',
    // `
    // create table team (
    //     teamId int unsigned not null primary key auto_increment,
    //     teamName varchar(255)
    // )
    // `,
    // `create table fm_sit_commission(
    //      Id varchar(255)  NOT NULL primary key,
    //      Name varchar(255) NOT NULL,
    //      FM_Expected_Pay_Date__c DATE NOT NULL,
    //      Field_Marketer__c varchar(255) NOT NULL
    // )`
    // 'alter table fm_sit_commission add column FM_Commission__c double NOT NULL',
    // `create table role ( 
    //     roleId int unsigned not null primary key auto_increment,
    //     roleName varchar(255),
    //     isAdmin tinyint(1) NOT NULL DEFAULT 0,
    //     isOnboarder tinyint(1) NOT NULL DEFAULT 0
    // )`,
    // `alter table user add column deleted tinyint(1) NOT NULL DEFAULT 0`,
    // `alter table user
    //     add column approved tinyint(1) NOT NULL DEFAULT 0,
    //     add column percentComplete int
    // `,
    // `alter table user change column approved isApproved tinyint(1) not null default 0`,
    // `alter table user change column percentComplete percentComplete int default 0`,
    // 'alter table user drop column personalEmail',
    // 'alter table account drop column status',
    // 'alter table account add column Status__c varchar(255)',
    // 'alter table account add column modified_date TIMESTAMP',
    //  `create table install_scheduled (
    //     Id varchar(255)  NOT NULL primary key,
    //      Install_Scheduled_Date_Time__c DATETIME NOT NULL,
    //      RepName varchar(255) not null
    // )`
]

async function initialize(dbService) {
    for (const query of schemaQueries) {
        try {
            await dbService.query(query, [], { skipInitCheck: true })
        }
        catch (error) {
            console.log(error.message)
        }
    }
}

module.exports = { initialize }
