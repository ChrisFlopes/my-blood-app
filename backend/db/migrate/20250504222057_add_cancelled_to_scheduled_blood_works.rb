class AddCancelledToScheduledBloodWorks < ActiveRecord::Migration[8.0]
  def change
    add_column :scheduled_blood_works, :cancelled, :boolean, default: false, null: false
    add_column :scheduled_blood_works, :cancelled_at, :datetime
  end
end
