class Api::TeamProjectsController < ApplicationController
  before_action :logged_in_user
  before_action :load_team_project
  before_action :team_member

  def get_project_tasks
    # tasks = @team_project.team_project_tasks.includes(:individual_task_tags)
    tasks = @team_project.team_project_tasks.includes(:assignee)
    # @tasks = tasks.map { |task| { task: task, tags: task.individual_task_tags } }
    @tasks = tasks.map { |task| { task: task, assignee: task.assignee } }

    render json: { tasks: @tasks }
  end

  private

  def load_team_project
    @team_project = TeamProject.includes(:team, :team_project_tasks).find(params[:id])
  end

  def team_member
    @team = @team_project.team
    redirect_to root_url unless @team.team_member?(current_user)
  end
end
