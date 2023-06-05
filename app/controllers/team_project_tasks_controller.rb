class TeamProjectTasksController < ApplicationController
  before_action :logged_in_user
  before_action :load_team
  before_action :load_team_project
  before_action :team_member
  before_action :team_admin, only: :destroy

  def create
    @team_project_task = @team_project.team_project_tasks.build(team_project_task_params)
    @team_project_task.save
  end

  def update
    @team_project_task = TeamProjectTask.find(params[:id])
    permitted_params = team_project_task_params

    task_params = {
      name: permitted_params[:name],
      description: permitted_params[:description],
      priority: permitted_params[:priority],
      deadline: permitted_params[:deadline],
      status: permitted_params[:status],
      assignee_id: permitted_params[:assignee_id].to_i.zero? ? nil : permitted_params[:assignee_id].to_i
    }
    @team_project_task.update(task_params)
  end

  def destroy
    team_project_task = TeamProjectTask.find(params[:id]).destroy
  end

  private

  # def team_project_task_params
  #   params.require(:team_project_task).permit(:name, :description, :priority, :deadline, :status, tags: [:id, :name, :user_todo_list_id, :created_at, :updated_at])
  #         .tap { |whitelisted| whitelisted[:priority] = params[:individual_task][:priority].to_i }
  # end

  def team_project_task_params
    params.require(:team_project_task).permit(:name, :description, :priority, :deadline, :status, :creator_id, :assignee_id)
          .tap do |whitelisted|
            whitelisted[:priority] = params[:team_project_task][:priority].to_i.zero? ? params[:team_project_task][:priority] : params[:team_project_task][:priority].to_i
            whitelisted[:status] = params[:team_project_task][:status].to_i.zero? ? params[:team_project_task][:status] : params[:team_project_task][:status].to_i
          end
  end

  def load_team
    @team = Team.find(params[:team_id])
  end

  def load_team_project
    @team_project = TeamProject.find(params[:team_project_id])
  end

  def team_member
    redirect_to(root_url) unless @team.team_member?(current_user)
  end

  def team_admin
    redirect_to(root_url) unless @team.team_admin?(current_user)
  end
end
