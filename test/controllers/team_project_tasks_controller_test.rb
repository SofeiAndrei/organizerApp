require "test_helper"

class TeamProjectTasksControllerTest < ActionDispatch::IntegrationTest
  test "should get create" do
    get team_project_tasks_create_url
    assert_response :success
  end

  test "should get update" do
    get team_project_tasks_update_url
    assert_response :success
  end

  test "should get destroy" do
    get team_project_tasks_destroy_url
    assert_response :success
  end
end
