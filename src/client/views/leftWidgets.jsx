import {view} from "../framework";

export default view(function LeftWidgets() {

    return (
        <div className="col-md-3">
            <div className="panel panel-default">
                <div className="panel-heading">BRIGHT BEGINNINGS</div>
                <ul className="list-group">
                    <li className="list-group-item">
                        <div className="info-wrapper">
                            <i className="glyphicon glyphicon-user"></i>
                            <p>Name</p>
                        </div>
                    </li>
                    <li className="list-group-item">
                        <div className="info-wrapper">
                            <i className="glyphicon glyphicon-user"></i>
                            <p>Name</p>
                        </div>
                    </li>
                    <li className="list-group-item">
                        <div className="info-wrapper">
                            <i className="glyphicon glyphicon-user"></i>
                            <p>Name</p>
                        </div>
                    </li>
                    <li className="list-group-item">
                        <div className="info-wrapper">
                            <i className="glyphicon glyphicon-user"></i>
                            <p>Name</p>
                        </div>
                    </li>
                    <li className="list-group-item">
                        <div className="info-wrapper">
                            <i className="glyphicon glyphicon-user"></i>
                            <p>Name</p>
                        </div>
                    </li>
                </ul>
            </div>
            <div className="panel panel-promotions panel-default">
                <div className="panel-heading">PWR PROMOTIONS</div>
                <ul className="list-group">
                    <li className="list-group-item">
                        <div className="info-wrapper">
                            <button className="btn btn-primary" type="button">
                                FM ELITE
                            </button>
                            <p>REP NAME</p>
                        </div>
                    </li>
                    <li className="list-group-item">
                        <div className="info-wrapper">
                            <button className="btn btn-primary" type="button">
                                JR EC
                            </button>
                            <p>REP NAME</p>
                        </div>
                    </li>
                    <li className="list-group-item">
                        <div className="info-wrapper">
                            <button className="btn btn-primary" type="button">
                                SR EC
                            </button>
                            <p>REP NAME</p>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    )
})