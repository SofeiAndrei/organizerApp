class IndividualTaskTag < ApplicationRecord
  belongs_to :user_todo_list

  validates :name, presence: true,
                   length: { minimum: 2, maximum: 32 }
end
