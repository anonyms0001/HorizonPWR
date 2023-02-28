class CreateFinancePartners < ActiveRecord::Migration[6.1]
  def change
    create_table :finance_partners do |t|
      t.string :name
      t.boolean :active, default: true

      t.timestamps
    end
    safety_assured do
      add_reference :projects, :finance_partner, foreign_key: {to_table: :finance_partners}
    end
    partners = %w[Generations Sunlight Cash LoanPal Dividend Concert]
    partners.each do |partner|
      FinancePartner.create(name: partner)
    end

    add_column :projects, :energy_efficiency_pack, :boolean
    add_column :projects, :battery, :boolean
  end
end
