import WebKit

protocol ScriptMessageDelegate: class {
    func registerForPushNotifications()
    func signOut()
}

class ScriptMessageHandler: NSObject, WKScriptMessageHandler {
    private weak var delegate: ScriptMessageDelegate?

    init(delegate: ScriptMessageDelegate) {
        self.delegate = delegate
    }

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        guard
            let body = message.body as? [String: Any],
            let message = ScriptMessage(body: body)
        else { return }

        routeMessage(message)
    }

    private func routeMessage(_ message: ScriptMessage) {
        switch message {
        case .registerForPushNotifications:
            delegate?.registerForPushNotifications()
        case .signOut:
            delegate?.signOut()
        }
    }
}
