class CreateTeamProjectTasks < ActiveRecord::Migration[7.0]
  def change
    create_table :team_project_tasks do |t|
      t.references :team_project, null: false, foreign_key: true
      t.string :name
      t.text :description
      t.integer :priority, default: 3
      t.integer :status, default: 1
      t.date :deadline

      t.timestamps
    end

    add_index :team_project_tasks, %i[team_project_id created_at],
              name: 'team_project_tasks_index_on_team_project_id_and_created_at'
  end
end
