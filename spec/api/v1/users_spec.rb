require 'rails_helper'

RSpec.describe V1::Users, type: :request do
  let :request_header do
    binary_header
  end

  let :request_body do
    {
      user: {
        type: "Figure::Photo",
        user: @user,
        avatar: fixture_file_upload(Rails.root.join("app/assets/images/flower.jpg"), 'image/jpg', :binary)
      }
    }
  end

  before :each do
    @user = FactoryBot.create :user
  end

  describe 'GET /api/v1/users/#{id}' do
    it 'responds successfully' do
      get "/api/v1/users/#{@user.id}"
      expect(response.status).to eq 200
    end
  end

  describe 'GET /api/v1/users/#{id}/projects' do
    it 'responds successfully' do
      set_auth_info @user
      get "/api/v1/users/#{@user.id}/projects", {}, request_header
      expect(response.status).to eq 200
    end
    it 'responds Unauthorized' do
      get "/api/v1/users/#{@user.id}/projects"
      expect(response.status).to eq 401
    end
  end

  describe 'PATCH /api/v1/users' do
    it 'responds successfully' do
      set_auth_info @user
      patch "/api/v1/users", request_body, request_header
      expect(response.status).to eq 200
    end
    it 'responds Unauthorized' do
      patch "/api/v1/users", request_body, request_header
      expect(response.status).to eq 401
    end
  end
end
