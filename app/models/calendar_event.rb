class CalendarEvent < ApplicationRecord
  belongs_to :organizer, class_name: 'User', foreign_key: :organizer_id
  belongs_to :team, optional: true

  validates :name, presence: true,
                   length: { minimum: 5, maximum: 40 }
  validates :description, length: { maximum: 256 }
end
