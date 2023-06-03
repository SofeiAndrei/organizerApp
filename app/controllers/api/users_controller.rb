class Api::UsersController < ApplicationController
  before_action :logged_in_user
  before_action :correct_user, only: [:calendar_filtered_events]

  def search_users
    user_limit_for_search = 5

    if params[:search_input] == ''
      render json: { users: {} }
    else
      users = if params[:search_by_id] == 'true'
                User.where(activated: true).where.not(id: params[:already_selected_ids])
                  &.find_by(id: params[:search_input].to_i)
              else
                User.where(activated: true).where.not(id: params[:already_selected_ids])
                  &.where("name ILIKE '#{params[:search_input]}%'")&.limit(user_limit_for_search)
              end
      render json: { users: users }
    end
  end

  def calendar_filtered_events
    selected_team_projects_ids = params[:filters][:team_projects_ids]
    personal_checked = params[:filters][:personal] == 'true'
    selected_teams_ids = personal_checked ? [nil] : []
    selected_teams_ids.concat(params[:filters][:teams_ids]) if params[:filters][:teams_ids]

    calendar_events = []
    tasks = @user.tasks
    user_calendar_events = @user.events_invited_to.includes(:invited_users, :calendar_event_invitations).where(team_id: selected_teams_ids)

    if selected_team_projects_ids
      calendar_events.concat(format_tasks(tasks[:assigned_tasks].where(team_project_id: selected_team_projects_ids), false, 0))
    end
    calendar_events.concat(format_tasks(tasks[:individual_tasks], true, calendar_events.length)) if personal_checked
    calendar_events.concat(format_events(user_calendar_events, calendar_events.length))

    render json: { events: calendar_events }
  end

  private

  def correct_user
    @user = User.find(params[:id])
    redirect_to(root_url) unless current_user?(@user)
  end
end
