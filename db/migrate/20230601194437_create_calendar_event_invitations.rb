class CreateCalendarEventInvitations < ActiveRecord::Migration[7.0]
  def change
    create_table :calendar_event_invitations do |t|
      t.integer :user_id
      t.integer :calendar_event_id
      t.integer :answer, default: 1

      t.timestamps
    end
    add_index :calendar_event_invitations, [:user_id]
    add_index :calendar_event_invitations, [:calendar_event_id]
    add_index :calendar_event_invitations, %i[user_id calendar_event_id],
              unique: true, name: 'index_event_invitation_on_user_id_and_calendar_event_id'
  end
end
