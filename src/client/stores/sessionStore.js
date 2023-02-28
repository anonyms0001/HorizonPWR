import { store, emit } from '../framework'
import requester from '../requester'

export default store({

    isActive  : null,
    user      : null,
    isNewUser : null,
    loadingState:  false,

    eventListeners: {
           async ClickedSignUp({ signUpEmail }) {
            const tryRegister = await requester.post('/api/register', {signUpEmail})

            if(tryRegister){
                alert("You Are Registered Now")
                await emit.ClickedLogin({email: signUpEmail, password: "password"})
            }

        },
        async ClickedLogin({email, password}) {
            const {isActive, entities} = await requester.post('/api/login', {email, password})
            if (isActive ) {
                emit.LoginConfirmed({entities})
            } else if(isActive === null && entities){
                alert("Incorrect Password! Please Try Again")
                emit.LoginDenied()
                emit.StopLoadingState()
            } else {
                alert("Retype email or register by clicking the link bellow ")
                // console.log("else within ClickedLogin ")
                emit.LoginDenied()
                emit.StopLoadingState()
                // this.loadingState = false
            }
        },
        LoginDenied() {
            this.isActive = false
            emit.StopLoadingState()
        },
        LoginConfirmed({ entities }) {
            this.isActive = true
            const { user, isNewUser } = entities
            if(user.userId === 308){
                // console.log("SESSION STORE ", user.accountId)
                user.accountId = '0013m000029RgdeAAC';
            }
            this.user = user
            this.isNewUser = isNewUser
            //emit.IsNewUser({ userId: this.user.userId })
        },
        PasswordChanged() {
            this.isNewUser = false
            alert("Password was successfully updated")
        },
        async ClickedLogout() {
            await requester.post('/api/logout')
            window.location.reload(true) // remove cookies
        },
        async Initialized() {
            const { isActive, entities } = await requester.get('/api/sessionStatus')
            if (isActive) {
                emit.LoginConfirmed({ entities })
            }
            else {
                emit.LoginDenied()
            }
        },
        DetectedServerError({ errorName, errorMessage, errorStack }) {
            console.log({ errorName, errorMessage, errorStack })
            alert(`Error detected: ${errorName}: ${errorMessage}`)
        },
        ReceivedIsNewUser({ isNewUser }) {
            this.isNewUser = isNewUser
        },
        StartLoadingState(){
            this.loadingState = true
        },
        StopLoadingState(){
            this.loadingState = false
        }
    }
})
