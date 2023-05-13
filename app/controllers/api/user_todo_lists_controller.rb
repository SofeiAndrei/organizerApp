class Api::UserTodoListsController < ApplicationController
  before_action :logged_in_user
  before_action :correct_user

  def get_tasks
    @tasks = @user_todo_list.individual_tasks
    puts json: {tasks: @tasks}
    render json: { tasks: @tasks }
  end

  private

  def correct_user
    @user_todo_list = current_user.user_todo_lists.find(params[:id])
    redirect_to root_url if @user_todo_list.nil?
  end
end
