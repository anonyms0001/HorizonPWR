import Turbo
import UIKit
import WebKit

class SessionCoordinator: Coordinator {
    lazy var session = Session(processPool: processPool, pathConfiguration: pathConfiguration, delegate: self)
    lazy var modalSession = Session(processPool: processPool, pathConfiguration: pathConfiguration, delegate: self)
    let url: URL

    var willReloadSession: (() -> Void)?

    private let cookieJar = CookieJar()
    private let navigationController: UINavigationController
    private let pathConfiguration: PathConfiguration
    private let processPool: WKProcessPool
    private let pushNotificationsRegistrationService = PushNotifications.RegistrationService()
    private let showMenuButton: Bool
    private let signOutService = SignOut.Service()
    private var isStarted = false

    init(configuration: Configuration, navigationController: UINavigationController) {
        self.url = configuration.url
        self.showMenuButton = configuration.showMenuButton
        self.processPool = configuration.processPool
        self.pathConfiguration = configuration.pathConfiguration
        self.navigationController = navigationController
    }

    override func start() {
        if !isStarted {
            visit(VisitProposal(url: url))
            isStarted = true
        }
    }

    func visit(_ notification: PushNotifications.Notification) {
        visit(VisitProposal(notification: notification))
    }

    private func visit(_ proposal: VisitProposal) {
        navigationController.dismiss(animated: true)

        let visitable = VisitableViewController(url: proposal.url)
        navigate(to: visitable, via: proposal)
        visit(visitable, proposal: proposal)
    }

    private func navigate(to viewController: UIViewController, via proposal: VisitProposal) {
        if proposal.isModalPresentation {
            presentCancellableModal(rootViewController: viewController)
        } else if willVisitCurrentPage(url: proposal.url) {
            navigationController.replaceLastController(with: viewController)
        } else if proposal.isAdvanceAction {
            navigationController.pushViewController(viewController, animated: proposal.isAnimated)
        } else {
            navigationController.replaceLastController(with: viewController)
        }
        addMenuButton(to: viewController)
    }

    private func willVisitCurrentPage(url: URL) -> Bool {
        session.activeVisitable?.visitableURL == url
    }

    private func presentCancellableModal(rootViewController viewController: UIViewController) {
        let cancellableNavigationController = CancellableNavigationController(rootViewController: viewController) { [weak self] in
            self?.navigationController.dismiss(animated: true)
        }
        navigationController.present(cancellableNavigationController, animated: true)
    }

    private func visit(_ visitable: Visitable, proposal: VisitProposal) {
        let session = proposal.isModalPresentation ? modalSession : self.session
        session.visit(visitable, options: proposal.options)
    }

    private func addMenuButton(to viewController: UIViewController) {
        if showMenuButton && navigationController.viewControllers.count <= 1 {
            let image = UIImage(systemName: "line.horizontal.3")
            viewController.navigationItem.leftBarButtonItem =
                UIBarButtonItem(image: image, style: .plain, target: self, action: #selector(toggleNavBar))
        }
    }

    @objc private func toggleNavBar() {
        let script = "window.TurboNativeBridge.toggleNavBar();"
        session.webView.evaluateJavaScript(script, completionHandler: nil)
    }

    private func pushErrorCoordinator(error: Error) {
        let errorCoordinator = ErrorCoordinator(error: error, navigationController: navigationController)
        errorCoordinator.didRetry = { [weak self] in
            self?.session.reload()
        }
        pushCoordinator(errorCoordinator)
    }

    private func pushAuthenticationCoordinator() {
        let authenticationCoordinator = AuthenticationCoordinator(navigationController: navigationController)
        authenticationCoordinator.didAuthenticate = { [weak self] url in
            guard let self = self else { return }
            self.willReloadSession?()
            self.visit(VisitProposal(url: url, pathConfiguration: self.pathConfiguration))
        }
        pushCoordinator(authenticationCoordinator)
    }

    private func pushUpdatePasswordCoordinator() {
        let updatePasswordCoordinator = UpdatePasswordCoordinator(navigationController: navigationController)
        pushCoordinator(updatePasswordCoordinator)
    }
}

extension SessionCoordinator: SessionScriptMessageHandler {}

extension SessionCoordinator: SessionDelegate {
    func session(_ session: Session, didProposeVisit proposal: VisitProposal) {
        if proposal.isAuthenticationFlow {
            pushAuthenticationCoordinator()
        } else if proposal.isUpdatePasswordFlow {
            pushUpdatePasswordCoordinator()
        } else {
            visit(proposal)
        }
    }

    func session(_ session: Session, didFailRequestForVisitable visitable: Visitable, error: Error) {
        if error.isUnauthorized {
            pushAuthenticationCoordinator()
        } else {
            pushErrorCoordinator(error: error)
        }
    }
}

extension SessionCoordinator: ScriptMessageDelegate {
    func registerForPushNotifications() {
        pushNotificationsRegistrationService.requestAuthorization()
    }

    func signOut() {
        signOutService.signOut { [weak self] result in
            guard let self = self else { return }
            switch result {
            case .success:
                self.willReloadSession?()
            case .failure(let error):
                self.pushErrorCoordinator(error: error)
            }
        }
    }
}
