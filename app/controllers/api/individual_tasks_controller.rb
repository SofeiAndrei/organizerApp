class Api::IndividualTasksController < ApplicationController
  before_action :logged_in_user
  before_action :load_todo_list
  before_action :correct_user

  def create
    puts params.inspect
    @individual_task = @user_todo_list.individual_tasks.build(individual_task_params)
    puts @individual_task.inspect
    if @individual_task.save
      flash[:success] = 'Task Created!'
    else
      flash[:danger] = 'There was a problem creating the task'
    end
  end

  def update
    @individual_task = IndividualTask.find(params[:id])
    permitted_params = individual_task_params

    task_params = {
      name: permitted_params[:name],
      description: permitted_params[:description],
      priority: permitted_params[:priority],
      deadline: permitted_params[:deadline],
      completed: permitted_params[:completed]
    }
    return unless @individual_task.update(task_params)

    flash[:success] = 'Changes saved successfully!'
    tags_ids = permitted_params[:tags].map { |tag| tag[:id] }
    tags = IndividualTaskTag.where(id: tags_ids) # new tags
    set_tags = @individual_task.individual_task_tags # old tags

    deleted_old_tags = []
    new_added_tags = []
    # Remove deleted tasks
    set_tags.each do |old_tag|
      deleted_old_tags.append(old_tag) unless tags.include? old_tag
    end
    # Add newly added tags
    tags.each do |new_tag|
      new_added_tags.append(new_tag) unless set_tags.include? new_tag
      set_tags << new_tag unless set_tags.include? new_tag
    end
    set_tags.delete(deleted_old_tags) unless deleted_old_tags.empty?
  end

  def destroy
    IndividualTask.find(params[:id]).destroy
    flash[:success] = 'Deleted task successfully'
  end

  private

  def individual_task_params
    params.require(:individual_task).permit(:name, :description, :priority, :deadline, :completed, tags: %i[id name user_todo_list_id created_at updated_at])
          .tap { |whitelisted| whitelisted[:priority] = params[:individual_task][:priority].to_i.zero? ? params[:individual_task][:priority] : params[:individual_task][:priority].to_i }
  end

  def load_todo_list
    @user_todo_list = UserTodoList.find(params[:user_todo_list_id])
  end

  def correct_user
    puts @user_todo_list
    @user = @user_todo_list.user
    redirect_to root_url unless current_user?(@user)
  end
end
