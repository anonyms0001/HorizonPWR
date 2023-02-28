import SwiftUI

struct FilledButtonStyle: ButtonStyle {
    func makeBody(configuration: Self.Configuration) -> some View {
        FilledButtonStyleView(configuration: configuration)
    }
}

private extension FilledButtonStyle {
    struct FilledButtonStyleView: View {
        @Environment(\.isEnabled) var isEnabled
        let configuration: FilledButtonStyle.Configuration

        var body: some View {
            return configuration.label
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 12)
                .background(
                    RoundedRectangle(cornerRadius: 4)
                        .fill(fillColor(for: configuration))
                )
        }

        private func fillColor(for configuration: FilledButtonStyle.Configuration) -> Color {
            if !isEnabled {
                return Color.button.opacity(0.5)
            } else if configuration.isPressed {
                return .buttonPressed
            }
            return .button
        }
    }
}
