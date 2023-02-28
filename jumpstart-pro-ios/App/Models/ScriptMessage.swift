enum ScriptMessage {
    case registerForPushNotifications
    case signOut

    init?(body: [String: Any]) {
        switch body["name"] as? String {
        case "registerForPushNotifications":
            self = .registerForPushNotifications
        case "signOut":
            self = .signOut

        default:
            return nil
        }
    }
}
