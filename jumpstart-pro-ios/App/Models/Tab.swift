import UIKit

/**
 Tabs power the UITabBarController's tab bar items. They are read from `PathConfiguration.json`.

 `title` and `path` parameters are required. Either `systemImageName` or `imageName` is also required.
 A warning will be logged if an image name is invalid or can't be found.
 A warning will also be logged if no image is set for a tab.

 - Parameters:
   - title: The name of the tab
   - path: Appended to Endpoint.rootURL to create the Visit
   - systemImageName: Optional, the name of the SF Symbols icon to use as the tab image
   - imageName: Optional, the name of the asset from Assets.xcassets to use as the tab image
 */

struct Tab: Decodable, Equatable {
    let title: String
    let path: String
    let systemImageName: String?
    let imageName: String?

    static var bundle = Bundle.main

    var image: UIImage? {
        if let image = systemImage ?? customImage {
            return image
        }

        logger.warning("No image found for \(title) tab. Check your PathConfiguration.json.")
        return nil
    }

    private var systemImage: UIImage? {
        guard let systemImageName = systemImageName
        else { return nil }

        if let image = UIImage(systemName: systemImageName) {
            return image
        }

        logger.warning("\(systemImageName) is not a valid SF Symbols image name. Check your PathConfiguration.json.")
        return nil
    }

    private var customImage: UIImage? {
        guard let imageName = imageName
        else { return nil }

        if let image = UIImage(named: imageName, in: Tab.bundle, with: nil) {
            return image
        }

        logger.warning("\(imageName) could not be found. Did you add it to Assets.xcassets? Check your PathConfiguration.json.")
        return nil
    }
}

extension Tab {
    static var `default`: Tab {
        Tab(title: "Home", path: "/", systemImageName: "house", imageName: nil)
    }
}
