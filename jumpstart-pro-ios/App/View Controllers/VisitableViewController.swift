import Turbo

class VisitableViewController: Turbo.VisitableViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .white
    }

    // MARK: Visitable

    override func visitableDidRender() {
        navigationItem.title = visitableView.webView?.title
    }
}
