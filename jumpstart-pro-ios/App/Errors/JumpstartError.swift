import Foundation
import Turbo

struct JumpstartError: Error {
    private let error: Error

    init(error: Error) {
        self.error = error
    }
}

extension JumpstartError: LocalizedError {
    var errorDescription: String? {
        if let turboError = error as? TurboError {
            switch turboError {
            case .networkFailure:
                return "NetworkFailureError".localized
            case .timeoutFailure:
                return "TimeoutFailureError".localized
            case .contentTypeMismatch:
                return "ContentTypeMismatch".localized
            case .pageLoadFailure:
                return "PageLoadFailureError".localized
            case .http(let statusCode):
                return String.localizedStringWithFormat("HTTPError".localized, statusCode)
            }
        }

        // Special case for when the initial visit fails before Turbo gets involved.
        if (error as NSError).code == -1004 {
            return TurboError.networkFailure.jumpstartErrorDescription
        }

        return error.localizedDescription
    }
}
