import SwiftUI
import WebKit

class AuthenticationCoordinator: Coordinator {
    var didAuthenticate: ((URL) -> Void)?

    private let navigationController: UINavigationController
    private let viewModel = NewSessionViewModel()

    init(navigationController: UINavigationController) {
        self.navigationController = navigationController
    }

    override func start() {
        viewModel.didFinish = finish(url:)

        let newSessionView = NewSessionView(viewModel: viewModel)
        let authenticationViewController = UIHostingController(rootView: newSessionView)
        presentCancellableNavigationController(rootViewController: authenticationViewController)
    }

    private func finish(url: URL) {
        didAuthenticate?(url)
        didFinish?(self)
    }

    private func presentCancellableNavigationController(rootViewController: UIViewController) {
        if let presentedCancellableNavigationController = navigationController.presentedViewController as? CancellableNavigationController {
            presentedCancellableNavigationController.replaceLastController(with: rootViewController)
            presentedCancellableNavigationController.reset(withHandler: dismissAndFinish)
        } else {
            let cancellableNavigationController = CancellableNavigationController(rootViewController: rootViewController, handler: dismissAndFinish)
            navigationController.present(cancellableNavigationController, animated: true)
        }
    }

    @objc private func dismissAndFinish() {
        navigationController.dismiss(animated: true)
        didFinish?(self)
    }
}
