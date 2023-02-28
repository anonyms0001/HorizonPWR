@testable import Jumpstart
import UserNotifications

class FakeUserNotificationCenter: UserNotificationCenter {
    var nextGranted = false

    private(set) var lastRequestedAuthorizationOptions: UNAuthorizationOptions?

    func requestAuthorization(options: UNAuthorizationOptions, completionHandler: @escaping (Bool, Error?) -> Void) {
        self.lastRequestedAuthorizationOptions = options
        completionHandler(nextGranted, nil)
    }
}
