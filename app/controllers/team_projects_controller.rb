class TeamProjectsController < ApplicationController
  before_action :logged_in_user
  before_action :load_team
  before_action :team_member, only: [:show]
  before_action :team_admin_or_owner, only: %i[new create edit update destroy]

  def new
    @team_project = TeamProject.new
  end

  def create
    @team.team_projects.build(project_params)
    if @team.save
      flash[:success] = 'Project created successfully!'
      redirect_to team_team_project_path(@team, @team.team_projects.last)
    else
      render 'new'
    end
  end

  def show
    @team_project = TeamProject.find(params[:id])
    @team_members = @team.members
  end

  def edit
    @team_project = TeamProject.find(params[:id])
  end

  def update
    @team_project = TeamProject.find(params[:id])
    if @team_project.update(project_params)
      flash[:success] = 'Changes saved successfully!'
      redirect_to team_team_project_path(@team_project.team, @team_project)
    else
      render 'edit'
    end
  end

  def destroy
    team_project = TeamProject.find(params[:id])
    team = team_project.team
    team_project.destroy
    flash[:success] = 'Deleted project successfully'
    redirect_to team_path(team)
  end

  private

  def project_params
    params.require(:team_project).permit(:name, :team_id)
  end

  def load_team
    @team = Team.find(params[:team_id])
  end

  def team_member
    redirect_to(root_url) unless @team.team_member?(current_user)
  end

  def team_admin_or_owner
    redirect_to(root_url) unless @team.team_admin?(current_user) || current_user?(@team.owner)
  end
end
