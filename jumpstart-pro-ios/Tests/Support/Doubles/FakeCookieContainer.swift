@testable import Jumpstart
import WebKit

class FakeCookieContainer: CookieContainer {
    private(set) var lastSetCookies: [HTTPCookie]?
    private(set) var clearCookiesWasCalled = false
    private(set) var copyCookiesFromWebViewStorageToHTTPStorageWasCalled = false

    func setCookies(_ cookies: [HTTPCookie], for url: URL, completion: @escaping () -> Void) {
        lastSetCookies = cookies
        completion()
    }

    func clearCookies(_ completion: @escaping () -> Void) {
        clearCookiesWasCalled = true
        completion()
    }

    func copyCookiesFromWebViewStorageToHTTPStorage(_ completion: @escaping () -> Void) {
        copyCookiesFromWebViewStorageToHTTPStorageWasCalled = true
        completion()
    }
}
