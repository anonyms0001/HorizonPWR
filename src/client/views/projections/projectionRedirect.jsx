import { Redirect} from 'react-router-dom'
import {view, emit} from '../../framework'
import ProjectionStore from "../../stores/projectionStore"


export default view(function ProjectionRedirect() {
    let initDate = new Date(), y = initDate.getFullYear(), m = initDate.getMonth()
    let firstDay = new Date(y, m, 1)
    firstDay.setHours(firstDay.getHours() - 6)
    let firstToString = firstDay.toISOString()
    let firstDate = firstToString.split('T')
    let lastDay = new Date(y, m + 1, 0)
    lastDay.setHours(lastDay.getHours() - 6)
    lastDay.setDate(lastDay.getDate() + 1)
    let lastToString = lastDay.toISOString()
    let lastDate = lastToString.split('T')
    const {processingRedirect, projectionMonthId} = ProjectionStore

    console.log("processingRedirect ", processingRedirect, firstDate[0], lastDate[0])
    if(processingRedirect){
        emit.ProcessProjectionRedirect({start: firstDate[0], end: lastDate[0]})
    }else{
        // emit.GetCurrentProjection({start: firstDate[0], end: lastDate[0]})
        return <Redirect to={"/projection/" + projectionMonthId}/>
    }
    let today = new Date()
    const absoluteToday = today.getFullYear() + '-' + ((today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1))

    return (
       <h1>Hey</h1>
    )
})