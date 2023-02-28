import Foundation

enum Endpoint {
    static let root = URL(string: "http://localhost:5000")!

    enum Turbo {
        static let pathConfiguration = basePath.appendingPathComponent("/path_configuration.json")

        private static let basePath = root.appendingPathComponent("/turbo")
    }

    enum API {
        static let auth = base.appendingPathComponent("/auth")
        static let passwords = base.appendingPathComponent("/password")
        static let notificationTokens = base.appendingPathComponent("/notification_tokens")

        private static let base = root.appendingPathComponent("/api/v1")
    }
}
