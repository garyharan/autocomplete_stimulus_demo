require "test_helper"

class HomeControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get home_index_url
    assert_response :success
  end

  test "should get search as proper html" do
    get home_search_url(q: "beet")
    assert_response :success
    assert_select "body > main > div > div.text-xxl.text-bold", text: "Beetlejuice"
    assert_select "body > main > div > div:nth-child(2)", text: "1988"
    assert_select "body > main > div > div:nth-child(3)", text: "Comedy, Fantasy"
  end

  test "should get search" do
    get home_search_url(q: "beet", format: :json)
    assert_response :success
    json_response = JSON.parse(response.body)
    assert_equal 1, json_response.length
    assert_equal json_response.first["title"], "Beetlejuice"
  end
end
