@testable import Jumpstart
import SwiftUI
import XCTest

class UpdatePasswordCoordinatorTests: XCTestCase {
    // MARK: start()

    func test_start_presentsAnUpdatePasswordView() throws {
        let navigationController = NavigationControllerSpy()
        let coordinator = UpdatePasswordCoordinator(navigationController: navigationController)

        coordinator.start()

        let cancellableNavigationController = try XCTUnwrap(navigationController.presentedViewController as? CancellableNavigationController)
        XCTAssertNotNil(cancellableNavigationController.viewControllers.last as? UIHostingController<UpdatePasswordView>)
    }

    func test_start_dismissesAnyPresentedViewController() throws {
        let navigationController = NavigationControllerSpy()
        navigationController.present(UIViewController(), animated: false)
        let coordinator = UpdatePasswordCoordinator(navigationController: navigationController)

        coordinator.start()

        XCTAssertTrue(navigationController.dismissWasCalled)
    }

    func test_start_whenTheViewModelFinishes_finishes() throws {
        let navigationController = NavigationControllerSpy()
        let coordinator = UpdatePasswordCoordinator(navigationController: navigationController)

        var didFinishWasCalled = false
        coordinator.didFinish = { _ in didFinishWasCalled = true }

        coordinator.start()

        let cancellableNavigationController = try XCTUnwrap(navigationController.presentedViewController as? CancellableNavigationController)
        let hostingController = try XCTUnwrap(cancellableNavigationController.viewControllers.last as? UIHostingController<UpdatePasswordView>)
        hostingController.rootView.viewModel.didFinish?()

        XCTAssertTrue(didFinishWasCalled)
    }
}
