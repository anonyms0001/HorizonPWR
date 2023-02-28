@testable import Turbo

class SessionSpy: Session {
    private(set) var reloadWasCalled = false

    override func reload() {
        reloadWasCalled = true
        super.reload()
    }
}
