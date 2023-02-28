import Combine
import Foundation
import WebKit

class NewSessionViewModel: ObservableObject {
    @Published var email: String = ""
    @Published var password: String = ""
    @Published var error: String?
    @Published var isSigningIn = false

    var didFinish: ((URL) -> Void)?

    init(cookieJar: CookieContainer = CookieJar()) {
        self.cookieJar = cookieJar
    }

    private let cookieJar: CookieContainer
    private let service = Authentication.Service()
    private var cancellables = Set<AnyCancellable>()

    func signIn(clearErrorAfter: TimeInterval = 3.0) {
        isSigningIn = true

        cookieJar.copyCookiesFromWebViewStorageToHTTPStorage { [weak self] in
            guard let self = self else { return }

            self.service.signIn(email: self.email, password: self.password) { [weak self] result in
                switch result {
                case .failure(let error):
                    self?.error = error.localizedDescription
                    DispatchQueue.main.asyncAfter(deadline: .now() + clearErrorAfter) {
                        self?.error = nil
                    }
                case .success(let url):
                    self?.didFinish?(url)
                }

                self?.isSigningIn = false
            }
        }
    }
}
