import WebKit

class WebViewSpy: WKWebView {
    private(set) var lastEvaluatedJavaScript: String?

    override func evaluateJavaScript(_ javaScriptString: String, completionHandler: ((Any?, Error?) -> Void)? = nil) {
        lastEvaluatedJavaScript = javaScriptString
    }
}
