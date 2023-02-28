extension Authentication {
    struct Body: Encodable {
        let email: String
        let password: String
    }
}
