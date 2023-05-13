class CreateIndividualTasks < ActiveRecord::Migration[7.0]
  def change
    create_table :individual_tasks do |t|
      t.references :user_todo_list, null: false, foreign_key: true
      t.string :name
      t.text :description
      t.boolean :completed, default: false
      t.integer :priority, default: 3

      t.timestamps
    end

    add_index :individual_tasks, %i[user_todo_list_id completed priority created_at],
              name: 'individual_tasks_index_on_list_id_completed_priority_create_at'
  end
end
