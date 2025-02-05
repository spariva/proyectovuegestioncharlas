<template>
  <div class="container my-3 my-md-5 p-4">
    <!-- Botón de retroceder -->
    <button class="btn-retroceder" @click="volverAtras">
      <i class="fas fa-arrow-left"></i>
      <!-- Ícono de retroceder -->
    </button>

    <h2 class="mb-4 text-center" style="font-size: 42px; font-weight: 400px">
      Gestión de Alumnos
    </h2>
    <hr class="linea-separadora" />
    <!-- Mostrar spinner mientras se cargan los alumnos -->

    <div v-if="cargando" class="d-flex justify-content-center my-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <!-- Mostrar mensaje si no hay alumnos -->
    <div
      v-if="!alumnos.length && !cargando"
      class="alert alert-warning text-center my-4"
    >
      No hay alumnos en el curso.
    </div>

    <!-- Tarjetas de Usuarios -->
    <div class="row row-cols-xl-3 row-cols-lg-2 row-cols-1 d-flex">
      <div class="col" v-for="alumno in alumnos" :key="alumno.alumno.idUsuario">
        <div class="card-usuario">
          <div class="card-encabezado" style="background-color: #7782c6">
            <i
              class="fas fa-info-circle info-icon"
              @click="mostrarInformacionUsuario(alumno)"
            ></i>
          </div>
          <div class="card-cuerpo">
            <div class="profile-info">
              <img :src="alumno.alumno.imagen" />
              <div class="user-details">
                <div class="titulo" style="font-weight: 600">
                  {{ alumno.alumno.usuario }}
                </div>
                <div class="user-curso subtitulo" style="font-size: 13px">
                  {{ alumno.alumno.email }} 
                  <span class="badge bg-info text-dark">
                    {{alumno.charlasTotales}}
                    </span>           
                  <span class="badge bg-danger">
                    {{alumno.charlasPropuestas}}
                    </span>  
                  <span class="badge bg-success">
                    {{alumno.charlasAceptadas}}
                    </span>                 
                </div>
              </div>
            </div>
            <div class="btn-group">
              <!-- Solo mostrar el botón si el curso está activo -->
              <button
                @click="abrirAlerta(alumno.alumno)"
                v-text="alumno.alumno.estadoUsuario ? 'Desactivar' : 'Activar'"
                :style="{
                  backgroundColor: alumno.alumno.estadoUsuario
                    ? '#ff4d4f'
                    : '#4CAF50',
                  color: 'white',
                }"
              ></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PerfilService from "@/services/PerfilService";
import Swal from "sweetalert2";

export default {
  name: "AlumnosCursoProfesorComponent",
  data() {
    return {
      alumnos: [],
      cargando: false,
      perfilService: new PerfilService(),
      curso: { activo: false },
    };
  },
  methods: {
    abrirAlerta(alumno) {
      if (alumno.estadoUsuario) {
        // Si el alumno está activo, se le pregunta si quiere desactivarlo
        Swal.fire({
          title: "¿Estás seguro?",
          text: `Estás a punto de desactivar al usuario "${alumno.usuario}"`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Sí, cambiar",
          cancelButtonText: "Cancelar",
        }).then((result) => {
          if (result.isConfirmed) {
            this.cambiarEstadoAlumno(alumno, false); // Desactivar
          }
        });
      } else {
        // Si el alumno está inactivo, se le pregunta si quiere activarlo
        Swal.fire({
          title: "¿Deseas activar al alumno?",
          text: `El alumno "${alumno.usuario}" está desactivado. ¿Deseas activarlo?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Sí, activar",
          cancelButtonText: "No, cancelar",
        }).then((result) => {
          if (result.isConfirmed) {
            this.cambiarEstadoAlumno(alumno, true); // Activar
          }
        });
      }
    },

    async cambiarEstadoAlumno(alumno, activar) {
      Swal.fire({
        title: activar ? "Activando..." : "Desactivando...",
        text: `Por favor, espere mientras se ${
          activar ? "activa" : "desactiva"
        } al usuario.`,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        // Realiza la actualización en la API para activar o desactivar al alumno
        await this.perfilService.updateEstadoUsuario(alumno.idUsuario, activar);

        // Recarga los datos de los alumnos
        await this.cargarAlumnos();

        // Muestra un mensaje de éxito
        Swal.fire(
          "¡Éxito!",
          `El usuario "${alumno.usuario}" ha sido ${
            activar ? "activado" : "desactivado"
          }.`,
          "success"
        );
      } catch (error) {
        // Muestra un mensaje de error
        Swal.fire({
          title: "¡Error!",
          text: `No se pudo ${
            activar ? "activar" : "desactivar"
          } el usuario. Por favor, inténtelo de nuevo.`,
          icon: "error",
          confirmButtonText: "Cerrar",
        });
      }
    },

    mostrarInformacionUsuario(alumno) {
      Swal.fire({
        title: "Información del Usuario",
        html: `
        <div style="text-align: left;">
      <strong>Nombre:</strong> ${alumno.alumno.usuario}<br>
      <strong>Curso:</strong> ${alumno.alumno.curso}<br>
      <strong>Email:</strong> ${alumno.alumno.email}<br>
      <strong>Charlas totales:</strong>
       ${alumno.charlasTotales}<br> <!-- Aquí accedes a charlasTotales -->
      <strong>Estado:</strong> ${
        alumno.alumno.estadoUsuario ? "Activo" : "Inactivo"
      } </div>
    `,
        icon: "info",
        confirmButtonText: "OK",
      });
    },
    async cargarAlumnos() {
      try {
        const idCurso = this.$route.query.idCurso;
        const activo = this.$route.query.activo === 'true';
        console.log("idCurso:", idCurso);
        this.cargando = true;
        console.log("Cargando alumnos...");

        // const data = await this.perfilService.getAlumnosCursoProfesorEnAlumnos(
        //   idCurso
        // );
        // console.log("Los alumnos son: ", data);

        let data;
        console.log("EL maldito ud: " + activo);
        if (activo) {
          // Si el curso está activo, se obtiene la lista de alumnos activos
          data = await this.perfilService.getAlumnosCursoProfesorEnAlumnos(
            idCurso
          );
          console.log("Los alumnos activos son: ", data);
        } else {
          // Si el curso está inactivo, se obtiene el historial de alumnos
          data = await this.perfilService.getAlumnosCursoHistorialProfesor(
            idCurso
          );
          console.log("Los alumnos del historial son: ", data);
        }

        // Verifica que hay alumn
        this.alumnos = data.alumnos; // Asignamos los alumnos del primer curso encontrado
        console.log("Alumnos cargados correctamente: ", this.alumnos);
      } catch (error) {
        console.error("Error al cargar los alumnos:", error);
        alert("No se pudieron cargar los alumnos.");
      } finally {
        this.cargando = false;
      }
    },

    volverAtras() {
      this.$router.go(-1); // Esto hace que el navegador vuelva a la página anterior
    },
  },

  created() {
    this.cargarAlumnos();
  },
};
</script>

<style scoped>
.card-usuario:last-child {
  margin-right: 0;
}

.user-curso {
  font-size: 14px;
}

.btn-group button {
  background-color: #cbcbcb;
  border: none;
  padding: 8px 15px;
  margin: 5px;
  border-radius: 15px;
  cursor: pointer;
  transition: background-color 0.3s;
  flex: 1;
}

.btn-group button:hover {
  background-color: #c0c0c0;
}

.container {
  background-color: #d9d9d9;
  border-radius: 16px;
}

.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

@media (max-width: 575.98px) {
  .container {
    width: auto;
    padding: 16px;
    margin-right: 20px;
    margin-left: 20px;
  }
}

.card-usuario {
  width: 100%;
  max-width: 480px;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
  margin-bottom: 20px;
}

.card-encabezado {
  background-color: #ff7a00;
  height: 100px;
  position: relative;
}

.info-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  color: white;
  cursor: pointer;
}

.card-cuerpo {
  background-color: #a3a3a3;
  padding: 20px;
  text-align: center;
  position: relative;
  margin-top: -30px;
  z-index: 1;
}

.profile-info {
  display: block;
  align-items: center;
  justify-content: center;
  margin-top: -60px;
}

.profile-info img {
  width: 100px;
  height: 100px;
  border-radius: 10%;
  margin-bottom: 20px;
}

.user-details {
  text-align: center;
}

.btn-group {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.btn-retroceder {
  background-color: #a3a3a3;
  border: none;
  padding: 8px 15px;
  margin: 0px;
  border-radius: 15px;
  cursor: pointer;
  transition: background-color 0.3s;
  flex: 1;
}

.btn-activar {
  margin-left: 0px !important;
  background-color: #40685c !important; 
  color: white;
  cursor: pointer;
}

.btn-activar:active {
  border-color: #578e73 !important;
  background-color: #578e73 !important;
  color: white;
}

.btn-activar:hover {
  border-color: #578e73 !important;
  background-color: #578e73 !important;
  color: white;
}

@media (max-width: 991px) {
  .d-flex {
    display: grid !important;
    justify-content: center !important;
  }

  .card-usuario {
    width: 400px; /* Ajusta el ancho máximo de las tarjetas */
    margin-left: auto;
    margin-right: auto;
  }
}

@media (max-width: 450px) {
  .card-usuario {
    width: 350px; /* Ajusta el ancho máximo de las tarjetas */
    margin-left: auto;
    margin-right: auto;
  }
}

@media (max-width: 400px) {
  .card-usuario {
    width: 300px; /* Ajusta el ancho máximo de las tarjetas */
    margin-left: auto;
    margin-right: auto;
  }
}

.swal2-cancel.btn-red {
  background-color: #ff4d4f !important; /* Rojo intenso */
  color: white !important; /* Texto blanco */
  border: none !important; /* Sin borde */
  box-shadow: none !important; /* Sin sombra */
}
</style>
