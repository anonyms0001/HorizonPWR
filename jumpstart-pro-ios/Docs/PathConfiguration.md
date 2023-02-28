# Path Configuration

The Path Configuration is a feature of Turbo Native that is used for defining settings and rules for your application. 

Read the official [Hotwire docs on the Path Configuration](https://github.com/hotwired/turbo-ios/blob/main/Docs/PathConfiguration.md) to learn the basics.

We've added some built-in functionality to the Path Configuration for Jumpstart Pro apps.

### Remote Configuration

Jumpstart Pro extends the PathConfiguration to load remotely from your Rails application. This allows you to deploy changes to your iOS app without releasing a new iOS app version.

It will fallback to the Path Configuration hardcoded in your iOS app if the remote configuration cannot be loaded.

On iOS, the file is located at `App/Configuration/PathConfiguration.json`.  This is loaded synchronously on app launch.

After launch, `/path_configuration.json` is loaded asynchronously. If this is different than the local file the tabs will be reloaded to match the remote configuration.

### Tab Configuration

The Tabs in the Turbo Native app are configurable using the Path Configuration. 

```json
{
  "settings": {
      "tabs": [
          {
              "title": "Posts",
              "path": "/posts",
              "system_image_name": "note.text"
          },
          {
              "title": "What's New",
              "path": "/announcements",
              "system_image_name": "megaphone"
          }
      ]
  },
}
```

Each `settings.tabs` entry consistes of 3 keys:

* `title` - the text displayed on the tab
* `path` - the url to load for this tab
* `system_image_name` - the [SF Symbols](https://developer.apple.com/sf-symbols/) icon for the tab

### Rules

You can use rules to define how specific URLs should be handled.

For example:

```
{
  "rules": [
    {
      "patterns": [
        "/new$",
        "/edit$"
      ],
      "properties": {
        "presentation": "modal"
      }
    },
  ]
}
```

This will match any `/new` and `/edit` routes and present them as modals rather than pushing them to the stack.

You can also use this to trigger native flows.

#### VisitProposal

When the `Session` proposes a visit, it looks up the path properties for the proposed visit url if it has a `pathConfiguration` and it passes those path properties to your app in the `VisitProposal` via `proposal.properties`. This is for convenience, but you can also use the path configuration directly and do the same lookup in your application code.

### Path Properties

You can add your own functionality by adding to the `VisitProposal` extension defined in the iOS app. We've added some helpers that you can use as a starting point for adding your own.

```swift
var isAuthenticationFlow: Bool { flow == "authentication" }
var isModalPresentation: Bool { presentation == "modal" }
var isUpdatePasswordFlow: Bool { flow == "update_password" }
```

### Session Coordinator

The session coordinator's navigate method uses these properties to determine how to handle visits.

For example, this looks at the `VisitProposal` to see if it needs to be presented as a modal and then handles it appropriately:

```swift
private func navigate(to viewController: UIViewController, via proposal: VisitProposal) {
  if proposal.isModalPresentation {
    presentCancellableModal(rootViewController: viewController)
  }
}
```

You can add to this method for handling other options.

### SessionDelegate

Breaking out into a native view is handled using the SessionDelegate's session method. Here we check the `VisitProposal` for different flows for native views and trigger them.

```swift
extension SessionCoordinator: SessionDelegate {
  func session(_ session: Session, didProposeVisit proposal: VisitProposal) {
    if proposal.isAuthenticationFlow {
      pushAuthenticationCoordinator()
    } else if proposal.isUpdatePasswordFlow {
      pushUpdatePasswordCoordinator()
    } else {
      visit(proposal)
    }
  }
}
```