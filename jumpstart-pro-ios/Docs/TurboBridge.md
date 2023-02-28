# Turbo Bridge

The Turbo Bridge is one of the most important pieces for making a Hybrid app possible with Turbo Native.

It uses the `postMessage` Javascript function to send messages from the WebView to the Native app. Similarly, the Native app can inject Javascript to execute in the WebView to go from Native to Javascript.

### window.TurboNativeBridge

The Turbo Native Bridge is an object we define in our Javascript on the window so it is accessible to anyone interacting with the browser. 

We register it as `window.TurboNativeBridge` so both Javascript and Native code can access this.

This provides a standardized object to define actions that our Hybrid app can use in either direction from iOS to Javascript or vice versa.

### Javascript to iOS Interaction

The iOS app registers itself as a message handler that we can access in Javascript using `window.webkit.messageHandlers.nativeApp`

We can use `postMessage` on this object to send a message to the Native app. To learn more, check out the [`postMessage` docs on  MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage).

For example, we can send a message to iOS using `window.TurboNativeBridge.postMessage("signOut")`

The iOS app is then responsible for listening to this and triggering the sign out code. The SessionCoordinator's ScriptMessageDelegate is responsible for implementing functions for handling these messages. 

```swift
extension SessionCoordinator: ScriptMessageDelegate {
    func registerForPushNotifications() {
    }

    func signOut() {
    }
}

#### iOS to Javascript Interaction

Sending a message from iOS to Javascript is straightforward. We simply inject Javascript into the WebView to be executed.

Our hamburger menu button executes Javascript when tapped. That is wired up using the following:

​```swift
@objc private func toggleNavBar() {
    let script = "window.TurboNativeBridge.toggleNavBar();"
    session.webView.evaluateJavaScript(script, completionHandler: nil)
}
```

We simply define the Javascript we want to execute and then evaluate it on the WebView object.

To standardize interactions, we register methods on the `TurboNativeBridge` Javascript object. This organizes the logic for various actions that we want the Native app to be able to trigger.