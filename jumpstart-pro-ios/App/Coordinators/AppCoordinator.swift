import Turbo
import UIKit
import WebKit

class AppCoordinator: Coordinator {
    var rootViewController: UIViewController { tabBarController }

    init(pathConfiguration: PathConfiguration = PathConfiguration.default) {
        self.pathConfiguration = pathConfiguration
    }

    private lazy var notificationHandler = PushNotifications.Handler(router: self)
    private let pathConfiguration: PathConfiguration
    private let processPool = WKProcessPool()
    private let pushNotificationsRegistrationService = PushNotifications.RegistrationService()
    private let tabBarController = UITabBarController()
    private var rootViewControllers = [UINavigationController]()

    private var tabs = [Tab]() {
        didSet {
            if tabs != oldValue {
                reloadTabs()
            }
        }
    }

    override func start() {
        pathConfiguration.delegate = self
        tabBarController.delegate = self
        tabs = loadTabsFromConfiguration()
        pushNotificationsRegistrationService.rerequestAuthorization()
        notificationHandler.start()
    }

    private func loadTabsFromConfiguration() -> [Tab] {
        TabParser(json: pathConfiguration.settings["tabs"]).tabs
    }

    private func reloadTabs() {
        childCoordinators.forEach { popCoordinator($0) }
        rootViewControllers = loadRootViewControllers()

        tabBarController.viewControllers = rootViewControllers
        tabBarController.tabBar.isHidden = rootViewControllers.count == 1
        childCoordinators.first?.start()
    }

    private func loadRootViewControllers() -> [UINavigationController] {
        tabs.map { tab in
            let configuration = SessionCoordinator.Configuration(
                url: Endpoint.root.appendingPathComponent(tab.path),
                showMenuButton: tabs.count == 1,
                processPool: processPool,
                pathConfiguration: pathConfiguration
            )
            let navigationController = UINavigationController(tab: tab, delegate: self)
            let coordinator = SessionCoordinator(configuration: configuration, navigationController: navigationController)
            coordinator.willReloadSession = reloadAllSessions
            pushCoordinator(coordinator, andStart: false)
            return navigationController
        }
    }

    private func reloadAllSessions() {
        childCoordinators.forEach { coordinator in
            if let sessionCoordinator = coordinator as? SessionCoordinator {
                sessionCoordinator.session.reload()
            }
        }
    }

    private func selectedCoordinator(from navigationController: UINavigationController) -> Coordinator? {
        if let index = rootViewControllers.firstIndex(of: navigationController) {
            return childCoordinators[index]
        }
        return nil
    }
}

extension AppCoordinator: UITabBarControllerDelegate {
    func tabBarController(_ tabBarController: UITabBarController, didSelect viewController: UIViewController) {
        guard let navigationController = viewController as? UINavigationController else { return }
        selectedCoordinator(from: navigationController)?.start()
    }
}

extension AppCoordinator: PathConfigurationDelegate {
    func pathConfigurationDidUpdate() {
        tabs = loadTabsFromConfiguration()
    }
}

extension AppCoordinator: PushNotificationRouter {
    func routeNotification(_ notification: PushNotifications.Notification) {
        guard
            let navigationController = tabBarController.selectedViewController as? UINavigationController,
            let sessionCoordinator = selectedCoordinator(from: navigationController) as? SessionCoordinator
        else { return }

        sessionCoordinator.visit(notification)
    }
}
