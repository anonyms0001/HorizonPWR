
![.github/workflows/ci.yml](https://github.com/HorizonPWR2/horizonpwr-rails/workflows/.github/workflows/ci.yml/badge.svg)

**Notes:**
Tuple
Rubymine
Postico
Check with lead developer for needed keys 

#### Requirements
macOS 10.14.2 or later
Most current Xcode’s Command Line Tools 
Homebrew 
rbenv 
Rails 5.2 or higher
Ruby 3.0.0 or higher
postgres (PostgreSQL) 13.2 or higher
Heroku CLI

You'll need the following installed to run the template successfully:

* Xcode Command Line Tools
  If needed run `xcode-select --install`
* Homebrew 
  Run in terminal first `brew update` 
  If that didn't work install Homebrew with `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)`
  After running either run `brew services` to manage background services with macOS
* rbenv
  Run `brew install rbenv` then `rbenv init`
* Ruby 3.0.0
  Run `rbenv install 3.0.0`
[comment]: <> (  Run `rbenv local 3.0.0` &#40;inside the repo&#41; )
* bundler - `gem install bundler:2.2.13`  
* Redis - For ActionCable support (and Sidekiq, caching, etc) - `brew install redis` then `brew services start redis`
* PostgreSQL - `brew install postgresql` then `brew services start postgresql`
* Imagemagick - `brew install imagemagick`
* Yarn - `brew install yarn` or [Install Yarn](https://yarnpkg.com/en/docs/install)
* Foreman (optional) - `gem install foreman` - helps run all your
  processes in development
* Heroku Cli
  run `brew tap heroku/brew && brew install heroku`


#### Initial Setup
* Clone Git Repo (You should have been invited to access the Github HorizonPWR2 - horizonpwr-rails repo)
  Run in parent directory `git clone https://github.com/HorizonPWR2/horizonpwr-rails.git`
* Add postgresql user (if not yet setup)
  run `psql postgres -U your_username ;` (replace your_username placeholder with desired username)
* Run rake task `rake db:drop db:create`
* Run heroku commands to download and import dump from the pwrstation-review instance

  `heroku pg:backups:capture --app pwrstation-review`
  
  `heroku pg:backups:download --app pwrstation-review`
  
  `pg_restore --verbose --clean --no-acl --no-owner -h localhost -U your_username -d horizonpwr_development latest.dump`
  
* Setup Rails app
  run `bin/setup` to install Rubygem and Javascript dependencies. This will also install foreman system wide for you and setup your database.
    This will kick off a few processes including:
      Yarn update
      bundle install
      etc
* Initialize Ruby app then open this URL in the browser http://localhost:3000  
  Run `rails start` 
  Run `foreman start` 
  

#### Running PWRStation
Run this command to spin up everything
`foreman start`

Otherwise, you'll need to spin up several processes in different
terminals. Only do this for troubleshooting:
(See Procfile & Procfile.dev for latest info on processes that are started by foreman)

```bash
rails server

# Your background workers
sidekiq # or whatever you're using

# Optionally, the webpack dev server for automatically reloading JS and CSS changes
bin/webpack-dev-server

# Stripe requires webhooks for SCA payments
stripe listen --forward-to localhost:5000/webhooks/stripe
```

#### optional
* [Stripe CLI](https://stripe.com/docs/stripe-cli) for Stripe webhooks in development - `brew install stripe/stripe-cli/stripe`
* [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html#command-line-installer---all-users) for AWS to download attachments in development - Highly recommended
    ```
    curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
    sudo installer -pkg AWSCLIV2.pkg -target /
    ```


#### Git Process
git st
git add -p
bundle exec standardrb --fix
bundle exec brakeman
git add -p
# `rails test:all` Runs both of the following, but may cause unexpected errors. We recommend running both separately.
    rails test
    rails test test/system
git commit -m '[#tracker_id]'
git pull origin master -r
git push origin master

##### If You Get Errors When Running Tests
```bash
Errno::EMFILE: Failed to open TCP connection to 127.0.0.1:9515 (Too many open files - socket(2) for "127.0.0.1" port 9515)
```
Solution:
Run the following in your console: `ulimit -n 1024`
This will increase the max open file limit until you restart your terminal.
- http://woshub.com/too-many-open-files-error-linux/

#### ERD (Entity-Relationship Diagrams)
rake erd title='PWRStation' exclude="Pay::Charge, Pay::Subscription, User::ConnectedAccount, Plan, ApiToken" attributes="foreign_keys"


#### Credentials
`env EDITOR="vi" bin/rails credentials:edit --environment=development`


#### Running Rails Console in Production
`RAILS_ENV=production rails c`


#### Deploy
When you make a push to origin/master if the build passes, it will automatically deploy to Review
In order to deploy to staging, you can use Heroku CLI with the following command.
Be careful with this command, if you forget any part of it, and you have production access, then it will default to 
deploying to production. Do not use this command unless you are completely comfortable fixing any issues that could arise 
from any mistake with its use.

`heroku pipelines:promote -a pwrstation-review --to pwrstation-staging`

OR you can do that from slack with

`/promote pwrstation from development to staging`


#### Get a latest copy of the review database
`rake db:drop db:create`
`heroku pg:backups:capture --app pwrstation-review`
`heroku pg:backups:download --app pwrstation-review`
`pg_restore --verbose --clean --no-acl --no-owner -h localhost -U admin -d horizonpwr_development latest.dump`

When restoring from a backup, be aware that latest.dump is an intentionally ignored file in the repo. If you are 
restoring your local from a heroku back up. Make sure that you have removed any previous latest.dump* files to avoid 
restoring an older back up copy. When download a new back up, if a latest.dump already exists, it will create a 
latest.dump1, latest.dump2, etc.


#### See salesforce api limits
`rake import_salesforce:limits`


#### log in bookmark
`javascript:(function(){var d=document;s=d.querySelector;s.call(d,'input[name*=email]').value='willard.moore@horizonpwr.com'; s.call(d,'input[name*=pass]').value='123123';s.call(d,'form').submit(); }())`


#### Notes & Todos
Running `rails notes` in the console will display every place you have put the following in a comment:
- TODO
- NOTE
- FIXME
- OPTIMIZE

We are currently only using TODO and NOTE, and I suggest we keep it that way, for simplicity, since optimizing and fixing
code are TODO items.


#### Whenever/Cron
If you update schedule.rb, run this:
`whenever --update-crontab`
