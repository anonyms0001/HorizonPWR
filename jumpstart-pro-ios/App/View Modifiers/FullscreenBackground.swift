import SwiftUI

struct FullScreenBackground: ViewModifier {
    let color: Color

    func body(content: Content) -> some View {
        ZStack {
            color.ignoresSafeArea()
            content
        }
    }
}

extension View {
    func fullScreenBackground(color: Color) -> some View {
        modifier(FullScreenBackground(color: color))
    }
}
