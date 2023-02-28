import SwiftUI

struct ErrorAlert: View {
    let message: String

    var body: some View {
        Text(message)
            .fontWeight(.bold)
            .frame(maxWidth: .infinity)
            .foregroundColor(.white)
            .padding(.vertical)
            .background(
                RoundedRectangle(cornerRadius: 15)
                    .foregroundColor(Color.body)
            )
    }
}

struct ErrorAlert_Previews: PreviewProvider {
    static var previews: some View {
        ErrorAlert(message: "Invalid login credentials")
            .autosizedPreview()
    }
}
