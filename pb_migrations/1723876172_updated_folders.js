/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ertjjwrp3iblm2y")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "4e3z1j2r",
    "name": "parent",
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
  const collection = dao.findCollectionByNameOrId("ertjjwrp3iblm2y")

  // remove
  collection.schema.removeField("4e3z1j2r")

  return dao.saveCollection(collection)
})
