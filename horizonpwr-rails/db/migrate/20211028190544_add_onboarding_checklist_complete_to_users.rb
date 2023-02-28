class AddOnboardingChecklistCompleteToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :onboarding_checklist_complete, :boolean, default: false
  end
end
