import HTTP
@testable import Jumpstart
import XCTest

class ClientTests: XCTestCase {
    // MARK: request(_:completion:)

    func test_request_performsTheRequestViaHTTPClient() {
        let requestLoader = FakeRequestLoader()
        HTTP.Global.requestLoader = requestLoader
        let client = Jumpstart.Client<EmptyResponse, JumpstartHTTPError>()
        let request = Request(url: Endpoint.root)

        client.request(request) { _ in }

        XCTAssertEqual(requestLoader.lastLoadedRequest?.url, Endpoint.root)
    }

    func test_request_persistsTheCookies() throws {
        let requestLoader = FakeRequestLoader()
        HTTP.Global.requestLoader = requestLoader
        requestLoader.nextResponse = HTTPURLResponse(
            url: Endpoint.root,
            statusCode: 200,
            httpVersion: nil,
            headerFields: ["Set-Cookie": "name=value;"]
        )
        requestLoader.nextData = try? JSONEncoder().encode(EmptyResponse())

        let cookieJar = FakeCookieContainer()
        let client = Jumpstart.Client<EmptyResponse, JumpstartHTTPError>(cookieJar: cookieJar)
        let request = Request(url: Endpoint.root)

        client.request(request) { _ in }

        XCTAssertEqual(cookieJar.lastSetCookies?.count, 1)
        XCTAssertEqual(cookieJar.lastSetCookies?.last?.name, "name")
        XCTAssertEqual(cookieJar.lastSetCookies?.last?.value, "value")
    }

    func test_request_passesAlongAnError() throws {
        try stubRequestLoaderFailure(error: "Error message")

        let client = Jumpstart.Client<EmptyResponse, JumpstartHTTPError>()
        let request = Request(url: Endpoint.root)

        client.request(request) { result in
            let error = JumpstartHTTPError(error: "Error message")
            assertResultError(result, .invalidRequest(error))
        }
    }
}

private struct EmptyResponse: Codable {}
