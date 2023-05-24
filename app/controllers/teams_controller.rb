class TeamsController < ApplicationController
  before_action :logged_in_user
  before_action :is_team_member
  before_action :team_owner, only: [:update, :destroy]

  def create
  end

  def show
  end

  def update
  end

  def destroy
  end

  private

  def is_team_member
    @team = Team.find(params[:id])
    redirect_to(root_url) unless team_member?(@user)
  end

  def team_owner
    @team = Team.find(params[:id])
    redirect_to(root_url) unless current_user == @team.owner
  end
end
