require 'rails_helper'

RSpec.describe V1::Attachments, type: :request do
  let :request_header do
    binary_header
  end

  let :request_body do
    {
      attachment: {
        file: fixture_file_upload(Rails.root.join("app/assets/images/flower.jpg"), 'image/jpg'),
      }
    }
  end

  describe 'POST /api/v1/attachments' do
    xit 'responds successfully' do
      @user = FactoryBot.create :user
      set_auth_info @user
      request_body[:user] = @user
      # TODO: attachment.create_with_type の file.typeが正常に動作してるか調べる
      post "/api/v1/attachments", request_body, request_header
      expect(response.status).to eq 201
    end
    it 'responds Unauthorized' do
      post "/api/v1/attachments", request_body, request_header
      expect(response.status).to eq 401
    end
  end
end
