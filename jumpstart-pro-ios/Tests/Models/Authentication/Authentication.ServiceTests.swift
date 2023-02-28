import HTTP
@testable import Jumpstart
import WebKit
import XCTest

class AuthenticationServiceTests: XCTestCase {
    // MARK: signIn(email:password:completion:)

    override func setUp() {
        clearCookies()
    }

    override func tearDown() {
        clearCookies()
    }

    func test_signIn_setsTheUserAgent() throws {
        let requestLoader = FakeRequestLoader()
        HTTP.Global.requestLoader = requestLoader

        let service = Authentication.Service()
        service.signIn(email: "", password: "") { _ in }

        XCTAssertEqual(requestLoader.lastLoadedRequest?.allHTTPHeaderFields?["User-Agent"], UserAgent.default)
    }

    func test_signIn_encodesTheEmailAndPassword() throws {
        let requestLoader = FakeRequestLoader()
        HTTP.Global.requestLoader = requestLoader

        let service = Authentication.Service()
        service.signIn(email: "joe@masilotti.com", password: "password") { _ in }

        let body = try XCTUnwrap(requestLoader.lastLoadedRequest?.httpBody)
        let json = try XCTUnwrap(JSONSerialization.jsonObject(with: body, options: []) as? [String: String])
        XCTAssertEqual(json["email"], "joe@masilotti.com")
        XCTAssertEqual(json["password"], "password")
    }

    func test_signIn_success_passesAlongTheURL() throws {
        try stubRequestLoaderSuccess()
        let service = Authentication.Service()

        let expectation = self.expectation(description: "Wait for completion")
        service.signIn(email: "", password: "") { result in
            XCTAssertEqual(try? result.get(), Endpoint.root.appendingPathComponent("/path"))
            expectation.fulfill()
        }

        wait(for: [expectation], timeout: 1)
        XCTAssertEqual(SecureStorage.accessToken, "some-token")
    }

    func test_signIn_success_persistsTheAccessToken() throws {
        try stubRequestLoaderSuccess()
        let service = Authentication.Service()

        let expectation = self.expectation(description: "Wait for completion")
        service.signIn(email: "", password: "") { _ in
            expectation.fulfill()
        }

        wait(for: [expectation], timeout: 1)
        XCTAssertEqual(SecureStorage.accessToken, "some-token")
    }

    func test_signIn_success_persistsTheCookies() throws {
        try stubRequestLoaderSuccess()
        let service = Authentication.Service()

        let serviceExpectation = self.expectation(description: "Wait for completion")
        service.signIn(email: "", password: "") { _ in
            serviceExpectation.fulfill()
        }
        wait(for: [serviceExpectation], timeout: 1)

        var cookies = [HTTPCookie]()
        let cookieExpectation = self.expectation(description: "Wait for cookies")
        WKWebsiteDataStore.default().httpCookieStore.getAllCookies { allCookies in
            cookies = allCookies
            cookieExpectation.fulfill()
        }
        wait(for: [cookieExpectation], timeout: 1)

        let cookie = try XCTUnwrap(cookies.first(where: { $0.name == "session" }))
        XCTAssertEqual(cookie.name, "session")
        XCTAssertEqual(cookie.value, "some-cookie")
        XCTAssertEqual(HTTPCookieStorage.shared.cookies?.last?.name, "session")
        XCTAssertEqual(HTTPCookieStorage.shared.cookies?.last?.value, "some-cookie")
    }

    func test_signIn_failure() throws {
        try stubRequestLoaderFailure(error: "Error message")

        let service = Authentication.Service()
        let expectation = self.expectation(description: "Wait for completion")
        service.signIn(email: "", password: "") { result in
            let error = JumpstartHTTPError(error: "Error message")
            assertResultError(result, .invalidRequest(error))
            expectation.fulfill()
        }

        wait(for: [expectation], timeout: 1)
    }

    private func clearCookies() {
        let expectation = self.expectation(description: "Wait for cookies to be cleared")
        CookieJar().clearCookies {
            expectation.fulfill()
        }
        wait(for: [expectation], timeout: 1)
    }
}
