import Foundation
import Turbo

extension VisitProposal {
    init(url: URL, action: VisitAction = .advance) {
        self.init(url: url, options: VisitOptions(action: action))
    }

    init(url: URL, action: VisitAction = .advance, pathConfiguration: PathConfiguration) {
        self.init(url: url, options: VisitOptions(action: action, response: nil), properties: pathConfiguration.properties(for: url))
    }

    init(notification: PushNotifications.Notification) {
        self.init(url: notification.url, options: VisitOptions(action: .advance), properties: ["animated": notification.isAnimated])
    }

    var isAdvanceAction: Bool { options.action == .advance }
    var isAuthenticationFlow: Bool { flow == "authentication" }
    var isModalPresentation: Bool { presentation == "modal" }
    var isUpdatePasswordFlow: Bool { flow == "update_password" }
    var isAnimated: Bool { properties["animated"] as? Bool ?? true }

    private var flow: String? { properties["flow"] as? String }
    private var presentation: String? { properties["presentation"] as? String }
}
