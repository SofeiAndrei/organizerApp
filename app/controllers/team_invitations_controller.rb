class TeamInvitationsController < ApplicationController
  before_action :logged_in_user
  before_action :load_invitation, only: %i[destroy reject accept]
  before_action :load_team, only: %i[destroy accept reject]
  before_action :team_admin, only: [:destroy]
  before_action :team_admin_create, only: [:create]
  before_action :invited_user, only: %i[accept reject]

  def create
    puts params.inspect
    @invited_user = User.find(params[:invited_id])
    @team = Team.find(params[:team_id])
    @team.invite_user(@invited_user)
  end

  def destroy
    puts params.inspect
    @team_invitation = TeamInvitation.find(params[:id]).destroy
  end

  def reject
    @team_invitation = TeamInvitation.find(params[:id])
    @team_invitation.destroy
    flash[:success] = "Rejected invitation from #{@team.name}!"
    redirect_to my_teams_user_path(current_user)
  end

  def accept
    @team_invitation = TeamInvitation.find(params[:id])
    @team.add_member(current_user, false)
    @team_invitation.destroy
    flash[:success] = "Accepted invitation from #{@team.name}!"
    redirect_to my_teams_user_path(current_user)
  end

  private

  def load_invitation
    @team_invitation = TeamInvitation.find(params[:id])
  end

  def load_team
    @team = @team_invitation.team
  end

  def team_admin
    redirect_to(root_url) unless @team.team_admin?(current_user)
  end

  def team_admin_create
    @team = Team.find(params[:team_id])
    redirect_to(root_url) unless @team.team_admin?(current_user)
  end

  def invited_user
    @team_invitation = TeamInvitation.find(params[:id])
    @invited_user = @team_invitation.invited
    redirect_to(root_url) unless current_user?(@invited_user)
  end
end
