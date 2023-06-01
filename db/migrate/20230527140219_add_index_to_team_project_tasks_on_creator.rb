class AddIndexToTeamProjectTasksOnCreator < ActiveRecord::Migration[7.0]
  def change
    add_index :team_project_tasks, :creator_id
  end
end
