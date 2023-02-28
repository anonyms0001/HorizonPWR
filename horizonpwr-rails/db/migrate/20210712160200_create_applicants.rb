class CreateApplicants < ActiveRecord::Migration[6.1]
  def change
    create_table :applicants do |t|
      t.string :first_name
      t.string :last_name
      t.string :email
      t.string :phone
      t.string :status, default: "new"
      t.references :user, foreign_key: true
      t.references :job_position, foreign_key: true
      t.references :dynamic_form, foreign_key: true
      t.boolean :previously_employed_here

      t.timestamps
    end
  end
end
