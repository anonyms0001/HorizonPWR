# Coordinators

The idea of the Coordinator pattern is to create a separate entity — a `Coordinator` — which is responsible for the application’s flow. The `Coordinator` encapsulates a part of the application. The `Coordinator` knows nothing of its parent `Coordinator`, but it can start its child `Coordinators`.

We use this pattern in Jumpstart Pro iOS to organize the application.

You can learn more about this pattern here:

* https://www.raywenderlich.com/158-coordinator-tutorial-for-ios-getting-started
* https://www.hackingwithswift.com/articles/71/how-to-use-the-coordinator-pattern-in-ios-apps