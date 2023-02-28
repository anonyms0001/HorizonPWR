class CreateProposals < ActiveRecord::Migration[6.1]
  def change
    create_table :proposals do |t|
      t.references :appointment, foreign_key: true
      t.string :completion_state, null: false, default: "new"
      t.references :design_by, foreign_key: {to_table: :users}
      t.datetime :design_started_at
      t.datetime :design_completed_at
      t.references :quality_control_by, foreign_key: {to_table: :users}
      t.integer :quality_control_section_step, default: 1
      t.integer :quality_control_step, default: 1
      t.datetime :quality_control_started_at
      t.datetime :quality_control_completed_at
      t.boolean :blocked, null: false, default: false
      t.string :blocked_on
      t.string :reason_incomplete
      t.references :project, foreign_key: {to_table: :projects}

      t.timestamps
    end
  end
end
