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
        defaultSearchOptions: {
            sortBy: 'nInvent'
          },
        engine: new EasySearch.Minimongo({
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

