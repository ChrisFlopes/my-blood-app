class DropUserRoles < ActiveRecord::Migration[8.0]
  def up
    drop_table :user_roles, if_exists: true
  end

  def down
    create_table :user_roles do |t|
      t.string :name, null: false
      t.timestamps
    end
  end
end
