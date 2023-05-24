class TeamMembershipsController < ApplicationController
  before_action :logged_in_user
  # before_action :user_or_team_admin, only: :destroy

  def create
  end

  def destroy
  end

  private

  def user_or_team_admin
    team_membership = TeamMembership.find(params[:id])
    member = team_membership.member
    redirect_to root_url unless current_user?(member)

    team = team_membership.team
    redirect_to root_url unless team.team_admin?(current_user)
  end
end
