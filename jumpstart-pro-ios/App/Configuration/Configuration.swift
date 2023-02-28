import UIKit
import UserNotifications

class Configuration {
    static let shared = Configuration()

    lazy var userNotificationCenter: UserNotificationCenter = UNUserNotificationCenter.current()
    lazy var application: Application = UIApplication.shared

    private init() {}
}
