# namespace :jumpstart do
#   desc "TODO"
#   task merge_latest: :environment do
#     # !/usr/bin/env ruby
#     require "open3"
#     require "fileutils"
#     include FileUtils
#     # path to your application root.
#     APP_ROOT = File.expand_path("..", __dir__)
#     UPSTREAM = "jumpstart"
#     REPOSITORY_URL = "git@github.com:jumpstart-pro/jumpstart-pro.git"
#     def system!(*args)
#       Open3.capture3(*args) || abort("\n== Command #{args} failed ==")
#     end
#     chdir APP_ROOT do
#       puts "== Updating Jumpstart Pro =="
#       # Add git remote for Jumpstart Pro
#       puts "== Adding Remote =="
#       system! "git", "remote add -f #{UPSTREAM} #{REPOSITORY_URL}"
#       # Get current branch
#       # current_branch, _, _ = system! "git", "branch", "--show-current"
#       # Fetch changes
#       puts "== Fetching changes =="
#       system! "git", "fetch", "jumpstart"
#       # Merge changes
#       puts "== Merging changes =="
#       system! "git", "merge", "jumpstart/master", "--allow-unrelated-histories"
#       puts "== Successfully updated =="
#     end
#   end
# end
