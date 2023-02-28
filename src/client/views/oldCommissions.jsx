import Link from '../components/link'
import { view, emit } from '../framework'
import userStore from '../stores/userStore'
import salesforceStore from '../stores/salesforceStore'

export default view(function OldCommissions() {

    const { commissions, SelectedPayDate } = salesforceStore

    let earned = 0
    let pending = 0
    let keys = {}
    if (commissions !== null) {
        keys = Object.keys(commissions)
        keys.sort((a, b) => {
            if (a > b) {
                return -1;
            }
            if (a < b) {
                return 1;
            }

            return 0;
        })
        console.log(keys)
        for (let i = 0; i < commissions.length; i++) {
            let today = new Date()
            let payDate = new Date(commissions[i].PayDate)
            if (today > payDate) {
                earned += commissions[i].Commission
            }
            else {
                pending += commissions[i].Commission
            }
        }
    }

    return (
        <div className="table-container commissions">
                <div className="table-header">
                    <table className="table" param="pwrstation">
                        <thead>
                            <tr>
                                <th>Payment Date</th>
                                <th>Amount Earned</th>
                                <th>Customer Name</th>
                                <th>System Size</th>
                                <th>Deductions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                commissions ? keys.map((key, idx) => {
                                    let today = new Date()
                                    let payDate = new Date(key)
                                    const rows = [
                                        <tr key={key} className={idx % 2 ? '' : 'even-column'} onClick={() => {emit.ClickedCommissionsRow({ PayDate: key })}}>
                                            <td className="greyColor">{key}</td>
                                            <td className="greyColor">{'$ ' + commissions[key].TotalCommissions.toLocaleString()}</td>
                                            <td className="greyColor"></td>
                                            <td className="greyColor"></td>
                                            <td className="greyColor"></td>
                                        </tr>
                                    ]
                                    
                                    if (key === SelectedPayDate) {
                                        
                                        const details = Object.values(commissions[key].ComissionInfo)
                                        
                                        commissions[key].ComissionInfo.forEach((commission) => {
                                            rows.push(
                                                <tr key={key} className={idx % 2 ? '' : 'greyColor active'} onClick={() => {emit.ClickedCommissionsRow({ PayDate: key })}}>
                                                    <td className="greyColor"></td>
                                                    <td className="greyColor">{'$' + commission.Commission.toLocaleString()}</td>
                                                    <td className="greyColor">{commission.CustomerName}</td>
                                                    <td className="greyColor">{commission.SystemSize + 'kW'}</td>
                                                    <td className="greyColor">{commission.Deductions ? commission.Deductions : '0'}</td>
                                                </tr>
                                            )
                                        })
                                    }
                                    return (
                                        rows
                                    )
                                }) : null
                            }
                        </tbody>
                    </table>
                </div>
                <div className="table-content">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Payment Date</th>
                                <th>Amount Earned</th>
                                <th>Customer Name</th>
                                <th>System Size</th>
                                <th>Deductions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                commissions ? keys.map((key, idx) => {
                                    let today = new Date()
                                    let payDate = new Date(key)
                                    const rows = [
                                        <tr key={key} className={idx % 2 ? '' : 'even-column'} onClick={() => {emit.ClickedCommissionsRow({ PayDate: key })}}>
                                            <td className="greyColor">{key}</td>
                                            <td className="greyColor">{'$ ' + commissions[key].TotalCommissions.toLocaleString()}</td>
                                            <td className="greyColor"></td>
                                            <td className="greyColor"></td>
                                            <td className="greyColor"></td>
                                        </tr>
                                    ]
                                    
                                    if (key === SelectedPayDate) {
                                        console.log(typeof commissions[key].ComissionInfo)
                                        const details = Object.values(commissions[key].ComissionInfo)
                                        console.log(typeof details)
                                        commissions[key].ComissionInfo.forEach((commission) => {
                                            rows.push(
                                                <tr key={key} className='greyColor active' onClick={() => {emit.ClickedCommissionsRow({ PayDate: key })}}>
                                                    <td className="greyColor"></td>
                                                    <td className="greyColor">{'$' + commission.Commission.toLocaleString()}</td>
                                                    <td className="greyColor">{commission.CustomerName}</td>
                                                    <td className="greyColor">{commission.SystemSize + 'kW'}</td>
                                                    <td className="greyColor">{commission.Deductions ? commission.Deductions : '0'}</td>
                                                </tr>
                                            )
                                        })
                                    }
                                    return (
                                        rows
                                    )
                                }) : null
                            }
                        </tbody>
                    </table>
                </div>
            </div>
    )
})
