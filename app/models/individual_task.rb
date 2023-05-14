class IndividualTask < ApplicationRecord
  belongs_to :user_todo_list
  validates :user_todo_list_id, presence: true
  validates :name, presence: true,
                   length: { minimum: 1, maximum: 20 }

  validates :description, length: { maximum: 256 }

  enum priority: { urgent: 1, high: 2, normal: 3, low: 4 }
end
