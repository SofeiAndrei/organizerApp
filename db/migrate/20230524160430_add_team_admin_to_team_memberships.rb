class AddTeamAdminToTeamMemberships < ActiveRecord::Migration[7.0]
  def change
    add_column :team_memberships, :team_admin, :boolean, default: false
  end
end
