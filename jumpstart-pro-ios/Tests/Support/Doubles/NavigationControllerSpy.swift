import UIKit

class NavigationControllerSpy: UINavigationController {
    private(set) var dismissWasCalled = false
    private(set) var lastPushedViewControllerWasAnimated = true
    private(set) var pushedViewControllers = [UIViewController]()

    private var lastPresentedViewController: UIViewController?

    override var presentedViewController: UIViewController? {
        lastPresentedViewController
    }

    override func dismiss(animated flag: Bool, completion: (() -> Void)? = nil) {
        lastPresentedViewController = nil
        dismissWasCalled = true
        super.dismiss(animated: flag, completion: completion)
    }

    override func present(_ viewControllerToPresent: UIViewController, animated flag: Bool, completion: (() -> Void)? = nil) {
        lastPresentedViewController = viewControllerToPresent
        super.present(viewControllerToPresent, animated: flag, completion: completion)
    }

    override func pushViewController(_ viewController: UIViewController, animated: Bool) {
        lastPushedViewControllerWasAnimated = animated
        pushedViewControllers.append(viewController)
        super.pushViewController(viewController, animated: false)
    }

    func resetSentMessages() {
        dismissWasCalled = false
        lastPresentedViewController = nil
        lastPushedViewControllerWasAnimated = true
        pushedViewControllers = []
    }
}
