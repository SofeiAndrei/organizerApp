class IndividualTask < ApplicationRecord
  belongs_to :user_todo_list
  has_many :individual_task_tag_relationships, foreign_key: :individual_task_id,
                                               class_name: 'IndividualTaskTagRelationship',
                                               dependent: :destroy
  has_many :individual_task_tags, through: :individual_task_tag_relationships, source: :individual_task_tag
  # accepts_nested_attributes_for :individual_task_tag_relationships, allow_destroy: true

  validates :user_todo_list_id, presence: true
  validates :name, presence: true,
                   length: { minimum: 1, maximum: 40 }

  validates :description, length: { maximum: 256 }

  enum priority: { urgent: 1, high: 2, normal: 3, low: 4 }
end
