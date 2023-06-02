class CalendarEventInvitation < ApplicationRecord
  belongs_to :user
  belongs_to :calendar_event

  validates :user_id, presence: true
  validates :calendar_event_id, presence: true

  enum answer: { no_answer: 1, yes: 2, no: 3, organizer: 4 }
end
