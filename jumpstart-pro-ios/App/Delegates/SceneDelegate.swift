import UIKit

class SceneDelegate: UIResponder, UIWindowSceneDelegate {
    var window: UIWindow?

    private let coordinator = AppCoordinator()

    func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
        guard let windowScene = scene as? UIWindowScene else {
            fatalError("Expected a UIWindowScene.")
        }
        start(in: windowScene)
    }

    private func start(in windowScene: UIWindowScene) {
        let window = UIWindow(windowScene: windowScene)
        coordinator.start()
        window.rootViewController = coordinator.rootViewController
        self.window = window
        window.makeKeyAndVisible()
    }
}
