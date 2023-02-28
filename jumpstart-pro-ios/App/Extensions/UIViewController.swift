import UIKit

extension UIViewController {
    func addFullScreenChild(_ viewController: UIViewController) {
        view.addFullScreenView(viewController.view)
        addChild(viewController)
    }
}
