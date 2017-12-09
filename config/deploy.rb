# config valid only for current version of Capistrano
lock '3.10.0'

set :application, 'fabnavi5'
set :repo_url, 'git@github.com:fabnavi/fabnavi5.git'
set :rbenv_ruby, '2.4.2'

# Default branch is :master
# ask :branch, `git rev-parse --abbrev-ref HEAD`.chomp

# Default deploy_to directory is /var/www/my_app_name
set :deploy_to, '/var/www/fabnavi5'

# Default value for :scm is :git
# set :scm, :git

# Default value for :format is :pretty
# set :format, :pretty

# Default value for :log_level is :debug
# set :log_level, :debug

# Default value for :pty is false
# set :pty, true

# Default value for :linked_files is []
set :linked_files, fetch(:linked_files, []).push('config/database.yml', 'config/secrets.yml')

# Default value for linked_dirs is []
set :linked_dirs, fetch(:linked_dirs, []).push('log', 'tmp/pids', 'tmp/cache', 'tmp/sockets', 'vendor/bundle', 'public/system', 'app/assets/javascripts/dist')

# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }

set :default_env, {
  path: "/usr/local/lib/nodebrew/current/bin:$PATH"
}

# Default value for keep_releases is 5
set :keep_releases, 1

set :unicorn_pid, "#{shared_path}/tmp/pids/unicorn.pid"
set :unicorn_rack_env, fetch(:stage) || "production"
set :unicorn_config_path, "#{current_path}/config/unicorn.rb"

namespace :deploy do
  task :build_js do
    on roles(:app) do
      within release_path do
        execute :npm, "install"
        execute :npm, "run build"
      end
    end
  end
  before "assets:precompile", "build_js"

  task :restart do
    on roles(:app), in: :sequence, wait: 5 do
      invoke 'unicorn:restart'
    end
  end
  after :published, :restart

  after :restart, :clear_cache do
    on roles(:web), in: :groups, limit: 3, wait: 10 do
      # Here we can do anything such as:
      # within release_path do
      #   execute :rake, 'cache:clear'
      # end
    end
  end

end
