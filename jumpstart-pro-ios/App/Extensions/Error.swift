import Turbo

extension Error {
    var isUnauthorized: Bool { httpStatusCode == 401 }

    private var httpStatusCode: Int? {
        guard
            let turboError = self as? TurboError,
            case let .http(statusCode) = turboError
        else { return nil }
        return statusCode
    }
}
