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


// set up the iron router
Router.configure({
  layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function () {
    this.render('navbar', {to:"header"});
    this.render('home', {to:"main"});
    
});
Router.route('/home/', function () {
    console.log("Estamos en el /home");
    this.render('navbar', {to:"header"});
    this.render('home', {to:"main"});
    
});

Router.route('/personal/', function () {
    console.log("Estamos en el /personal");
    this.render('navbar', {to:"header"});
    this.render('listaPersonal', {to:"main"});
});
Router.route('/personal/new', function(){
    console.log("Nuevo profesor");
    this.render('navbar', {to:"header"});
    this.render('profesorNew', {to:"main"});
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
Router.route('/inventario/new', function(){
    console.log("Nuevo ");
    this.render('navbar', {to:"header"});
    this.render('inventarioNew', {to:"main"});
});
Router.route('/inventario/:_id', function(){
    console.log("Accediendo al documento: "+this.params._id);
    this.render('navbar', {to:"header"});
    this.render('inventarioEdit', {to:"main"});
});
Router.route('/inventario/trash/:_id', function(){
    console.log("Accediendo al documento: "+this.params._id);
    this.render('navbar', {to:"header"});
    this.render('inventarioRemove', {to:"main"});
});

Template.navbar.helpers({
      
     email: function(){
        return Meteor.user().emails[0].address;
    }
  }),  

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
    
Template.profesoresForm.rendered=function(){
            $('.mydatepicker').datepicker({
            format: "dd/mm/yyyy",
            weekStart: 1,
            maxViewMode: 3,
            language: "es",
            autoclose: true
        });
    },
    
Template.mostrarprofesoresForm.helpers({
    data: function() {
        console.log("params _id: "+ Router.current().params._id);
        
        var idP = new Meteor.Collection.ObjectID(Router.current().params._id);
        
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
        console.log("Guardado");
        Router.go('/personal');
    },
}),

Template.listaInventario.helpers({
   inventario: function() {
       return Inventario.find({}, {sort:{"nInvent": -1, "profesor": 1}});
   }
}),
    
Template.listaInventario.events({
  'click .js-show-inventarioForm':function(event){
      $("#inventario_add_form").modal('show');
  },
  'change .sorting': (e) => {
    inventIndex
      .getComponentMethods()
      .addProps('sortBy', $(e.target).val())
    ;
  },
    
  
}),
    
Template.inventarioForm.rendered=function(){
            $('#fechaFact').datepicker({
            format: "dd/mm/yyyy",
            weekStart: 1,
            maxViewMode: 3,
            language: "es",
            autoclose: true
        });
    },
    
Template.mostrarinventarioForm.helpers({
    data: function() {
        console.log("en data");
        console.log("params _id: "+ Router.current().params._id);
        var idI = new Meteor.Collection.ObjectID(Router.current().params._id);
        console.log("idI: "+ idI);
        return Inventario.findOne({_id: idI});
    }
}),
Template.inventarioForm.events({
    'submit .js-update-inventario':function(event){
       event.preventDefault();
        console.log("Inventario _id: "+ Router.current().params._id);
        var idI = new Meteor.Collection.ObjectID(Router.current().params._id);
        console.log("Actualizando inventatio: "+event.target.nInvent.value+" "+event.target.descElem.value+" id: "+idI);

       var invent = {
           _id: idI,
           nInvent: event.target.nInvent.value,
           descElem: event.target.descElem.value,
           elemsElem: event.target.elemsElem.value,
           marca: event.target.marca.value,
           modelo: event.target.modelo.value,
           nSerie: event.target.nSerie.value,
           orgElem: event.target.orgElem.value,
           centroCoste: event.target.centroCoste.value,
           campus: event.target.campus.value,
           edif: event.target.edif.value,
           planta: event.target.planta.value,
           local: event.target.local.value,
           orgProy: event.target.orgProy.value,
           nProy: event.target.nProy.value,
           titProy: event.target.titProy.value,
           proveedor: event.target.proveedor.value,
           nFact: event.target.nFact.value,
           fechaFact: event.target.fechaFact.value,
           precio: event.target.precio.value,
           
           unidad: event.target.unidad.value,
           profesor: event.target.profesor.value,
           dpt: event.target.dpt.value,
           
       };
        console.log("Actuaizando inventario: "+invent);
        Meteor.call("upsertInventario", idI, invent);
        console.log("Guardado");
        Router.go('/inventario');
    }
}),
    
Template.inventarioRemove.events({
    'click .js-delete-inventario':function(event){
        var idI = new Meteor.Collection.ObjectID(Router.current().params._id);
        console.log("Eliminando inventario _id: "+idI);
        Meteor.call("removeInventario", idI);
    },
}),
Template.inventarioRemove.helpers({
    data: function(){
        var idI = new Meteor.Collection.ObjectID(Router.current().params._id);
        return Inventario.findOne({_id: idI});
    }
});   

