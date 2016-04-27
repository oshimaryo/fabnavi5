class CreateSensorInfos < ActiveRecord::Migration
  def change
    create_table :sensor_infos do |t|
      t.text :data
      t.belongs_to :project, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
