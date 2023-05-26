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

ActiveRecord::Schema[7.0].define(version: 2023_05_25_112851) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "individual_task_tag_relationships", force: :cascade do |t|
    t.integer "individual_task_id"
    t.integer "individual_task_tag_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["individual_task_id", "individual_task_tag_id"], name: "index_individual_task_tag_relationships_unique", unique: true
    t.index ["individual_task_id"], name: "index_individual_task_tag_relationships_on_task_id"
    t.index ["individual_task_tag_id"], name: "index_individual_task_tag_relationships_on_task_tag_id"
  end

  create_table "individual_task_tags", force: :cascade do |t|
    t.string "name"
    t.bigint "user_todo_list_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_todo_list_id"], name: "index_individual_task_tags_on_user_todo_list_id"
  end

  create_table "individual_tasks", force: :cascade do |t|
    t.bigint "user_todo_list_id", null: false
    t.string "name"
    t.text "description"
    t.boolean "completed", default: false
    t.integer "priority", default: 3
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.date "deadline"
    t.index ["user_todo_list_id", "completed", "priority", "created_at"], name: "individual_tasks_index_on_list_id_completed_priority_create_at"
    t.index ["user_todo_list_id"], name: "index_individual_tasks_on_user_todo_list_id"
  end

  create_table "team_invitations", force: :cascade do |t|
    t.integer "invited_id"
    t.integer "team_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["invited_id", "team_id"], name: "index_team_invitations_on_invited_id_and_team_id", unique: true
    t.index ["invited_id"], name: "index_team_invitations_on_invited_id"
    t.index ["team_id"], name: "index_team_invitations_on_team_id"
  end

  create_table "team_memberships", force: :cascade do |t|
    t.integer "team_id"
    t.integer "member_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "team_admin", default: false
    t.index ["member_id"], name: "index_team_memberships_on_member_id"
    t.index ["team_id", "member_id"], name: "index_team_memberships_on_team_id_and_member_id", unique: true
    t.index ["team_id"], name: "index_team_memberships_on_team_id"
  end

  create_table "teams", force: :cascade do |t|
    t.string "name"
    t.integer "owner_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["owner_id", "created_at"], name: "index_teams_on_owner_id_and_created_at"
  end

  create_table "user_todo_lists", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id", "created_at"], name: "index_user_todo_lists_on_user_id_and_created_at"
    t.index ["user_id"], name: "index_user_todo_lists_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "name"
    t.string "email"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "password_digest"
    t.string "remember_digest"
    t.boolean "admin"
    t.string "activation_digest"
    t.boolean "activated"
    t.datetime "activated_at"
    t.string "reset_digest"
    t.datetime "reset_sent_at"
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "individual_task_tags", "user_todo_lists"
  add_foreign_key "individual_tasks", "user_todo_lists"
  add_foreign_key "user_todo_lists", "users"
end
