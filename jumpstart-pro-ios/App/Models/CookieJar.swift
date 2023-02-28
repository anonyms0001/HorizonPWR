import WebKit

protocol CookieContainer {
    func setCookies(_ cookies: [HTTPCookie], for url: URL, completion: @escaping () -> Void)
    func clearCookies(_ completion: @escaping () -> Void)
    func copyCookiesFromWebViewStorageToHTTPStorage(_ completion: @escaping () -> Void)
}

struct CookieJar: CookieContainer {
    func setCookies(_ cookies: [HTTPCookie], for url: URL, completion: @escaping () -> Void) {
        HTTPCookieStorage.shared.setCookies(cookies, for: url, mainDocumentURL: nil)
        WKWebsiteDataStore.default().httpCookieStore.setCookies(cookies, completion: completion)
    }

    func clearCookies(_ completion: @escaping () -> Void) {
        HTTPCookieStorage.shared.cookies?.forEach(HTTPCookieStorage.shared.deleteCookie)
        WKWebsiteDataStore.default().fetchDataRecords(ofTypes: [WKWebsiteDataTypeCookies]) { records in
            WKWebsiteDataStore.default().removeData(ofTypes: [WKWebsiteDataTypeCookies], for: records, completionHandler: completion)
        }
    }

    func copyCookiesFromWebViewStorageToHTTPStorage(_ completion: @escaping () -> Void) {
        onMainThread {
            WKWebsiteDataStore.default().httpCookieStore.getAllCookies { cookies in
                HTTPCookieStorage.shared.setCookies(cookies, for: Endpoint.root, mainDocumentURL: Endpoint.root)
                completion()
            }
        }
    }
}
