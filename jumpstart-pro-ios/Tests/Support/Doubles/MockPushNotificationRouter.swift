import Foundation
@testable import Jumpstart

class FakePushNotificationRouter: PushNotificationRouter {
    private(set) var lastRoutedNotification: PushNotifications.Notification?

    func routeNotification(_ notification: PushNotifications.Notification) {
        self.lastRoutedNotification = notification
    }
}
