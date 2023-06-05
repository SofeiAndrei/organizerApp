class CreateTeamInvitations < ActiveRecord::Migration[7.0]
  def change
    create_table :team_invitations do |t|
      t.integer :invited_id
      t.integer :team_id

      t.timestamps
    end
    add_index :team_invitations, :invited_id
    add_index :team_invitations, :team_id
    add_index :team_invitations, %i[invited_id team_id], unique: true
  end
end
