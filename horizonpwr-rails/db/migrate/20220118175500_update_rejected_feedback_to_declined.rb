class UpdateRejectedFeedbackToDeclined < ActiveRecord::Migration[6.1]
  def up
    Feedback.where(status: "rejected").update_all(status: "declined")
  end

  def down
    Feedback.where(status: "declined").update_all(status: "rejected")
  end
end
