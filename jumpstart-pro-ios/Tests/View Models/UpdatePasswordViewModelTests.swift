import Combine
@testable import HTTP
@testable import Jumpstart
import XCTest

class UpdatePasswordViewModelTests: XCTestCase {
    private var cancellables: Set<AnyCancellable>!

    override func setUp() {
        super.setUp()
        cancellables = []
    }

    // MARK: signIn()

    override class func tearDown() {
        HTTP.Global.resetToDefaults()
    }

    func test_updatePassword_PATCHesThePasswords() throws {
        let requestLoader = FakeRequestLoader()
        HTTP.Global.requestLoader = requestLoader

        let viewModel = UpdatePasswordViewModel()
        viewModel.currentPassword = "current"
        viewModel.newPassword = "new"
        viewModel.newPasswordConfirmation = "confirmation"
        viewModel.updatePassword()

        let request = try XCTUnwrap(requestLoader.lastLoadedRequest)
        XCTAssertEqual(request.url, Endpoint.API.passwords)
        XCTAssertEqual(request.httpMethod, "PATCH")

        let body = try XCTUnwrap(request.httpBody)
        let json = try XCTUnwrap(JSONSerialization.jsonObject(with: body, options: []) as? [String: [String: String]])
        XCTAssertEqual(json["user"]?["current_password"], "current")
        XCTAssertEqual(json["user"]?["password"], "new")
        XCTAssertEqual(json["user"]?["password_confirmation"], "confirmation")
    }

    func test_updatePassword_failure_setsTheError() throws {
        try stubRequestLoaderFailure(error: "Something bad happened.")
        let viewModel = UpdatePasswordViewModel()

        let expectation = self.expectation(description: "Wait for error")
        viewModel.$error.dropFirst().collect(2).sink { errors in
            XCTAssertEqual(errors.first, "Something bad happened.")
            XCTAssertNil(errors.last!)
            expectation.fulfill()
        }.store(in: &cancellables)

        viewModel.updatePassword(clearErrorAfter: 0.01)
        wait(for: [expectation], timeout: 1)
    }

    func test_updatePassword_success_finished() throws {
        try stubRequestLoaderSuccess()
        let viewModel = UpdatePasswordViewModel()
        let expectation = self.expectation(description: "Wait for service callback")

        var didFinishWasCalled = false
        viewModel.didFinish = {
            didFinishWasCalled = true
            expectation.fulfill()
        }

        viewModel.updatePassword()

        wait(for: [expectation], timeout: 1)
        XCTAssertTrue(didFinishWasCalled)
    }
}
