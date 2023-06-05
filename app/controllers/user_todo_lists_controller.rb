class UserTodoListsController < ApplicationController
  before_action :logged_in_user
  before_action :correct_user, only: %i[show update destroy edit update new create index]
  before_action :load_todo_list, only: %i[edit update destroy show]
  def new
    @user_todo_list = current_user.user_todo_lists.build
  end

  def create
    @user_todo_list = current_user.user_todo_lists.build(name: params[:name])
    if @user_todo_list.save
      flash[:success] = 'To Do List Created!'
      redirect_to user_user_todo_list_path(current_user, @user_todo_list)
    else
      flash[:danger] = 'There has been a problem creating the To Do List'
      render 'user_todo_lists/index'
    end
  end

  def show
    @tags = @user_todo_list.individual_task_tags.map { |tag| { id: tag.id, name: tag.name } }
  end

  def edit; end

  def update
    if @user_todo_list.update(user_todo_list_params)
      flash[:success] = 'Changes saved successfully!'
      redirect_to user_user_todo_list_path(@user, @user_todo_list)
    else
      render 'edit'
    end
  end

  def index
    @user_todo_lists = UserTodoList.where(user_id: params[:user_id]).includes(:individual_tasks).paginate(page: params[:page])
  end

  def destroy
    # user_todo_list = UserTodoList.find(params[:id]).destroy
    @user_todo_list.destroy
    flash[:success] = 'Deleted todo list successfully'
    respond_to do |f|
      f.html { redirect_to user_user_todo_lists_path(current_user) }
    end
  end

  private

  def user_todo_list_params
    params.require(:user_todo_list).permit(:name)
  end

  def load_todo_list
    @user_todo_list = UserTodoList.find(params[:id])
  end

  def correct_user
    @user = User.find(params[:user_id])
    redirect_to root_url unless current_user?(@user)
  end
end
