Profesores = new Mongo.Collection("profesores");
Inventario = new Mongo.Collection("inventario");
Personaldto = new Mongo.Collection("personaldto");

Inventario.attachSchema(new SimpleSchema({
    
    nJGasto: {
        type: String,
//       unique: true,
        label: "Nº JUSTIFICANTE DEL GASTO:"
    },
    nInvent: {
      type: String,
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
        defaultValue: "",
        optional: true
    },
    marca: {
        type: String,
        label: "MARCA:",
        defaultValue: "",
        optional: true
    },
    modelo: {
        type: String,
        label: "MODELO:",
        defaultValue: "",
        optional: true
    },
    nSerie: {
        type: String,
        label: "Nº DE SERIE:",
        defaultValue: "",
        optional: true
    },
    profesor: {
        type: String,
        label: "USUARIO DEL BIÉN:",
        defaultValue: "",
        optional: true
    },
    orgElem: {
        type: String,
        label: "ORGÁNICA:"
    },
    centroCoste: {
        type: String,
        label: "CENTRO DE COSTE:",
    },
    campus: {
        type: String,
        label: "CAMPUS:",
        defaultValue: "Reina Mercedes"
    },
    edif: {
        type: String,
        label: "EDIFICIO:",
        defaultValue: "E.T.S.I. Informática"
    },
    planta: {
        type: Number,
        label: "PLANTA:",
        defaultValue: 0,
        max: 4,
        optional: true
    },
    local: {
        type: String,
        label: "LOCAL:",
        defaultValue: "",
        optional: true
    },
    orgProy: {
        type: String,
        label: "ORGÁNICA PROYECTO:",
        defaultValue: "",
        optional: true
    },
    nProy: {
        type: String,
        label: "Nº DE PROYECTO:",
        defaultValue: "",
        optional: true
    },
    titProy: {
        type: String,
        label: "TÍTULO DEL PROYECTO:",
        defaultValue: "",
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
        label: "PRECIO:",
        decimal: true
    },
    unidad: {
        type: Number,
        label: "Unidad:",
        optional: true
    },
    dpt: {
        type: String,
        label: "DPT:",
        optional: true,
        defaultValue: "89"
    },
    
}));

Personaldto.attachSchema(new SimpleSchema({
    usuario: {
      type: String,
      label: "Nombre de usuario",
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
        type: String,
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
        type: String,
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
        type: String,
        label: "Panel",
        optional: true,
        max: 12
    },
    toma: {
        type: String,
        label: "Toma",
        optional: true,
        max: 24
    }
}));