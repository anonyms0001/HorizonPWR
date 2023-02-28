# Push Notifications

Sending push notifications to mobile devices consists of a few things: registering devices, sending notifications, and removing tokens.

You'll need an Apple Developer account: https://developer.apple.com/account

To update

### Registering for Push Notifications

When users login to your app, Jumpstart Pro uses a Stimulus controller to ask the iOS app to prompt if the user wants to receive push notifications. If they allow notifications, a `NotificationToken` will be created via the API for the current user.

**Note:** Push notifications are not supported in the Simulator. You will see the following message in the logs if you allow notifications in the Simulator.

> **Failed to register for remote notifications: Error Domain=NSCocoaErrorDomain Code=3010 "remote notifications are not supported in the simulator"**

### Sending Push Notifications with RPush

RPush runs as a separate process to send push notifications. This helps with sending notifications in bulk, but it also allows you to check for errors periodically such as when a user deletes your app from their device. You can catch failures and remove the Notification Token from the database so you continue sending push notifications that will fail.

**We recommend using p8 APNs Api for authentication.** It does not require updating a certificate every year like Apns2 does.

[Learn more about RPush](https://github.com/rpush/rpush)

### Unregistering on Logout

When a user logs out, the iOS will make a request to the API to logout. It will pass along the notification token to be deleted as part of this so the user no longer receives push notifications.

### Feedback Service

https://github.com/rpush/rpush/wiki/APNs-Delivery-Failure-Handling

RPush checks for feedback periodically and stores results in the `Rpush::Apns::Feedback` model. Each record contains the device token and a timestamp of when the APNs determined that the app no longer exists on the device.

