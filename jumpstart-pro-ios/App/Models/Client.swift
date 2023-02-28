import Foundation
import HTTP

struct Client<T, E> where T: Decodable, E: LocalizedError & Decodable & Equatable {
    private let httpClient = HTTP.Client<T, E>()
    private let cookieJar: CookieContainer

    init(cookieJar: CookieContainer = CookieJar()) {
        self.cookieJar = cookieJar
    }

    public func request(_ request: Request, completion: @escaping Completion<T, E>) {
        httpClient.request(request) { result in
            switch result {
            case .success(let response):
                guard let headers = response.headers as? [String: String]
                else { return completion(.failure(.invalidResponse(-1))) }

                let cookies = HTTPCookie.cookies(withResponseHeaderFields: headers, for: Endpoint.root)
                cookieJar.setCookies(cookies, for: Endpoint.root) {
                    completion(.success(response))
                }
            case .failure(let error):
                completion(.failure(error))
            }
        }
    }
}
