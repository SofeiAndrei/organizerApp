module CalendarHelper
  def format_tasks(tasks, personal, start_index)
    current_index = start_index
    tasks.map do |task|
      current_index += 1
      {
        id: current_index + 1,
        text: task.name,
        start: "#{task.deadline}T00:00:00",
        end: "#{task.deadline}T00:00:00",
        allday: true,
        tags: {
          type: personal ? 'personal_task' : 'team_task',
          task_id: task.id
        }
      }
    end
  end
end

