class CreateTeamMemberships < ActiveRecord::Migration[7.0]
  def change
    create_table :team_memberships do |t|
      t.integer :team_id
      t.integer :member_id

      t.timestamps
    end
    add_index :team_memberships, :team_id
    add_index :team_memberships, :member_id
    add_index :team_memberships, %i[team_id member_id], unique: true
  end
end
