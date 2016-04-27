json.extract! project, :id, :name, :description, :updated_at, :created_at
if project.figure
  json.figure do
    json.partial! 'v1/projects/figure', figure: project.figure
  end
end
if project.lisenced?
  json.lisence do
    json.partial! 'v1/projects/lisence', lisence: project.lisence
  end
end
json.user do
  json.partial! 'v1/projects/user', user: project.user
end

json.content do
  json.partial! 'v1/projects/content', content: project.content
end

json.sensor_infos do
  json.array! project.sensor_infos do |si|
    json.partial! 'v1/projects/sensor_info', sensor_info: si
  end
end
