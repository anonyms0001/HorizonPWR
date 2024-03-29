import './devToolMods'
import 'babel-polyfill'
import '../../assets/js/jquery'
import '../../assets/js/smartlook'
import { render } from 'react-dom'
import { HashRouter } from 'react-router-dom'
import '../../assets/css/login-style.css'
import '../../assets/css/bootstrap.css'
import '../../assets/css/default.css'

// import '../../assets/js/bootstrap.min'
// import '../../assets/css/pp-tou.css'
// import '../../assets/css/all.css'
import Routes from './reactRoutes'
import { emit } from './framework'

render(
    <HashRouter>
        <Routes />
    </HashRouter>
    , document.getElementById('root')
    , () => emit.Initialized()
)
