every 1.day, at: "1:00 am" do
  rake "-s heroku restart --app pwrstation-#{environment}" unless environment == "production"
  rake "-s heroku restart --app pwrstation-prod" if environment == "production"
end

every 1.hour do
  rake "-s generate:future_payouts"
end

every :sunday, at: "12:01 am" do
  rake "-s generate:future_payouts"
  # rake "-s generate:prepare_pending_payouts" TODO:
  # rake "-s generate:prepare_pending_payouts" TODO:
  # TODO: Project Status:      https://www.pivotaltracker.com/story/show/179906943
  # TODO: Lost Earning Status: https://www.pivotaltracker.com/story/show/179906555
  # TODO: Bonuses:             https://www.pivotaltracker.com/story/show/179907550
end
