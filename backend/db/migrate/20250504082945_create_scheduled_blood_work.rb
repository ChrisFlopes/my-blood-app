class CreateScheduledBloodWork < ActiveRecord::Migration[8.0]
  def change
    create_table :scheduled_blood_works do |t|
      t.references :patient, null: false, foreign_key: true
      t.references :blood_work_type, null: false, foreign_key: true
      t.datetime :appointment_time

      t.timestamps
    end
  end
end
