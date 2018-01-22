# https://qiita.com/akicho8/items/b8698d756b298c11040c
namespace :routes do
  task :api => :environment do
    Grape::API.subclasses.each do |subclass|
      subclass.routes.each do |e|
        puts "%-10s %-6s %-24s %s" % [subclass, e.request_method, e.path, e.description]
      end
      puts
    end
  end
end
