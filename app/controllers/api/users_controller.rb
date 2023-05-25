class Api::UsersController < ApplicationController
  before_action :logged_in_user

  def search_users
    user_limit_for_search = 5

    if params[:search_input] == ''
      render json: { users: {} }
    else
      users = if params[:search_by_id] == 'true'
                User.where.not(id: params[:already_selected_ids])&.find_by(id: params[:search_input].to_i)
              else
                User.where.not(id: params[:already_selected_ids])&.where("name ILIKE '#{params[:search_input]}%'")&.limit(user_limit_for_search)
              end
      render json: { users: users }
    end
  end
end