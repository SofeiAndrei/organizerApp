require 'test_helper'

class UsersLoginTest < ActionDispatch::IntegrationTest
  def setup
    @user = users(:adrian)
  end

  # test "the truth" do
  #   assert true
  # end
  test 'login with invalid entrys' do
    get login_path
    assert_template 'sessions/new'
    post login_path, params: { session: { email: 'user@invalid',
                                          password: 'wrong password' } }
    assert_not logged_in?
    assert_not flash.empty?
    get root_path
    assert flash.empty?
  end
  test 'login with logout work' do
    get login_path
    post login_path, params: { session: { email: 'andreisofei@yahoo.com',
                                          password: 'passoflengthmin8' } }
    assert logged_in?
    assert_redirected_to @user
    follow_redirect!
    assert_template 'users/show'
    assert_select 'a[href=?]', login_path, count: 0
    # assert_select 'a[href=?]', logout_path, count: 1  -> daca era link to, care face un a cu referinta
    assert_select 'a[href=?]', logout_path, count: 1 # face un 'hidden form' cu o metoda de post care da post la metoda trimisa de tine
    assert_select 'a[href=?]', user_path(@user)
    delete logout_path
    assert_redirected_to root_path
    delete logout_path # Simulate a user clicking logout in a second window
    follow_redirect!
    assert_select 'a[href=?]', login_path, count: 1
    # assert_select 'a[href=?]', logout_path, count: 0  -> daca era link to, care face un a cu referinta
    assert_select 'a[href=?]', logout_path, count: 0
    assert_select 'a[href=?]', user_path(@user), count: 0
    assert_not logged_in?
  end
  test 'authenticated? shoud return false for a user with digest -> nil' do
    assert_not @user.authenticated?(:remember, '')
  end

  test 'log in with remember' do
    log_in_as(@user, remember_me: '1')
    assert_not_empty cookies[:remember_token]
  end

  test 'log in without remember' do
    log_in_as(@user, remember_me: '1') # setez cookie-ul
    log_in_as(@user, remember_me: '0') # ma reloghez ca sa vad ca s-a sters
    assert_empty cookies[:remember_token]
  end
end
