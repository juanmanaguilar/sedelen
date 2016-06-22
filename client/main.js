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
    this.render('inventarioEdit', {to:"main",
                                  data: function () {
                                            var idP = new Meteor.Collection.ObjectID(this.params._id);
                                            return Inventario.findOne({_id: idP});
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
    this.render('personaldtoEdit', {to:"main"});
});
Router.route('/personaldto/trash/:_id', function(){
    console.log("Accediendo al documento: "+this.params._id);
    this.render('navbar', {to:"header"});
    this.render('personaldtoRemove', {to:"main"});
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

Template.mostrarlistaPersonaldto.helpers({
   personaldto: function() {
       return Personaldto.find({},{sort:{apellidos: 1, nombre: 1}});
   }
}),
  
Template.listaInventario.helpers({
   inventario: function() {
       return Inventario.find({}, {sort:{"nInvent": -1, "profesor": 1}});
   }
}),
Template.listaInventario.events({
    idLink: function(){
        if (Inventario.findOne({_id: Router.current().params._id})){
            return Inventario.findOne({_id: Router.current().params._id});
        }
        else {
            var idI = new Meteor.Collection.ObjectID(Router.current().params._id);
            console.log("idI: "+ idI);
            return Inventario.findOne({_id: idI});
        }    
    }
}),
    
Template.listaInventario.events({
  'click .js-show-inventarioForm': function(event){
//      $("#inventario_add_form").modal('show');
      console.log(event);
      console.log(this);
      if (Inventario.findOne({_id: this._id})){
            console.log("el _id es un Object: "+this._id);
            Router.go("/inventario/"+this._id);
        }
        else {
            console.log("El _id es un str: "+this._id.str);
            Router.go("/inventario/"+this._id.str);
        }    
      
      
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
    
Template.inventarioEdit.events({
	'click .js-generar-pdf': function() {
        console.log("Generando PDF");
		// Define the pdf-document 
		//var docDefinition = { content: 'Mi documento pdf' };
        var nInv = this.nInvent.toString();
        console.log("nInv: "+nInv);
        
        var docDefinition = {
            pageSize: 'A4',
            header: [{
                margin: 10,
                columns: [
                        
                         { 
                             margin: [10, 0, 0, 0],
                             text: 'UNIVERSIDAD DE SEVILLA\nÁREA DE CONTRATACIÓN Y PATRIMONIO\nUNIDAD DE INVENTARIO', style: 'subheader' }
                        
                ]}
            ],
            
	       content: [
               
               
                { text: 'UNIVERSIDAD DE SEVILLA\nÁREA DE CONTRATACIÓN Y PATRIMONIO\nUNIDAD DE INVENTARIO', style: 'subheader' },
				
				{
						style: 'tableExample',
						color: '#444',
						table: {
								widths: [ 345, 145 ],
								headerRows: 2,
								// keepWithHeaderRows: 1,
								body: [
										[{ text: 'IMPRESO PARA DAR DE ALTA EN EL INVENTARIO\nGENERAL', rowSpan: 2,style: 'tableHeader' }, { text: 'CÓDIGO:                           ', rowSpan: 2, style: 'tableHeader' }],
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
										[{ text: 'Nº DE INVENTARIO\nGENERAL:......................................................................................', rowSpan: 2, style: 'tableHeader' }],
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
										[{ text: 'Nº JUSTIFICANTE DEL GASTO:...............................................................', style: 'tableHeader', colSpan: 0 }],
                                        [{ text: 'DESCRIPCIÓN DEL ELEMENTO', style: 'tableHeader', alignment: 'center', rowSPan: 2 }],
                                        [ {table: {
                                            headerRows: 1,
                                                widths: [ 500 ],
                                                body: [ 
                                                        [{ text: '\nNº INVENTARIO DE CENTRO: '+nInv , style: 'subheader', rowSPan: 2 }],
                                                        [{ text: 'DESCRIPCIÓN DEL BIEN: '+this.descElem , style: 'subheader',rowSPan: 3 }],
                                                        [{ text: 'ELEMENTOS QUE LO COMPONEN: '+this.elemsElem , style: 'subheader',rowSPan: 3 }],
                                                    
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
                                                        
                                                        [{ text: 'SITUACIÓN DEL BIEN:........................................................................', style: 'subheader'}]
                                                    ]
                                        },
                                        layout: 'noBorders'}],
                                    
                                    
                                        [{ text: 'UBICACIÓN DEL ELEMENTO', style: 'tableHeader', alignment: 'center', rowSPan: 2 }],
                                    
                                        [ {table: {
                                            headerRows: 1,
                                            widths: [ 500 ],
                                            body: [ 
                                                    [{ text: '\nUBICACIÓN ECONÓMICA(Indicar orgánica): '+this.orgElem , style: 'subheader', rowSPan: 2 }],
                                                    [{ text: 'UBICACIÓN ORGANIZATIVA(centro de coste): '+this.centroCoste , style: 'subheader' }],
                                                    [{ text: 'UBICACIÓN GEOGRÁFICA\n\nCAMPUS: '+this.campus, style: 'subheader', rowSPan: 2 }],
                                                    [{ text: 'EDIFICIO: '+this.edif , style: 'subheader' }],
                                                    [{ text: 'PLANTA: '+this.planta , style: 'subheader' }],
                                                    [{ text: 'LOCAL: '+this.local , style: 'subheader' }],
                                                    [{ text: 'SUBLOCAL: ' , style: 'subheader' }]
                                                ]
                                        },
                                        layout: 'noBorders'}],
                                        
                                        [{ text: 'VALORACIÓN DEL ELEMENTO', style: 'tableHeader', alignment: 'center', rowSPan: 2 }],
                                    
                                        [ {table: {
                                            headerRows: 1,
                                            widths: [ 500 ],
                                            body: [ 

                                                    [{ text: '\nPROVEEDOR/TRANSMITIENTE: '+this.proveedor, style: 'subheader', rowSPan: 2 }],
                                                    [{ 

                                                        style: 'subheader',
                                                        columns: [
                                                            { text: 'NÚM. DE FACTURA: '+this.nFact },
                                                            { text: 'FECHA de FACTURA/DOCUMENTO: '+this.fechaFact }
                                                        ]
                                                     }],

                                                    [{ text: 'PRECIO DE ADQUISICIÓN(Uitario con IVA incluido aplicando prorrata): '+this.precio, style: 'subheader', rowSPan: 2 }],
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
                    fontSize: 6,
                    columns: [
                        { text: 'Firma y sello del\nresponsable funcional\n\n\n\nFdo:'},
                        { text: 'LA UNIDAD DE\nINVENTARIO'}
                    ]
                }
				
            ],
            styles: {
                header: {
                    fontSize: 8,
                    bold: true,
                    margin: [0, 0, 0, 10]
                },
                ancho100: {
                    fontSize: 8,
                    bold: true,
                    margin: [0, 0, 0, 0],
                    width: '100%'
                },
                subheader: {
                    fontSize: 6,
                    bold: true,
                    margin: [0, 10, 0, 5]
                },
                tableExample: {
                    margin: [0, 5, 0, 15]
                },
                tableHeader: {
                    bold: true,
                    fontSize: 6,
                    color: 'black'
                },
                quote: {
                    italics: true
                },
                small: {
                    fontSize: 4
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
        console.log("params _id: "+ Router.current().params._id);
        
        if (Inventario.findOne({_id: Router.current().params._id})){
            return Inventario.findOne({_id: Router.current().params._id});
        }
        else {
            var idI = new Meteor.Collection.ObjectID(Router.current().params._id);
            console.log("idI dataQ: "+ idI);
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
            return "updateInventarioQ";
        }
    },
    typeQ: function(){
        console.log("Url: "+Router.current().location.get().path);
        if (Router.current().location.get().path == "/inventario/new"){
            console.log("typeQ: insert")
            return "insert";
        }
        else {
            console.log("typeQ: update")
            return "update";
        }
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

