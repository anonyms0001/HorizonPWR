import UIKit

extension UINavigationController {
    convenience init(tab: Tab, delegate: UINavigationControllerDelegate) {
        self.init()

        self.delegate = delegate
        self.tabBarItem.title = tab.title
        self.tabBarItem.image = tab.image
    }

    func replaceLastController(with viewController: UIViewController) {
        let viewControllers = self.viewControllers.dropLast()
        setViewControllers(viewControllers + [viewController], animated: false)
    }
}
