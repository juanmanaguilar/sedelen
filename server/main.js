import { Meteor } from 'meteor/meteor';

let
    profIndex = new EasySearch.Index({
        collection: Profesores,
        fields: ['apellidos', 'nombre'],
        engine: new EasySearch.Minimongo()
    }),
    inventIndex = new EasySearch.Index({
        collection: Inventario,
        fields: ['nInvent','descElem', 'profesor'],
        
        engine: new EasySearch.Minimongo()
    });

Meteor.publish("profesores", function(){
     if (this.userId) {
        return Profesores.find();
     }
});
Meteor.publish("personaldto", function(){
     if (this.userId) {
        return Personaldto.find();
     }
});
Meteor.publish("inventario", function(){
    if (this.userId){
        return Inventario.find();
    }
});

Meteor.publish("allUsers", function(){
  return Meteor.users.find();
});
