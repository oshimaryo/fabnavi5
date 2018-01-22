require 'rails_helper'

RSpec.describe V1::Calibrations, type: :request do
  let :request_header do
    json_header
  end

  let :request_body do
    {
      calibration: {
        name: "new Calibration",
        x: 10.0,
        y: 10.0,
        width: 10.0,
        height: 10.0
      }
    }
  end

  describe 'GET /api/v1/calibrations' do
    xit 'responds successfully' do
      @user = FactoryBot.create :user
      set_auth_info @user
      request_body[:user] = @user
      @user.calibrations.create!(
        name: "#{SecureRandom.hex(16)}",
        x: 10.0,
        y: 10.0,
        width: 10.0,
        height: 10.0
      )
      # calibration = FactoryBot.create :calibration
      get "/api/v1/calibrations"
      expect(response.status).to eq 200
    end
  end

  describe 'POST /api/v1/calibrations/create' do
    it 'responds successfully' do
      @user = FactoryBot.create :user
      set_auth_info @user
      request_body[:user] = @user
      post "/api/v1/calibrations", request_body.to_json, request_header
      expect(response.status).to eq 201
    end
    it 'responds Unauthorized' do
      calibration = FactoryBot.create :calibration
      post "/api/v1/calibrations", request_body.to_json, request_header
      expect(response.status).to eq 401
    end
  end

  describe 'PATCH /api/v1/calibrations/:id' do
    it 'responds successfully' do
      @user = FactoryBot.create :user
      set_auth_info @user
      request_body[:user] = @user
      calibration = @user.calibrations.create!(
        name: "#{SecureRandom.hex(16)}",
        x: 10.0,
        y: 10.0,
        width: 10.0,
        height: 10.0
      )
      patch "/api/v1/calibrations/#{calibration.id}", request_body.to_json, request_header
      expect(response.status).to eq 200
    end
    it 'responds Unauthorized' do
      calibration = FactoryBot.create :calibration
      patch "/api/v1/calibrations/#{calibration.id}", request_body.to_json, request_header
      expect(response.status).to eq 401
    end
  end

  describe 'DELETE /api/v1/calibrations/id' do
    it 'responds successfully' do
      @user = FactoryBot.create :user
      set_auth_info @user
      request_body[:user] = @user
      calibration = @user.calibrations.create!(
        name: "#{SecureRandom.hex(16)}",
        x: 10.0,
        y: 10.0,
        width: 10.0,
        height: 10.0
      )
      delete "/api/v1/calibrations/#{calibration.id}", {}, request_header
      expect(response.status).to eq 204
    end
    it 'responds Unauthorized' do
      calibration = FactoryBot.create :calibration
      delete "/api/v1/calibrations/#{calibration.id}"
      expect(response.status).to eq 401
    end
  end
end
