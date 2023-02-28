@testable import Jumpstart
import UserNotifications
import XCTest

class PushNotificationsHandlerTests: XCTestCase {
    func test_startMonitoring_isTheNotificationCentersDelegate() throws {
        let handler = PushNotifications.Handler(router: FakePushNotificationRouter())
        handler.start()
        XCTAssert(UNUserNotificationCenter.current().delegate === handler)
    }

    // MARK: UNUserNotificationCenterDelegate

    func test_didReceive_validURL_routesTheURL() throws {
        let router = FakePushNotificationRouter()
        let handler = PushNotifications.Handler(router: router)

        let userInfo = ["url": URL.example.absoluteString]
        handler.userNotificationCenter(UNUserNotificationCenter.current(), didReceive: userInfo) {}

        XCTAssertEqual(router.lastRoutedNotification?.url, URL.example)
    }

    func test_didReceive_validNotification_CallsTheCompletionHandler() throws {
        let handler = PushNotifications.Handler(router: FakePushNotificationRouter())

        var completionHandlerWasCalled = false
        let expectation = self.expectation(description: "Wait for completion handler to be called.")

        let userInfo = ["url": URL.example.absoluteString]
        handler.userNotificationCenter(UNUserNotificationCenter.current(), didReceive: userInfo) {
            completionHandlerWasCalled = true
            expectation.fulfill()
        }

        wait(for: [expectation], timeout: 1)
        XCTAssertTrue(completionHandlerWasCalled)
    }

    func test_didReceive_invalidNotification_CallsTheCompletionHandler() throws {
        let handler = PushNotifications.Handler(router: FakePushNotificationRouter())
        handler.start()

        var completionHandlerWasCalled = false
        let expectation = self.expectation(description: "Wait for completion handler to be called.")

        handler.userNotificationCenter(UNUserNotificationCenter.current(), didReceive: [:]) {
            completionHandlerWasCalled = true
            expectation.fulfill()
        }

        wait(for: [expectation], timeout: 1)
        XCTAssertTrue(completionHandlerWasCalled)
    }
}
