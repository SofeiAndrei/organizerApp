class Api::IndividualTaskTagsController < ApplicationController
  before_action :load_todo_list
  before_action :correct_user

  def create
    puts params.inspect
    @individual_task_tag = @user_todo_list.individual_task_tags.build(individual_task_tag_params)
    response = @individual_task_tag.save

    puts response
    if response
      flash[:success] = 'Tag Created!'
      tag = { id: @individual_task_tag.id, name: @individual_task_tag.name }
      render json: tag
    else
      flash[:danger] = 'There was a problem creating the tag'
    end
  end

  def destroy
    individual_task_tag = IndividualTaskTag.find(params[:id]).destroy
    flash[:success] = 'Deleted tag successfully'
  end

  private

  def individual_task_tag_params
    params.require(:individual_task_tag).permit(:name)
  end

  def load_todo_list
    @user_todo_list = UserTodoList.find(params[:user_todo_list_id])
  end

  def correct_user
    @user = @user_todo_list.user
    redirect_to root_url unless current_user?(@user)
  end
end
