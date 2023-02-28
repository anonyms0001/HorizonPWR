import Foundation
@testable import Jumpstart

class FakeScriptMessageDelegate: ScriptMessageDelegate {
    private(set) var registerForPushNotificationsWasCalled = false
    private(set) var signOutWasCalled = false

    func registerForPushNotifications() {
        registerForPushNotificationsWasCalled = true
    }

    func signOut() {
        signOutWasCalled = true
    }
}
