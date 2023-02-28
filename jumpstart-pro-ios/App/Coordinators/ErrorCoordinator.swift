import SwiftUI
import Turbo
import UIKit

class ErrorCoordinator: Coordinator {
    var didRetry: (() -> Void)?

    private let error: JumpstartError
    private let navigationController: UINavigationController
    private var errorViewController: UIViewController?

    init(error: Error, navigationController: UINavigationController) {
        self.error = JumpstartError(error: error)
        self.navigationController = navigationController
    }

    override func start() {
        guard let visibleViewController = navigationController.visibleViewController else { return }

        let errorView = ErrorView(error: error, retry: retry)
        let errorViewController = UIHostingController(rootView: errorView)
        self.errorViewController = errorViewController
        visibleViewController.addFullScreenChild(errorViewController)
    }

    private func retry() {
        if let errorViewController = errorViewController {
            didRetry?()
            errorViewController.removeFromParent()
            errorViewController.view.removeFromSuperview()
        }
        didFinish?(self)
    }
}
