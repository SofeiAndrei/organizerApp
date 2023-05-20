class CreateIndividualTaskTags < ActiveRecord::Migration[7.0]
  def change
    create_table :individual_task_tags do |t|
      t.string :name
      t.references :user_todo_list, null: false, foreign_key: true

      t.timestamps
    end

    add_index :individual_task_tags, %i[user_todo_list_id]
  end
end
