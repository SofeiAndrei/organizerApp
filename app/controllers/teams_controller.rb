class TeamsController < ApplicationController
  before_action :logged_in_user
  before_action :team_member, only: %i[show calendar]
  before_action :team_owner, only: %i[edit update destroy]

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
    @team = Team.includes(:invited_users, :team_projects).find(params[:id])
    @team_invitations = @team.team_invitations
    @team_memberships = @team.team_memberships.includes(:member)
    @members_with_admin_field = @team_memberships.map { |membership| { id: membership.member_id, name: membership.member.name, team_admin: membership.team_admin? } }
  end

  def calendar
    @team = Team.find(params[:id])
    team_projects = @team.team_projects.map do |project|
      {
        id: project.id,
        name: project.name
      }
    end
    team_members = @team.members.map do |member|
      {
        id: member.id,
        name: member.name
      }
    end
    team_members.append({ id: nil, name: 'Unassigned' })
    @filters = {
      team_projects: team_projects,
      team_members: team_members
    }
    now = Time.now
    @current_date = {
      year: now.year,
      month: now.month - 1,
      day: now.day
    }
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
    Team.find(params[:id]).destroy
    flash[:success] = 'Deleted team successfully'

    respond_to do |f|
      f.html { redirect_to my_teams_user_path(current_user) }
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
