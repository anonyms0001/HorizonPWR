import Combine
@testable import HTTP
@testable import Jumpstart
import XCTest

class NewSessionViewModelTests: XCTestCase {
    private var cancellables: Set<AnyCancellable>!

    override func setUp() {
        super.setUp()
        cancellables = []
    }

    // MARK: signIn()

    override class func tearDown() {
        HTTP.Global.resetToDefaults()
    }

    func test_signIn_POSTSTheCredentials() throws {
        let requestLoader = FakeRequestLoader()
        HTTP.Global.requestLoader = requestLoader

        let cookieJar = FakeCookieContainer()
        let viewModel = NewSessionViewModel(cookieJar: cookieJar)
        viewModel.email = "joe@masilotti.com"
        viewModel.password = "password"
        viewModel.signIn()

        let request = try XCTUnwrap(requestLoader.lastLoadedRequest)
        XCTAssertEqual(request.url, Endpoint.API.auth)
        XCTAssertEqual(request.httpMethod, "POST")

        let body = try XCTUnwrap(request.httpBody)
        let json = try XCTUnwrap(JSONSerialization.jsonObject(with: body, options: []) as? [String: String])
        XCTAssertEqual(json["email"], "joe@masilotti.com")
        XCTAssertEqual(json["password"], "password")
    }

    func test_signIn_copiesCookiesFromWebViewToHTTPStorage() throws {
        let cookieJar = FakeCookieContainer()
        let viewModel = NewSessionViewModel(cookieJar: cookieJar)

        viewModel.signIn()

        XCTAssertTrue(cookieJar.copyCookiesFromWebViewStorageToHTTPStorageWasCalled)
    }

    func test_signIn_failure_setsTheError() throws {
        try stubRequestLoaderFailure(error: "Something bad happened.")
        let viewModel = NewSessionViewModel()

        let expectation = self.expectation(description: "Wait for error")
        viewModel.$error.dropFirst().collect(2).sink { errors in
            XCTAssertEqual(errors.first, "Something bad happened.")
            XCTAssertNil(errors.last!)
            expectation.fulfill()
        }.store(in: &cancellables)

        viewModel.signIn(clearErrorAfter: 0.01)
        wait(for: [expectation], timeout: 0.02)
    }

    func test_signIn_success_passesAlongTheURL() throws {
        try stubRequestLoaderSuccess()
        let viewModel = NewSessionViewModel()
        let expectation = self.expectation(description: "Wait for service callback")

        var didFinishURL: URL?
        viewModel.didFinish = { url in
            didFinishURL = url
            expectation.fulfill()
        }

        viewModel.signIn()

        wait(for: [expectation], timeout: 1)
        XCTAssertEqual(didFinishURL, Endpoint.root.appendingPathComponent("/path"))
    }

    func test_signIn_disablesThenReenablesTheFormOnSuccess() throws {
        try stubRequestLoaderSuccess()
        let viewModel = NewSessionViewModel()
        let expectation = self.expectation(description: "Wait for service callback")
        viewModel.didFinish = { _ in expectation.fulfill() }

        viewModel.signIn()
        XCTAssertTrue(viewModel.isSigningIn)

        wait(for: [expectation], timeout: 1)
        XCTAssertFalse(viewModel.isSigningIn)
    }

    func test_signIn_disablesThenReenablesTheFormOnFailure() throws {
        try stubRequestLoaderFailure(error: "Some error")
        let viewModel = NewSessionViewModel()

        let expectation = self.expectation(description: "Wait for error")
        viewModel.$error.dropFirst().sink { _ in
            expectation.fulfill()
        }.store(in: &cancellables)

        viewModel.signIn()
        XCTAssertTrue(viewModel.isSigningIn)

        wait(for: [expectation], timeout: 1)
        XCTAssertFalse(viewModel.isSigningIn)
    }
}
