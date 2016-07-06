set :branch, 'release'
server '54.92.114.100', user: 'deploy', roles: %w{app db web}
