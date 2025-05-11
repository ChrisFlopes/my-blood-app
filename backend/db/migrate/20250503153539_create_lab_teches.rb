class CreateLabTeches < ActiveRecord::Migration[8.0]
  def change
    create_table :lab_teches do |t|
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
