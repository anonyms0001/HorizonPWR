@testable import Jumpstart
import XCTest

class PushNotificationsNotificationTests: XCTestCase {
    func test_init_validURL() {
        let notification = PushNotifications.Notification(userInfo: [
            "url": URL.example.absoluteString
        ])
        XCTAssertEqual(notification?.url, URL.example)
    }

    func test_init_invalidURL() {
        let notification = PushNotifications.Notification(userInfo: [
            "url": ""
        ])
        XCTAssertNil(notification)
    }

    func test_init_missingURL() {
        let notification = PushNotifications.Notification(userInfo: [:])
        XCTAssertNil(notification)
    }

    func test_init_animationMatchesTheApplicationActiveState() throws {
        let application = FakeApplication()

        application.applicationState = .active
        let notification1 = try XCTUnwrap(PushNotifications.Notification(application: application))
        XCTAssertTrue(notification1.isAnimated)

        application.applicationState = .inactive
        let notification2 = try XCTUnwrap(PushNotifications.Notification(application: application))
        XCTAssertFalse(notification2.isAnimated)
    }
}

private extension PushNotifications.Notification {
    init?(application: Application) {
        self.init(userInfo: [
            "url": URL.example.absoluteString
        ], application: application)
    }
}
