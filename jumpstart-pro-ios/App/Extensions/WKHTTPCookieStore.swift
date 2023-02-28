import WebKit

extension WKHTTPCookieStore {
    func setCookies(_ cookies: [HTTPCookie], completion: @escaping () -> Void) {
        let group = DispatchGroup()

        cookies.forEach { [weak self] cookie in
            group.enter()
            self?.setCookie(cookie) {
                group.leave()
            }
        }

        group.notify(queue: .main, execute: completion)
    }
}
