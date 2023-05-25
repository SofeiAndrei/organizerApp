class TeamsController < ApplicationController
  before_action :logged_in_user
  before_action :team_member, only: [:show]
  before_action :team_owner, only: [:edit, :update, :destroy]

  def new
    @team = Team.new
  end

  def create
    @team = Team.new(team_params)
    if @team.save
      flash[:success] = 'Team created successfully!'
      @team.add_member(current_user, true)
      redirect_to @team
    else
      render 'new'
    end
  end

  def show
    @team = Team.includes(:invited_users, :members).find(params[:id])
  end

  def edit
    @team = Team.find(params[:id])
  end

  def update
    @team = Team.find(params[:id])
    if @team.update(team_params)
      flash[:success] = 'Changes saved successfully!'
      redirect_to @team
    else
      render 'edit'
    end
  end

  def destroy
    team = Team.find(params[:id]).destroy
    flash[:success] = 'Deleted team successfully'

    respond_to do |f|
      f.html { redirect_to user_user_todo_lists_path(current_user) }
    end
  end

  private

  def team_params
    params.require(:team).permit(:name, :owner_id)
  end

  def team_member
    @team = Team.find(params[:id])
    redirect_to(root_url) unless @team.team_member?(current_user)
  end

  def team_owner
    @team = Team.find(params[:id])
    redirect_to(root_url) unless current_user?(@team.owner)
  end
end
