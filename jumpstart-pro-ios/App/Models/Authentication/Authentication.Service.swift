import Combine
import HTTP
import WebKit

extension Authentication {
    typealias Completion = (Result<URL, HTTPError<JumpstartHTTPError>>) -> Void

    struct Service {
        private let accessTokenKey = Constants.UserDefaults.accessTokenKey.rawValue
        private let client = Client<Response, JumpstartHTTPError>()
        private let cookieJar = CookieJar()
        private let url = Endpoint.API.auth

        func signIn(email: String, password: String, completion: @escaping Completion) {
            let body = Body(email: email, password: password)
            let headers = ["User-Agent": UserAgent.default]
            let request = BodyRequest(url: url, method: .post, body: body, headers: headers)
            client.request(request) { result in
                onMainThread {
                    switch result {
                    case .success(let response):
                        persistAuthentication(from: response, completion: completion)
                    case .failure(let error):
                        completion(.failure(error))
                    }
                }
            }
        }

        private func persistAuthentication(from response: HTTP.Response<Response>, completion: @escaping Completion) {
            guard let headers = response.headers as? [String: String]
            else { return completion(.failure(.invalidResponse(-1))) }

            SecureStorage.accessToken = response.value.token

            let cookies = HTTPCookie.cookies(withResponseHeaderFields: headers, for: url)
            cookieJar.setCookies(cookies, for: Endpoint.API.auth) {
                completion(.success(Endpoint.root.appendingPathComponent(response.value.location)))
            }
        }
    }
}
