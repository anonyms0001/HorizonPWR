@testable import Jumpstart
import XCTest

class DataTests: XCTestCase {
    // MARK: hexString()

    func test_hexString_convertsHexEncodedDataToAString() throws {
        let encodedData = try XCTUnwrap(Data.hexToken)
        XCTAssertEqual(encodedData.hexString, "746f6b656e")
    }
}

private extension Data {
    static let hexToken = Data(bytes: [0x74, 0x6f, 0x6b, 0x65, 0x6e] as [UInt8], count: 5)
}
