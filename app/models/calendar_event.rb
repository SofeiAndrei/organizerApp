class CalendarEvent < ApplicationRecord
  belongs_to :organizer, class_name: 'User', foreign_key: :organizer_id
  belongs_to :team, optional: true
  has_many :calendar_event_invitations, dependent: :destroy
  has_many :invited_users, through: :calendar_event_invitations, source: :user

  validates :name, presence: true,
                   length: { minimum: 5, maximum: 40 }
  validates :description, length: { maximum: 256 }
end
