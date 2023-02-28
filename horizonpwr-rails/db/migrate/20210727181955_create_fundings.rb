class CreateFundings < ActiveRecord::Migration[6.1]
  def change
    create_table :fundings do |t|
      t.datetime :approved_at
      t.datetime :denied_at
      t.datetime :loan_docs_signed_at
      t.datetime :application_submitted_at
      t.integer :amount
      t.datetime :coc_sent_at
      t.datetime :coc_signed_at
      t.datetime :invoice_sent_at
      t.references :project, null: false, foreign_key: true
      t.references :finance_partner, null: false, foreign_key: true

      t.timestamps
    end
  end
end
