# Authentication

Jumpstart Pro iOS comes with authentication fully integrated to Jumpstart Pro Rails out of the box.

### How Sign In Works

When a user hits `/users/sign_in` or receives an Unauthorized response, the iOS app will push the AuthenticationCoordinator.

This displays the NewSessionView and the user can submit their email and password to authenticate.

The iOS app will make an API request to `/api/v1/auth` with the email and password.

On authentication failure, a JSON response with an error will be returned to the iOS app and displayed.

On successful authentication, the API will return a special response. It does two things that are unique for the Turbo Native apps:

1. It signs the user in and sets the session cookie
2. It also returns a JSON response with an API token for the iOS app

The iOS app will take the cookies and add them to the WebView to authenticate the user inside. It will also save the API token to use for any iOS client side API requests in native code. This dual authentication allows us to authenticate the user in both places to make sure the hybrid app is fully authenticated.

### How Logout Works

Similar to Sign In, we need to log the user out both in the WebView and remove the API token from the iOS app. 

To do this, we register a Stimulus controller on the Sign Out link in the navbar. This Stimulus controller intercepts the link click and sends a message from the WebView to the native app.

```javascript
window.TurboNativeBridge.postMessage("signOut")
```

The native app receives this message and triggers the Sign Out using the ScriptMessageDelegate. 

The SignOut.Service then makes an API request to the API which includes the Notification Token. The API destroys the NotificationToken for the device to unregister it for push notifications, signs out the user (removing the session cookie) and returns a successful response.

The iOS app will then clear the cookies for the WebView, remove the access token and notification token, and refresh the page.