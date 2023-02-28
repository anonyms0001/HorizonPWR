import Foundation
import Turbo
import WebKit

extension SessionCoordinator {
    struct Configuration {
        let url: URL
        let showMenuButton: Bool
        let processPool: WKProcessPool
        let pathConfiguration: PathConfiguration
    }
}
