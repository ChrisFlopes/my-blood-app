class AddActiveToBloodWorkTypes < ActiveRecord::Migration[8.0]
  def change
    add_column :blood_work_types, :active, :boolean, default: true
  end
end
