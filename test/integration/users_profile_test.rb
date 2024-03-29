require 'test_helper'

class UsersProfileTest < ActionDispatch::IntegrationTest
  include ApplicationHelper

  def setup
    @user = users(:adrian)
    log_in_user
  end

  test 'profile display' do
    get user_path @user
    assert_template 'users/show'
    assert_select 'title', full_title(@user.name)
    assert_select 'img.gravatar'
  end
end
