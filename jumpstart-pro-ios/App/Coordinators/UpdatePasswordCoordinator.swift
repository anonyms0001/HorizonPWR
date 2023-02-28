import SwiftUI

class UpdatePasswordCoordinator: Coordinator {
    private let navigationController: UINavigationController
    private let viewModel = UpdatePasswordViewModel()

    init(navigationController: UINavigationController) {
        self.navigationController = navigationController
    }

    override func start() {
        navigationController.dismiss(animated: true)
        viewModel.didFinish = finish

        let newSessionView = UpdatePasswordView(viewModel: viewModel)
        let authenticationViewController = UIHostingController(rootView: newSessionView)
        presentCancellableNavigationController(rootViewController: authenticationViewController)
    }

    private func presentCancellableNavigationController(rootViewController: UIViewController) {
        let cancellableNavigationController = CancellableNavigationController(rootViewController: rootViewController, handler: finish)
        navigationController.present(cancellableNavigationController, animated: true)
    }

    private func finish() {
        navigationController.dismiss(animated: true)
        didFinish?(self)
    }
}
