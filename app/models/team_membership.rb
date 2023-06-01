class TeamMembership < ApplicationRecord
  belongs_to :team
  belongs_to :member, class_name: 'User'

  validates :team_id, presence: true
  validates :member_id, presence: true
end
