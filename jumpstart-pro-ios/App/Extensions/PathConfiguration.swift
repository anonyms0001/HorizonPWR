import Foundation
import Turbo

extension PathConfiguration {
    static var `default`: Self {
        Self(sources: [
            .file(Bundle.main.url(forResource: "PathConfiguration", withExtension: "json")!),
            .server(Endpoint.Turbo.pathConfiguration)
        ])
    }
}
