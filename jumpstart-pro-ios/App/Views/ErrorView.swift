import SwiftUI

struct ErrorView: View {
    let error: JumpstartError
    let retry: () -> Void

    var body: some View {
        VStack(spacing: 10) {
            Text(error.localizedDescription)
                .multilineTextAlignment(.center)
            Button(action: retry, label: {
                Text("Retry")
            })
        }
        .frame(maxWidth: 300)
    }
}

struct ErrorView_Previews: PreviewProvider {
    static var previews: some View {
        ErrorView(error: JumpstartError.networkError) {}
    }
}

private extension JumpstartError {
    static var networkError: Self {
        JumpstartError(error: NSError(domain: "", code: -1004, userInfo: nil))
    }
}
