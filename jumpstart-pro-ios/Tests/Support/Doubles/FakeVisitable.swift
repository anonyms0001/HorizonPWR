import Turbo
import UIKit

class FakeVisitable: Visitable {
    let visitableViewController = UIViewController()
    var visitableDelegate: VisitableDelegate?
    var visitableView: VisitableView!
    var visitableURL: URL!

    func visitableDidRender() {}
}
