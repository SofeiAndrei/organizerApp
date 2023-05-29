class CreateTeamProjects < ActiveRecord::Migration[7.0]
  def change
    create_table :team_projects do |t|
      t.string :name
      t.references :team, null: false, foreign_key: true

      t.timestamps
    end

    add_index :team_projects, %i[team_id created_at]
  end
end
