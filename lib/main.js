Profesores = new Mongo.Collection("profesores");
Inventario = new Mongo.Collection("inventario");
Personaldto = new Mongo.Collection("personaldto");

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