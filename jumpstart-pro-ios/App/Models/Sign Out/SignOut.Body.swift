extension SignOut {
    struct Body: Encodable {
        let notificationToken: String?
    }

    enum CodingKeys: String, CodingKey {
        case notificationToken = "notification_token"
    }
}
