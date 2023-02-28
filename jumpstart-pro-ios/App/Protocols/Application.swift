import UIKit

protocol Application {
    var applicationState: UIApplication.State { get }
    var isRegisteredForRemoteNotifications: Bool { get }

    func registerForRemoteNotifications()
}

extension UIApplication: Application {}
