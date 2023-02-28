import Foundation
@testable import Jumpstart

extension PushNotifications.Notification {
    static var google: Self {
        PushNotifications.Notification(userInfo: [
            "url": URL.google.absoluteString
        ])!
    }
}
