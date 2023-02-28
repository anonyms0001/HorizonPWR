import SwiftUI

struct UpdatePasswordView: View {
    @ObservedObject var viewModel: UpdatePasswordViewModel

    var body: some View {
        ZStack {
            VStack {
                VStack {
                    Text("Update Password")
                        .font(.largeTitle)
                        .bold()
                }
                .padding(.bottom)

                VStack(spacing: 16) {
                    VStack(alignment: .leading) {
                        Text("Current password")
                            .font(.subheadline)

                        SecureField("Current password", text: $viewModel.currentPassword)
                            .textContentType(.password)
                            .brandedInput()

                        Text("We need your current password to confirm your changes")
                            .font(.caption)
                    }
                    .padding(.horizontal)

                    VStack(alignment: .leading) {
                        Text("New password")
                            .font(.subheadline)

                        SecureField("New password", text: $viewModel.newPassword)
                            .textContentType(.newPassword)
                            .brandedInput()
                    }
                    .padding(.horizontal)

                    VStack(alignment: .leading) {
                        Text("Confirm new password")
                            .font(.subheadline)

                        SecureField("Confirm new password", text: $viewModel.newPasswordConfirmation)
                            .textContentType(.newPassword)
                            .brandedInput()
                    }
                    .padding(.horizontal)

                    Button(action: {
                        viewModel.updatePassword()
                    }, label: {
                        Text("Update")
                            .font(.subheadline)
                            .bold()
                    })
                        .buttonStyle(FilledButtonStyle())
                        .padding(.horizontal)
                }
                .padding(.horizontal)
            }
            .branded()
            .disabled(viewModel.isUpdatingPassword)
            .fullScreenBackground(color: .background)

            if let error = viewModel.error {
                VStack {
                    ErrorAlert(message: error)
                        .padding()
                    Spacer()
                }
                .padding(.top)
            }
        }
    }
}

struct UpdatePasswordView_Previews: PreviewProvider {
    static var previews: some View {
        UpdatePasswordView(viewModel: UpdatePasswordViewModel())
    }
}
