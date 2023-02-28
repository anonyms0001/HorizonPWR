import SwiftUI

struct Branded: ViewModifier {
    func body(content: Content) -> some View {
        content
            .foregroundColor(.body)
    }
}

extension View {
    func branded() -> some View {
        modifier(Branded())
    }
}
