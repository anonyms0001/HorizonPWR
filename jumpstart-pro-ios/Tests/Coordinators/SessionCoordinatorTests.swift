import HTTP
@testable import Jumpstart
import Turbo
import WebKit
import XCTest

class SessionCoordinatorTests: XCTestCase {
    // MARK: start()

    func test_start_dismissesAPresentedViewController() {
        let navigationController = NavigationControllerSpy()
        navigationController.present(UIViewController(), animated: false)
        let coordinator = SessionCoordinator(navigationController: navigationController)

        coordinator.start()

        XCTAssertNil(navigationController.presentedViewController)
    }

    func test_start_pushesAVisitable() throws {
        let navigationController = NavigationControllerSpy()
        let coordinator = SessionCoordinator(navigationController: navigationController)

        coordinator.start()

        XCTAssertEqual(navigationController.pushedViewControllers.count, 1)
        let visitableViewController = try XCTUnwrap(navigationController.pushedViewControllers.last as? Jumpstart.VisitableViewController)
        XCTAssertEqual(visitableViewController.visitableURL, URL.example)
    }

    func test_start_visitsTheVisitable() {
        let coordinator = SessionCoordinator()

        coordinator.start()

        XCTAssertEqual(coordinator.session.webView.url, URL.example.appendingTrailingSlash())
    }

    func test_start_ifAlreadyStarted_doesntPushNorVisit() {
        let navigationController = NavigationControllerSpy()
        let coordinator = SessionCoordinator(navigationController: navigationController)

        coordinator.start()
        let controller = navigationController.pushedViewControllers.last

        coordinator.start()
        XCTAssert(navigationController.viewControllers.last === controller)
    }

    func test_start_addsAMenuButton() throws {
        let navigationController = NavigationControllerSpy()
        let coordinator = SessionCoordinator(navigationController: navigationController)

        coordinator.start()

        let controller = try XCTUnwrap(navigationController.pushedViewControllers.last)
        XCTAssertNotNil(controller.navigationItem.leftBarButtonItem)
    }

    func test_start_doesNotAddAMenuButtonWhenNotAskedTo() throws {
        let navigationController = NavigationControllerSpy()
        let coordinator = SessionCoordinator(showMenuButton: false, navigationController: navigationController)

        coordinator.start()

        let controller = try XCTUnwrap(navigationController.pushedViewControllers.last)
        XCTAssertNil(controller.navigationItem.leftBarButtonItem)
    }

    func test_start_tappingTheMenuButton_togglesTheNavBar() throws {
        let navigationController = NavigationControllerSpy()
        let webView = WebViewSpy()
        let session = Session(webView: webView)
        let coordinator = SessionCoordinator(navigationController: navigationController)

        coordinator.session = session
        coordinator.start()

        let controller = try XCTUnwrap(navigationController.pushedViewControllers.last)
        let button = try XCTUnwrap(controller.navigationItem.leftBarButtonItem)
        _ = button.target?.perform(button.action)

        XCTAssertEqual(webView.lastEvaluatedJavaScript, "window.TurboNativeBridge.toggleNavBar();")
    }

    // MARK: visit(_:)

    func test_visit_visitsTheNotificationsURL() throws {
        let coordinator = SessionCoordinator()
        coordinator.start()

        coordinator.visit(PushNotifications.Notification.google)

        XCTAssertEqual(coordinator.session.webView.url, URL.google.appendingTrailingSlash())
    }

    // MARK: SessionDelegate.session(_:didProposeVisit:)

    func test_didProposeVisit_pushesAVisitable() throws {
        let navigationController = NavigationControllerSpy()
        let coordinator = SessionCoordinator(navigationController: navigationController)
        coordinator.start()

        let proposal = VisitProposal(url: URL.google)
        coordinator.session(coordinator.session, didProposeVisit: proposal)

        XCTAssertEqual(navigationController.pushedViewControllers.count, 2)
        let visitableViewController = try XCTUnwrap(navigationController.pushedViewControllers.last as? Jumpstart.VisitableViewController)
        XCTAssertEqual(visitableViewController.visitableURL, URL.google)
    }

    func test_didProposeVisit_visitsTheVisitable() {
        let coordinator = SessionCoordinator()
        coordinator.start()

        let proposal = VisitProposal(url: URL.google)
        coordinator.session(coordinator.session, didProposeVisit: proposal)

        XCTAssertEqual(coordinator.session.webView.url, URL.google.appendingTrailingSlash())
    }

    func test_didProposeVisit_pushesWithoutAnimation() {
        let navigationController = NavigationControllerSpy()
        let coordinator = SessionCoordinator(navigationController: navigationController)
        coordinator.start()

        let proposal = VisitProposal.withoutAnimation
        coordinator.session(coordinator.session, didProposeVisit: proposal)

        XCTAssertFalse(navigationController.lastPushedViewControllerWasAnimated)
    }

    func test_didProposeVisit_modal_presentsACancellableModal() {
        let navigationController = NavigationControllerSpy()
        let coordinator = SessionCoordinator(navigationController: navigationController)
        coordinator.start()

        let proposal = VisitProposal.modal(url: URL.example)
        coordinator.session(coordinator.session, didProposeVisit: proposal)

        XCTAssert(navigationController.presentedViewController is CancellableNavigationController)
    }

    func test_didProposeVisit_modal_visitsViaTheModalSession() {
        let coordinator = SessionCoordinator()
        coordinator.start()

        let proposal = VisitProposal.modal(url: URL.example)
        coordinator.session(coordinator.session, didProposeVisit: proposal)

        XCTAssertEqual(coordinator.modalSession.webView.url, URL.example.appendingTrailingSlash())
    }

    func test_didProposeVisit_modal_dismissesWhenTappingCancel() throws {
        let navigationController = NavigationControllerSpy()
        let coordinator = SessionCoordinator(navigationController: navigationController)
        coordinator.start()

        let proposal = VisitProposal.modal(url: URL.example)
        coordinator.session(coordinator.session, didProposeVisit: proposal)

        let modal = try XCTUnwrap(navigationController.presentedViewController as? CancellableNavigationController)
        let controller = modal.viewControllers.first
        let button = try XCTUnwrap(controller?.navigationItem.leftBarButtonItem)

        navigationController.resetSentMessages()
        _ = button.target?.perform(button.action)
        XCTAssertNil(navigationController.presentedViewController)
    }

    func test_didProposeVisit_withTheSameURL_replacesTheLastVisitable() throws {
        let navigationController = NavigationControllerSpy()
        let coordinator = SessionCoordinator(navigationController: navigationController)

        coordinator.start()
        let controller = navigationController.viewControllers.last

        let proposal = VisitProposal(url: URL.example)
        coordinator.session(coordinator.session, didProposeVisit: proposal)

        XCTAssertEqual(navigationController.pushedViewControllers.count, 1)
        let visitableViewController = try XCTUnwrap(navigationController.viewControllers.last as? Jumpstart.VisitableViewController)
        XCTAssertEqual(visitableViewController.visitableURL, URL.example)
        XCTAssertFalse(navigationController.viewControllers.last === controller)
    }

    func test_didProposeVisit_replace_replacesTheLastVisitable() throws {
        let navigationController = NavigationControllerSpy()
        let coordinator = SessionCoordinator(navigationController: navigationController)
        coordinator.start()

        let proposal = VisitProposal(url: URL.google, action: .replace)
        coordinator.session(coordinator.session, didProposeVisit: proposal)

        XCTAssertEqual(navigationController.pushedViewControllers.count, 1)
        let visitableViewController = try XCTUnwrap(navigationController.viewControllers.last as? Jumpstart.VisitableViewController)
        XCTAssertEqual(visitableViewController.visitableURL, URL.google)
    }

    func test_didProposeVisit_authenticationFlow_pushesAuthenticationCoordinator() throws {
        let coordinator = SessionCoordinator()
        coordinator.start()

        let proposal = VisitProposal.authenticationFlow
        coordinator.session(coordinator.session, didProposeVisit: proposal)

        XCTAssertEqual(coordinator.childCoordinators.count, 1)
        XCTAssert(coordinator.childCoordinators.last is AuthenticationCoordinator)
    }

    func test_didProposeVisit_updatePasswordFlow_pushesUpdatePasswordCoordinator() throws {
        let coordinator = SessionCoordinator()
        coordinator.start()

        let proposal = VisitProposal.updatePasswordFlow
        coordinator.session(coordinator.session, didProposeVisit: proposal)

        XCTAssertEqual(coordinator.childCoordinators.count, 1)
        XCTAssert(coordinator.childCoordinators.last is UpdatePasswordCoordinator)
    }

    func test_didProposeVisit_doesNotAddMenuButtonIfMoreThanOneViewController() throws {
        let navigationController = NavigationControllerSpy()
        let coordinator = SessionCoordinator(navigationController: navigationController)
        coordinator.start()
        XCTAssertNotNil(navigationController.viewControllers.last?.navigationItem.leftBarButtonItem)

        let proposal = VisitProposal(url: Endpoint.root.appendingPathComponent("/example"))
        coordinator.session(coordinator.session, didProposeVisit: proposal)

        let viewController = try XCTUnwrap(navigationController.pushedViewControllers.last)
        XCTAssertNil(viewController.navigationItem.leftBarButtonItem)
    }

    // MARK: SessionDelegate.session(_:didFailRequestForVisitable:error:)

    func test_didFailRequestForVisitable_401_pushesAuthenticationCoordinator() {
        let coordinator = SessionCoordinator()
        coordinator.start()

        let error = TurboError.http(statusCode: 401)
        coordinator.session(coordinator.session, didFailRequestForVisitable: FakeVisitable(), error: error)

        XCTAssertEqual(coordinator.childCoordinators.count, 1)
        XCTAssert(coordinator.childCoordinators.last is AuthenticationCoordinator)
    }

    func test_didFailRequestForVisitable_pushesAnErrorCoordinator() {
        let coordinator = SessionCoordinator()
        coordinator.start()

        coordinator.session(coordinator.session, didFailRequestForVisitable: FakeVisitable(), error: TestError())

        XCTAssert(coordinator.childCoordinators.last is ErrorCoordinator)
    }

    func test_didFailRequestForVisitable_didRetry_reloadsTheSession() throws {
        let session = SessionSpy()
        let coordinator = SessionCoordinator()
        coordinator.session = session
        coordinator.start()

        coordinator.session(session, didFailRequestForVisitable: FakeVisitable(), error: TestError())

        let errorCoordinator = try XCTUnwrap(coordinator.childCoordinators.last as? ErrorCoordinator)
        errorCoordinator.didRetry?()

        XCTAssertTrue(session.reloadWasCalled)
    }

    // MARK: ScriptMessageDelegate.registerForPushNotifications()

    func test_registerForPushNotifications() throws {
        let userNotificationCenter = FakeUserNotificationCenter()
        Configuration.shared.userNotificationCenter = userNotificationCenter

        let coordinator = SessionCoordinator()
        coordinator.registerForPushNotifications()

        XCTAssertEqual(userNotificationCenter.lastRequestedAuthorizationOptions, [.alert, .sound, .badge])
    }

    // MARK: ScriptMessageDelegate.signOut()

    func test_signOut_makesADELETERequestToTheAuthEndpoint() {
        let requestLoader = FakeRequestLoader()
        HTTP.Global.requestLoader = requestLoader
        let coordinator = SessionCoordinator()

        coordinator.signOut()

        let request = requestLoader.lastLoadedRequest
        XCTAssertEqual(request?.httpMethod, "DELETE")
        XCTAssertEqual(request?.url, Endpoint.API.auth)
    }

    func test_signOut_success_reloadsTheSession() throws {
        try stubRequestLoaderSuccess()
        let coordinator = SessionCoordinator()
        let expectation = self.expectation(description: "Wait for callback to be called")
        coordinator.willReloadSession = {
            expectation.fulfill()
        }

        coordinator.signOut()

        wait(for: [expectation], timeout: 1)
    }

    func test_signOut_failure_pushesAnErrorCoordinator() throws {
        try stubRequestLoaderFailure(error: "An error occurred")
        let coordinator = SessionCoordinator()

        coordinator.signOut()

        XCTAssertEqual(coordinator.childCoordinators.count, 1)
        XCTAssert(coordinator.childCoordinators.last is ErrorCoordinator)
    }

    // MARK: AuthenticationCoordinator.authenticate()

    func test_authenticate_callsTheCallback() throws {
        let coordinator = SessionCoordinator()
        coordinator.start()

        var willReloadSessionWasCalled = false
        coordinator.willReloadSession = { willReloadSessionWasCalled = true }

        let error = TurboError.http(statusCode: 401)
        coordinator.session(coordinator.session, didFailRequestForVisitable: FakeVisitable(), error: error)

        let authenticationCoordinator = try XCTUnwrap(coordinator.childCoordinators.last as? AuthenticationCoordinator)
        authenticationCoordinator.didAuthenticate?(URL.modal)

        XCTAssertTrue(willReloadSessionWasCalled)
    }

    func test_authenticate_routesTheURL() throws {
        let pathConfiguration = try newAsModalRulePathConfiguration()
        let coordinator = SessionCoordinator(pathConfiguration: pathConfiguration)
        coordinator.start()

        let error = TurboError.http(statusCode: 401)
        coordinator.session(coordinator.session, didFailRequestForVisitable: FakeVisitable(), error: error)

        let authenticationCoordinator = try XCTUnwrap(coordinator.childCoordinators.last as? AuthenticationCoordinator)
        authenticationCoordinator.didAuthenticate?(URL.modal)

        // Note the modal session, so routing /new to the modal is verified.
        XCTAssertEqual(coordinator.modalSession.webView.url, URL.modal)
    }
}

private extension SessionCoordinator {
    convenience init(showMenuButton: Bool = true, pathConfiguration: PathConfiguration = PathConfiguration(sources: []), navigationController: UINavigationController = UINavigationController()) {
        let configuration = SessionCoordinator.Configuration(
            url: URL.example,
            showMenuButton: showMenuButton,
            processPool: WKProcessPool(),
            pathConfiguration: pathConfiguration
        )
        self.init(configuration: configuration, navigationController: navigationController)
    }
}
