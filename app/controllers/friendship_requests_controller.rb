class FriendshipRequestsController < ApplicationController
  before_action :logged_in_user
  # before_action :sender_user, only: :destroy
  # before_action :receiver_user, only: %i[accept reject]

  def create
    @receiver = User.find(params[:receiver_id])
    current_user.send_friend_request(@receiver)
    respond_to do |format|
      format.html { redirect_to @receiver }
      format.js
    end
  end

  def destroy
    @receiver = FriendshipRequest.find(params[:id]).receiver
    current_user.retract_friend_request(@receiver)
    respond_to do |format|
      format.html { redirect_to @receiver }
      format.js
    end
  end

  def accept
    @sender = FriendshipRequest.find(params[:id]).sender
    @sender.retract_friend_request(current_user)
    current_user.befriend(@sender)

    respond_to do |format|
      format.html { redirect_to @sender }
      format.js
    end
  end

  def reject
    @sender = FriendshipRequest.find(params[:id]).sender
    @sender.retract_friend_request(current_user)
    respond_to do |format|
      format.html { redirect_to @sender }
      format.js
    end
  end
end
