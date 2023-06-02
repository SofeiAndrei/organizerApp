class TaskComment < ApplicationRecord
  belongs_to :team_project_task
  belongs_to :writer, class_name: 'User', foreign_key: :writer_id

  validates :team_project_task_id, presence: true
  validates :writer_id, presence: true
  validates :content, length: { minimum: 1, maximum: 256 }
end
