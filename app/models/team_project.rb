class TeamProject < ApplicationRecord
  belongs_to :team
  has_many :team_project_tasks, dependent: :destroy

  validates :team_id, presence: true
  validates :name, presence: true,
                   length: { minimum: 1, maximum: 40 }
end
