import Foundation
import HTTP

extension PushNotifications {
    struct RegistrationService {
        private let client = HTTP.Client<Empty, Empty>()
        private let userNotificationCenter = Configuration.shared.userNotificationCenter
        private let application = Configuration.shared.application

        func requestAuthorization(completion: (() -> Void)? = nil) {
            userNotificationCenter.requestAuthorization(options: [.alert, .sound, .badge]) { granted, _ in
                registerForRemoteNotifications(granted: granted, completion: completion)
            }
        }

        func rerequestAuthorization(completion: (() -> Void)? = nil) {
            if application.isRegisteredForRemoteNotifications {
                requestAuthorization(completion: completion)
            }
        }

        func registerToken(_ token: String) {
            let body = Body(token: token)
            let request = BodyRequest(url: Endpoint.API.notificationTokens, method: .post, body: body)

            client.request(request) { result in
                switch result {
                case .success:
                    UserDefaults.notificationToken = token
                case let .failure(error):
                    logger.error("Failed to register notification token: \(error)")
                }
            }
        }

        private func registerForRemoteNotifications(granted: Bool, completion: (() -> Void)?) {
            if granted {
                onMainThread {
                    application.registerForRemoteNotifications()
                    completion?()
                }
            } else {
                completion?()
            }
        }
    }
}
