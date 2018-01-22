require 'rails_helper'

RSpec.describe V1::Projects, type: :request do
  let :request_header do
    json_header
  end
  
  let :request_body do
    {
      project: {
        name: "#{SecureRandom.hex(16)}",
        content_attributes: {
          type: "Content::PhotoList"
        }
      }
    }
  end

  def set_auth_info
    @user.update! tokens: token
    request_header[:Uid] = "user0@example.com"
    request_header["Access-Token"] = "x9XcLOtpdQWDpa3tSmESjg"
    request_header[:Client] = "ADbJwXx1RgaqQ3m_WD9_mg"
  end

  def create_user_project
    @user.projects.create!(
      name: "#{SecureRandom.hex(16)}",
      private: false,
      description: "#{SecureRandom.hex(32)}",
      content_attributes: {
        type: "Content::PhotoList"
      },
      tag_list: "tag1 tag2 tag3 tag4 tag5"
    )
  end

  describe 'GET /api/v1/projects' do
    it 'responds successfully' do
      get '/api/v1/projects'
      expect(response).to be_success
      expect(response.status).to eq(200)
    end
  end

  describe 'POST /api/v1/projects.json' do
    it 'responds successfully' do
      @user = FactoryBot.create :user
      set_auth_info()
      request_body[:user] = @user
      post '/api/v1/projects', request_body.to_json, request_header
      expect(response.status).to eq(201)
    end

    it 'responds Unauthorized' do
      post '/api/v1/projects', request_body.to_json, request_header
      expect(response.status).to eq(401)
    end
  end

  describe 'GET /api/v1/projects/{id}.json' do
    it 'responds successfully' do
      project = FactoryBot.create :project
      get "/api/v1/projects/#{project.id}"
      expect(response).to be_success
      expect(response.status).to eq(200)
    end
  end

  describe 'PATCH /api/v1/projects/{id}.json' do
    it 'responds successfully' do
      @user = FactoryBot.create :user
      project = create_user_project()
      set_auth_info()
      request_body[:user] = @user
      patch "/api/v1/projects/#{project.id}", request_body.to_json, request_header
      expect(response.status).to eq(200)
    end

    it 'responds Unauthorized' do
      project = FactoryBot.create :project
      patch "/api/v1/projects/#{project.id}", request_body.to_json, request_header
      expect(response.status).to eq(401)
    end
  end

  describe 'DELETE /api/v1/projects/{id}.json' do
    it 'responds successfully' do
      @user = FactoryBot.create :user
      project = create_user_project()
      set_auth_info()
      request_body[:user] = @user
      delete "/api/v1/projects/#{project.id}", {}, request_header
      expect(response.status).to eq(204)
    end

    it 'responds Unauthorized' do
      project = FactoryBot.create :project
      delete "/api/v1/projects/#{project.id}"
      expect(response.status).to eq(401)
    end
  end

  describe 'PATCH /api/v1/projects/{id}/like.json' do
    xit 'responds successfully' do
    end

    it 'responds Unauthorized' do
      project = FactoryBot.create :project
      patch "/api/v1/projects/#{project.id}/like", request_body.to_json, request_header
      expect(response.status).to eq(401)
    end
  end

  describe 'PATCH /api/v1/projects/{id}/unlike.json' do
    xit 'responds successfully' do
    end

    it 'responds Unauthorized' do
      project = FactoryBot.create :project
      patch "/api/v1/projects/#{project.id}/unlike", request_body.to_json, request_header
      expect(response.status).to eq(401)
    end
  end

end
