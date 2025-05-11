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

ActiveRecord::Schema[8.0].define(version: 2025_05_05_134336) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "admins", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_admins_on_user_id"
  end

  create_table "blood_test_results", force: :cascade do |t|
    t.bigint "patient_id", null: false
    t.bigint "blood_work_type_id", null: false
    t.integer "measured_value"
    t.string "measured_unit"
    t.datetime "measured_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["blood_work_type_id"], name: "index_blood_test_results_on_blood_work_type_id"
    t.index ["patient_id"], name: "index_blood_test_results_on_patient_id"
  end

  create_table "blood_work_types", force: :cascade do |t|
    t.string "name"
    t.string "units"
    t.integer "min"
    t.integer "max"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "active", default: true
  end

  create_table "doctor_patients", force: :cascade do |t|
    t.bigint "doctor_id", null: false
    t.bigint "patient_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["doctor_id"], name: "index_doctor_patients_on_doctor_id"
    t.index ["patient_id"], name: "index_doctor_patients_on_patient_id"
  end

  create_table "doctors", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "speciality"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_doctors_on_user_id"
  end

  create_table "lab_teches", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_lab_teches_on_user_id"
  end

  create_table "patients", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_patients_on_user_id"
  end

  create_table "scheduled_blood_works", force: :cascade do |t|
    t.bigint "patient_id", null: false
    t.bigint "blood_work_type_id", null: false
    t.datetime "appointment_time"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "approved", default: false, null: false
    t.datetime "approved_at"
    t.boolean "rejected", default: false, null: false
    t.datetime "rejected_at"
    t.boolean "cancelled", default: false, null: false
    t.datetime "cancelled_at"
    t.index ["blood_work_type_id"], name: "index_scheduled_blood_works_on_blood_work_type_id"
    t.index ["patient_id"], name: "index_scheduled_blood_works_on_patient_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "name"
    t.string "email", null: false
    t.string "contact_number"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "password_digest"
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  add_foreign_key "admins", "users"
  add_foreign_key "blood_test_results", "blood_work_types"
  add_foreign_key "blood_test_results", "patients"
  add_foreign_key "doctor_patients", "doctors"
  add_foreign_key "doctor_patients", "patients"
  add_foreign_key "doctors", "users"
  add_foreign_key "lab_teches", "users"
  add_foreign_key "patients", "users"
  add_foreign_key "scheduled_blood_works", "blood_work_types"
  add_foreign_key "scheduled_blood_works", "patients"
end
