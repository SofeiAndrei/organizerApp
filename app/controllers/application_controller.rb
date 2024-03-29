class ApplicationController < ActionController::Base
  def hello
    render html: 'Hello, world!'
  end

  include SessionsHelper # includem ca sa putem folosi chestiile de la login in toata aplicatia
  include CalendarHelper

  private

  def logged_in_user
    return if logged_in?

    store_location
    flash[:danger] = 'Please log in'
    redirect_to login_url
  end
end
