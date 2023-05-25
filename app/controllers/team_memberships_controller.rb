class TeamMembershipsController < ApplicationController
  before_action :logged_in_user
  # before_action :user_or_team_admin, only: :destroy

  def create
  end

  def promote
    @team_membership = TeamMembership.find(params[:id])
    if @team_membership.update(team_admin: true)
      flash[:success] = 'User promoted successfully!'
    end
  end

  def demote
    @team_membership = TeamMembership.find(params[:id])
    if @team_membership.update(team_admin: false)
      flash[:success] = 'User demoted successfully!'
    end
  end

  def destroy
    @team_membership = TeamMembership.find(params[:id]).destroy
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
