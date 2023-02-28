import Foundation

extension UserDefaults {
    static var notificationToken: String? {
        get { UserDefaults.standard.string(forKey: notificationTokenKey) }
        set { UserDefaults.standard.setValue(newValue, forKey: notificationTokenKey) }
    }

    private static var notificationTokenKey = Constants.UserDefaults.notificationTokenKey.rawValue
}
