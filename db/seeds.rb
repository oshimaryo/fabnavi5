# CC Lisences
%w(by by_sa by_nd by_nc by_nc_sa by_nc_nd).each do |name|
  Lisence.create name: name
end

tokens = [
  # Client: ADbJwXx1RgaqQ3m_WD9_mg
  # Access-Token: x9XcLOtpdQWDpa3tSmESjg
  # Uid: user0@example.com
  {
    "ADbJwXx1RgaqQ3m_WD9_mg" => {
      "token" => "$2a$10$Z4I..3utPJzQ4u7CfBF4F.W9h5AKr0.IOeP4LSSSim6J.fiAN7iCG",
      "expiry" => 3443245119,
      "last_token" => "$2a$10$8/jCT8SYxQTXb6VdlSD5buTSzP69xGrNx3U11INm7MjQrMNM5btHO",
      "updated_at"=>"2015-09-12T14:25:19.533+09:00"
    }
  },
  # Client: 1E2cqbJxYbBb_gohA-qP1w
  # Access-Token: VYmU5yvIwDeXCBsJUtvBkw
  # Uid: user1@example.com
  {
    "1E2cqbJxYbBb_gohA-qP1w" => {
      "token" => "$2a$10$uD28iGILzWC1wSkz9DwuQe7ap.zz/aPmeYI9J.A6jzEAB7xjYBYaq",
      "expiry" => 3443071103,
      "last_token" => "$2a$10$qZqwyOiSAGl/wyAFJiPE7.4qgdfc2iAcDHH1iJX/q7ANY4jnttW..",
      "updated_at"=>"2015-09-10T14:05:03.692+09:00"
    }
  }
]

tokens.each_with_index do |tok, i|
  # User
  u = User.create!(
    provider: "persona",
    email: "user#{i}@example.com",
    uid: "user#{i}@example.com",
    password: "password",
    tokens: tok,
    avatar: File.open(File.join(Rails.root, "app/assets/images/cloud.jpg")),
  )

  5.times do |j|
    # Project
    p = u.projects.create!(
      name: "User#{i}'s Project#{j}",
      private: (j % 2 == 0 ? true : false),
      description: "This is the description of User#{i}'s Project#{j}. This is the description of User#{i}'s Project#{j}. This is the description of User#{i}'s Project#{j}.",
      lisence_id: 1,
      content_attributes: {
        type: "Content::PhotoList",
        description: "This is the description of the content of User#{i}'s Project#{j}. This is the description of the content of User#{i}'s Project#{j}. This is the description of the content of User#{i}'s Project#{j}."
      },
      tag_list: "tag1 tag2 tag3 tag4 tag5"
    )

    # Content
    p.content.update!(
      figures_attributes: [
        {type: "Figure::Photo"}, {type: "Figure::Photo"},
        {type: "Figure::Photo"}, {type: "Figure::Photo"},
        {type: "Figure::Photo"}, {type: "Figure::Photo"},
      ]
    )

    # Figure
    p.content.figures.each do |fig|
      u.attachments.create!(
        type: Attachment::Image.name,
        file: File.open(File.join(Rails.root, "app/assets/images/flower.jpg")),
        attachable_id: fig.id,
        attachable_type: fig.class.base_class.name
      )
    end

    p.update figure_id: p.content.figures.first.id
  end
end
