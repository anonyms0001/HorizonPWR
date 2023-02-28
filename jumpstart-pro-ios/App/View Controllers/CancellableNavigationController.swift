import UIKit

class CancellableNavigationController: UINavigationController {
    private let buttonTitle: String
    private let rootViewController: UIViewController
    private var handler: () -> Void

    init(title: String = "Cancel", rootViewController: UIViewController, handler: @escaping () -> Void) {
        self.buttonTitle = title
        self.rootViewController = rootViewController
        self.handler = handler
        super.init(rootViewController: rootViewController)
        presentationController?.delegate = self
    }

    @available(*, unavailable)
    required init?(coder aDecoder: NSCoder) { fatalError() }

    override func viewDidLoad() {
        addCancelButton(to: rootViewController)
    }

    func reset(withHandler handler: @escaping () -> Void) {
        self.handler = handler
        addCancelButton(to: visibleViewController)
    }

    private func addCancelButton(to viewController: UIViewController?) {
        viewController?.navigationItem.leftBarButtonItem =
            UIBarButtonItem(title: buttonTitle, style: .plain, target: self, action: #selector(callhandler))
    }

    @objc private func callhandler() {
        handler()
    }
}

extension CancellableNavigationController: UIAdaptivePresentationControllerDelegate {
    func presentationControllerDidDismiss(_ presentationController: UIPresentationController) {
        handler()
    }
}
