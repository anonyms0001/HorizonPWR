import SwiftUI

struct NewSessionView: View {
    @ObservedObject var viewModel: NewSessionViewModel

    var body: some View {
        ZStack {
            VStack {
                VStack {
                    Logo()
                    
                    Text("Log In")
                        .font(.largeTitle)
                        .bold()
                }
                .padding(.bottom)

                VStack(spacing: 16) {
                    VStack(alignment: .leading) {
                        Text("Email")
                            .font(.subheadline)

                        TextField("name@example.com", text: $viewModel.email)
                            .textContentType(.username)
                            .keyboardType(.emailAddress)
                            .brandedInput()
                    }
                    .padding(.horizontal)

                    VStack(alignment: .leading) {
                        Text("Password")
                            .font(.subheadline)

                        SecureField("Password", text: $viewModel.password)
                            .textContentType(.password)
                            .brandedInput()
                    }
                    .padding(.horizontal)

                    Button(action: {
                        viewModel.signIn()
                    }, label: {
                        Text("Log In")
                            .font(.subheadline)
                            .bold()
                    })
                        .buttonStyle(FilledButtonStyle())
                        .padding(.horizontal)
                }
                .padding(.horizontal)
            }
            .branded()
            .disabled(viewModel.isSigningIn)
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

struct NewSessionView_Previews: PreviewProvider {
    static var previews: some View {
        NewSessionView(viewModel: NewSessionViewModel())
    }
}
