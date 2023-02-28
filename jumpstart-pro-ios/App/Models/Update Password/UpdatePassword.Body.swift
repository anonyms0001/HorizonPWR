enum UpdatePassword {}

extension UpdatePassword {
    struct Body: Codable {
        let user: User

        struct User: Codable {
            let currentPassword: String
            let password: String
            let passwordConfirmation: String
        }
    }
}
