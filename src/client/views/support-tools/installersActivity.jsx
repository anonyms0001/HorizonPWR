import {view, emit} from '../../framework'
import installersActivityStore from "../../stores/installersActivityStore"

export default view(function InstallersActivity() {

    const {installersActivity, installersState} = installersActivityStore

    // console.log("installersState ", installersState)

    console.log("installersActivity view in ", installersActivity)

    function InstallerStateChange(installer) {
        // console.log("installer ", installer)
        emit.ClickedInstallersTab(installer)
    }

    return (
        <section className="pwrstation-view-profile">

            <div id="resultbox"/>
            <div className="row">
                <div className="col-xs-12">
                    <div className="panel with-nav-tabs panel-default">
                        <div className="panel-heading" style={{padding: "1em 0px 0px 0px", border: "none"}}>
                            <div style={{display: "flex"}}>
                                <div className="panel-title"
                                     style={{
                                         flex: "1",
                                         textAlign: "left",
                                         marginTop: "8px",
                                         borderBottom: "1px solid #ddd", paddingLeft: "15px"
                                     }}>INSTALLERS
                                </div>
                                <div style={{flex: "2"}}>
                                    <ul className="nav nav-tabs">
                                        <li className={installersState === 'comet' ? "active" : ""}>
                                            <a tabIndex="0" style={{cursor: "pointer"}}
                                               onClick={InstallerStateChange.bind(this, 'comet')}> East
                                                Idaho Comet</a>

                                        </li>
                                        <li className={installersState === 'boiseComet' ? "active" : ""}>
                                            <a tabIndex="0" style={{cursor: "pointer"}}
                                               onClick={InstallerStateChange.bind(this, 'boiseComet')}>Comet Energy</a>

                                        </li>
                                        {/*<li>*/}
                                        {/*    <a tabIndex="1">Comet Energy Boise</a>*/}
                                        {/*</li>*/}
                                        <li className={installersState === 'winema' ? "active" : ""}>
                                            <a tabIndex="1" style={{cursor: "pointer"}}
                                               onClick={InstallerStateChange.bind(this, 'winema')}> Winema
                                                Electric</a>
                                        </li>
                                        <li className={installersState === 'elemental' ? "active" : ""}>
                                            <a tabIndex="2" style={{cursor: "pointer"}}
                                               onClick={InstallerStateChange.bind(this, 'elemental')}>Elemental
                                                Energy</a>
                                        </li>
                                        <li className={installersState === 'dog' ? "active" : ""}>
                                            <a tabIndex="2" style={{cursor: "pointer"}}
                                               onClick={InstallerStateChange.bind(this, 'dog')}>Big Dog</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="panel-body" style={{padding: "0px"}}>
                            <div className="tab-content" style={{border: "none"}}>

                                <div
                                    className={installersState === 'comet' ? "tab-pane fade in active" : "tab-pane"}
                                    style={{border: "none"}}>
                                    <table className='table table-striped'>
                                        <thead>
                                        <tr>
                                            <th>
                                                PROJECT NAME
                                            </th>
                                            <th>
                                                INSTALL DATE
                                            </th>
                                            <th>
                                                FINAL SYSTEM SIZE
                                            </th>
                                            <th>
                                                GROUND MOUNT
                                            </th>
                                            <th>
                                                EC
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            installersActivity.length > 0 ?
                                                installersActivity.filter(installer => installer.Installer__c === 'a0z3m00000Al1sVAAR').map((cometItem) => {
                                                    let formattedDate = cometItem.Install_Date__c.split('T')
                                                    return (
                                                        <tr>
                                                            <td style={{textAlign: "left"}}>
                                                                {cometItem.Name}
                                                            </td>
                                                            <td>
                                                                {formattedDate[0]}
                                                            </td>
                                                            <td>
                                                                {cometItem.Final_System_Size__c}
                                                            </td>
                                                            <td>
                                                                <i className={cometItem.Ground_Mount__c ? "glyphicon glyphicon-check" : "glyphicon glyphicon-unchecked"}/>
                                                            </td>
                                                            <td>
                                                                {cometItem.RepName}
                                                            </td>
                                                        </tr>

                                                    )
                                                }) : null}
                                        </tbody>
                                    </table>
                                </div>
                                <div
                                    className={installersState === 'boiseComet' ? "tab-pane fade in active" : "tab-pane"}
                                    style={{border: "none"}}>
                                    <table className='table table-striped'>
                                        <thead>
                                        <tr>
                                            <th>
                                                PROJECT NAME
                                            </th>
                                            <th>
                                                INSTALL DATE
                                            </th>
                                            <th>
                                                FINAL SYSTEM SIZE
                                            </th>
                                            <th>
                                                GROUND MOUNT
                                            </th>
                                            <th>
                                                EC
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            installersActivity.length > 0 ?
                                                installersActivity.filter(installer => installer.Installer__c === 'a0z3m00000AkyCdAAJ').map((cometItem) => {
                                                    let formattedDate = cometItem.Install_Date__c.split('T')
                                                    return (
                                                        <tr>
                                                            <td style={{textAlign: "left"}}>
                                                                {cometItem.Name}
                                                            </td>
                                                            <td>
                                                                {formattedDate[0]}
                                                            </td>
                                                            <td>
                                                                {cometItem.Final_System_Size__c}
                                                            </td>
                                                            <td>
                                                                <i className={cometItem.Ground_Mount__c ? "glyphicon glyphicon-check" : "glyphicon glyphicon-unchecked"}/>
                                                            </td>
                                                            <td>
                                                                {cometItem.RepName}
                                                            </td>
                                                        </tr>

                                                    )
                                                }) : null}
                                        </tbody>
                                    </table>
                                </div>

                                <div id='a0z3m00000Al7CrAAJ'
                                     className={installersState === 'winema' ? "tab-pane fade in active" : "tab-pane"}
                                     style={{border: "none"}}>
                                    <table className='table table-striped'>
                                        <thead>
                                        <tr>
                                            <th>
                                                PROJECT NAME
                                            </th>
                                            <th>
                                                INSTALL DATE
                                            </th>
                                            <th>
                                                FINAL SYSTEM SIZE
                                            </th>
                                            <th>
                                                GROUND MOUNT
                                            </th>
                                            <th>
                                                EC
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            installersActivity.length > 0 ?
                                                installersActivity.filter(installer => installer.Installer__c === 'a0z3m00000Al7CrAAJ').map((cometItem) => {
                                                    let formattedDate = cometItem.Install_Date__c.split('T')
                                                    return (
                                                        <tr>
                                                            <td style={{textAlign: "left"}}>
                                                                {cometItem.Name}
                                                            </td>
                                                            <td>
                                                                {formattedDate[0]}
                                                            </td>
                                                            <td>
                                                                {cometItem.Final_System_Size__c}
                                                            </td>
                                                            <td>
                                                                <i className={cometItem.Ground_Mount__c ? "glyphicon glyphicon-check" : "glyphicon glyphicon-unchecked"}/>
                                                            </td>
                                                            <td>
                                                                {cometItem.RepName}
                                                            </td>
                                                        </tr>
                                                    )
                                                }) : null}
                                        </tbody>
                                    </table>
                                </div>


                                <div
                                    className={installersState === 'elemental' ? "tab-pane fade in active" : "tab-pane"}
                                    style={{border: "none"}}>
                                    <table className='table table-striped'>
                                        <thead>
                                        <tr>
                                            <th>
                                                PROJECT NAME
                                            </th>
                                            <th>
                                                INSTALL DATE
                                            </th>
                                            <th>
                                                FINAL SYSTEM SIZE
                                            </th>
                                            <th>
                                                GROUND MOUNT
                                            </th>
                                            <th>
                                                EC
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            installersActivity.length > 0 ?
                                                installersActivity.filter(installer => installer.Installer__c === 'a0z3m00000Al7CcAAJ').map((cometItem) => {
                                                    let formattedDate = cometItem.Install_Date__c.split('T')
                                                    return (
                                                        <tr>
                                                            <td style={{textAlign: "left"}}>
                                                                {cometItem.Name}
                                                            </td>
                                                            <td>
                                                                {formattedDate[0]}
                                                            </td>
                                                            <td>
                                                                {cometItem.Final_System_Size__c}
                                                            </td>
                                                            <td>
                                                                <i className={cometItem.Ground_Mount__c ? "glyphicon glyphicon-check" : "glyphicon glyphicon-unchecked"}/>
                                                            </td>
                                                            <td>
                                                                {cometItem.RepName}
                                                            </td>
                                                        </tr>

                                                    )
                                                }) : null}
                                        </tbody>
                                    </table>
                                </div>
                                <div
                                    className={installersState === 'dog' ? "tab-pane fade in active" : "tab-pane"}
                                    style={{border: "none"}}>
                                    <table className='table table-striped'>
                                        <thead>
                                        <tr>
                                            <th>
                                                PROJECT NAME
                                            </th>
                                            <th>
                                                INSTALL DATE
                                            </th>
                                            <th>
                                                FINAL SYSTEM SIZE
                                            </th>
                                            <th>
                                                GROUND MOUNT
                                            </th>
                                            <th>
                                                EC
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            installersActivity.length > 0 ?
                                                installersActivity.filter(installer => installer.Installer__c === 'a0z3m00000ADdKXAA1').map((cometItem) => {
                                                    let formattedDate = cometItem.Install_Date__c.split('T')
                                                    return (
                                                        <tr>
                                                            <td style={{textAlign: "left"}}>
                                                                {cometItem.Name}
                                                            </td>
                                                            <td>
                                                                {formattedDate[0]}
                                                            </td>
                                                            <td>
                                                                {cometItem.Final_System_Size__c}
                                                            </td>
                                                            <td>
                                                                <i className={cometItem.Ground_Mount__c ? "glyphicon glyphicon-check" : "glyphicon glyphicon-unchecked"}/>
                                                            </td>
                                                            <td>
                                                                {cometItem.RepName}
                                                            </td>
                                                        </tr>

                                                    )
                                                }) : null}
                                        </tbody>
                                    </table>
                                </div>


                            </div>
                        </div>
                    </div>
                </div>
                <div className="clear20"/>
            </div>

            <div className="clear30"/>
        </section>
    )
})

