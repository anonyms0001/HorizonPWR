@testable import Jumpstart
import UIKit

class FakeApplication: Application {
    var isRegisteredForRemoteNotifications = false
    var applicationState = UIApplication.State.inactive

    private(set) var registerForRemoteNotificationsWasCalled = false

    func registerForRemoteNotifications() {
        registerForRemoteNotificationsWasCalled = true
    }
}
