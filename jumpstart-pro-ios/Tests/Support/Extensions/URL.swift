import Foundation

extension URL {
    static var example = URL(string: "https://example.com")!
    static var google = URL(string: "https://google.com")!
    static var modal = URL(string: "https://example.com/new")!

    func appendingTrailingSlash() -> URL {
        appendingPathComponent("/")
    }
}
