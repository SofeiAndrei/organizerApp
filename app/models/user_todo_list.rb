class UserTodoList < ApplicationRecord
  belongs_to :user
  has_many :individual_tasks, dependent: :destroy
  has_many :individual_task_tags, dependent: :destroy

  validates :user_id, presence: true
  validates :name, presence: true,
                   length: { minimum: 1, maximum: 40 }
end
