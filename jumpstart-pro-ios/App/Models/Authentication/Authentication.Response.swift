extension Authentication {
    struct Response: Codable {
        let token: String
        let location: String
    }
}
