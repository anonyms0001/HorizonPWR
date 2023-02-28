import Foundation
import Turbo

extension VisitProposal {
    static var authenticationFlow: Self {
        VisitProposal(url: URL.example, options: VisitOptions(), properties: [
            "flow": "authentication"
        ])
    }

    static func modal(url: URL) -> Self {
        VisitProposal(
            url: url,
            options: VisitOptions(action: .advance, response: nil),
            properties: [
                "presentation": "modal"
            ]
        )
    }

    static var updatePasswordFlow: Self {
        VisitProposal(
            url: URL.example,
            options: VisitOptions(action: .advance),
            properties: [
                "flow": "update_password"
            ]
        )
    }

    static var withoutAnimation: Self {
        VisitProposal(
            url: URL.google,
            options: VisitOptions(action: .advance),
            properties: [
                "animated": false
            ]
        )
    }
}
