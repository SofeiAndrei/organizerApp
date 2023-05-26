class UsersController < ApplicationController
  before_action :logged_in_user, only: [:index, :edit, :update, :destroy, :calendar, :my_teams]
  before_action :correct_user, only: [:edit, :update, :calendar]
  before_action :admin_user, only: [:destroy]
  def new
    @user = User.new
  end

  def edit
    # shows view for the edit user page
    @user = User.find(params[:id])
  end

  def show
    @user = User.find(params[:id]) # params fiind parametrul din url
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
    @user = User.find(params[:id])
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
    user = User.find(params[:id]).destroy
    flash[:success] = 'Deleted user successfully'
    redirect_to users_url
  end

  def calendar
    now = Time.now
    @current_date = {
      year: now.year,
      month: now.month - 1,
      day: now.day
    }

    puts now
    puts @current_date
  end

  def my_teams
    puts 'My teams'
    @teams = current_user.teams
    @team_invitations = current_user.team_invitations.includes(:team)
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

  def correct_user
    @user = User.find(params[:id])
    redirect_to(root_url) unless current_user?(@user)
  end

  def admin_user
    redirect_to(root_url) unless current_user.admin?
  end
end
