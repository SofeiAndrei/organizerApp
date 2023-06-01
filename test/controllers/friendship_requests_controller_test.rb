require "test_helper"

class FriendshipRequestsControllerTest < ActionDispatch::IntegrationTest
  test "should get create" do
    get friendship_requests_create_url
    assert_response :success
  end

  test "should get destroy" do
    get friendship_requests_destroy_url
    assert_response :success
  end

  test "should get accept" do
    get friendship_requests_accept_url
    assert_response :success
  end

  test "should get reject" do
    get friendship_requests_reject_url
    assert_response :success
  end
end
