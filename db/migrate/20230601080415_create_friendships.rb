class CreateFriendships < ActiveRecord::Migration[7.0]
  def change
    create_table :friendships do |t|
      t.integer :sender_id
      t.integer :receiver_id

      t.timestamps
    end
    add_index :friendships, :receiver_id
    add_index :friendships, :sender_id
    add_index :friendships, %i[receiver_id sender_id], unique: true
  end
end
