class AddAssigneeAndCreatorToTeamProjectTasks < ActiveRecord::Migration[7.0]
  def change
    add_column :team_project_tasks, :assignee_id, :integer
    add_column :team_project_tasks, :creator_id, :integer
  end
end
