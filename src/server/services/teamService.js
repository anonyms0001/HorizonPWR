const dbService = require('./dbService')

async function getTeams() {
    const teams = await dbService.query('SELECT teamId, teamName FROM team')
    return teams
}

async function createTeam({ newTeamName }) {
    await dbService.query('INSERT INTO team (teamName) VALUES (?)', [ newTeamName ])
}

async function editTeam({ team }) {
    await dbService.query('UPDATE team SET teamName = ? WHERE teamId = ?', [team.teamName, team.teamId])
}

async function deleteTeam({ team }) {
    await dbService.query('DELETE FROM team WHERE teamId = ?', [team.teamId])
}

module.exports = {
    getTeams,
    createTeam,
    editTeam,
    deleteTeam,
}
// const dbService = require('./dbService')

// async function getTeams() {
//     const teams = await dbService.query('SELECT teamId, teamName FROM team')
//     return teams
// }

// async function createTeam({ newTeamName }) {
//     await dbService.query('INSERT INTO team (teamName) VALUES (?)', [ newTeamName ])
// }

// module.exports = {
//     getTeams,
//     createTeam,
// }
