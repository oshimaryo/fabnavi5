class RemoveFigureIndexFromProjects < ActiveRecord::Migration
  def change
    remove_foreign_key :projects, column: :figure_id
  end
end
