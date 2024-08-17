/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("312f7ujdontpaj1")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "zi4kzkdw",
    "name": "folder",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "ertjjwrp3iblm2y",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("312f7ujdontpaj1")

  // remove
  collection.schema.removeField("zi4kzkdw")

  return dao.saveCollection(collection)
})
