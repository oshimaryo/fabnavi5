json.array! content.figures do |figure|
  json.figure do
    if figure.attached?
      json.position figure.position
      json.figure_id figure.id
      json.extract! figure.attachment, :id, :file
    end
  end
  json.type figure.type
end
