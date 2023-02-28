import Foundation
import HTTP

extension SignOut {
    struct Service {
        private let client = HTTP.Client<Empty, Empty>()
        private let cookieJar: CookieContainer

        init(cookieJar: CookieContainer = CookieJar()) {
            self.cookieJar = cookieJar
        }

        func signOut(completion: @escaping (Result<Bool, HTTPError<Empty>>) -> Void) {
            let body = Body(notificationToken: UserDefaults.notificationToken)
            let headers = [
                "User-Agent": UserAgent.default,
                "Authorization": "Bearer \(SecureStorage.accessToken ?? "")"
            ]
            let request = BodyRequest(url: Endpoint.API.auth, method: .delete, body: body, headers: headers, keyEncodingStrategy: .convertToSnakeCase)
            client.request(request) { result in
                onMainThread {
                    switch result {
                    case .success:
                        UserDefaults.notificationToken = nil
                        SecureStorage.clearAccessToken()
                        cookieJar.clearCookies {
                            completion(.success(true))
                        }
                    case .failure(let error):
                        completion(.failure(error))
                    }
                }
            }
        }
    }
}
