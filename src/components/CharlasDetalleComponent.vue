<template>
    <div>
      <div class="container">
        <h1>Detalles de la Charla</h1>
        <div v-if="charla">
          <h2>{{ charla.titulo }}</h2>
          <p><strong>Descripción:</strong> {{ charla.descripcion }}</p>
          <p><strong>Estado:</strong> {{ charla.estadoCharla }}</p>
          <p>{{ charla.recursos }}</p>
        </div>
        <div v-else>
          <p>Cargando los detalles de la charla...</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import CharlasService from "@/services/CharlasService";
  const serviceCharlas = new CharlasService();
  
  export default {
    name: "CharlasDetalleComponent",
    data() {
      return {
        charla: null, // Detalles de la charla específica
      };
    },
    mounted() {
      this.cargarCharla(); // Llamar al cargarCharla al montar el componente
    },
    methods: {
      cargarCharla() {
        const idCharla = this.$route.params.id; // Obtener el parámetro de la URL
        serviceCharlas
          .getCharlas()
          .then((response) => {
            this.charla = response.find((c) => c.idCharla === parseInt(idCharla));
            if (!this.charla) {
              console.error("Charla no encontrada con el ID:", idCharla);
            }
          })
          .catch((error) => {
            console.error("Error al cargar las charlas:", error);
          });
      },
    },
  };
  </script>
  
  <style>
  .container {
    padding: 20px;
  }
  </style>
  