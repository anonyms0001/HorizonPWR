import Foundation

struct JumpstartHTTPError: Codable, LocalizedError, Equatable {
    let error: String

    var errorDescription: String? { error }
}
