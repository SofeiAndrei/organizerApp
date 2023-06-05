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
          description: task.description,
          real_id: task.id,
          all_day_event: true,
          assignee_id: personal ? nil : task.assignee_id
        }
      }
    end
  end

  def format_events(events, start_index)
    current_index = start_index

    events.map do |event|
      mapped_users = event.invited_users.map do |user|
        {
          data: user,
          answer: event.calendar_event_invitations.find_by(user_id: user.id).answer
        }
      end
      current_index += 1
      {
        id: current_index + 1,
        text: event.name,
        start: event.event_start,
        end: event.event_end,
        allday: event.all_day_event,
        tags: {
          type: event.team_id.nil? ? 'personal_event' : 'team_event',
          description: event.description,
          real_id: event.id,
          all_day_event: event.all_day_event,
          organizer_id: event.organizer_id,
          invited_users: mapped_users
        }
      }
    end
  end
end
