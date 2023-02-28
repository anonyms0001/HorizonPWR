import { emit } from '../framework'
import Link from '../components/link'

export default function SignUp() {

    return (

        <section id="login" className="page-background" >
            <div className="darkform">
                <div className="logo-login">
                    <h1>Welcome to</h1>
                    <img src="/assets/images/logo-horizon.png" alt="Horizon PWR" />
                    <h3>PWRStation</h3>
                </div>                
                <h4 className="login-title">REGISTER HERE</h4>
                <form id="loginform" className="login" method="post" onSubmit={e => {
                    e.preventDefault()
                    emit.ClickedSignUp({
                        signUpEmail: document.getElementById('signUpEmail').value,
                        // password: document.getElementById('loginPassword').value,
                    })
                }}>
                    <p id="error"></p>
                    <input id="signUpEmail" type="email" name="email" placeholder="Enter HorizonPWR Email Address" required />
                    {/*<input id="loginPassword" type="password" name="pass" placeholder="Enter Password" required />*/}
                    <button type="submit">VALIDATE EMAIL</button>
                    
                    {/* TODO */}
                    {/* <div>
                        <label className="remember-me">
                            <input type="checkbox" name="remember" checked={true} />
                            &nbsp;Remember Me
                        </label>
                    </div> */}
                </form>

                <Link className="forgot-password" to="/login">Already Registered? Log In</Link>

                <p className="quote">“He who is not courageous enough to take the risk will accomplish nothing in life”</p>
                <p>-Muhammad Ali</p>
            </div>
        </section>
    )
}

// TODO
/*
$(document).ready(function(){
    $("#loginform").submit(function(e){                    
        e.preventDefault();
        var remember = false;
        if($("input[name=remember]").prop("checked")==true) {
            remember = true;
        }                    
        $("button[type=submit]").append('<img id="spinner" src="/assets/images/spinner.gif" style="height: 25px;margin: -5px 0 0 6px;">');
        $.post("/api/login",{"email":$("input[name=email]").val(),"pass":$("input[name=pass]").val(),"remember":remember},function(data){
            $("#spinner").remove();
            var result = JSON.parse(data);
            if(result.success) {
                window.location="/";
            } else {
                $("#error").text(result.message).slideDown();
            }
        })
    });

    $("input").on("click change",function(){
        $("#error").slideUp();
    });
})
*/
