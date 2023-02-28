import UIKit

extension PushNotifications {
    struct Notification {
        let url: URL
        let isAnimated: Bool

        init?(userInfo: [AnyHashable: Any], application: Application = UIApplication.shared) {
            guard
                let urlString = userInfo["url"] as? String,
                let url = URL(string: urlString)
            else { return nil }

            self.url = url
            self.isAnimated = application.applicationState == .active
        }
    }
}
