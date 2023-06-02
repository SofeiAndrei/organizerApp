class Api::TeamsController < ApplicationController
  before_action :logged_in_user
  before_action :team_member

  def calendar_filtered_events
    calendar_events = []
    tasks = @team.tasks
    team_calendar_events = @team.calendar_events.includes(:invited_users, :calendar_event_invitations)

    calendar_events.concat(format_tasks(tasks, false, 0))
    calendar_events.concat(format_events(team_calendar_events, calendar_events.length))

    render json: { events: calendar_events }
  end

  private

  def team_member
    @team = Team.find(params[:id])
    redirect_to(root_url) unless @team.team_member?(current_user)
  end
end
