class UserTodoListsController < ApplicationController
  before_action :logged_in_user, only: [:new, :create, :show, :update, :destroy, :index]
  before_action :correct_user_for_other, only: [:show, :update, :destroy]
  before_action :correct_user_for_index, only: [:new, :index]
  def new
    @user_todo_list = current_user.user_todo_lists.build
  end

  def create
    @user_todo_list = current_user.user_todo_lists.build(name: params[:name])
    if @user_todo_list.save
      flash[:success] = 'To Do List Created!'
      redirect_to user_user_todo_lists_path(current_user)
    else
      flash[:danger] = 'There has been a problem creating the To Do List'
      render 'user_todo_lists/index'
    end
  end

  def show
    @user_todo_list = UserTodoList.find(params[:id])
  end

  def update
  end

  def index
    @user_todo_lists = UserTodoList.where(user_id: params[:user_id]).paginate(page: params[:page])
  end

  def destroy
    user_todo_list = UserTodoList.find(params[:id]).destroy
    flash[:success] = 'Deleted user todo list successfully'
    respond_to do |f|
      f.html { redirect_to user_user_todo_lists_path(current_user) }
    end
  end

  private

  def user_todo_list_params
    params.require(:user_todo_list).permit(:name)
  end

  def correct_user_for_index
    @user = User.find(params[:user_id])
    redirect_to root_url unless current_user?(@user)
  end

  def correct_user_for_other
    @user_todo_list = current_user.user_todo_lists.find(params[:id])
    redirect_to root_url if @user_todo_list.nil?
  end
end
