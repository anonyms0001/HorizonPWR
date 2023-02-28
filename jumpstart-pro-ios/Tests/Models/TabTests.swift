@testable import Jumpstart
import XCTest

class TabTests: XCTestCase {
    // MARK: image

    override class func tearDown() {
        Tab.bundle = Bundle.main
    }

    func test_validSystemImage() {
        let tab = Tab(systemImageName: "wrench", imageName: nil)
        XCTAssertNotNil(tab.image)
    }

    func test_validImage() {
        Tab.bundle = Bundle(for: type(of: self))
        let tab = Tab(systemImageName: nil, imageName: "Image")
        XCTAssertNotNil(tab.image)
    }
}

private extension Tab {
    init(systemImageName: String?, imageName: String?) {
        self.init(
            title: "Tab Title",
            path: "/path",
            systemImageName: systemImageName,
            imageName: imageName
        )
    }
}
