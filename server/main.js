import { Meteor } from 'meteor/meteor';
const Profesores = new Mongo.Collection("profesores");
const Inventario = new Mongo.Collection("inventario");
let
    profIndex = new EasySearch.Index({
        collection: Profesores,
        fields: ['apellidos', 'nombre'],
        engine: new EasySearch.Minimongo()
    }),
    inventIndex = new EasySearch.Index({
        collection: Inventario,
        fields: ['nInvent','articulo', 'profesor'],
        defaultSearchOptions: {
            sortBy: 'nInvent'
          },
        engine: new EasySearch.MongoDB({
            sort: function (searchObject, options) {
              const sortBy = options.search.props.sortBy;

              // return a mongo sort specifier
              if ('nInvent' === sortBy) {
                return {
                  nInvent: -1
                };
              } else if ('fechaFact' === sortBy) {
                return {
                  fechaFact: -1
                };
              } else {
                throw new Meteor.Error('Invalid sort by prop passed');
              }
            }
        })
    });

Meteor.publish("profesores", function(){
     if (this.userId) {
        return Profesores.find();
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

Meteor.methods({
    updateProfesor: function(profesorId, data){   
      var exist = Profesores.findOne({_id: profesorId });
      if (exist){
          return Profesores.update(profesorId, data);
          console.log("Actualizando profesor "+data);
      }
      else {
          console.log("No existe el profesor");
          console.log("Insertando nuevo profesor "+data);
          return Profesores.insert(data);
      }
    },
    insertProfesor: function(data){
      if (this.userId) {
          return Profesores.insert(data);
      }
    },
    upsertProfesor: function (profesorId, data){
        if (this.userId) {
          return Profesores.upsert(profesorId, data);
      }
    },
    removeProfesor: function (profesorId){
        if (this.userId) {
          return Profesores.remove(profesorId);
      }
    }
});