class TeamMembershipsController < ApplicationController
  before_action :logged_in_user
  before_action :user_or_team_admin, only: :destroy

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
    @team_membership = TeamMembership.includes(:member, team: :team_projects).find(params[:id])
    @member = @team_membership.member
    @team_projects_ids = @team_membership.team.team_projects.pluck(:id)
    TeamProjectTask.where(team_project_id: @team_projects_ids, assignee_id: @member.id).update_all(assignee_id: nil)
    @team_membership.destroy
  end

  private

  def user_or_team_admin
    team_membership = TeamMembership.find(params[:id])
    member = team_membership.member
    team = team_membership.team

    redirect_to root_url unless current_user?(member) || team.team_admin?(current_user)
  end
end
