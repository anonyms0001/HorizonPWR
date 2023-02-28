import Turbo

extension TurboError {
    var jumpstartErrorDescription: String? {
        JumpstartError(error: self).errorDescription
    }
}
