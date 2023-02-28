import HTTP
@testable import Jumpstart
import XCTest

class SignOutServiceTests: XCTestCase {
    // MARK: signOut(:)

    func test_signOut_DELETESToTheAuthEndpoint() throws {
        let requestLoader = FakeRequestLoader()
        HTTP.Global.requestLoader = requestLoader

        let service = SignOut.Service()
        service.signOut { _ in }

        let request = try XCTUnwrap(requestLoader.lastLoadedRequest)
        XCTAssertEqual(request.httpMethod, "DELETE")
        XCTAssertEqual(request.url, Endpoint.API.auth)
    }

    func test_signOut_setsTheUserAgentAndAuthTokenHeader() throws {
        let requestLoader = FakeRequestLoader()
        HTTP.Global.requestLoader = requestLoader
        SecureStorage.accessToken = "access-token"

        let service = SignOut.Service()
        service.signOut { _ in }

        let request = try XCTUnwrap(requestLoader.lastLoadedRequest)
        XCTAssertEqual(request.value(forHTTPHeaderField: "User-Agent"), UserAgent.default)
        XCTAssertEqual(request.value(forHTTPHeaderField: "Authorization"), "Bearer access-token")
    }

    func test_signOut_encodesTheNotificationToken() throws {
        let requestLoader = FakeRequestLoader()
        HTTP.Global.requestLoader = requestLoader
        UserDefaults.notificationToken = "notification-token"

        let service = SignOut.Service()
        service.signOut { _ in }

        let body = try XCTUnwrap(requestLoader.lastLoadedRequest?.httpBody)
        let json = try XCTUnwrap(JSONSerialization.jsonObject(with: body, options: []) as? [String: String])
        XCTAssertEqual(json["notification_token"], "notification-token")
    }

    func test_signOut_success_clearsTheNotificationTokenAccessTokenAndCookies() throws {
        let requestLoader = FakeRequestLoader()
        HTTP.Global.requestLoader = requestLoader

        let cookieJar = FakeCookieContainer()

        UserDefaults.notificationToken = "notification-token"
        SecureStorage.accessToken = "access-token"

        try stubRequestLoaderSuccess()
        let service = SignOut.Service(cookieJar: cookieJar)
        service.signOut { _ in }

        XCTAssertNil(UserDefaults.notificationToken)
        XCTAssertNil(SecureStorage.accessToken)
        XCTAssertTrue(cookieJar.clearCookiesWasCalled)
    }

    func test_signOut_success_callsTheResultWithSuccessTrue() throws {
        let cookieJar = FakeCookieContainer()
        try stubRequestLoaderSuccess()

        let service = SignOut.Service(cookieJar: cookieJar)
        service.signOut { result in
            switch result {
            case .success(let value): XCTAssertTrue(value)
            case .failure: XCTFail()
            }
        }
    }

    func test_signOut_failure_passesAlongTheFailureError() throws {
        let requestLoader = FakeRequestLoader()
        HTTP.Global.requestLoader = requestLoader

        let httpResponse = HTTPURLResponse(url: URL.example, statusCode: 500, httpVersion: nil, headerFields: [:])
        requestLoader.nextResponse = httpResponse

        let service = SignOut.Service()
        service.signOut { result in
            assertResultError(result, .invalidResponse(500))
        }
    }
}
