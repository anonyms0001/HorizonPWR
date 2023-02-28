import Foundation

struct UserAgent {
    static let `default` = "Jumpstart iOS (Turbo Native) / \(versionNumber)"

    private static let versionNumber = Bundle.main.infoDictionary?["CFBundleShortVersionString"] as! String
}
