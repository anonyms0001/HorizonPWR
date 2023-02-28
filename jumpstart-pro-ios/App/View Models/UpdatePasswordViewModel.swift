import Combine
import Foundation
import HTTP

class UpdatePasswordViewModel: ObservableObject {
    @Published var currentPassword: String = ""
    @Published var newPassword: String = ""
    @Published var newPasswordConfirmation: String = ""
    @Published var error: String?
    @Published var isUpdatingPassword = false

    var didFinish: (() -> Void)?

    private let client = Client<HTTP.Empty, JumpstartHTTPError>()

    func updatePassword(clearErrorAfter: TimeInterval = 3.0) {
        isUpdatingPassword = true

        client.request(request) { [weak self] result in
            onMainThread {
                switch result {
                case .success:
                    self?.didFinish?()
                case .failure(let error):
                    self?.error = error.localizedDescription
                    DispatchQueue.main.asyncAfter(deadline: .now() + clearErrorAfter) {
                        self?.error = nil
                    }
                }

                self?.isUpdatingPassword = false
            }
        }
    }

    private var request: Request {
        BodyRequest(
            url: Endpoint.API.passwords,
            method: .patch,
            body: body,
            headers: headers,
            keyEncodingStrategy: .convertToSnakeCase
        )
    }

    private var body: UpdatePassword.Body {
        UpdatePassword.Body(
            user: UpdatePassword.Body.User(
                currentPassword: currentPassword,
                password: newPassword,
                passwordConfirmation: newPasswordConfirmation
            )
        )
    }

    private let headers = [
        "User-Agent": UserAgent.default,
        "Authorization": "Bearer \(SecureStorage.accessToken ?? "")"
    ]
}
