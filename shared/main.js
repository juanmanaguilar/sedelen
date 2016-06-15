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
    },
    insertPersonaldto: function(data){
      if (this.userId) {
          return Personaldto.insert(data);
      }
      return;
    },
    upsertInventario: function (inventarioId, data){
        if (this.userId) {
          return Inventario.upsert(inventarioId, data);
      }
    },
    removeInventario: function (inventarioId){
        if (this.userId) {
          return Inventario.remove(inventarioId);
      }
    }
});