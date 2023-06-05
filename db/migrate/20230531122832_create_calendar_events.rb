class CreateCalendarEvents < ActiveRecord::Migration[7.0]
  def change
    create_table :calendar_events do |t|
      t.string :name
      t.text :description
      t.integer :organizer_id, null: false, foreign_key: true
      t.integer :team_id, default: nil
      t.datetime :event_start
      t.datetime :event_end
      t.boolean :all_day_event, default: false

      t.timestamps
    end
    add_index :calendar_events, %i[organizer_id team_id]
  end
end
