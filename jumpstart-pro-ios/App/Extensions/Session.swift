import Turbo
import WebKit

protocol SessionScriptMessageHandler: SessionDelegate, ScriptMessageDelegate {}

extension Session {
    convenience init(processPool: WKProcessPool, pathConfiguration: PathConfiguration, delegate: SessionScriptMessageHandler) {
        let webViewConfiguration = WKWebViewConfiguration()
        webViewConfiguration.processPool = processPool

        let scriptMessageHandler = ScriptMessageHandler(delegate: delegate)
        webViewConfiguration.userContentController.add(scriptMessageHandler, name: "nativeApp")
        self.init(webViewConfiguration: webViewConfiguration)

        self.pathConfiguration = pathConfiguration
        self.delegate = delegate
        webView.allowsLinkPreview = false
        webView.customUserAgent = UserAgent.default
    }
}
