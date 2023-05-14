class Api::IndividualTasksController < ApplicationController
  before_action :load_todo_list
  before_action :correct_user

  def create
    puts params.inspect
    @individual_task = @user_todo_list.individual_tasks.build(individual_task_params)
    if @individual_task.save
      flash[:success] = 'Task Created!'
    else
      flash[:danger] = 'There was a problem creating the task'
    end
    # redirect_to user_user_todo_list_path(current_user, @user_todo_list)
  end

  def update
    @individual_task = IndividualTask.find(params[:id])
    if @individual_task.update(individual_task_params)
      flash[:success] = 'Changes saved successfully!'
    end
  end

  def destroy
    individual_task = IndividualTask.find(params[:id]).destroy
    flash[:success] = 'Deleted task successfully'
  end

  private

  def individual_task_params
    params.require(:individual_task).permit(:name, :description, :priority, :completed)
          .tap { |whitelisted| whitelisted[:priority] = params[:individual_task][:priority].to_i }
  end

  def load_todo_list
    @user_todo_list = UserTodoList.find(params[:user_todo_list_id])
  end

  def correct_user
    @user = @user_todo_list.user
    redirect_to root_url unless current_user?(@user)
  end
end