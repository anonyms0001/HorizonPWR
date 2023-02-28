@testable import Jumpstart
import XCTest

class TabParserTests: XCTestCase {
    // MARK: tabs

    func test_tabs_missingTabsKey_defaultsToHomeTab() {
        let parser = TabParser(json: nil)
        XCTAssertEqual(parser.tabs, [Tab.default])
    }

    func test_tabs_invalidConfiguration_defaultsToHomeTab() {
        let parser = TabParser(json: [
            ["foo": "bar"]
        ])
        XCTAssertEqual(parser.tabs, [Tab.default])
    }

    func test_tabs_parsesEachTab() {
        let parser = TabParser(json: [
            [
                "title": "Tab Title",
                "path": "/path",
                "systemImageName": "wrench"
            ]
        ])
        XCTAssertEqual(parser.tabs, [
            Tab(title: "Tab Title", path: "/path", systemImageName: "wrench", imageName: nil)
        ])
    }
}
