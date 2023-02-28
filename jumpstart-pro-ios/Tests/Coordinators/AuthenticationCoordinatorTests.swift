@testable import Jumpstart
import SwiftUI
import WebKit
import XCTest

class AuthenticationCoordinatorTests: XCTestCase {
    // MARK: start()

    func test_start_presentsATheNewSessionView() throws {
        let navigationController = NavigationControllerSpy()
        let coordinator = AuthenticationCoordinator(navigationController: navigationController)

        coordinator.start()

        let cancellableNavigationController = try XCTUnwrap(navigationController.presentedViewController as? CancellableNavigationController)
        XCTAssertNotNil(cancellableNavigationController.viewControllers.last as? UIHostingController<NewSessionView>)
    }

    func test_start_replacesThePresentedControllerIfAlreadyPresented() throws {
        let navigationController = NavigationControllerSpy()
        let cancellableNavigationController = CancellableNavigationController(rootViewController: UIViewController()) {}
        navigationController.present(cancellableNavigationController, animated: false)

        let coordinator = AuthenticationCoordinator(navigationController: navigationController)
        coordinator.start()

        XCTAssertEqual(cancellableNavigationController.viewControllers.count, 1)
        XCTAssertNotNil(cancellableNavigationController.viewControllers.last as? UIHostingController<NewSessionView>)
    }

    func test_start_dismissesAndFinishesWhenTheExistingCancellableHandles() throws {
        let navigationController = NavigationControllerSpy()
        let cancellableNavigationController = CancellableNavigationController(rootViewController: UIViewController()) {}
        navigationController.present(cancellableNavigationController, animated: false)
        let coordinator = AuthenticationCoordinator(navigationController: navigationController)

        var didFinishWasCalled = false
        coordinator.didFinish = { _ in didFinishWasCalled = true }

        coordinator.start()

        let cancelButon = try XCTUnwrap(cancellableNavigationController.visibleViewController?.navigationItem.leftBarButtonItem)
        _ = cancelButon.target?.perform(cancelButon.action)

        XCTAssertNil(navigationController.presentedViewController)
        XCTAssertTrue(didFinishWasCalled)
    }

    func test_start_whenTheViewModelFinishes_authenticatesAndFinishes() throws {
        let navigationController = NavigationControllerSpy()
        let coordinator = AuthenticationCoordinator(navigationController: navigationController)

        var lastAuthenticatedURL: URL?
        coordinator.didAuthenticate = { url in lastAuthenticatedURL = url }

        var didFinishWasCalled = false
        coordinator.didFinish = { _ in didFinishWasCalled = true }

        coordinator.start()

        let cancellableNavigationController = try XCTUnwrap(navigationController.presentedViewController as? CancellableNavigationController)
        let hostingController = try XCTUnwrap(cancellableNavigationController.viewControllers.last as? UIHostingController<NewSessionView>)
        hostingController.rootView.viewModel.didFinish?(URL.example)

        XCTAssertEqual(lastAuthenticatedURL, URL.example)
        XCTAssertTrue(didFinishWasCalled)
    }
}
