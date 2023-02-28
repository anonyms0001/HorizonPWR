import SwiftUI

struct BrandedInput: ViewModifier {
    func body(content: Content) -> some View {
        content
            .autocapitalization(.none)
            .disableAutocorrection(true)
            .padding(10)
            .foregroundColor(.input)
            .background(Color.white)
            .overlay(RoundedRectangle(cornerRadius: 4).stroke(Color.border, lineWidth: 1))
    }
}

extension View {
    func brandedInput() -> some View {
        modifier(BrandedInput())
    }
}
