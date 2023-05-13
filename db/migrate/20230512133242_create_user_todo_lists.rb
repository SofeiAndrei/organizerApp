class CreateUserTodoLists < ActiveRecord::Migration[7.0]
  def change
    create_table :user_todo_lists do |t|
      t.references :user, null: false, foreign_key: true
      t.string :name

      t.timestamps
    end

    add_index :user_todo_lists, %i[user_id created_at]
  end
end
