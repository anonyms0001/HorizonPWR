import Foundation
import HTTP
@testable import Jumpstart
import XCTest

class PushNotificationsRegistrationServiceTests: XCTestCase {
    private var notificationTokenKey = Constants.UserDefaults.notificationTokenKey.rawValue

    override func setUp() {
        UserDefaults.standard.removeObject(forKey: notificationTokenKey)
    }

    override func tearDown() {
        UserDefaults.standard.removeObject(forKey: notificationTokenKey)
    }

    // MARK: requestAuthorization(_:)

    func test_requestAuthorization_requestsAlertSoundAndBadgeNotifications() {
        let userNotificationCenter = FakeUserNotificationCenter()
        Configuration.shared.userNotificationCenter = userNotificationCenter

        let service = PushNotifications.RegistrationService()
        service.requestAuthorization {}

        XCTAssertEqual(userNotificationCenter.lastRequestedAuthorizationOptions, [.alert, .sound, .badge])
    }

    func test_requestAuthorization_registersForRemoteNotifications_whenGranted() {
        let userNotificationCenter = FakeUserNotificationCenter()
        Configuration.shared.userNotificationCenter = userNotificationCenter

        let application = FakeApplication()
        Configuration.shared.application = application

        let service = PushNotifications.RegistrationService()
        userNotificationCenter.nextGranted = true

        let expectation = self.expectation(description: "Wait for authorization to finish")
        service.requestAuthorization {
            expectation.fulfill()
        }

        wait(for: [expectation], timeout: 1)
        XCTAssertTrue(application.registerForRemoteNotificationsWasCalled)
    }

    func test_requestAuthorization_doesNotRegisterForRemoteNotifications_otherwise() {
        let userNotificationCenter = FakeUserNotificationCenter()
        Configuration.shared.userNotificationCenter = userNotificationCenter

        let application = FakeApplication()
        Configuration.shared.application = application

        let service = PushNotifications.RegistrationService()
        userNotificationCenter.nextGranted = false

        let expectation = self.expectation(description: "Wait for authorization to finish")
        service.requestAuthorization {
            expectation.fulfill()
        }

        wait(for: [expectation], timeout: 1)
        XCTAssertFalse(application.registerForRemoteNotificationsWasCalled)
    }

    // MARK: rerequestAuthorization(_:)

    func test_rerequestAuthorization_whenAlreadyAuthorized_requestsAuthorization() {
        let userNotificationCenter = FakeUserNotificationCenter()
        Configuration.shared.userNotificationCenter = userNotificationCenter

        let application = FakeApplication()
        application.isRegisteredForRemoteNotifications = true
        Configuration.shared.application = application

        let service = PushNotifications.RegistrationService()
        service.rerequestAuthorization {}

        XCTAssertEqual(userNotificationCenter.lastRequestedAuthorizationOptions, [.alert, .sound, .badge])
    }

    func test_rerequestAuthorization_whenNotYetAuthorized_doesNotrequestAuthorization() {
        let userNotificationCenter = FakeUserNotificationCenter()
        Configuration.shared.userNotificationCenter = userNotificationCenter

        let application = FakeApplication()
        application.isRegisteredForRemoteNotifications = false
        Configuration.shared.application = application

        let service = PushNotifications.RegistrationService()
        service.rerequestAuthorization {}

        XCTAssertNil(userNotificationCenter.lastRequestedAuthorizationOptions)
    }

    // MARK: registerToken(_:)

    func test_registerToken_POSTsTheTokenToThePushNotificationEndpoint() throws {
        let requestLoader = FakeRequestLoader()
        HTTP.Global.requestLoader = requestLoader

        let service = PushNotifications.RegistrationService()
        service.registerToken("abc123")

        let request = try XCTUnwrap(requestLoader.lastLoadedRequest)
        XCTAssertEqual(request.httpMethod, "POST")
        XCTAssertEqual(request.url, Endpoint.API.notificationTokens)

        let expectedBody = try? XCTUnwrap(JSONEncoder().encode(PushNotifications.Body(token: "abc123")))
        XCTAssertEqual(request.httpBody, expectedBody)
    }

    func test_registerToken_success_persistsTheToken() throws {
        try stubRequestLoaderSuccess()

        let service = PushNotifications.RegistrationService()
        service.registerToken("abc123")

        XCTAssertEqual(UserDefaults.standard.string(forKey: notificationTokenKey), "abc123")
    }

    func test_registerToken_failure_doesNotPersistTheToken() throws {
        try stubRequestLoaderFailure(error: "Some error!")

        let service = PushNotifications.RegistrationService()
        service.registerToken("abc123")

        XCTAssertNil(UserDefaults.standard.string(forKey: notificationTokenKey))
    }
}
