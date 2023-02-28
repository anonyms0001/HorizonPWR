@testable import Jumpstart
import WebKit
import XCTest

class ScriptMessageHandlerTests: XCTestCase {
    // MARK: userContentController(:didReceive:)

    func test_receivesARegisterForPushNotificationsMessage_tellsTheDelegate() throws {
        let delegate = FakeScriptMessageDelegate()
        let handler = ScriptMessageHandler(delegate: delegate)
        let message = TestScriptMessage(body: [
            "name": "registerForPushNotifications",
        ])

        handler.userContentController(WKUserContentController(), didReceive: message)
        XCTAssertTrue(delegate.registerForPushNotificationsWasCalled)
    }

    func test_receivesAnyOtherMessage_doesNotTellTheDelegate() throws {
        let delegate = FakeScriptMessageDelegate()
        let handler = ScriptMessageHandler(delegate: delegate)
        let message = TestScriptMessage(body: ["name": "somethingElse"])

        handler.userContentController(WKUserContentController(), didReceive: message)
        XCTAssertFalse(delegate.registerForPushNotificationsWasCalled)
    }
}

// Can't instantiate a WKScriptMessage directly.
private class TestScriptMessage: WKScriptMessage {
    override var body: Any {
        return actualBody
    }

    var actualBody: Any

    init(body: Any) {
        self.actualBody = body
    }
}
