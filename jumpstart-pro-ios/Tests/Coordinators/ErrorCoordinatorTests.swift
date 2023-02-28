@testable import Jumpstart
import SwiftUI
import Turbo
import XCTest

class ErrorCoordinatorTests: XCTestCase {
    // MARK: start()

    func test_start_addsAnErrorViewToTheVisibleViewController() throws {
        let viewController = UIViewController()
        let navigationController = NavigationControllerSpy(rootViewController: viewController)
        let coordinator = ErrorCoordinator(error: TestError(), navigationController: navigationController)

        coordinator.start()

        let hostingController = try XCTUnwrap(viewController.children.first as? UIHostingController<ErrorView>)
        XCTAssert(viewController.view.subviews.first === hostingController.view)
    }

    func test_start_convertsTheErrorToAnApplicationSpecificOne() throws {
        let viewController = UIViewController()
        let navigationController = NavigationControllerSpy(rootViewController: viewController)
        let coordinator = ErrorCoordinator(error: TurboError.timeoutFailure, navigationController: navigationController)

        coordinator.start()

        let hostingController = try XCTUnwrap(viewController.children.first as? UIHostingController<ErrorView>)
        XCTAssertEqual(hostingController.rootView.error.errorDescription, "TimeoutFailureError".localized)
    }

    func test_start_retrying_removesTheViewFinishesAndCallsTheCallback() throws {
        let viewController = UIViewController()
        let navigationController = NavigationControllerSpy(rootViewController: viewController)
        let coordinator = ErrorCoordinator(error: TestError(), navigationController: navigationController)

        coordinator.start()

        var didRetryWasCalled = false
        coordinator.didRetry = { didRetryWasCalled = true }

        var didFinishWasCalled = false
        coordinator.didFinish = { _ in didFinishWasCalled = true }

        let hostingController = try XCTUnwrap(viewController.children.first as? UIHostingController<ErrorView>)
        hostingController.rootView.retry()

        XCTAssertTrue(viewController.children.isEmpty)
        XCTAssertEqual(viewController.view.subviews.count, 0)
        XCTAssertTrue(didRetryWasCalled)
        XCTAssertTrue(didFinishWasCalled)
    }
}
