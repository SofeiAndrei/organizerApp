class FriendshipsController < ApplicationController
  # before_action :friendship_exists
  before_action :logged_in_user
  before_action :correct_user

  def destroy
    if current_user?(@sender)
      current_user.unfriend(@receiver)
      respond_to do |format|
        format.html { redirect_to @receiver }
        format.js
      end
    else
      current_user.unfriend(@sender)
      respond_to do |format|
        format.html { redirect_to @sender }
        format.js
      end
    end
  end

  private

  # def friendship_exists

  def correct_user
    @friendship = Friendship.find(params[:id])
    @sender = @friendship.sender
    @receiver = @friendship.receiver
    redirect_to root_url unless current_user?(@sender) || current_user?(@receiver)
  end
end
