Profesores = new Mongo.Collection("profesores");
Inventario = new Mongo.Collection("inventario");                                

ProfIndex = new EasySearch.Index({
    collection: Profesores,
    fields: ['apellidos', 'nombre'],
    engine: new EasySearch.Minimongo()
});

import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';


Template.listaPersonal.helpers({
//       profesores: Profesores.find({}, {sort:{Apellidos: 1, Nombre: 1}})
   profesores: function() {
       return Profesores.find({}, {sort:{apellidos: 1, nombre: 1}});
   }
}),

Template.searchBox.helpers({
  profIndex: () => ProfIndex
}),

Template.listaInventario.helpers({
   inventario: function() {
       return Inventario.find({}, {sort:{"FECHA FACT": 1, "PROFESOR": 1}});
   }
});