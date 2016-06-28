Profesores = new Mongo.Collection("profesores");
Inventario = new Mongo.Collection("inventario");
Personaldto = new Mongo.Collection("personaldto");


Inventario.attachSchema(new SimpleSchema({
    
    nInvent: {
      type: Number,
//      unique: true,
      label: "Nº DE INVENTARIO DE CENTRO:"
    },
    descElem: {
        type: String,
        label: "DESCRIPCIÓN DEL BIÉN:"
    },
    elemsElem: {
        type: String,
        label: "ELEMENTOS QUE LO COMPONEN:",
        optional: true
    },
    marca: {
        type: String,
        label: "MARCA:",
        optional: true
    },
    modelo: {
        type: String,
        label: "MODELO:",
        optional: true
    },
    nSerie: {
        type: String,
        label: "Nº DE SERIE:",
        optional: true
    },
    orgElem: {
        type: String,
        label: "ORGÁNICA:",
        optional: true
    },
    centroCoste: {
        type: String,
        label: "CENTRO DE COSTE:",
        optional: true
    },
    campus: {
        type: String,
        label: "CAMPUS:"
    },
    edif: {
        type: String,
        label: "EDIFICIO:"
    },
    planta: {
        type: Number,
        label: "PLANTA:",
        optional: true,
        max: 4
    },
    local: {
        type: String,
        label: "LOCAL:",
        optional: true
    },
    orgProy: {
        type: String,
        label: "ORGÁNICA PROYECTO:",
        optional: true
    },
    nProy: {
        type: String,
        label: "Nº DE PROYECTO:",
        optional: true
    },
    titProy: {
        type: String,
        label: "TÍTULO DEL PROYECTO:",
        optional: true
    },
    proveedor: {
        type: String,
        label: "PROVEEDOR:"
    },
    nFact: {
        type: String,
        label: "Nº DE FACTURA:"
    },
    fechaFact: {
        type: Date,
        label: "FECHA DE FACTURA:",
        optional: true,
        autoform: {
            datePickerOptions: {
                format: "dd/mm/yyyy",
                weekStart: 1,
                maxViewMode: 3,
                language: "es",
                autoclose: true
            }
        }
    },
    precio: {
        type: Number,
        label: "PRECIO:"
    },
    unidad: {
        type: Number,
        label: "Unidad:",
        optional: true
    },
    profesor: {
        type: String,
        label: "Profesor:",
        optional: true
    },
    dpt: {
        type: String,
        label: "DPT:",
        optional: true
    },
    
}));

Personaldto.attachSchema(new SimpleSchema({
    usuario: {
      type: String,
      regEx: /^[a-z0-9A-Z_]{3,15}$/,
      unique: true
    },
    nombre: {
        type: String,
        label: "Nombre"
    },
    apellidos: {
        type: String,
        label: "Apellidos"
    },
    despacho: {
        type: String,
        label: "Despacho",
        optional: true
    },
    telefono: {
        type: Number,
        label: "Teléfono",
        optional: true
    },
    observaciones: {
        type: String,
        optional: true,
        label: "Observaciones"
    },
    email: {
        type: String,
        label: "email",
        optional: true,
        regEx: SimpleSchema.RegEx.Email
    },
    activo: {
        type: Boolean,
        label: "Activo"
    },
    armario: {
        type: String,
        label: "Armario",
        optional: true
    },
    roseta: {
        type: String,
        label: "Roseta",
        optional: true
    },
    panel: {
        type: Number,
        label: "Panel",
        optional: true,
        max: 12
    },
    toma: {
        type: Number,
        label: "Toma",
        optional: true,
        max: 24
    }
}));