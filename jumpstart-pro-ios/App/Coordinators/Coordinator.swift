import UIKit

class Coordinator: NSObject {
    var childCoordinators: [Coordinator] = []
    var didFinish: ((Coordinator) -> Void)?

    func start() {}

    func pushCoordinator(_ coordinator: Coordinator, andStart start: Bool = true) {
        coordinator.didFinish = { [weak self] coordinator in
            self?.popCoordinator(coordinator)
        }
        if start {
            coordinator.start()
        }
        childCoordinators.append(coordinator)
    }

    func popCoordinator(_ coordinator: Coordinator) {
        if let index = childCoordinators.firstIndex(where: { $0 === coordinator }) {
            childCoordinators.remove(at: index)
        }
    }
}

extension Coordinator: UINavigationControllerDelegate {
    func navigationController(_ navigationController: UINavigationController, willShow viewController: UIViewController, animated: Bool) {
        childCoordinators.forEach { coordinator in
            coordinator.navigationController(navigationController, willShow: viewController, animated: animated)
        }
    }
}
