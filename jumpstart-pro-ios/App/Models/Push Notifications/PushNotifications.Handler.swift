import UIKit

protocol PushNotificationRouter: AnyObject {
    func routeNotification(_ notification: PushNotifications.Notification)
}

extension PushNotifications {
    class Handler: NSObject {
        private weak var router: PushNotificationRouter?

        init(router: PushNotificationRouter) {
            self.router = router
        }

        func start() {
            UNUserNotificationCenter.current().delegate = self
        }
    }
}

extension PushNotifications.Handler: UNUserNotificationCenterDelegate {
    func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification, withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Swift.Void) {
        completionHandler(.banner)
    }

    func userNotificationCenter(_ center: UNUserNotificationCenter, didReceive response: UNNotificationResponse, withCompletionHandler completionHandler: @escaping () -> Void) {
        userNotificationCenter(center, didReceive: response.notification.request.content.userInfo, withCompletionHandler: completionHandler)
    }

    func userNotificationCenter(_ center: UNUserNotificationCenter, didReceive userInfo: [AnyHashable: Any], withCompletionHandler completionHandler: @escaping () -> Void) {
        if let notification = PushNotifications.Notification(userInfo: userInfo) {
            router?.routeNotification(notification)
        }

        completionHandler()
    }
}
