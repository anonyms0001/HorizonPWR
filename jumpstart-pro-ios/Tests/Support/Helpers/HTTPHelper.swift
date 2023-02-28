@testable import HTTP
@testable import Jumpstart
import XCTest

extension XCTestCase {
    func stubRequestLoaderFailure(error message: String) throws {
        let requestLoader = FakeRequestLoader()
        HTTP.Global.requestLoader = requestLoader

        let response = JumpstartHTTPError(error: message)
        requestLoader.nextData = try JSONEncoder().encode(response)

        let httpResponse = HTTPURLResponse(url: URL.example, statusCode: 500, httpVersion: nil, headerFields: [:])
        requestLoader.nextResponse = httpResponse
    }

    func stubRequestLoaderSuccess() throws {
        let requestLoader = FakeRequestLoader()
        HTTP.Global.requestLoader = requestLoader

        let response = Authentication.Response(token: "some-token", location: "/path")
        requestLoader.nextData = try JSONEncoder().encode(response)

        let httpResponse = HTTPURLResponse(url: URL.example, statusCode: 200, httpVersion: nil, headerFields: [
            "Set-Cookie": "session=some-cookie"
        ])
        requestLoader.nextResponse = httpResponse
    }
}
