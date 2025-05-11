class CreateBloodWorkType < ActiveRecord::Migration[8.0]
  def change
    create_table :blood_work_types do |t|
      t.string :name
      t.string :units
      t.integer :min
      t.integer :max

      t.timestamps
    end
  end
end
