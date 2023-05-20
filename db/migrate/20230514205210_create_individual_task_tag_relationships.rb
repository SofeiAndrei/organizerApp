class CreateIndividualTaskTagRelationships < ActiveRecord::Migration[7.0]
  def change
    create_table :individual_task_tag_relationships do |t|
      t.integer :individual_task_id
      t.integer :individual_task_tag_id

      t.timestamps
    end

    add_index :individual_task_tag_relationships, :individual_task_id,
              name: 'index_individual_task_tag_relationships_on_task_id'
    add_index :individual_task_tag_relationships, :individual_task_tag_id,
              name: 'index_individual_task_tag_relationships_on_task_tag_id'
    add_index :individual_task_tag_relationships, %i[individual_task_id individual_task_tag_id], unique: true,
              name: 'index_individual_task_tag_relationships_unique'
  end
end
