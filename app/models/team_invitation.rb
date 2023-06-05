class TeamInvitation < ApplicationRecord
  belongs_to :team
  belongs_to :invited, class_name: 'User'

  validates :team_id, presence: true
  validates :invited_id, presence: true

  def team_name
    team.name
  end
end
