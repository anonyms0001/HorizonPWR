import Foundation

enum TabError: Error {
    case parsing
}

struct TabParser {
    let tabs: [Tab]

    init(json: AnyHashable?) {
        guard let json = json else {
            logger.notice("No 'tabs' key found in PathConfiguration.json. Defaulting to one Home tab.")
            self.tabs = [Tab.default]
            return
        }

        let decoder = JSONDecoder()
        decoder.keyDecodingStrategy = .convertFromSnakeCase

        do {
            let data = try JSONSerialization.data(withJSONObject: json, options: [])
            self.tabs = try decoder.decode([Tab].self, from: data)
        } catch {
            logger.error("Invalid tab configuration found in PathConfiguration.json. Defaulting to one Home tab.")
            logger.error("\(error)")
            self.tabs = [Tab.default]
            return
        }
    }
}
