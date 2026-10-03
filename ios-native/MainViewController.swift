import UIKit
import Capacitor

// Registers the app's own Print plugin with Capacitor, and keeps the page from
// zooming or sliding sideways (the app is laid out to fit the screen width).
class MainViewController: CAPBridgeViewController {
    override open func capacitorDidLoad() {
        bridge?.registerPluginInstance(PrintPlugin())
        if let scrollView = bridge?.webView?.scrollView {
            scrollView.alwaysBounceHorizontal = false
            scrollView.showsHorizontalScrollIndicator = false
            scrollView.bouncesZoom = false
        }
    }
}
