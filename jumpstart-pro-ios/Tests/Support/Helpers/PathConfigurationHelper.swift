import Turbo
import XCTest

extension XCTestCase {
    func oneTabPathConfiguration() throws -> PathConfiguration {
        let source = try pathConfigurationSource(for: "PathConfiguration-OneTab")
        return PathConfiguration(sources: [.file(source)])
    }

    func twoTabPathConfiguration() throws -> PathConfiguration {
        let source = try pathConfigurationSource(for: "PathConfiguration-TwoTabs")
        return PathConfiguration(sources: [.file(source)])
    }

    func newAsModalRulePathConfiguration() throws -> PathConfiguration {
        let source = try pathConfigurationSource(for: "PathConfiguration-NewAsModalRule")
        return PathConfiguration(sources: [.file(source)])
    }

    func pathConfigurationSource(for resource: String) throws -> URL {
        let testBundle = Bundle(for: type(of: self))
        let url = testBundle.url(forResource: resource, withExtension: "json")
        return try XCTUnwrap(url, "Could not find PathConfiguration.json in Test bundle.")
    }
}
