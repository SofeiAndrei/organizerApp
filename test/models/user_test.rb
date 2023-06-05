require 'test_helper'

class UserTest < ActiveSupport::TestCase
  def setup
    @user = User.new(name: 'Example name', email: 'example@gmail.com',
                     password: 'parolademinim8', password_confirmation: 'parolademinim8')
  end
  # test "the truth" do
  #   assert true
  # end

  test 'should be valid' do
    assert @user.valid?
  end

  test 'name should be present' do
    @user.name = ''
    assert_not @user.valid?
  end

  test 'email should be present' do
    @user.email = ''
    assert_not @user.valid?
  end

  test 'name should not be too long' do
    @user.name = 'a' * 51
    assert_not @user.valid?
  end

  test 'name should not be too short' do
    @user.name = 'a' * 4
    assert_not @user.valid?
  end

  test 'email should not be too long' do
    @user.email = 'a' * 101
    assert_not @user.valid?
  end

  test 'email should not be too short' do
    @user.email = 'a' * 9
    assert_not @user.valid?
  end

  test 'email should be valid' do
    valid_addresses = %w[user@example.com
                         user@gmail.com
                         user@yahoo.com
                         user@takeofflabs.com
                         user@golfgenius.com]
    valid_addresses.each do |valid_address|
      @user.email = valid_address
      assert @user.valid?, "#{valid_address.inspect} should be valid" # al doilea argument e mesaj custom daca da fail
    end
  end

  test 'email should exclude invalid addresses' do
    invalid_addresses = %w[user@example,com
                           USER_at_foo.org
                           user.name@example.
                           foo@bar_baz.com
                           foo@bar+baz.com
                           foo@bar..com]
    invalid_addresses.each do |invalid_address|
      @user.email = invalid_address
      assert_not @user.valid?, "#{invalid_address.inspect} should be valid" # al doilea argument e mesaj custom daca da fail
    end
  end

  test 'emails should be unique' do
    duplicate_user = @user.dup
    @user.save
    assert_not duplicate_user.valid?
  end

  test 'emails should be saved as lower-case' do
    mixed_case_email = 'AndrEi_S@YahOo.com'
    @user.email = mixed_case_email
    @user.save
    assert_equal mixed_case_email.downcase, @user.reload.email
  end

  test 'password should not be blank' do
    @user.password = @user.password_confirmation = ''
    assert_not @user.valid?
  end

  test 'password should have a minimum length' do
    @user.password = @user.password_confirmation = 'a' * 7
    assert_not @user.valid?
  end

  test 'authenticated? should return false for a user with nil digest' do
    assert_not @user.authenticated?(:remember, '')
  end
end
