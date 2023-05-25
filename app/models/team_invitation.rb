class TeamInvitation < ApplicationRecord
  belongs_to :team
  belongs_to :invited, class_name: 'User'

  validates :team_id, presence: true
  validates :invited_id, presence: true
end
