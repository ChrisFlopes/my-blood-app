class AddApprovedToScheduledBloodWork < ActiveRecord::Migration[8.0]
  def change
    add_column :scheduled_blood_works, :approved, :boolean, default: false, null: false
    add_column :scheduled_blood_works, :approved_at, :datetime
    add_column :scheduled_blood_works, :rejected, :boolean, default: false, null: false
    add_column :scheduled_blood_works, :rejected_at, :datetime
  end
end
