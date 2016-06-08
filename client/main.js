Profesores = new Mongo.Collection("profesores");
Inventario = new Mongo.Collection("inventario");                                

Meteor.subscribe("profesores");
Meteor.subscribe("inventario");

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


// set up the iron router
Router.configure({
  layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function () {
    console.log("Estamos en el /");
    this.render('navbar', {to:"header"});
    
});
Router.route('/personal/', function () {
    console.log("Estamos en el /personal");
    this.render('navbar', {to:"header"});
    this.render('listaPersonal', {to:"main"});
});
Router.route('/personal/:_id', function(){
    console.log("Accediendo al documento: "+this.params._id);
    this.render('navbar', {to:"header"});
    this.render('profesorEdit', {to:"main"});
//    this.render('profesoresForm', {to:"main"});
});
Router.route('/personal/trash/:_id', function(){
    console.log("Accediendo al documento: "+this.params._id);
    this.render('navbar', {to:"header"});
    this.render('profesorRemove', {to:"main"});
});
Router.route('/inventario/', function () {
    console.log("Estamos en el /inventario");
    this.render('navbar', {to:"header"});
    this.render('listaInventario', {to:"main"});
});
Router.route('/inventario/:_id', function(){
    console.log("Accediendo al documento: "+this.params._id);
    this.render('navbar', {to:"header"});
    this.render('inventarioForm', {to:"main"});
});

Template.listaPersonal.helpers({
//       profesores: Profesores.find({}, {sort:{Apellidos: 1, Nombre: 1}})
   profesores: function() {
       return Profesores.find({}, {sort:{apellidos: 1, nombre: 1}});
   }
}),
Template.listaPersonal.events({
   'click .js-show-profesoresForm':function(event){
      $("#profesor_add_form").modal('show');
    },
}),
Template.searchBoxP.helpers({
    searchIndexes: () => [profIndex, inventIndex],
        profIndex: () => profIndex,
        inventIndex: () => inventIndex
}),
Template.searchBoxI.helpers({
    searchIndexes: () => [profIndex, inventIndex],
        profIndex: () => profIndex,
        inventIndex: () => inventIndex
}),

Template.profesorRemove.events({
    'click .js-delete-profesor':function(event){
        var idP = new Meteor.Collection.ObjectID(Router.current().params._id);
//        var idP = this._id
        console.log("Eliminando profesor _id: "+idP);
        Meteor.call("removeProfesor", idP);
    },
}),

Template.profesorRemove.helpers({
    data: function(){
        var idP = new Meteor.Collection.ObjectID(Router.current().params._id);
        return Profesores.findOne({_id: idP});
    }
}),
    
Template.profesoresForm.helpers({
    data: function() {
        console.log("params _id: "+ Router.current().params._id);
        var idPText = Router.current().params._id;
        var idPObject = new Meteor.Collection.ObjectID(Router.current().params._id);
        var idP = "";
 //       var idP = new Meteor.Collection.ObjectID(Router.current().params._id);
 //       if (Profesores.findOne({_id: idP})){
        if (Profesores.findOne({_id: idPObject})){ //el _id es un Object
            idP = idPObject;
  //         return Profesores.findOne({_id: idPObject}); 
        } else {                                    //el _id es normal
//           return Profesores.findOne({_id: Router.current().params._id});
            idP = idPText;
        }
        
        return Profesores.findOne({_id: idP});
        
    }
}),
    
Template.profesoresForm.events({
    'submit .js-update-profesor':function(event){
       event.preventDefault();
        console.log("Profesor _id: "+ Router.current().params._id);
        var idP = new Meteor.Collection.ObjectID(Router.current().params._id);
        console.log("Actualizando profesor: "+event.target.nombre.value+" "+event.target.apellidos.value+" id: "+idP);

       var prof = {
           _id: idP,
           nombre: event.target.nombre.value,
           apellidos: event.target.apellidos.value,
           despacho: event.target.despacho.value,
           titulo: event.target.titulo.value,
           direccion: event.target.direccion.value,
           codigoPostal: event.target.codigoPostal.value,
           telefCasa: event.target.telefCasa.value,
           telefTrabajo: event.target.telefTrabajo.value,
           nrp: event.target.nrp.value,
           dni: event.target.dni.value,
           categoria: event.target.categoria.value,
           nombramiento: event.target.nombramiento.value,
           dedicacion: event.target.dedicacion.value,
           fechaContrato: event.target.fechaContrato.value,
           finalContrato: event.target.finalContrato.value,
           titulacion: event.target.titulacion.value,
           numCuenta: event.target.numCuenta.value,
           movil: event.target.movil.value,
           email: event.target.email.value,
           fechaNacimiento: event.target.fechaNacimiento.value
       };
        console.log("Actuaizando profesor: "+prof);
//       Meteor.call("updateProfesor", idP, prof);
        Meteor.call("upsertProfesor", idP, prof);
    },
}),

Template.listaInventario.helpers({
   inventario: function() {
       return Inventario.find({}, {sort:{"nInvent": -1, "profesor": 1}});
   }
}),
    
Template.listaInventario.events({
  'change .sorting': (e) => {
    inventIndex
      .getComponentMethods()
      .addProps('sortBy', $(e.target).val())
    ;
  }
}),
    
Template.inventarioForm.helpers({
    data: function() {
        console.log("en data");
        console.log("params _id: "+ Router.current().params._id);
        var idP = new Meteor.Collection.ObjectID(Router.current().params._id);
        console.log("idP: "+ idP);
        return Inventario.findOne({_id: idP});
    }
});