import { ReactiveVar } from 'meteor/reactive-var'

Meteor.subscribe("profesores");
Meteor.subscribe("inventario");
Meteor.subscribe("personaldto");

let
    profIndex = new EasySearch.Index({
        collection: Profesores,
        fields: ['apellidos', 'nombre'],
        engine: new EasySearch.Minimongo()
    }),
    inventIndex = new EasySearch.Index({
        collection: Inventario,
        fields: ['nInvent','descElem', 'profesor', 'fechaFact'],
        defaultSearchOptions: {
            sortBy: 'nInvent'
          },
            engine: new EasySearch.Minimongo({
            sort: function (searchObject, options) {
              const sortBy = options.search.props.sortBy;

              // return a mongo sort specifier
 //             if ('nInvent' === sortBy) {
                return {
                  nInvent: -1
                };
  //            } else {
    //            throw new Meteor.Error('Invalid sort by prop passed');
      //        }
            }
          })
    }),
    personalIndex = new EasySearch.Index({
        collection: Personaldto,
        fields: ['apellidos','nombre'],
        engine: new EasySearch.Minimongo()
    });

Avatar.setOptions({
  fallbackType: "initials"
});

// set up the iron router
Router.configure({
  layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function () {
//    this.render('navbar', {to:"header"});
    this.render('home', {to:"main"});

    
});
Router.route('/home/', function () {
    console.log("Estamos en el /home");
    this.render('navbar', {to:"header"});
    this.render('home', {to:"main"});
    
});
Router.route('/profile/', function () {
    console.log("Estamos en el /profile");
    this.render('navbar', {to:"header"});
    this.render('profile', {to:"main"});
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
    this.render('inventarioEdit', {to:"main",
                                  data: function () {
                                            console.log("En data");
                                            console.log("params _id: "+this.params._id);

                                            if(Inventario.findOne({_id: this.params._id})){
                                                console.log("idI data: "+this.params._id);
                                                return Inventario.findOne({_id: this.params._id});
                                            }
                                            else {
                                                var idI = new Meteor.Collection.ObjectID(this.params._id);
                                                console.log("idI data: "+idI);
                                                console.log(Inventario.findOne({_id: idI}));
                                                return Inventario.findOne({_id: idI});
                                            } 
                                        },
                                  });
});

Router.route('/inventario/trash/:_id', function(){
    console.log("Accediendo al documento: "+this.params._id);
    this.render('navbar', {to:"header"});
    this.render('inventarioRemove', {to:"main"});
});
Router.route('/personaldto/', function () {
    console.log("Estamos en el /personaldto");
    this.render('navbar', {to:"header"});
    this.render('listaPersonaldto', {to:"main"});
});
Router.route('/personaldto/new', function(){
    console.log("Nuevo");
    this.render('navbar', {to:"header"});
    this.render('insertPersonalForm', {to:"main"});
});
Router.route('/personaldto/newQ', function(){
    console.log("Nuevo");
    this.render('navbar', {to:"header"});
    this.render('personaldtoNew', {to:"main"});
});
Router.route('/personaldto/:_id', function(){
    console.log("Accediendo al documento: "+this.params._id);
    this.render('navbar', {to:"header"});
    this.render('personalEdit', {to:"main"});
});
Router.route('/personaldto/trash/:_id', function(){
    console.log("Accediendo al documento: "+this.params._id);
    this.render('navbar', {to:"header"});
    this.render('personalRemove', {to:"main"});
});

Template.navbar.helpers({
     email: function(){
        return Meteor.user().emails[0].address;
     },
     user: function(){
        return Meteor.user();
     }
  }),
Template.profile.helpers({
     email: function(){
        return Meteor.user().emails[0].address;
     },
     user: function(){
        return Meteor.user();
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
    searchIndexes: () => [profIndex, inventIndex, personalIndex],
        profIndex: () => profIndex,
        inventIndex: () => inventIndex,
        personalIndex: () => personalIndex
}),
Template.searchBoxI.helpers({
    searchIndexes: () => [profIndex, inventIndex, personalIndex],
        profIndex: () => profIndex,
        inventIndex: () => inventIndex,
        personalIndex: () => personalIndex
}),
Template.searchBoxPdto.helpers({
    searchIndexes: () => [profIndex, inventIndex, personalIndex],
        profIndex: () => profIndex,
        inventIndex: () => inventIndex,
        personalIndex: () => personalIndex
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
    
Template.listaPersonaldto.helpers({
//       profesores: Profesores.find({}, {sort:{Apellidos: 1, Nombre: 1}})
   profesores: function() {
       return Personal.find({}, {sort:{apellidos: 1, nombre: 1}});
   }
}),
Template.listaPersonaldto.events({
   'click .js-show-personalForm':function(event){
      $("#personal_add_form").modal('show');
    },
}),

Template.mostrarlistaPersonaldto.helpers({
   personaldto: function() {
//       return Personaldto.find({},{sort:{apellidos: 1, nombre: 1}});
       return Personaldto.find({activo:"VERDADERO"},{sort:{apellidos: 1, nombre: 1}});
   }
}),
    
Template.listaInventario.onCreated(function(){
  // Here, this equals the current template instance. We can assign
  // our ReactiveVar to it, making it accessible throughout the
  // current template instance.
    this.fechaDesde = new ReactiveVar();
    var hoy = new Date().now;
    this.fechaHasta = new ReactiveVar( hoy );
});

Template.listaInventario.rendered=function(){
            $('.mydatepicker').datepicker({
            format: "dd/mm/yyyy",
            weekStart: 1,
            maxViewMode: 3,
            language: "es",
            autoclose: true
        });
    },    
    
Template.listaInventario.helpers({
    
    fechaDesde: function () {
        // Here we get our template instance from Template.instance() and
        // can access fechaDesde from it.
        console.log("fechaDesde: "+Template.instance().fechaDesde.get());
        return Template.instance().fechaDesde.get();
        
    },
    fechaHasta: function () {
        
        console.log("fechaDesde: "+Template.instance().fechaHasta.get());
        return Template.instance().fechaHasta.get();
    },
    inventario: function() {
       return Inventario.find({$and: [ 
                                       {fechaFact: {$gte: Template.instance().fechaDesde.get() }},
                                       {fechaFact: {$lte: Template.instance().fechaHasta.get() }},
                                       {fechaFact: {$exists: true}},
                                       {fechaFact: {$type: 9}},         //type: 2 string 9 date
                                       {fechaFact: {$ne: ""}}
                                     ] },
                                        
                              {sort:{"nInvent": -1, "profesor": 1}});
   }    
    
//   inventario: function() {
//       return Inventario.find({}, {sort:{"nInvent": -1, "profesor": 1}});
//   }    
}),
    
Template.listaInventario.events({
  'click .js-show-inventarioForm': function(event){

      console.log(event);
      console.log(this);
      console.log("typeof this._id: "+typeof this._id)
      console.log("Typeof this._id.str:"+typeof this._id.str);
 //     if (Inventario.findOne({_id: this._id})){
      if (typeof this._id == 'string') {
            console.log("el _id es un sting: "+this._id);
            Router.go("/inventario/"+this._id);
        }
        else {
            console.log("El _id es un object: "+this._id);
//            console.log("El str del object es: "+this._id.str);
            Router.go("/inventario/"+this._id);
        }        
  },
  'click .js-show-inventarioRemove': function(event){

      console.log(event);
      console.log(this);
      console.log("typeof this._id: "+typeof this._id)
      console.log("Typeof this._id.str:"+typeof this._id.str);
 //     if (Inventario.findOne({_id: this._id})){
      if (typeof this._id == 'string') {
            console.log("el _id es un sting: "+this._id);
            Router.go("/inventario/trash/"+this._id);
        }
        else {
            console.log("El _id es un object: "+this._id);
//            console.log("El str del object es: "+this._id.str);
            Router.go("/inventario/trash/"+this._id);
        }        
  },
  'change .js-change-fechaDesde': function( event, template ) {
    console.log( "Fecha desde: "+$( event.target ).val() ) 
      // Here we get our template instance from the template
      // argument in our event handler.
      template.fechaDesde.set( $( event.target ).val() );  
  },
  'change .js-change-fechaHasta': function( event, template ) {
    console.log( "Fecha hasta: "+$( event.target ).val() ) 
      // Here we get our template instance from the template
      // argument in our event handler.
      template.fechaHasta.set( $( event.target ).val() );  
  }
  
}),
    
Template.inventarioEdit.events({
	'click .js-generar-pdf': function() {
        console.log("Generando PDF");
		// Define the pdf-document 
		//var docDefinition = { content: 'Mi documento pdf' };
        var nInv = this.nInvent.toString();
        console.log("nInv: "+nInv);
        
        var docDefinition = {
            pageSize: 'A4',
            pageMargins: [40, 100, 40, 40],
            header: [{
                margin: 5,
                columns: [
                        { margin: [40,0,0,0], 
                         image:  "data:image/jpeg;base64,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YBWxpbw71K9t1r/+MVh31b6SQ79G4eo1rXkPcC7b9Audu+l/KWoki1pe9xGv/G/l/wDG/S08DpeF0/1DisLTaQXkuLpjj6RKs2GwMJraHPHDSYB+amkgRYIuvEMcuLi9V314mngWZBfc29jmnduE8Dd+Y13521W4A4TpKPl4iOMDiM96lMcMvmTkNyJoR20GykkklKsf/9n/7Q/KUGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAB0cAgAAAgAvHAIFABFVU19Fc2xvZ2FuX0JsYW5jbwA4QklNBCUAAAAAABCfKv+5uXbafuprh/mV1exFOEJJTQPtAAAAAAAQASwAAAABAAIBLAAAAAEAAjhCSU0EJgAAAAAADgAAAAAAAAAAAAA/gAAAOEJJTQQNAAAAAAAEAAAAeDhCSU0EGQAAAAAABAAAAB44QklNA/MAAAAAAAkAAAAAAAAAAAEAOEJJTQQKAAAAAAABAAA4QklNJxAAAAAAAAoAAQAAAAAAAAACOEJJTQP1AAAAAABIAC9mZgABAGxmZgAGAAAAAAABAC9mZgABAKGZmgAGAAAAAAABADIAAAABAFoAAAAGAAAAAAABADUAAAABAC0AAAAGAAAAAAABOEJJTQP4AAAAAABwAAD/////////////////////////////A+gAAAAA/////////////////////////////wPoAAAAAP////////////////////////////8D6AAAAAD/////////////////////////////A+gAADhCSU0ECAAAAAAAEAAAAAEAAAJAAAACQAAAAAA4QklNBB4AAAAAAAQAAAAAOEJJTQQaAAAAAAM9AAAABgAAAAAAAAAAAAAATAAAAFUAAAAEAGwAbwBnAG8AAAABAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAFUAAABMAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAEAAAAAAABudWxsAAAAAgAAAAZib3VuZHNPYmpjAAAAAQAAAAAAAFJjdDEAAAAEAAAAAFRvcCBsb25nAAAAAAAAAABMZWZ0bG9uZwAAAAAAAAAAQnRvbWxvbmcAAABMAAAAAFJnaHRsb25nAAAAVQAAAAZzbGljZXNWbExzAAAAAU9iamMAAAABAAAA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ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczp4YXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhhcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6c3RNZnM9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9NYW5pZmVzdEl0ZW0jIiB4bWxuczp4YXBUUGc9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC90L3BnLyIgeG1sbnM6c3REaW09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9EaW1lbnNpb25zIyIgeG1sbnM6c3RGbnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9Gb250IyIgeG1sbnM6eGFwRz0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL2cvIiB4bWxuczpwZGY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGRmLzEuMy8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIiBkYzpmb3JtYXQ9ImltYWdlL2pwZWciIHhhcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTMyBXaW5kb3dzIiB4YXA6Q3JlYXRlRGF0ZT0iMjAxMC0wOC0yNFQwOTo0NTowNCswMjowMCIgeGFwOk1vZGlmeURhdGU9IjIwMTAtMTAtMTlUMTc6Mzk6MzkrMDI6MDAiIHhhcDpNZXRhZGF0YURhdGU9IjIwMTAtMTAtMTlUMTc6Mzk6MzkrMDI6MDAiIHhhcE1NOkRvY3VtZW50SUQ9InV1aWQ6OUVGNDA0NkY1M0FGREYxMUE4MDU4QzM0MEMxQUQzNkIiIHhhcE1NOkluc3RhbmNlSUQ9InV1aWQ6QzYzRkI3Q0M5NERCREYxMTk2MkNCRDE1NjVBMDREQzUiIHhhcFRQZzpOUGFnZXM9IjEiIHhhcFRQZzpIYXNWaXNpYmxlVHJhbnNwYXJlbmN5PSJUcnVlIiB4YXBUUGc6SGFzVmlzaWJsZU92ZXJwcmludD0iRmFsc2UiIHBkZjpQcm9kdWNlcj0iQWRvYmUgUERGIGxpYnJhcnkgOC4wMCIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiBwaG90b3Nob3A6SGlzdG9yeT0iIiB0aWZmOk9yaWVudGF0aW9uPSIxIiB0aWZmOlhSZXNvbHV0aW9uPSIzMDAwMDAwLzEwMDAwIiB0aWZmOllSZXNvbHV0aW9uPSIzMDAwMDAwLzEwMDAwIiB0aWZmOlJlc29sdXRpb25Vbml0PSIyIiB0aWZmOk5hdGl2ZURpZ2VzdD0iMjU2LDI1NywyNTgsMjU5LDI2MiwyNzQsMjc3LDI4NCw1MzAsNTMxLDI4MiwyODMsMjk2LDMwMSwzMTgsMzE5LDUyOSw1MzIsMzA2LDI3MCwyNzEsMjcyLDMwNSwzMTUsMzM0MzI7REFFRDg5RjhFRjlFM0U3OUQxREQwOEU4MjYzNzQzOTYiIGV4aWY6UGl4ZWxYRGltZW5zaW9uPSI4NSIgZXhpZjpQaXhlbFlEaW1lbnNpb249Ijc2IiBleGlmOkNvbG9yU3BhY2U9IjEiIGV4aWY6TmF0aXZlRGlnZXN0PSIzNjg2NCw0MDk2MCw0MDk2MSwzNzEyMSwzNzEyMiw0MDk2Miw0MDk2MywzNzUxMCw0MDk2NCwzNjg2NywzNjg2OCwzMzQzNCwzMzQzNywzNDg1MCwzNDg1MiwzNDg1NSwzNDg1NiwzNzM3NywzNzM3OCwzNzM3OSwzNzM4MCwzNzM4MSwzNzM4MiwzNzM4MywzNzM4NCwzNzM4NSwzNzM4NiwzNzM5Niw0MTQ4Myw0MTQ4NCw0MTQ4Niw0MTQ4Nyw0MTQ4OCw0MTQ5Miw0MTQ5Myw0MTQ5NSw0MTcyOCw0MTcyOSw0MTczMCw0MTk4NSw0MTk4Niw0MTk4Nyw0MTk4OCw0MTk4OSw0MTk5MCw0MTk5MSw0MTk5Miw0MTk5Myw0MTk5NCw0MTk5NSw0MTk5Niw0MjAxNiwwLDIsNCw1LDYsNyw4LDksMTAsMTEsMTIsMTMsMTQsMTUsMTYsMTcsMTgsMjAsMjIsMjMsMjQsMjUsMjYsMjcsMjgsMzA7NjE3NEQ5NzJDRTExMTZCMUI3NzY4MjI2RTE1RkMyQzEiPiA8ZGM6dGl0bGU+IDxyZGY6QWx0PiA8cmRmOmxpIHhtbDpsYW5nPSJ4LWRlZmF1bHQiPlVTX0VzbG9nYW5fQmxhbmNvPC9yZGY6bGk+IDwvcmRmOkFsdD4gPC9kYzp0aXRsZT4gPHhhcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InV1aWQ6OEE2MTJENTNBQ0FFREYxMThGMDRBQ0MzRTFBRUMyOTIiIHN0UmVmOmRvY3VtZW50SUQ9InV1aWQ6ODk2MTJENTNBQ0FFREYxMThGMDRBQ0MzRTFBRUMyOTIiLz4gPHhhcE1NOk1hbmlmZXN0PiA8cmRmOlNlcT4gPHJkZjpsaT4gPHJkZjpEZXNjcmlwdGlvbiBzdE1mczpsaW5rRm9ybT0iRW1iZWRCeVJlZmVyZW5jZSI+IDxzdE1mczpyZWZlcmVuY2Ugc3RSZWY6ZmlsZVBhdGg9IkM6XFVzZXJzXGNkaWF6XERvY3VtZW50c1xOVUVWQVVTXHVzMjAgY29waWEuanBnIiBzdFJlZjppbnN0YW5jZUlEPSJ1dWlkOjY1QzM5NzAxM0IyQ0RGMTE4ODk2QUMwRkFCM0FERTMxIiBzdFJlZjpkb2N1bWVudElEPSJ1dWlkOjY0QzM5NzAxM0IyQ0RGMTE4ODk2QUMwRkFCM0FERTMxIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpsaT4gPHJkZjpsaT4gPHJkZjpEZXNjcmlwdGlvbiBzdE1mczpsaW5rRm9ybT0iRW1iZWRCeVJlZmVyZW5jZSI+IDxzdE1mczpyZWZlcmVuY2Ugc3RSZWY6ZmlsZVBhdGg9ImViYWRpX3BvcnRhZGEuanBnIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpsaT4gPHJkZjpsaT4gPHJkZjpEZXNjcmlwdGlvbiBzdE1mczpsaW5rRm9ybT0iRW1iZWRCeVJlZmVyZW5jZSI+IDxzdE1mczpyZWZlcmVuY2Ugc3RSZWY6ZmlsZVBhdGg9ImlzdDJfMTEwNjIyMjYtc3R1ZHlpbmctYXQtdGhlLWNhbXB1cy5qcGciLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOmxpPiA8cmRmOmxpPiA8cmRmOkRlc2NyaXB0aW9uIHN0TWZzOmxpbmtGb3JtPSJFbWJlZEJ5UmVmZXJlbmNlIj4gPHN0TWZzOnJlZmVyZW5jZSBzdFJlZjpmaWxlUGF0aD0iaVN0b2NrXzAwMDAwODczMTI2OVNtYWxsLmpwZyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6bGk+IDwvcmRmOlNlcT4gPC94YXBNTTpNYW5pZmVzdD4gPHhhcFRQZzpNYXhQYWdlU2l6ZSBzdERpbTp3PSI5NjAuMDAwMDAwIiBzdERpbTpoPSIxMjAwLjAwMDAwMCIgc3REaW06dW5pdD0iUGl4ZWxzIi8+IDx4YXBUUGc6Rm9udHM+IDxyZGY6QmFnPiA8cmRmOmxpIHN0Rm50OmZvbnROYW1lPSJBcmlhbC1CbGFjayIgc3RGbnQ6Zm9udEZhbWlseT0iQXJpYWwiIHN0Rm50OmZvbnRGYWNlPSJCbGFjayIgc3RGbnQ6Zm9udFR5cGU9Ik9wZW4gVHlwZSIgc3RGbnQ6dmVyc2lvblN0cmluZz0iVmVyc2lvbiA1LjAwIiBzdEZudDpjb21wb3NpdGU9IkZhbHNlIiBzdEZudDpmb250RmlsZU5hbWU9ImFyaWJsay50dGYiLz4gPHJkZjpsaSBzdEZudDpmb250TmFtZT0iQXJpYWwtQm9sZE1UIiBzdEZudDpmb250RmFtaWx5PSJBcmlhbCIgc3RGbnQ6Zm9udEZhY2U9IkJvbGQiIHN0Rm50OmZvbnRUeXBlPSJPcGVuIFR5cGUiIHN0Rm50OnZlcnNpb25TdHJpbmc9IlZlcnNpb24gNS4wMSIgc3RGbnQ6Y29tcG9zaXRlPSJGYWxzZSIgc3RGbnQ6Zm9udEZpbGVOYW1lPSJhcmlhbGJkLnR0ZiIvPiA8cmRmOmxpIHN0Rm50OmZvbnROYW1lPSJBcmlhbE1UIiBzdEZudDpmb250RmFtaWx5PSJBcmlhbCIgc3RGbnQ6Zm9udEZhY2U9IlJlZ3VsYXIiIHN0Rm50OmZvbnRUeXBlPSJPcGVuIFR5cGUiIHN0Rm50OnZlcnNpb25TdHJpbmc9IlZlcnNpb24gNS4wMSIgc3RGbnQ6Y29tcG9zaXRlPSJGYWxzZSIgc3RGbnQ6Zm9udEZpbGVOYW1lPSJhcmlhbC50dGYiLz4gPHJkZjpsaSBzdEZudDpmb250TmFtZT0iSG9vZ2UwNTUzIiBzdEZudDpmb250RmFtaWx5PSJob29nZSAwNV81MyIgc3RGbnQ6Zm9udEZhY2U9IlJlZ3VsYXIiIHN0Rm50OmZvbnRUeXBlPSJUcnVlVHlwZSIgc3RGbnQ6dmVyc2lvblN0cmluZz0iTWFjcm9tZWRpYSBGb250b2dyYXBoZXIgNC4xLjQgNy8zLzAxIiBzdEZudDpjb21wb3NpdGU9IkZhbHNlIiBzdEZudDpmb250RmlsZU5hbWU9IkhPT0cwNTUzLlRURiIvPiA8cmRmOmxpIHN0Rm50OmZvbnROYW1lPSJUaW1lc05ld1JvbWFuUFMtQm9sZE1UIiBzdEZudDpmb250RmFtaWx5PSJUaW1lcyBOZXcgUm9tYW4iIHN0Rm50OmZvbnRGYWNlPSJCb2xkIiBzdEZudDpmb250VHlwZT0iT3BlbiBUeXBlIiBzdEZudDp2ZXJzaW9uU3RyaW5nPSJWZXJzaW9uIDUuMDEiIHN0Rm50OmNvbXBvc2l0ZT0iRmFsc2UiIHN0Rm50OmZvbnRGaWxlTmFtZT0idGltZXNiZC50dGYiLz4gPHJkZjpsaSBzdEZudDpmb250TmFtZT0iVGltZXNOZXdSb21hblBTTVQiIHN0Rm50OmZvbnRGYW1pbHk9IlRpbWVzIE5ldyBSb21hbiIgc3RGbnQ6Zm9udEZhY2U9IlJlZ3VsYXIiIHN0Rm50OmZvbnRUeXBlPSJPcGVuIFR5cGUiIHN0Rm50OnZlcnNpb25TdHJpbmc9IlZlcnNpb24gNS4wMSIgc3RGbnQ6Y29tcG9zaXRlPSJGYWxzZSIgc3RGbnQ6Zm9udEZpbGVOYW1lPSJ0aW1lcy50dGYiLz4gPC9yZGY6QmFnPiA8L3hhcFRQZzpGb250cz4gPHhhcFRQZzpQbGF0ZU5hbWVzPiA8cmRmOlNlcT4gPHJkZjpsaT5DeWFuPC9yZGY6bGk+IDxyZGY6bGk+TWFnZW50YTwvcmRmOmxpPiA8cmRmOmxpPlllbGxvdzwvcmRmOmxpPiA8cmRmOmxpPkJsYWNrPC9yZGY6bGk+IDxyZGY6bGk+YmxhbmNvPC9yZGY6bGk+IDxyZGY6bGk+UEFOVE9ORSA4NzIgQzwvcmRmOmxpPiA8cmRmOmxpPlBBTlRPTkUgODc3IEM8L3JkZjpsaT4gPHJkZjpsaT5VUzAxPC9yZGY6bGk+IDwvcmRmOlNlcT4gPC94YXBUUGc6UGxhdGVOYW1lcz4gPHhhcFRQZzpTd2F0Y2hHcm91cHM+IDxyZGY6U2VxPiA8cmRmOmxpPiA8cmRmOkRlc2NyaXB0aW9uIHhhcEc6Z3JvdXBOYW1lPSJHcnVwbyBkZSBtdWVzdHJhcyBwb3IgZGVmZWN0byIgeGFwRzpncm91cFR5cGU9IjAiPiA8eGFwRzpDb2xvcmFudHM+IDxyZGY6U2VxPiA8cmRmOmxpIHhhcEc6c3dhdGNoTmFtZT0iQmxhbmNvIiB4YXBHOm1vZGU9IlJHQiIgeGFwRzp0eXBlPSJQUk9DRVNTIiB4YXBHOnJlZD0iMjU1IiB4YXBHOmdyZWVuPSIyNTUiIHhhcEc6Ymx1ZT0iMjU1Ii8+IDxyZGY6bGkgeGFwRzpzd2F0Y2hOYW1lPSJOZWdybyIgeGFwRzptb2RlPSJSR0IiIHhhcEc6dHlwZT0iUFJPQ0VTUyIgeGFwRzpyZWQ9IjAiIHhhcEc6Z3JlZW49IjAiIHhhcEc6Ymx1ZT0iMCIvPiA8cmRmOmxpIHhhcEc6c3dhdGNoTmFtZT0iQ2FyYm9uY2lsbG8iIHhhcEc6bW9kZT0iUkdCIiB4YXBHOnR5cGU9IlBST0NFU1MiIHhhcEc6cmVkPSI2MyIgeGFwRzpncmVlbj0iNjMiIHhhcEc6Ymx1ZT0iNjMiLz4gPHJkZjpsaSB4YXBHOnN3YXRjaE5hbWU9IkdyYWZpdG8iIHhhcEc6bW9kZT0iUkdCIiB4YXBHOnR5cGU9IlBST0NFU1MiIHhhcEc6cmVkPSIxMDIiIHhhcEc6Z3JlZW49IjEwMiIgeGFwRzpibHVlPSIxMDIiLz4gPHJkZjpsaSB4YXBHOnN3YXRjaE5hbWU9IkNlbml6YSIgeGFwRzptb2RlPSJSR0IiIHhhcEc6dHlwZT0iUFJPQ0VTUyIgeGFwRzpyZWQ9IjEzOSIgeGFwRzpncmVlbj0iMTM5IiB4YXBHOmJsdWU9IjEzOSIvPiA8cmRmOmxpIHhhcEc6c3dhdGNoTmFtZT0iSHVtbyIgeGFwRzptb2RlPSJSR0IiIHhhcEc6dHlwZT0iUFJPQ0VTUyIgeGFwRzpyZWQ9IjE3NyIgeGFwRzpncmVlbj0iMTc3IiB4YXBHOmJsdWU9IjE3NyIvPiA8cmRmOmxpIHhhcEc6c3dhdGNoTmFtZT0iQ2Fmw6kgY29uIGxlY2hlIiB4YXBHOm1vZGU9IlJHQiIgeGFwRzp0eXBlPSJQUk9DRVNTIiB4YXBHOnJlZD0iMjI3IiB4YXBHOmdyZWVuPSIxODciIHhhcEc6Ymx1ZT0iMTQ5Ii8+IDxyZGY6bGkgeGFwRzpzd2F0Y2hOYW1lPSJDYXB1Y2hpbm8iIHhhcEc6bW9kZT0iUkdCIiB4YXBHOnR5cGU9IlBST0NFU1MiIHhhcEc6cmVkPSIyMTIiIHhhcEc6Z3JlZW49IjE1MCIgeGFwRzpibHVlPSI4OCIvPiA8cmRmOmxpIHhhcEc6c3dhdGNoTmFtZT0iTW9jaGFjY2lubyIgeGFwRzptb2RlPSJSR0IiIHhhcEc6dHlwZT0iUFJPQ0VTUyIgeGFwRzpyZWQ9IjEzOCIgeGFwRzpncmVlbj0iOTIiIHhhcEc6Ymx1ZT0iNDEiLz4gPHJkZjpsaSB4YXBHOnN3YXRjaE5hbWU9IkNob2NvbGF0ZSIgeGFwRzptb2RlPSJSR0IiIHhhcEc6dHlwZT0iUFJPQ0VTUyIgeGFwRzpyZWQ9IjkwIiB4YXBHOmdyZWVuPSI2MSIgeGFwRzpibHVlPSIyOCIvPiA8cmRmOmxpIHhhcEc6c3dhdGNoTmFtZT0iUm9qbyBNYXJ0ZSIgeGFwRzptb2RlPSJSR0IiIHhhcEc6dHlwZT0iUFJPQ0VTUyIgeGFwRzpyZWQ9IjE0MiIgeGFwRzpncmVlbj0iMCIgeGFwRzpibHVlPSIwIi8+IDxyZGY6bGkgeGFwRzpzd2F0Y2hOYW1lPSJSdWLDrSIgeGFwRzptb2RlPSJSR0IiIHhhcEc6dHlwZT0iUFJPQ0VTUyIgeGFwRzpyZWQ9IjE5MCIgeGFwRzpncmVlbj0iMCIgeGFwRzpibHVlPSIwIi8+IDxyZGY6bGkgeGFwRzpzd2F0Y2hOYW1lPSJSb2pvIHB1cm8iIHhhcEc6bW9kZT0iUkdCIiB4YXBHOnR5cGU9IlBST0NFU1MiIHhhcEc6cmVkPSIyNTUiIHhhcEc6Z3JlZW49IjAiIHhhcEc6Ymx1ZT0iMCIvPiA8cmRmOmxpIHhhcEc6c3dhdGNoTmFtZT0iQ2FsYWJhemEiIHhhcEc6bW9kZT0iUkdCIiB4YXBHOnR5cGU9IlBST0NFU1MiIHhhcEc6cmVkPSIyNTUiIHhhcEc6Z3JlZW49IjY0IiB4YXBHOmJsdWU9IjAiLz4gPHJkZjpsaSB4YXBHOnN3YXRjaE5hbWU9Ikp1Z28iIHhhcEc6bW9kZT0iUkdCIiB4YXBHOnR5cGU9IlBST0NFU1MiIHhhcEc6cmVkPSIyNTUiIHhhcEc6Z3JlZW49IjEyNyIgeGFwRzpibHVlPSIwIi8+IDxyZGY6bGkgeGFwRzpzd2F0Y2hOYW1lPSJTb2wiIHhhcEc6bW9kZT0iUkdCIiB4YXBHOnR5cGU9IlBST0NFU1MiIHhhcEc6cmVkPSIyNTUiIHhhcEc6Z3JlZW49IjE5MCIgeGFwRzpibHVlPSIwIi8+IDxyZGY6bGkgeGFwRzpzd2F0Y2hOYW1lPSJBbWFyaWxsbyIgeGFwRzptb2RlPSJSR0IiIHhhcEc6dHlwZT0iUFJPQ0VTUyIgeGFwRzpyZWQ9IjI1NSIgeGFwRzpncmVlbj0iMjU1IiB4YXBHOmJsdWU9IjAiLz4gPHJkZjpsaSB4YXBHOnN3YXRjaE5hbWU9IlZlcmRlIENoYXJ0cmV1c2UiIHhhcEc6bW9kZT0iUkdCIiB4YXBHOnR5cGU9IlBST0NFU1MiIHhhcEc6cmVkPSIyMDMiIHhhcEc6Z3JlZW49IjI1NSIgeGFwRzpibHVlPSIwIi8+IDxyZGY6bGkgeGFwRzpzd2F0Y2hOYW1lPSJWZXJkZSBoaWVyYmEiIHhhcEc6bW9kZT0iUkdCIiB4YXBHOnR5cGU9IlBST0NFU1MiIHhhcEc6cmVkPSIxMjUiIHhhcEc6Z3JlZW49IjI1NSIgeGFwRzpibHVlPSIwIi8+IDxyZGY6bGkgeGFwRzpzd2F0Y2hOYW1lPSJWZXJkZSBwdXJvIiB4YXBHOm1vZGU9IlJHQiIgeGFwRzp0eXBlPSJQUk9DRVNTIiB4YXBHOnJlZD0iMCIgeGFwRzpncmVlbj0iMjU1IiB4YXBHOmJsdWU9IjAiLz4gPHJkZjpsaSB4YXBHOnN3YXRjaE5hbWU9Ik1lbnRhIiB4YXBHOm1vZGU9IlJHQiIgeGFwRzp0eXBlPSJQUk9DRVNTIiB4YXBHOnJlZD0iMCIgeGFwRzpncmVlbj0iMTYyIiB4YXBHOmJsdWU9IjYxIi8+IDxyZGY6bGkgeGFwRzpzd2F0Y2hOYW1lPSJWZXJkZSBhY2VibyIgeGFwRzptb2RlPSJSR0IiIHhhcEc6dHlwZT0iUFJPQ0VTUyIgeGFwRzpyZWQ9IjAiIHhhcEc6Z3JlZW49IjEwNyIgeGFwRzpibHVlPSI1MSIvPiA8cmRmOmxpIHhhcEc6c3dhdGNoTmFtZT0iVmVyZGUgbWFyIiB4YXBHOm1vZGU9IlJHQiIgeGFwRzp0eXBlPSJQUk9DRVNTIiB4YXBHOnJlZD0iMSIgeGFwRzpncmVlbj0iODMiIHhhcEc6Ymx1ZT0iODMiLz4gPHJkZjpsaSB4YXBHOnN3YXRjaE5hbWU9IkF6dWwgQ2FyaWJlIiB4YXBHOm1vZGU9IlJHQiIgeGFwRzp0eXBlPSJQUk9DRVNTIiB4YXBHOnJlZD0iNCIgeGFwRzpncmVlbj0iMTE1IiB4YXBHOmJsdWU9IjE0NCIvPiA8cmRmOmxpIHhhcEc6c3dhdGNoTmFtZT0iQXp1bCBNZWRpdGVycsOhbmVvIiB4YXBHOm1vZGU9IlJHQiIgeGFwRzp0eXBlPSJQUk9DRVNTIiB4YXBHOnJlZD0iMCIgeGFwRzpncmVlbj0iMTU5IiB4YXBHOmJsdWU9IjE5NyIvPiA8cmRmOmxpIHhhcEc6c3dhdGNoTmFtZT0iQXp1bCBBbG9oYSIgeGFwRzptb2RlPSJSR0IiIHhhcEc6dHlwZT0iUFJPQ0VTUyIgeGFwRzpyZWQ9IjAiIHhhcEc6Z3JlZW49Ijk2IiB4YXBHOmJsdWU9IjE4MSIvPiA8cmRmOmxpIHhhcEc6c3dhdGNoTmFtZT0iTmVncm8gYXp1bCBjbGFybyIgeGFwRzptb2RlPSJSR0IiIHhhcEc6dHlwZT0iUFJPQ0VTUyIgeGFwRzpyZWQ9IjAiIHhhcEc6Z3JlZW49IjYwIiB4YXBHOmJsdWU9IjI1NSIvPiA8cmRmOmxpIHhhcEc6c3dhdGNoTmFtZT0iQXp1bCBwdXJvIiB4YXBHOm1vZGU9IlJHQiIgeGFwRzp0eXBlPSJQUk9DRVNTIiB4YXBHOnJlZD0iMCIgeGFwRzpncmVlbj0iMCIgeGFwRzpibHVlPSIyNTUiLz4gPHJkZjpsaSB4YXBHOnN3YXRjaE5hbWU9IkF6dWwgemFmaXJvIiB4YXBHOm1vZGU9IlJHQiIgeGFwRzp0eXBlPSJQUk9DRVNTIiB4YXBHOnJlZD0iMzQiIHhhcEc6Z3JlZW49IjE2IiB4YXBHOmJsdWU9IjIwOSIvPiA8cmRmOmxpIHhhcEc6c3dhdGNoTmFtZT0iVGFuemFuaXRhIiB4YXBHOm1vZGU9IlJHQiIgeGFwRzp0eXBlPSJQUk9DRVNTIiB4YXBHOnJlZD0iNjYiIHhhcEc6Z3JlZW49IjE2IiB4YXBHOmJsdWU9IjIwOSIvPiA8cmRmOmxpIHhhcEc6c3dhdGNoTmFtZT0iUMO6cnB1cmEgYnJpbGxhbnRlIiB4YXBHOm1vZGU9IlJHQiIgeGFwRzp0eXBlPSJQUk9DRVNTIiB4YXBHOnJlZD0iOTMiIHhhcEc6Z3JlZW49IjE2IiB4YXBHOmJsdWU9IjIwOSIvPiA8cmRmOmxpIHhhcEc6c3dhdGNoTmFtZT0iVmlvbGV0YSIgeGFwRzptb2RlPSJSR0IiIHhhcEc6dHlwZT0iUFJPQ0VTUyIgeGFwRzpyZWQ9IjEyOSIgeGFwRzpncmVlbj0iMTYiIHhhcEc6Ymx1ZT0iMjA5Ii8+IDxyZGY6bGkgeGFwRzpzd2F0Y2hOYW1lPSJPcnF1w61kZWEgUMO6cnB1cmEiIHhhcEc6bW9kZT0iUkdCIiB4YXBHOnR5cGU9IlBST0NFU1MiIHhhcEc6cmVkPSIxNzAiIHhhcEc6Z3JlZW49IjE2IiB4YXBHOmJsdWU9IjIwOSIvPiA8cmRmOmxpIHhhcEc6c3dhdGNoTmFtZT0iRnVjc2lhIiB4YXBHOm1vZGU9IlJHQiIgeGFwRzp0eXBlPSJQUk9DRVNTIiB4YXBHOnJlZD0iMjA3IiB4YXBHOmdyZWVuPSIxNiIgeGFwRzpibHVlPSIxNzYiLz4gPHJkZjpsaSB4YXBHOnN3YXRjaE5hbWU9IlJvam8gcHVybyBnbG9iYWwiIHhhcEc6dHlwZT0iUFJPQ0VTUyIgeGFwRzp0aW50PSIxMDAuMDAwMDAwIiB4YXBHOm1vZGU9IlJHQiIgeGFwRzpyZWQ9IjI1NSIgeGFwRzpncmVlbj0iMCIgeGFwRzpibHVlPSIwIi8+IDxyZGY6bGkgeGFwRzpzd2F0Y2hOYW1lPSJKdWdvIGdsb2JhbCIgeGFwRzp0eXBlPSJQUk9DRVNTIiB4YXBHOnRpbnQ9IjEwMC4wMDAwMDAiIHhhcEc6bW9kZT0iUkdCIiB4YXBHOnJlZD0iMjU1IiB4YXBHOmdyZWVuPSIxMjYiIHhhcEc6Ymx1ZT0iMCIvPiA8cmRmOmxpIHhhcEc6c3dhdGNoTmFtZT0iQW1hcmlsbG8gZ2xvYmFsIiB4YXBHOnR5cGU9IlBST0NFU1MiIHhhcEc6dGludD0iMTAwLjAwMDAwMCIgeGFwRzptb2RlPSJSR0IiIHhhcEc6cmVkPSIyNTUiIHhhcEc6Z3JlZW49IjI1NSIgeGFwRzpibHVlPSIwIi8+IDxyZGY6bGkgeGFwRzpzd2F0Y2hOYW1lPSJWZXJkZSBwdXJvIGdsb2JhbCIgeGFwRzp0eXBlPSJQUk9DRVNTIiB4YXBHOnRpbnQ9IjEwMC4wMDAwMDAiIHhhcEc6bW9kZT0iUkdCIiB4YXBHOnJlZD0iMCIgeGFwRzpncmVlbj0iMjU1IiB4YXBHOmJsdWU9IjAiLz4gPHJkZjpsaSB4YXBHOnN3YXRjaE5hbWU9IkF6dWwgTWVkaXRlcnLDoW5lbyBnbG9iYWwiIHhhcEc6dHlwZT0iUFJPQ0VTUyIgeGFwRzp0aW50PSIxMDAuMDAwMDAwIiB4YXBHOm1vZGU9IlJHQiIgeGFwRzpyZWQ9IjAiIHhhcEc6Z3JlZW49IjE2MCIgeGFwRzpibHVlPSIxOTgiLz4gPHJkZjpsaSB4YXBHOnN3YXRjaE5hbWU9IkF6dWwgcHVybyBnbG9iYWwiIHhhcEc6dHlwZT0iUFJPQ0VTUyIgeGFwRzp0aW50PSIxMDAuMDAwMDAwIiB4YXBHOm1vZGU9IlJHQiIgeGFwRzpyZWQ9IjAiIHhhcEc6Z3JlZW49IjAiIHhhcEc6Ymx1ZT0iMjU1Ii8+IDxyZGY6bGkgeGFwRzpzd2F0Y2hOYW1lPSJQQU5UT05FIDg3MiBDIiB4YXBHOnR5cGU9IlNQT1QiIHhhcEc6dGludD0iMTAwLjAwMDAwMCIgeGFwRzptb2RlPSJDTVlLIiB4YXBHOmN5YW49IjIwLjAwMDAwMCIgeGFwRzptYWdlbnRhPSIzMC4wMDAwMDEiIHhhcEc6eWVsbG93PSI2OS45OTk5OTkiIHhhcEc6YmxhY2s9IjE0Ljk5OTk5OSIvPiA8cmRmOmxpIHhhcEc6c3dhdGNoTmFtZT0iUEFOVE9ORSA4NzMgQyIgeGFwRzp0eXBlPSJTUE9UIiB4YXBHOnRpbnQ9IjEwMC4wMDAwMDAiIHhhcEc6bW9kZT0iQ01ZSyIgeGFwRzpjeWFuPSIzMC4wMDAwMDEiIHhhcEc6bWFnZW50YT0iMzAuMDAwMDAxIiB4YXBHOnllbGxvdz0iNjAuMDAwMDAyIiB4YXBHOmJsYWNrPSIxMC4wMDAwMDAiLz4gPHJkZjpsaSB4YXBHOnN3YXRjaE5hbWU9IlBBTlRPTkUgODc3IEMiIHhhcEc6dHlwZT0iU1BPVCIgeGFwRzp0aW50PSIxMDAuMDAwMDAwIiB4YXBHOm1vZGU9IkNNWUsiIHhhcEc6Y3lhbj0iMC4wMDAwMDAiIHhhcEc6bWFnZW50YT0iMC4wMDAwMDAiIHhhcEc6eWVsbG93PSIwLjAwMDAwMCIgeGFwRzpibGFjaz0iNDAuMDAwMDAxIi8+IDxyZGY6bGkgeGFwRzpzd2F0Y2hOYW1lPSJVUzAxIiB4YXBHOnR5cGU9IlNQT1QiIHhhcEc6dGludD0iMTAwLjAwMDAwMCIgeGFwRzptb2RlPSJSR0IiIHhhcEc6cmVkPSIxMzciIHhhcEc6Z3JlZW49IjIxIiB4YXBHOmJsdWU9IjU0Ii8+IDxyZGY6bGkgeGFwRzpzd2F0Y2hOYW1lPSJibGFuY28iIHhhcEc6dHlwZT0iU1BPVCIgeGFwRzp0aW50PSIxMDAuMDAwMDAwIiB4YXBHOm1vZGU9IkNNWUsiIHhhcEc6Y3lhbj0iMC4wMDAwMDAiIHhhcEc6bWFnZW50YT0iMC4wMDAwMDAiIHhhcEc6eWVsbG93PSIwLjAwMDAwMCIgeGFwRzpibGFjaz0iMC4wMDAwMDAiLz4gPC9yZGY6U2VxPiA8L3hhcEc6Q29sb3JhbnRzPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6bGk+IDwvcmRmOlNlcT4gPC94YXBUUGc6U3dhdGNoR3JvdXBzPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8P3hwYWNrZXQgZW5kPSJ3Ij8+/+IMWElDQ19QUk9GSUxFAAEBAAAMSExpbm8CEAAAbW50clJHQiBYWVogB84AAgAJAAYAMQAAYWNzcE1TRlQAAAAASUVDIHNSR0IAAAAAAAAAAAAAAAEAAPbWAAEAAAAA0y1IUCAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARY3BydAAAAVAAAAAzZGVzYwAAAYQAAABsd3RwdAAAAfAAAAAUYmtwdAAAAgQAAAAUclhZWgAAAhgAAAAUZ1hZWgAAAiwAAAAUYlhZWgAAAkAAAAAUZG1uZAAAAlQAAABwZG1kZAAAAsQAAACIdnVlZAAAA0wAAACGdmlldwAAA9QAAAAkbHVtaQAAA/gAAAAUbWVhcwAABAwAAAAkdGVjaAAABDAAAAAMclRSQwAABDwAAAgMZ1RSQwAABDwAAAgMYlRSQwAABDwAAAgMdGV4dAAAAABDb3B5cmlnaHQgKGMpIDE5OTggSGV3bGV0dC1QYWNrYXJkIENvbXBhbnkAAGRlc2MAAAAAAAAAEnNSR0IgSUVDNjE5NjYtMi4xAAAAAAAAAAAAAAASc1JHQiBJRUM2MTk2Ni0yLjEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAADzUQABAAAAARbMWFlaIAAAAAAAAAAAAAAAAAAAAABYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABi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"
                         ,
                         width: 85},
                         { 
                             margin: [90, 20, 0, 0],
                             text: 'UNIVERSIDAD DE SEVILLA\nÁREA DE CONTRATACIÓN Y PATRIMONIO\nUNIDAD DE INVENTARIO', style: 'subheader' }
                        
                ]}
            ],
            
	       content: [
               
               
               
           
               
//                { text: 'UNIVERSIDAD DE SEVILLA\nÁREA DE CONTRATACIÓN Y PATRIMONIO\nUNIDAD DE INVENTARIO', style: 'subheader' },
               
				
				{
						style: 'tableExample',
						color: '#444',
						table: {
								widths: [ 345, 145 ],
								headerRows: 2,
								// keepWithHeaderRows: 1,
								body: [
										[{ text: 'IMPRESO PARA DAR DE ALTA EN EL INVENTARIO GENERAL', rowSpan: 2,style: 'tableHeader' }, { text: 'CÓDIGO:                           ', rowSpan: 2, style: 'tableHeader' }],
										['',''],
								]
						}
				},
                
                { 
                    text: 'A rellenar por la Unidad de Inventario', 
                    style: ['quote', 'small'] 
                },
                {
						style: 'tableExample',
						color: '#444',
						table: {
								widths: [ 500 ],
								// keepWithHeaderRows: 1,
								body: [
										[{ text: 'Nº DE INVENTARIO GENERAL:', rowSpan: 2, style: 'tableHeader' }],
										[''],
								]
						}
				},		
				{ 
                    text: 'A rellenar por el Centro/Departamento/Servicio', 
                    style: ['quote', 'small'] 
                },
                {
						style: 'tableExample',
						color: '#444',
						table: {
								widths: [ 500 ],
								// keepWithHeaderRows: 1,
								body: [
										[{ text: 'Nº JUSTIFICANTE DEL GASTO: '+this.nJGasto , style: 'tableHeader', colSpan: 0 }],
                                        [{ text: 'DESCRIPCIÓN DEL ELEMENTO', style: 'tableHeader', alignment: 'center', rowSPan: 2 }],
                                        [ {table: {
                                            headerRows: 1,
                                                widths: [ 500 ],
                                                body: [ 
                                                        [{ text: 'Nº INVENTARIO DE CENTRO: '+nInv , style: 'subheader', rowSPan: 2 }],
                                                        [{ text: 'DESCRIPCIÓN DEL BIEN: '+this.descElem , style: 'subheader',rowSPan: 2 }],
                                                        [{ text: 'ELEMENTOS QUE LO COMPONEN: '+this.elemsElem , style: 'subheader',rowSPan: 4 }],
                                                    
                                                        [{ 
                                                            
                                                            style: 'subheader',
                                                            columns: [
                                                                { text: 'MARCA: '+this.marca },
                                                                { text: 'MODELO: '+this.modelo },
                                                                { text: 'NºSERIE: '+this.nSerie}

                                                            ]
                                                         }],
                                                        
                                                        [{ 
                                                            
                                                            style: 'subheader',
                                                            columns: [
                                                                { text: 'MATRÍCULA(vehículos:):' },
                                                                { text: 'NºDE BASTIDOR(vehículos):' }
                                                            ]
                                                         }],
                                                        
                                                        [{ text: 'USUARIO DEL BIEN: '+this.profesor , style: 'subheader'}]
                                                    ]
                                        },
                                        layout: 'noBorders'}],
                                    
                                    
                                        [{ text: 'UBICACIÓN DEL ELEMENTO', style: 'tableHeader', alignment: 'center', rowSPan: 2 }],
                                    
                                        [ {table: {
                                            headerRows: 1,
                                            widths: [ 500 ],
                                            body: [ 
                                                    [{ text: 'UBICACIÓN ECONÓMICA(Indicar orgánica): '+this.orgElem , style: 'subheader', rowSPan: 2 }],
                                                    [{ text: 'UBICACIÓN ORGANIZATIVA(centro de coste): '+this.centroCoste , style: 'subheader' }],
                                                    [{ text: 'UBICACIÓN GEOGRÁFICA\n\nCAMPUS: '+this.campus, style: 'subheader', rowSPan: 2 }],
                                                    [{ text: 'EDIFICIO: '+this.edif , style: 'subheader' }],
                                                    [{ text: 'PLANTA: '+this.planta , style: 'subheader' }],
                                                    [{ text: 'LOCAL: '+this.local , style: 'subheader' }]
                                                ]
                                        },
                                        layout: 'noBorders'}],
                                    
                                        [{ text: 'INVESTIGACIÓN', style: 'tableHeader', alignment: 'center', rowSPan: 2 }],
                                    
                                        [ {table: {
                                            headerRows: 1,
                                            widths: [ 500 ],
                                            body: [ 
                                                    [{ text: 'ORGÁNICA PROYECTO: '+this.orgProy , style: 'subheader', rowSPan: 2 }],
                                                    [{ text: 'CÓDIGO DE PROYECTO(a cumplimentar por investigación): ', style: 'subheader' }],
                                                    [{ text: 'Nº DE PROYECTO: '+this.nProy, style: 'subheader', rowSPan: 2 }],
                                                    [{ text: 'TÍTULO DEL PROYECTO: '+this.titProy , style: 'subheader' }]
                                                ]
                                        },
                                        layout: 'noBorders'}],
                                        
                                        [{ text: 'VALORACIÓN DEL ELEMENTO', style: 'tableHeader', alignment: 'center', rowSPan: 2 }],
                                    
                                        [ {table: {
                                            headerRows: 1,
                                            widths: [ 500 ],
                                            body: [ 

                                                    [{ text: 'PROVEEDOR/TRANSMITIENTE: '+this.proveedor, style: 'subheader', rowSPan: 2 }],
                                                    [{ 

                                                        style: 'subheader',
                                                        columns: [
                                                            { text: 'NÚM. DE FACTURA: '+this.nFact },
                                                            { text: 'FECHA de FACTURA/DOCUMENTO: '+this.fechaFact.toLocaleDateString() }
                                                        ]
                                                     }],

                                                    [{ text: 'PRECIO DE ADQUISICIÓN(Unitario con IVA incluido aplicando prorrata): '+this.precio, style: 'subheader', rowSPan: 2 }],
                                                    [{ text: 'VALOR DECLARADO EN DOCUMENTO OFICIAL (Adquisiciones sin factura): ' , style: 'subheader' }],
                                                    [{ text: 'VALOR ESTIMADO (Otras altas): ' , style: 'subheader' }]
                                                ]
                                        },
                                        layout: 'noBorders'}],
                                    
                                          
								]
						}
				},
                { 
                    alignment: 'center',
                    fontSize: 8,
                    margin: 5,
                    columns: [
                        { text: 'Firma y sello del\nresponsable funcional\n\n\n\nFdo: Antonio Ruiz Cortés'},
                        { text: 'LA UNIDAD DE\nINVENTARIO'}
                    ]
                }
               				
            ],
            styles: {
                header: {
                    fontSize: 12,
                    bold: true,
                    margin: [0, 0, 0, 5]
                },
                subheader: {
                    fontSize: 10,
                    bold: false,
//                    margin: [0, 10, 0, 5]
                    margin: [0, 0, 0, 2]
                },
                tableExample: {
 //                   margin: [0, 5, 0, 15]
                    margin: [0, 2, 0, 5]
                },
                tableHeader: {
                    bold: true,
                    fontSize: 10,
                    color: 'black'
                },
                quote: {
                    italics: true
                },
                small: {
                    fontSize: 8
                }
            }
        }
		
		// Start the pdf-generation process 
		pdfMake.createPdf(docDefinition).open();
	}
});

Template.inventarioFormQ.helpers({
    
    dataQ: function() {
        console.log("En dataQ");
        console.log("params _id: "+Router.current().params._id);
        
        if (Inventario.findOne({_id: Router.current().params._id})){
            console.log("idI dataQ: "+Router.current().params._id);
            return Inventario.findOne({_id: Router.current().params._id});
        }
        else {
            var idI = new Meteor.Collection.ObjectID(Router.current().params._id);
            console.log("idI dataQ: "+idI);
            console.log(Inventario.findOne({_id: idI}));
            return Inventario.findOne({_id: idI});
        }    
    },
    methodQ: function(){
        console.log("path: "+Router.current().location.get().path);
        if (Router.current().location.get().path == "/inventario/new"){
            console.log("methodQ: insertInventarioQ")
            return "insertInventarioQ";
        }
        else {
            console.log("methodQ: updateInventarioQ")
            return "updateInventarioQ"; // Si uso el method para el update no me funciona dice doc undefined
        }
    },
    idQ: function(){
        console.log("Url: "+Router.current().location.get().path);
        if (Router.current().location.get().path == "/inventario/new"){
            console.log("idQ: insert");
            return "insertInventarioForm";
        }
        else {
            console.log("idQ: updateinventarioForm")
            return "updateInventarioForm";
        }
    },
    typeQ: function(){
        console.log("Url: "+Router.current().location.get().path);
        if (Router.current().location.get().path == "/inventario/new"){
            console.log("typeQ: insert");
//            return "insert"; 
            return "method";  //para el inser si me funciona con el method que es lo recomendado por seguridad.
        }
        else {
            console.log("typeQ: update")
            return "update";
        }
    }
}),
    
Template.inventarioRemove.events({
    'click .js-delete-inventario':function(event){
        if (Inventario.findOne({_id: Router.current().params._id})){
            console.log("idI data a borrar: "+Router.current().params._id);
            Meteor.call("removeInventario", Router.current().params._id);
        }
        else {
            var idI = new Meteor.Collection.ObjectID(Router.current().params._id);
            console.log("Eliminando inventario _id: "+idI);
            Meteor.call("removeInventario", idI);
        }
    },
}),
Template.inventarioRemove.helpers({
    data: function(){
        console.log("Borrar params _id: "+Router.current().params._id);
        
        if (Inventario.findOne({_id: Router.current().params._id})){
            console.log("idI data a borrar: "+Router.current().params._id);
            return Inventario.findOne({_id: Router.current().params._id});
        }
        else {
            var idI = new Meteor.Collection.ObjectID(Router.current().params._id);
            console.log("idI data a borrar: "+idI);
            console.log(Inventario.findOne({_id: idI}));
            return Inventario.findOne({_id: idI});
        }    
    }
        
});   

