import { Meteor } from 'meteor/meteor';
const Profesores = new Mongo.Collection("profesores");
const Inventario = new Mongo.Collection("inventario");

ProfIndex = new EasySearch.Index({
    collection: Profesores,
    fields: ['apellidos', 'nombre'],
    engine: new EasySearch.Minimongo()
});

