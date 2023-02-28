@testable import Jumpstart
import XCTest

class CoordinatorTests: XCTestCase {
    // MARK: pushCoordinator(:andStart:)

    func test_pushCoordinator_isAddedAsAChild() {
        let coordinator = Coordinator()
        let childCoordinator = Coordinator()

        coordinator.pushCoordinator(childCoordinator)

        XCTAssertEqual(coordinator.childCoordinators, [childCoordinator])
    }

    func test_pushCoordinator_isPoppedWhenFinished() {
        let coordinator = Coordinator()
        let childCoordinator = Coordinator()
        coordinator.pushCoordinator(childCoordinator)

        childCoordinator.didFinish?(childCoordinator)

        XCTAssertTrue(coordinator.childCoordinators.isEmpty)
    }

    func test_pushCoordinator_startsTheCoordinator() {
        let coordinator = Coordinator()
        let childCoordinator = CoordinatorSpy()

        coordinator.pushCoordinator(childCoordinator)

        XCTAssertTrue(childCoordinator.isStarted)
    }

    func test_pushCoordinator_doesNotStartTheCoordinator() {
        let coordinator = Coordinator()
        let childCoordinator = CoordinatorSpy()

        coordinator.pushCoordinator(childCoordinator, andStart: false)

        XCTAssertFalse(childCoordinator.isStarted)
    }

    // MARK: popCoordinator(_:)

    func test_popCoordinator_removesTheCoordinator() {
        let coordinator = Coordinator()
        let firstChildCoordinator = Coordinator()
        let secondChildCoordinator = Coordinator()
        let thirdChildCoordinator = Coordinator()

        coordinator.pushCoordinator(firstChildCoordinator)
        coordinator.pushCoordinator(secondChildCoordinator)
        coordinator.pushCoordinator(thirdChildCoordinator)

        coordinator.popCoordinator(secondChildCoordinator)

        XCTAssertEqual(coordinator.childCoordinators, [
            firstChildCoordinator,
            thirdChildCoordinator,
        ])
    }

    // MARK: UINavigationControllerDelegate.navigationController(_:willShow:animated:)

    func test_navigationControllerWillShow_passesTheCallToItsChildren() {
        let coordinator = Coordinator()
        let viewController = UIViewController()

        let childCoordinator = CoordinatorSpy()
        coordinator.pushCoordinator(childCoordinator)

        coordinator.navigationController(UINavigationController(), willShow: viewController, animated: true)

        XCTAssert(childCoordinator.lastShownViewController === viewController)
    }
}

class CoordinatorSpy: Coordinator {
    private(set) var isStarted = false
    private(set) var lastShownViewController: UIViewController?

    override func start() {
        isStarted = true
    }

    override func navigationController(_ navigationController: UINavigationController, willShow viewController: UIViewController, animated: Bool) {
        lastShownViewController = viewController
    }
}
