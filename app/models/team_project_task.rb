class TeamProjectTask < ApplicationRecord
  belongs_to :team_project
  belongs_to :creator, class_name: 'User', foreign_key: :creator_id
  belongs_to :assignee, class_name: 'User', foreign_key: :assignee_id, optional: true

  validates :team_project_id, presence: true
  validates :creator_id, presence: true
  validates :name, presence: true,
                   length: { minimum: 1, maximum: 40 }
  validates :description, length: { maximum: 256 }

  enum priority: { urgent: 1, high: 2, normal: 3, low: 4 }
  enum status: { backlog: 1, selected_for_development: 2, in_progress: 3, testing: 4, completed: 5 }
end
