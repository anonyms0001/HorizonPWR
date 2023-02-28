extension PushNotifications {
    struct Body: Encodable {
        let token: String
        let platform = "iOS"
    }
}
