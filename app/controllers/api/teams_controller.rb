class Api::TeamsController < ApplicationController
  before_action :logged_in_user
  before_action :load_team
  before_action :team_member

  def calendar_filtered_events
    calendar_events = []

    selected_team_projects_ids = params[:filters][:team_projects_ids]
    selected_team_members_ids = params[:filters][:team_members_ids].map { |member_id| member_id == '' ? nil : member_id }

    tasks = @team.tasks.where(team_project_id: selected_team_projects_ids, assignee_id: selected_team_members_ids)
    team_calendar_events = @team.calendar_events.includes(:invited_users, :calendar_event_invitations)

    calendar_events.concat(format_tasks(tasks, false, 0))
    calendar_events.concat(format_events(team_calendar_events, calendar_events.length))

    render json: { events: calendar_events }
  end

  private

  def load_team
    @team = Team.find(params[:id])
  end

  def team_member
    redirect_to(root_url) unless @team.team_member?(current_user)
  end
end
