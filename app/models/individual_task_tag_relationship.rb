class IndividualTaskTagRelationship < ApplicationRecord
  belongs_to :individual_task
  belongs_to :individual_task_tag
  validates :individual_task_id, presence: true
  validates :individual_task_tag_id, presence: true
end
