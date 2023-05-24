class AddDeadlineToIndividualTasks < ActiveRecord::Migration[7.0]
  def change
    add_column :individual_tasks, :deadline, :date
  end
end
