class AddWeightToFeedbacks < ActiveRecord::Migration[6.1]
  def up
    add_column :feedbacks, :weight, :integer

    Feedback.all.each do |fb|
      fb.note.users_to_notify << fb.votes.map(&:user_id)
      fb.note.users_to_notify = fb.note.users_to_notify.flatten.uniq
      fb.save
    end
  end

  def down
    remove_column :feedbacks, :weight, :integer
  end
end
