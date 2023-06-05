class Api::TaskCommentsController < ApplicationController
  before_action :logged_in_user
  before_action :correct_user, only: [:destroy]

  def create
    @comment = TaskComment.new(task_comment_params)
    @comment.save
  end

  def comments_for_task
    puts params[:task_id]
    @task = TeamProjectTask.find(params[:task_id])
    @comments = @task.task_comments.includes(:writer).order('created_at DESC')

    mapped_comments = @comments.map do |comment|
      {
        id: comment.id,
        content: comment.content,
        created_at: comment.created_at,
        writer: comment.writer
      }
    end
    render json: { comments: mapped_comments }
  end

  def destroy
    @task_comment.destroy
  end

  private

  def task_comment_params
    params.require(:task_comment).permit(:content, :writer_id, :team_project_task_id)
  end

  def correct_user
    @task_comment = TaskComment.find(params[:id])
    redirect_to root_url unless current_user?(@task_comment.writer)
  end
end
