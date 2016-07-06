set :branch, 'staging'
server '52.193.209.185', user: 'deploy', roles: %w{app db web}
