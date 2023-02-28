@testable import Jumpstart
import Turbo
import XCTest

class AppCoordinatorTests: XCTestCase {
    // MARK: start()

    func test_start_isThePathConfigurationsDelegate() throws {
        let pathConfiguration = try twoTabPathConfiguration()
        let coordinator = AppCoordinator(pathConfiguration: pathConfiguration)

        coordinator.start()

        XCTAssert(pathConfiguration.delegate === coordinator)
    }

    func test_start_isTheTabBarControllersDelegate() throws {
        let coordinator = AppCoordinator()

        coordinator.start()

        let tabBarController = try XCTUnwrap(coordinator.rootViewController as? UITabBarController)
        XCTAssert(tabBarController.delegate === coordinator)
    }

    func test_start_loadsTabsFromTheConfiguration() throws {
        let pathConfiguration = try twoTabPathConfiguration()
        let coordinator = AppCoordinator(pathConfiguration: pathConfiguration)

        coordinator.start()

        let tabBarController = try XCTUnwrap(coordinator.rootViewController as? UITabBarController)
        XCTAssertEqual(tabBarController.viewControllers?.count, 2)
        XCTAssertEqual(tabBarController.tabBar.items?.first?.title, "Title 1")
        XCTAssertEqual(tabBarController.tabBar.items?.first?.image, UIImage(systemName: "wrench"))
    }

    func test_start_pushesASessionCoordinatorForEachTab() throws {
        let pathConfiguration = try twoTabPathConfiguration()
        let coordinator = AppCoordinator(pathConfiguration: pathConfiguration)

        coordinator.start()

        XCTAssertEqual(coordinator.childCoordinators.count, 2)

        let firstChildCoordinator = try XCTUnwrap(coordinator.childCoordinators.first as? SessionCoordinator)
        XCTAssertEqual(firstChildCoordinator.url, Endpoint.root.appendingPathComponent("/one"))

        let secondChildCoordinator = try XCTUnwrap(coordinator.childCoordinators.last as? SessionCoordinator)
        XCTAssertEqual(secondChildCoordinator.url, Endpoint.root.appendingPathComponent("/two"))
    }

    func test_start_onlyStartsTheFirstSessionCoordinator() throws {
        let pathConfiguration = try twoTabPathConfiguration()
        let coordinator = AppCoordinator(pathConfiguration: pathConfiguration)

        coordinator.start()

        let firstSessionCoordinator = try XCTUnwrap(coordinator.childCoordinators.first as? SessionCoordinator)
        XCTAssertNotNil(firstSessionCoordinator.session.webView.url)

        let secondSessionCoordinator = try XCTUnwrap(coordinator.childCoordinators.last as? SessionCoordinator)
        XCTAssertNil(secondSessionCoordinator.session.webView.url)
    }

    func test_start_isTheDelegateOfTheNavigationControllers() throws {
        let pathConfiguration = try twoTabPathConfiguration()
        let coordinator = AppCoordinator(pathConfiguration: pathConfiguration)

        coordinator.start()

        let tabBarController = try XCTUnwrap(coordinator.rootViewController as? UITabBarController)

        let firstNavigationController = try XCTUnwrap(tabBarController.viewControllers?.first as? UINavigationController)
        XCTAssert(firstNavigationController.delegate === coordinator)

        let secondNavigationController = try XCTUnwrap(tabBarController.viewControllers?.last as? UINavigationController)
        XCTAssert(secondNavigationController.delegate === coordinator)
    }

    func test_start_withOneTab_theTabBarIsHidden() throws {
        let pathConfiguration = try oneTabPathConfiguration()
        let coordinator = AppCoordinator(pathConfiguration: pathConfiguration)

        coordinator.start()

        XCTAssertEqual(coordinator.childCoordinators.count, 1)

        let tabBarController = try XCTUnwrap(coordinator.rootViewController as? UITabBarController)
        XCTAssertTrue(tabBarController.tabBar.isHidden)
    }

    func test_start_startsMonitoringForPushNotifications() throws {
        let coordinator = AppCoordinator()
        coordinator.start()
        XCTAssert(UNUserNotificationCenter.current().delegate is PushNotifications.Handler)
    }

    // MARK: UITabBarControllerDelegate

    func test_whenATabIsSelected_theCoordinatorIsStarted() throws {
        let pathConfiguration = try twoTabPathConfiguration()
        let coordinator = AppCoordinator(pathConfiguration: pathConfiguration)
        coordinator.start()

        let tabBarController = try XCTUnwrap(coordinator.rootViewController as? UITabBarController)
        let secondNavigationController = try XCTUnwrap(tabBarController.viewControllers?.last as? UINavigationController)
        coordinator.tabBarController(tabBarController, didSelect: secondNavigationController)

        let secondSessionCoordinator = try XCTUnwrap(coordinator.childCoordinators.last as? SessionCoordinator)
        XCTAssertNotNil(secondSessionCoordinator.session.webView.url)
    }

    // MARK: SessionCoordinator.willReloadSession()

    func test_willReloadSession_tellsEachSessionCoordinatorToReloadTheirSession() throws {
        let pathConfiguration = try twoTabPathConfiguration()
        let coordinator = AppCoordinator(pathConfiguration: pathConfiguration)
        coordinator.start()

        let secondSessionCoordinator = try XCTUnwrap(coordinator.childCoordinators.last as? SessionCoordinator)
        let session = SessionSpy()
        secondSessionCoordinator.session = session

        let firstSessionCoordinator = try XCTUnwrap(coordinator.childCoordinators.last as? SessionCoordinator)
        firstSessionCoordinator.willReloadSession?()

        XCTAssertTrue(session.reloadWasCalled)
    }

    // MARK: PathConfigurationDelegate

    func test_whenThePathConfigurationChanges_theTabsAndCoordinatorsAreReset() throws {
        let pathConfiguration = try twoTabPathConfiguration()
        let coordinator = AppCoordinator(pathConfiguration: pathConfiguration)
        coordinator.start()

        let newPathConfiguration = try pathConfigurationSource(for: "PathConfiguration-OneTab")
        pathConfiguration.sources = [.file(newPathConfiguration)]

        let tabBarController = try XCTUnwrap(coordinator.rootViewController as? UITabBarController)
        XCTAssertEqual(tabBarController.viewControllers?.count, 1)

        XCTAssertEqual(coordinator.childCoordinators.count, 1)
    }

    // MARK: PushNotificationRouter

    func test_routeNotification_visitsTheNotificationInTheSelectedTab() throws {
        let pathConfiguration = try oneTabPathConfiguration()
        let coordinator = AppCoordinator(pathConfiguration: pathConfiguration)
        coordinator.start()

        coordinator.routeNotification(PushNotifications.Notification.google)

        let sessionCoordinator = try XCTUnwrap(coordinator.childCoordinators.first as? SessionCoordinator)
        XCTAssertEqual(sessionCoordinator.session.activeVisitable?.visitableURL, URL.google)
    }
}
