# Tabs

The app's tabs are dynamically configured via the [Path Configuration](PathConfiguration.md). 

The `tabs` key is expected under `settings` as an array of hashes. For example:

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
              "image_name": "MyCustomImage"
          }
      ]
  },
  "rules": [ ... ]
}
```

The `title` and `path` keys are required for each tab. `title` sets the name of the tab and `path` is appended to the app's root URL - when tapping the tab this URL will be loaded.

The image for the tab can be set with either `system_image_name` or `image_name`. One or the other is required. `system_image_name` expects an icon name from [SF Symbols](https://developer.apple.com/sf-symbols/). `image_name` expects a custom asset name from `Assets.xcassets`.

### Hiding the Tab Bar

The tab bar is hidden if you configure less than 2 Tabs. 

### Menu Button

A Menu button is added to the left navigation bar button item (upper left). Tapping this triggers the Turbo Bridge JavaScript to toggle the nav bar rendered in the HTML.