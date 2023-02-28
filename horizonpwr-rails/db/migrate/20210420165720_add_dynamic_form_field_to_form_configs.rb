class AddDynamicFormFieldToFormConfigs < ActiveRecord::Migration[6.1]
  disable_ddl_transaction!

  def change
    add_reference :form_configs, :dynamic_form, null: false, index: {algorithm: :concurrently}
  end
end
