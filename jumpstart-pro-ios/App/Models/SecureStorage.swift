import Foundation
import KeychainAccess

class SecureStorage {
    static var accessToken: String? {
        get { keychain[accessTokenKey] }
        set { keychain[accessTokenKey] = newValue }
    }

    static func clearAccessToken() {
        accessToken = nil
    }

    private static var keychain = Keychain(service: "\(Bundle.main.bundleIdentifier!).keychain")
    private static let accessTokenKey = Constants.UserDefaults.accessTokenKey.rawValue
}
