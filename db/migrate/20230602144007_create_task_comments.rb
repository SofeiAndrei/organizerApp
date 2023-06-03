class CreateTaskComments < ActiveRecord::Migration[7.0]
  def change
    create_table :task_comments do |t|
      t.references :team_project_task, null: false, foreign_key: true
      t.integer :writer_id
      t.text :content

      t.timestamps
    end
    add_index :task_comments, %i[team_project_task_id created_at]
  end
end
