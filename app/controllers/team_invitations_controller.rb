class TeamInvitationsController < ApplicationController
  before_action :logged_in_user
  before_action :invited_user_or_team_admin, only: :destroy
  before_action :team_admin, only: :create

  def create
    puts params.inspect
    @user = User.find(params[:invited_id])
    @team = Team.find(params[:team_id])
    @team.invite_user(@user)
  end

  def destroy

  end

  private

  def team_admin
    @team = Team.find(params[:team_id])
    redirect_to(root_url) unless @team.team_admin?(current_user)
  end

  def invited_user_or_team_admin
    @team = Team.find(params[:team_id])
    @user = User.find(params[:invited_id])
    redirect_to(root_url) unless @team.team_admin?(current_user) || current_user?(@user)
  end
end
