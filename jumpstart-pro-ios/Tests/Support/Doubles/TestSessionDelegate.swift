@testable import Jumpstart
import Turbo

class TestSessionDelegate: SessionDelegate {
    func session(_ session: Session, didProposeVisit proposal: VisitProposal) {}
    func session(_ session: Session, didFailRequestForVisitable visitable: Visitable, error: Error) {}
}
