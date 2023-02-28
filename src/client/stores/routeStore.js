import { store } from '../framework'

// TODO: on refresh user is redirected to home even if they're logged in

export default store({
    
    pathname: '',
    pathnameString: '',
    // search: '',
    // hash: '',
    
    eventListeners: {
        RouteChanged({ pathname, search, hash }) {
            // console.log({ pathname, search, hash })
            this.pathname = pathname

            emit.ChangeRoute({pathname})
            // emit.ChangeRoute({pathname})
            // this.search = search
            // this.hash = hash
        },
        ChangeRoute({pathname}){

            this.pathnameString = pathname
        },
    }
})
