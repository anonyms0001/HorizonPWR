import Foundation

func onMainThread(work: @escaping () -> Void) {
    Thread.isMainThread ? work() : DispatchQueue.main.async(execute: work)
}
