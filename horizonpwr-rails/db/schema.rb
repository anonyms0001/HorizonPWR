# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2022_04_05_190521) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_stat_statements"
  enable_extension "plpgsql"

  create_table "account_invitations", force: :cascade do |t|
    t.bigint "account_id", null: false
    t.bigint "invited_by_id"
    t.string "token", null: false
    t.string "name", null: false
    t.string "email", null: false
    t.jsonb "roles", default: {}, null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["account_id"], name: "index_account_invitations_on_account_id"
    t.index ["invited_by_id"], name: "index_account_invitations_on_invited_by_id"
    t.index ["token"], name: "index_account_invitations_on_token", unique: true
  end

  create_table "account_users", force: :cascade do |t|
    t.bigint "account_id"
    t.bigint "user_id"
    t.jsonb "roles", default: {}, null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "default_consultant_id"
    t.index ["account_id"], name: "index_account_users_on_account_id"
    t.index ["default_consultant_id"], name: "index_account_users_on_default_consultant_id"
    t.index ["user_id"], name: "index_account_users_on_user_id"
  end

  create_table "accounts", force: :cascade do |t|
    t.string "name", null: false
    t.bigint "owner_id"
    t.boolean "personal", default: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "processor"
    t.string "processor_id"
    t.datetime "trial_ends_at"
    t.string "card_type"
    t.string "card_last4"
    t.string "card_exp_month"
    t.string "card_exp_year"
    t.text "extra_billing_info"
    t.string "domain"
    t.string "subdomain"
    t.boolean "active", default: false
    t.string "canvass_team_id"
    t.bigint "installer_id"
    t.text "historic_canvass_team_ids", default: [], array: true
    t.index ["installer_id"], name: "index_accounts_on_installer_id"
    t.index ["owner_id"], name: "index_accounts_on_owner_id"
  end

  create_table "action_text_embeds", force: :cascade do |t|
    t.string "url"
    t.jsonb "fields"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "action_text_rich_texts", force: :cascade do |t|
    t.string "name", null: false
    t.text "body"
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["record_type", "record_id", "name"], name: "index_action_text_rich_texts_uniqueness", unique: true
  end

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.bigint "user_id"
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
    t.index ["user_id"], name: "index_active_storage_attachments_on_user_id"
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.bigint "byte_size", null: false
    t.string "checksum", null: false
    t.datetime "created_at", null: false
    t.string "service_name", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "addresses", force: :cascade do |t|
    t.string "address"
    t.decimal "latitude"
    t.decimal "longitude"
    t.string "address_type"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "salesforce_lead_id"
    t.string "salesforce_opportunity_id"
    t.string "street"
    t.string "city"
    t.string "state"
    t.string "postal_code"
    t.string "canvass_address_id"
    t.string "number"
    t.boolean "archived", default: false, null: false
    t.index ["canvass_address_id"], name: "index_addresses_on_canvass_address_id"
    t.index ["salesforce_lead_id"], name: "index_addresses_on_salesforce_lead_id"
    t.index ["salesforce_opportunity_id"], name: "index_addresses_on_salesforce_opportunity_id"
  end

  create_table "adjustments", force: :cascade do |t|
    t.decimal "amount", null: false
    t.string "adjustable_type", null: false
    t.bigint "adjustable_id", null: false
    t.boolean "pay_back", default: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["adjustable_type", "adjustable_id"], name: "index_adjustments_on_adjustable"
  end

  create_table "announcements", force: :cascade do |t|
    t.string "kind"
    t.string "title"
    t.datetime "published_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "api_tokens", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "token"
    t.string "name"
    t.jsonb "metadata", default: {}
    t.boolean "transient", default: false
    t.datetime "last_used_at"
    t.datetime "expires_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["token"], name: "index_api_tokens_on_token", unique: true
    t.index ["user_id"], name: "index_api_tokens_on_user_id"
  end

  create_table "applicants", force: :cascade do |t|
    t.string "first_name"
    t.string "last_name"
    t.string "email"
    t.string "phone"
    t.string "status", default: "new"
    t.bigint "user_id"
    t.bigint "job_position_id"
    t.bigint "dynamic_form_id"
    t.boolean "previously_employed_here"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "new_email"
    t.string "secure_public_id"
    t.datetime "start_date"
    t.bigint "created_by_id"
    t.bigint "account_id"
    t.string "middle_initial"
    t.bigint "canvass_user_id"
    t.index ["account_id"], name: "index_applicants_on_account_id"
    t.index ["created_by_id"], name: "index_applicants_on_created_by_id"
    t.index ["dynamic_form_id"], name: "index_applicants_on_dynamic_form_id"
    t.index ["job_position_id"], name: "index_applicants_on_job_position_id"
    t.index ["secure_public_id"], name: "index_applicants_on_secure_public_id", unique: true
    t.index ["user_id"], name: "index_applicants_on_user_id"
  end

  create_table "appointments", force: :cascade do |t|
    t.string "appointment_status", default: "scheduled", null: false
    t.string "appointment_status_reason"
    t.string "appointment_type", null: false
    t.string "source", default: "pwrstation"
    t.bigint "created_by_id"
    t.bigint "scheduled_with_id"
    t.bigint "account_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "project_id"
    t.bigint "created_by_position_id"
    t.string "salesforce_opportunity_id"
    t.string "salesforce_residential_project_id"
    t.string "canvass_appointment_id"
    t.bigint "address_id"
    t.datetime "start_at"
    t.datetime "end_at"
    t.boolean "archived", default: false, null: false
    t.bigint "held_by_id"
    t.datetime "held_at"
    t.boolean "held"
    t.bigint "consult_id"
    t.string "held_reason"
    t.bigint "installer_account_id"
    t.string "appointment_subtype"
    t.jsonb "task_completion", default: {}, null: false
    t.datetime "completed_at"
    t.boolean "failed"
    t.index ["account_id"], name: "index_appointments_on_account_id"
    t.index ["address_id"], name: "index_appointments_on_address_id"
    t.index ["canvass_appointment_id"], name: "index_appointments_on_canvass_appointment_id"
    t.index ["consult_id"], name: "index_appointments_on_consult_id"
    t.index ["created_by_id"], name: "index_appointments_on_created_by_id"
    t.index ["created_by_position_id"], name: "index_appointments_on_created_by_position_id"
    t.index ["held_by_id"], name: "index_appointments_on_held_by_id"
    t.index ["installer_account_id"], name: "index_appointments_on_installer_account_id"
    t.index ["project_id"], name: "index_appointments_on_project_id"
    t.index ["salesforce_opportunity_id"], name: "index_appointments_on_salesforce_opportunity_id"
    t.index ["salesforce_residential_project_id"], name: "index_appointments_on_salesforce_residential_project_id"
    t.index ["scheduled_with_id"], name: "index_appointments_on_scheduled_with_id"
  end

  create_table "calendar_notes", force: :cascade do |t|
    t.boolean "global"
    t.datetime "date"
    t.boolean "active", default: true, null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "concessions", force: :cascade do |t|
    t.decimal "amount"
    t.bigint "project_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["project_id"], name: "index_concessions_on_project_id"
  end

  create_table "contact_addresses", force: :cascade do |t|
    t.boolean "primary_contact"
    t.bigint "address_id", null: false
    t.bigint "contact_id", null: false
    t.bigint "project_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["address_id"], name: "index_contact_addresses_on_address_id"
    t.index ["contact_id"], name: "index_contact_addresses_on_contact_id"
    t.index ["project_id"], name: "index_contact_addresses_on_project_id"
  end

  create_table "contact_appointments", force: :cascade do |t|
    t.bigint "appointment_id", null: false
    t.bigint "contact_id", null: false
    t.bigint "project_id"
    t.bigint "address_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["address_id"], name: "index_contact_appointments_on_address_id"
    t.index ["appointment_id"], name: "index_contact_appointments_on_appointment_id"
    t.index ["contact_id"], name: "index_contact_appointments_on_contact_id"
    t.index ["project_id"], name: "index_contact_appointments_on_project_id"
  end

  create_table "contacts", force: :cascade do |t|
    t.string "first_name"
    t.string "last_name"
    t.string "email"
    t.string "phone"
    t.bigint "user_id"
    t.bigint "account_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "salesforce_lead_id"
    t.string "salesforce_opportunity_id"
    t.string "lead_source"
    t.string "phone1"
    t.string "canvass_contact_id"
    t.datetime "birth_date"
    t.boolean "gender"
    t.boolean "archived", default: false, null: false
    t.string "secure_public_id"
    t.integer "active_campaign_id"
    t.index ["account_id"], name: "index_contacts_on_account_id"
    t.index ["active_campaign_id"], name: "index_contacts_on_active_campaign_id", unique: true
    t.index ["canvass_contact_id"], name: "index_contacts_on_canvass_contact_id"
    t.index ["salesforce_lead_id"], name: "index_contacts_on_salesforce_lead_id"
    t.index ["salesforce_opportunity_id"], name: "index_contacts_on_salesforce_opportunity_id"
    t.index ["secure_public_id"], name: "index_contacts_on_secure_public_id", unique: true
    t.index ["user_id"], name: "index_contacts_on_user_id"
  end

  create_table "contests", force: :cascade do |t|
    t.string "name"
    t.datetime "start_at"
    t.datetime "end_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "departments", force: :cascade do |t|
    t.string "name"
    t.boolean "active", default: true
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "dynamic_forms", force: :cascade do |t|
    t.string "model", null: false
    t.string "use_case", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "sequential", default: false
  end

  create_table "earning_rates", force: :cascade do |t|
    t.decimal "amount", null: false
    t.integer "range_top"
    t.integer "range_bottom"
    t.bigint "earning_type_id", null: false
    t.boolean "active", default: true
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["earning_type_id"], name: "index_earning_rates_on_earning_type_id"
  end

  create_table "earning_types", force: :cascade do |t|
    t.string "name", null: false
    t.string "display_name", null: false
    t.boolean "preferred_financial_option", null: false
    t.integer "percent", null: false
    t.bigint "job_position_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["job_position_id"], name: "index_earning_types_on_job_position_id"
  end

  create_table "earnings", force: :cascade do |t|
    t.bigint "downline_earning_id"
    t.bigint "payout_rate_variant_id", null: false
    t.bigint "address_id", null: false
    t.bigint "project_id"
    t.decimal "amount"
    t.decimal "unit", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "status", default: "pending", null: false
    t.bigint "user_id"
    t.bigint "appointment_id"
    t.index ["address_id"], name: "index_earnings_on_address_id"
    t.index ["appointment_id"], name: "index_earnings_on_appointment_id"
    t.index ["downline_earning_id"], name: "index_earnings_on_downline_earning_id"
    t.index ["payout_rate_variant_id"], name: "index_earnings_on_payout_rate_variant_id"
    t.index ["project_id"], name: "index_earnings_on_project_id"
    t.index ["user_id"], name: "index_earnings_on_user_id"
  end

  create_table "energy_consumptions", force: :cascade do |t|
    t.text "monthly_usage", default: "--- []\n"
    t.bigint "proposal_id", null: false
    t.bigint "updated_by_id"
    t.bigint "created_by_id"
    t.string "data_source"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.text "daily_usage", default: "--- []\n"
    t.index ["created_by_id"], name: "index_energy_consumptions_on_created_by_id"
    t.index ["proposal_id"], name: "index_energy_consumptions_on_proposal_id"
    t.index ["updated_by_id"], name: "index_energy_consumptions_on_updated_by_id"
  end

  create_table "events", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "account_id"
    t.string "eventable_type", null: false
    t.bigint "eventable_id", null: false
    t.string "action"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["account_id"], name: "index_events_on_account_id"
    t.index ["eventable_type", "eventable_id"], name: "index_events_on_eventable"
    t.index ["user_id"], name: "index_events_on_user_id"
  end

  create_table "feedbacks", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "status", default: "new", null: false
    t.string "title", null: false
    t.string "tracker_id"
    t.string "purpose", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "votes_count", default: 0, null: false
    t.integer "weight"
    t.index ["user_id"], name: "index_feedbacks_on_user_id"
  end

  create_table "field_configs", force: :cascade do |t|
    t.bigint "form_config_id", null: false
    t.string "title", null: false
    t.string "label"
    t.string "field_type", null: false
    t.text "options", array: true
    t.integer "position"
    t.boolean "active", default: true, null: false
    t.boolean "required", null: false
    t.boolean "repeatable", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "eventable_action"
    t.index ["form_config_id"], name: "index_field_configs_on_form_config_id"
  end

  create_table "field_responses", force: :cascade do |t|
    t.bigint "form_response_id", null: false
    t.bigint "field_config_id", null: false
    t.text "response"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "last_updated_by_id"
    t.index ["field_config_id"], name: "index_field_responses_on_field_config_id"
    t.index ["form_response_id"], name: "index_field_responses_on_form_response_id"
    t.index ["last_updated_by_id"], name: "index_field_responses_on_last_updated_by_id"
  end

  create_table "finance_partners", force: :cascade do |t|
    t.string "name"
    t.boolean "active", default: true
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "form_configs", force: :cascade do |t|
    t.string "title"
    t.boolean "active", default: true
    t.integer "position"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "dynamic_form_id", null: false
    t.index ["dynamic_form_id"], name: "index_form_configs_on_dynamic_form_id"
  end

  create_table "form_responses", force: :cascade do |t|
    t.string "respondable_type", null: false
    t.bigint "respondable_id", null: false
    t.bigint "dynamic_form_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "form_config_id", null: false
    t.index ["dynamic_form_id"], name: "index_form_responses_on_dynamic_form_id"
    t.index ["form_config_id"], name: "index_form_responses_on_form_config_id"
    t.index ["respondable_type", "respondable_id"], name: "index_form_responses_on_respondable"
  end

  create_table "funding_payments", force: :cascade do |t|
    t.datetime "received_at"
    t.decimal "amount"
    t.bigint "funding_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "payment_type", null: false
    t.index ["funding_id"], name: "index_funding_payments_on_funding_id"
  end

  create_table "fundings", force: :cascade do |t|
    t.datetime "approved_at"
    t.datetime "denied_at"
    t.datetime "loan_docs_signed_at"
    t.datetime "application_submitted_at"
    t.integer "amount"
    t.datetime "coc_sent_at"
    t.datetime "coc_signed_at"
    t.datetime "invoice_sent_at"
    t.bigint "project_id", null: false
    t.bigint "finance_partner_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.datetime "sent_to_collections_at"
    t.bigint "sent_to_collections_by_id"
    t.index ["finance_partner_id"], name: "index_fundings_on_finance_partner_id"
    t.index ["project_id"], name: "index_fundings_on_project_id"
    t.index ["sent_to_collections_by_id"], name: "index_fundings_on_sent_to_collections_by_id"
  end

  create_table "incoming_webhooks", force: :cascade do |t|
    t.boolean "has_been_run", default: false, null: false
    t.jsonb "payload", null: false
    t.string "event_type"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "installers", force: :cascade do |t|
    t.string "name"
    t.boolean "active"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "salesforce_installer_id"
    t.index ["salesforce_installer_id"], name: "index_installers_on_salesforce_installer_id"
  end

  create_table "job_positions", force: :cascade do |t|
    t.string "name"
    t.boolean "active", default: true, null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "hiring", default: false
    t.boolean "hiring_public", default: false
    t.boolean "leadership", default: false
    t.bigint "department_id"
    t.index ["department_id"], name: "index_job_positions_on_department_id"
  end

  create_table "note_user_permissions", force: :cascade do |t|
    t.bigint "note_id", null: false
    t.bigint "user_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["note_id"], name: "index_note_user_permissions_on_note_id"
    t.index ["user_id"], name: "index_note_user_permissions_on_user_id"
  end

  create_table "notes", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "account_id"
    t.bigint "installer_id"
    t.string "notable_type", null: false
    t.bigint "notable_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "installer_invited", default: false
    t.text "users_to_notify", default: "--- []\n"
    t.bigint "canvass_note_id"
    t.index ["account_id"], name: "index_notes_on_account_id"
    t.index ["installer_id"], name: "index_notes_on_installer_id"
    t.index ["notable_type", "notable_id"], name: "index_notes_on_notable"
    t.index ["user_id"], name: "index_notes_on_user_id"
  end

  create_table "notification_tokens", force: :cascade do |t|
    t.bigint "user_id"
    t.string "token", null: false
    t.string "platform", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_id"], name: "index_notification_tokens_on_user_id"
  end

  create_table "notifications", force: :cascade do |t|
    t.bigint "account_id"
    t.string "recipient_type", null: false
    t.bigint "recipient_id", null: false
    t.string "type"
    t.jsonb "params"
    t.datetime "read_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.datetime "interacted_at"
    t.index ["account_id"], name: "index_notifications_on_account_id"
    t.index ["recipient_type", "recipient_id"], name: "index_notifications_on_recipient_type_and_recipient_id"
  end

  create_table "pay_charges", force: :cascade do |t|
    t.bigint "owner_id"
    t.string "processor", null: false
    t.string "processor_id", null: false
    t.integer "amount", null: false
    t.integer "amount_refunded"
    t.string "card_type"
    t.string "card_last4"
    t.string "card_exp_month"
    t.string "card_exp_year"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "owner_type"
    t.jsonb "data"
    t.index ["owner_id"], name: "index_pay_charges_on_owner_id"
  end

  create_table "pay_subscriptions", id: :serial, force: :cascade do |t|
    t.integer "owner_id"
    t.string "name", null: false
    t.string "processor", null: false
    t.string "processor_id", null: false
    t.string "processor_plan", null: false
    t.integer "quantity", default: 1, null: false
    t.datetime "trial_ends_at"
    t.datetime "ends_at"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string "status"
    t.string "owner_type"
    t.jsonb "data"
  end

  create_table "payout_line_items", force: :cascade do |t|
    t.bigint "payout_id", null: false
    t.string "itemable_type", null: false
    t.bigint "itemable_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["itemable_type", "itemable_id"], name: "index_payout_line_items_on_itemable"
    t.index ["payout_id"], name: "index_payout_line_items_on_payout_id"
  end

  create_table "payout_rate_variants", force: :cascade do |t|
    t.bigint "payout_id", null: false
    t.bigint "earning_rate_id", null: false
    t.bigint "earning_type_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["earning_rate_id"], name: "index_payout_rate_variants_on_earning_rate_id"
    t.index ["earning_type_id"], name: "index_payout_rate_variants_on_earning_type_id"
    t.index ["payout_id"], name: "index_payout_rate_variants_on_payout_id"
  end

  create_table "payouts", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.date "pay_date", null: false
    t.integer "pay_total"
    t.string "status", default: "pending", null: false
    t.bigint "approved_by_id"
    t.datetime "approved_at"
    t.bigint "paid_by_id"
    t.datetime "paid_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["approved_by_id"], name: "index_payouts_on_approved_by_id"
    t.index ["paid_by_id"], name: "index_payouts_on_paid_by_id"
    t.index ["user_id"], name: "index_payouts_on_user_id"
  end

  create_table "pending_job_positions", force: :cascade do |t|
    t.string "status", null: false
    t.bigint "job_position_id", null: false
    t.bigint "user_id", null: false
    t.date "effective_at", null: false
    t.bigint "created_by_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["created_by_id"], name: "index_pending_job_positions_on_created_by_id"
    t.index ["job_position_id"], name: "index_pending_job_positions_on_job_position_id"
    t.index ["user_id"], name: "index_pending_job_positions_on_user_id"
  end

  create_table "performance_stats", force: :cascade do |t|
    t.datetime "start_at", null: false
    t.datetime "end_at", null: false
    t.integer "position"
    t.jsonb "kpi", default: {}, null: false
    t.string "accountable_type", null: false
    t.bigint "accountable_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "kpi_type"
    t.index ["accountable_type", "accountable_id"], name: "index_performance_stats_on_accountable"
  end

  create_table "plans", force: :cascade do |t|
    t.string "name", null: false
    t.integer "amount", default: 0, null: false
    t.string "interval", null: false
    t.jsonb "details", default: {}, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "trial_period_days", default: 0
    t.boolean "hidden"
  end

  create_table "project_feeds", force: :cascade do |t|
    t.bigint "project_id", null: false
    t.string "project_feedable_type", null: false
    t.bigint "project_feedable_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["project_feedable_type", "project_feedable_id"], name: "index_project_feeds_on_project_feedable"
    t.index ["project_id"], name: "index_project_feeds_on_project_id"
  end

  create_table "projects", force: :cascade do |t|
    t.bigint "installer_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "salesforce_residential_project_id"
    t.string "salesforce_opportunity_id"
    t.bigint "address_id"
    t.bigint "finance_partner_id"
    t.boolean "energy_efficiency_pack"
    t.decimal "system_size"
    t.string "status", default: "new"
    t.jsonb "install_types", default: {}, null: false
    t.bigint "account_id"
    t.bigint "sold_by_id"
    t.integer "solar_array_count"
    t.index ["account_id"], name: "index_projects_on_account_id"
    t.index ["address_id"], name: "index_projects_on_address_id"
    t.index ["finance_partner_id"], name: "index_projects_on_finance_partner_id"
    t.index ["installer_id"], name: "index_projects_on_installer_id"
    t.index ["salesforce_opportunity_id"], name: "index_projects_on_salesforce_opportunity_id"
    t.index ["salesforce_residential_project_id"], name: "index_projects_on_salesforce_residential_project_id"
    t.index ["sold_by_id"], name: "index_projects_on_sold_by_id"
  end

  create_table "proposals", force: :cascade do |t|
    t.bigint "appointment_id"
    t.string "completion_state", default: "new", null: false
    t.bigint "design_by_id"
    t.datetime "design_started_at"
    t.datetime "design_completed_at"
    t.bigint "quality_control_by_id"
    t.integer "quality_control_section_step", default: 1
    t.integer "quality_control_step", default: 1
    t.datetime "quality_control_started_at"
    t.datetime "quality_control_completed_at"
    t.boolean "blocked", default: false, null: false
    t.string "blocked_on"
    t.string "reason_incomplete"
    t.bigint "project_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "address_id"
    t.text "aurora_project_id"
    t.text "aurora_project_source"
    t.text "aurora_design_id"
    t.datetime "aurora_design_completed_at"
    t.datetime "aurora_design_requested_at"
    t.bigint "aurora_project_linked_by_id"
    t.boolean "archived", default: false, null: false
    t.bigint "blocked_by_id"
    t.datetime "blocked_at"
    t.index ["address_id"], name: "index_proposals_on_address_id"
    t.index ["appointment_id"], name: "index_proposals_on_appointment_id"
    t.index ["aurora_project_linked_by_id"], name: "index_proposals_on_aurora_project_linked_by_id"
    t.index ["blocked_by_id"], name: "index_proposals_on_blocked_by_id"
    t.index ["design_by_id"], name: "index_proposals_on_design_by_id"
    t.index ["project_id"], name: "index_proposals_on_project_id"
    t.index ["quality_control_by_id"], name: "index_proposals_on_quality_control_by_id"
  end

  create_table "referrals", force: :cascade do |t|
    t.bigint "referrer_contact_id"
    t.bigint "referral_contact_id"
    t.string "email", null: false
    t.string "phone"
    t.string "first_name", null: false
    t.string "last_name", null: false
    t.bigint "contest_id"
    t.string "status", default: "to_contact", null: false
    t.string "eligible", default: "unchecked", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "referrer_first_name"
    t.string "referrer_last_name"
    t.string "referrer_address"
    t.string "referrer_phone"
    t.string "referrer_email"
    t.integer "user_id"
    t.index ["contest_id"], name: "index_referrals_on_contest_id"
    t.index ["referral_contact_id"], name: "index_referrals_on_referral_contact_id"
    t.index ["referrer_contact_id"], name: "index_referrals_on_referrer_contact_id"
  end

  create_table "taggings", id: :serial, force: :cascade do |t|
    t.integer "tag_id"
    t.string "taggable_type"
    t.integer "taggable_id"
    t.string "tagger_type"
    t.integer "tagger_id"
    t.string "context", limit: 128
    t.datetime "created_at"
    t.index ["context"], name: "index_taggings_on_context"
    t.index ["tag_id", "taggable_id", "taggable_type", "context", "tagger_id", "tagger_type"], name: "taggings_idx", unique: true
    t.index ["tag_id"], name: "index_taggings_on_tag_id"
    t.index ["taggable_id", "taggable_type", "context"], name: "taggings_taggable_context_idx"
    t.index ["taggable_id", "taggable_type", "tagger_id", "context"], name: "taggings_idy"
    t.index ["taggable_id"], name: "index_taggings_on_taggable_id"
    t.index ["taggable_type"], name: "index_taggings_on_taggable_type"
    t.index ["tagger_id", "tagger_type"], name: "index_taggings_on_tagger_id_and_tagger_type"
    t.index ["tagger_id"], name: "index_taggings_on_tagger_id"
  end

  create_table "tags", id: :serial, force: :cascade do |t|
    t.string "name"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer "taggings_count", default: 0
    t.index ["name"], name: "index_tags_on_name", unique: true
  end

  create_table "upline_relations", force: :cascade do |t|
    t.bigint "upline_id", null: false
    t.bigint "downline_id", null: false
    t.bigint "created_by_id", null: false
    t.boolean "active", default: true
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["created_by_id"], name: "index_upline_relations_on_created_by_id"
    t.index ["downline_id"], name: "index_upline_relations_on_downline_id"
    t.index ["upline_id"], name: "index_upline_relations_on_upline_id"
  end

  create_table "user_connected_accounts", force: :cascade do |t|
    t.bigint "user_id"
    t.string "provider"
    t.string "uid"
    t.string "encrypted_access_token"
    t.string "encrypted_access_token_iv"
    t.string "encrypted_access_token_secret"
    t.string "encrypted_access_token_secret_iv"
    t.string "refresh_token"
    t.datetime "expires_at"
    t.text "auth"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["encrypted_access_token_iv"], name: "index_connected_accounts_access_token_iv", unique: true
    t.index ["encrypted_access_token_secret_iv"], name: "index_connected_accounts_access_token_secret_iv", unique: true
    t.index ["user_id"], name: "index_user_connected_accounts_on_user_id"
  end

  create_table "user_filters", force: :cascade do |t|
    t.text "name", null: false
    t.text "filter", null: false
    t.bigint "user_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_id"], name: "index_user_filters_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.string "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string "unconfirmed_email"
    t.string "first_name"
    t.string "last_name"
    t.string "time_zone"
    t.datetime "accepted_terms_at"
    t.datetime "accepted_privacy_at"
    t.datetime "announcements_read_at"
    t.boolean "admin"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "invitation_token"
    t.datetime "invitation_created_at"
    t.datetime "invitation_sent_at"
    t.datetime "invitation_accepted_at"
    t.integer "invitation_limit"
    t.string "invited_by_type"
    t.bigint "invited_by_id"
    t.integer "invitations_count", default: 0
    t.string "preferred_language"
    t.boolean "active", default: false
    t.date "start_date"
    t.date "birth_date"
    t.date "end_date"
    t.string "shirt_size"
    t.string "shoe_size"
    t.string "personal_email"
    t.string "phone"
    t.string "end_reason"
    t.bigint "job_position_id"
    t.string "salesforce_account_id"
    t.text "extra_salesforce_account_ids", default: [], array: true
    t.string "canvass_user_id"
    t.boolean "otp_required_for_login"
    t.string "otp_secret"
    t.integer "last_otp_timestep"
    t.text "otp_backup_codes"
    t.jsonb "permissions", default: {}, null: false
    t.string "secure_public_id"
    t.text "aurora_user_id"
    t.boolean "aurora_user_active", default: false
    t.boolean "canvass_user_active"
    t.datetime "last_seen_at"
    t.boolean "archived", default: false, null: false
    t.boolean "onboarding_checklist_complete", default: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["invitation_token"], name: "index_users_on_invitation_token", unique: true
    t.index ["invitations_count"], name: "index_users_on_invitations_count"
    t.index ["invited_by_id"], name: "index_users_on_invited_by_id"
    t.index ["invited_by_type", "invited_by_id"], name: "index_users_on_invited_by_type_and_invited_by_id"
    t.index ["job_position_id"], name: "index_users_on_job_position_id"
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["secure_public_id"], name: "index_users_on_secure_public_id", unique: true
  end

  create_table "votes", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "feedback_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["feedback_id"], name: "index_votes_on_feedback_id"
    t.index ["user_id"], name: "index_votes_on_user_id"
  end

  add_foreign_key "account_invitations", "accounts"
  add_foreign_key "account_invitations", "users", column: "invited_by_id"
  add_foreign_key "account_users", "accounts"
  add_foreign_key "account_users", "users"
  add_foreign_key "account_users", "users", column: "default_consultant_id"
  add_foreign_key "accounts", "installers"
  add_foreign_key "accounts", "users", column: "owner_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "api_tokens", "users"
  add_foreign_key "applicants", "accounts"
  add_foreign_key "applicants", "dynamic_forms"
  add_foreign_key "applicants", "job_positions"
  add_foreign_key "applicants", "users"
  add_foreign_key "applicants", "users", column: "created_by_id"
  add_foreign_key "appointments", "accounts"
  add_foreign_key "appointments", "addresses"
  add_foreign_key "appointments", "appointments", column: "consult_id"
  add_foreign_key "appointments", "job_positions", column: "created_by_position_id"
  add_foreign_key "appointments", "projects"
  add_foreign_key "appointments", "users", column: "created_by_id"
  add_foreign_key "appointments", "users", column: "held_by_id"
  add_foreign_key "appointments", "users", column: "scheduled_with_id"
  add_foreign_key "concessions", "projects"
  add_foreign_key "contact_addresses", "addresses"
  add_foreign_key "contact_addresses", "contacts"
  add_foreign_key "contact_addresses", "projects"
  add_foreign_key "contact_appointments", "addresses"
  add_foreign_key "contact_appointments", "appointments"
  add_foreign_key "contact_appointments", "contacts"
  add_foreign_key "contact_appointments", "projects"
  add_foreign_key "contacts", "accounts"
  add_foreign_key "contacts", "users"
  add_foreign_key "earning_rates", "earning_types"
  add_foreign_key "earning_types", "job_positions"
  add_foreign_key "earnings", "addresses"
  add_foreign_key "earnings", "appointments"
  add_foreign_key "earnings", "earnings", column: "downline_earning_id"
  add_foreign_key "earnings", "payout_rate_variants"
  add_foreign_key "earnings", "projects"
  add_foreign_key "earnings", "users"
  add_foreign_key "energy_consumptions", "proposals"
  add_foreign_key "energy_consumptions", "users", column: "created_by_id"
  add_foreign_key "energy_consumptions", "users", column: "updated_by_id"
  add_foreign_key "events", "accounts"
  add_foreign_key "events", "users"
  add_foreign_key "feedbacks", "users"
  add_foreign_key "field_configs", "form_configs"
  add_foreign_key "field_responses", "field_configs"
  add_foreign_key "field_responses", "form_responses"
  add_foreign_key "field_responses", "users", column: "last_updated_by_id"
  add_foreign_key "form_responses", "dynamic_forms"
  add_foreign_key "form_responses", "form_configs"
  add_foreign_key "funding_payments", "fundings"
  add_foreign_key "fundings", "finance_partners"
  add_foreign_key "fundings", "projects"
  add_foreign_key "fundings", "users", column: "sent_to_collections_by_id"
  add_foreign_key "note_user_permissions", "notes"
  add_foreign_key "note_user_permissions", "users"
  add_foreign_key "notes", "accounts"
  add_foreign_key "notes", "installers"
  add_foreign_key "notes", "users"
  add_foreign_key "payout_line_items", "payouts"
  add_foreign_key "payout_rate_variants", "earning_rates"
  add_foreign_key "payout_rate_variants", "earning_types"
  add_foreign_key "payout_rate_variants", "payouts"
  add_foreign_key "payouts", "users"
  add_foreign_key "payouts", "users", column: "approved_by_id"
  add_foreign_key "payouts", "users", column: "paid_by_id"
  add_foreign_key "pending_job_positions", "job_positions"
  add_foreign_key "pending_job_positions", "users"
  add_foreign_key "pending_job_positions", "users", column: "created_by_id"
  add_foreign_key "project_feeds", "projects"
  add_foreign_key "projects", "accounts"
  add_foreign_key "projects", "finance_partners"
  add_foreign_key "projects", "installers"
  add_foreign_key "projects", "users", column: "sold_by_id"
  add_foreign_key "proposals", "appointments"
  add_foreign_key "proposals", "projects"
  add_foreign_key "proposals", "users", column: "aurora_project_linked_by_id"
  add_foreign_key "proposals", "users", column: "blocked_by_id"
  add_foreign_key "proposals", "users", column: "design_by_id"
  add_foreign_key "proposals", "users", column: "quality_control_by_id"
  add_foreign_key "referrals", "contacts", column: "referral_contact_id"
  add_foreign_key "referrals", "contacts", column: "referrer_contact_id"
  add_foreign_key "referrals", "contests"
  add_foreign_key "taggings", "tags"
  add_foreign_key "upline_relations", "users", column: "created_by_id"
  add_foreign_key "upline_relations", "users", column: "downline_id"
  add_foreign_key "upline_relations", "users", column: "upline_id"
  add_foreign_key "user_connected_accounts", "users"
  add_foreign_key "user_filters", "users"
  add_foreign_key "votes", "feedbacks"
  add_foreign_key "votes", "users"
end
