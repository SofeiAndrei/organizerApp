class UsersController < ApplicationController
  before_action :logged_in_user, only: [:index, :edit, :update, :destroy, :calendar, :my_teams]
  before_action :load_user, only: %i[edit show update destroy calendar friend_list common_friends]
  before_action :correct_user, only: [:edit, :update, :calendar]
  before_action :correct_user_or_friend, only: [:friend_list]
  before_action :not_same_user, only: [:common_friends]
  before_action :admin_user, only: [:destroy]

  def new
    @user = User.new
  end

  def edit; end

  def show
    redirect_to root_url and return unless @user.activated?
  end

  def create
    @user = User.new(user_params)
    if @user.save
      @user.send_activation_email
      flash[:success] = 'Please check your email to activate your account!'
      redirect_to root_url
      # echivalent cu redirect_to user_url(@user)
    else
      render 'new'
    end
  end

  def update
    if @user.update(user_params)
      flash[:success] = 'Changes saved successfully!'
      redirect_to @user
      # echivalent cu redirect_to user_url(@user)
    else
      render 'edit'
    end
  end

  def index
    # @users = User.all  -> no pagination
    @users = User.where(activated: true).paginate(page: params[:page])
  end

  # Should be available only for admins
  def destroy
    @user.destroy
    flash[:success] = 'Deleted user successfully'
    redirect_to users_url
  end

  def calendar
    now = Time.now
    teams = @user.team_memberships.includes(:team, team: :team_projects).map(&:team)
    team_projects = []
    teams.each { |team| team_projects.concat(team.team_projects) }
    @filters = {
      team_projects: team_projects.map { |team_project| { id: team_project.id, name: team_project.name, team_id: team_project.team_id } },
      teams: teams.map { |team| { id: team.id, name: team.name } },
      personal: true
    }
    @current_date = {
      year: now.year,
      month: now.month - 1,
      day: now.day
    }
  end

  def my_teams
    puts 'My teams'
    @teams = current_user.teams
    @team_invitations = current_user.team_invitations.includes(:team)
  end

  def friend_list
    @friends = @user.friends
    @received_friend_request_from = @user.users_received_friendship_requests_from
  end

  def common_friends
    @common_friends = current_user.common_friends(@user)
  end

  private

  def user_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation)
  end

  def activated_user
    unless activated?
      flash[:danger] = 'Please activate your account'
      redirect_to login_url
    end
  end

  def load_user
    @user = User.find(params[:id])
  end

  def correct_user
    redirect_to(root_url) unless current_user?(@user)
  end

  def admin_user
    redirect_to(root_url) unless current_user.admin?
  end

  def not_same_user
    redirect_to(root_url) if current_user?(@user)
  end

  def correct_user_or_friend
    redirect_to(root_url) unless current_user?(@user) || current_user.friend?(@user)
  end
end
