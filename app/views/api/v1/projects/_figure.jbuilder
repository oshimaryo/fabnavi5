json.extract! figure, :id, :position
if figure.attached?
  json.attachment do
    json.id figure.attachment.id
    json.figure_id figure.id
    json.file do
      json.original figure.attachment.file.url
      if figure.attachment.file.try(:thumb)
        json.thumb figure.attachment.file.thumb.url
      end
    end
  end
end
