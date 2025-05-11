class CreateBloodTestResults < ActiveRecord::Migration[8.0]
  def change
    create_table :blood_test_results do |t|
      t.references :patient, null: false, foreign_key: true
      t.references :blood_work_type, null: false, foreign_key: true
      t.integer :measured_value
      t.string :measured_unit
      t.datetime :measured_at

      t.timestamps
    end
  end
end
