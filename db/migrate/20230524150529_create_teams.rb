class CreateTeams < ActiveRecord::Migration[7.0]
  def change
    create_table :teams do |t|
      t.string :name
      t.integer :owner_id

      t.timestamps
    end

    add_index :teams, [:owner_id, :created_at]
  end
end
