<template>
  <div class="container my-3 my-md-5" v-if="usuario">
    <div class="profile-card">
      <div
        class="profile-header"
        style="display: flex; align-items: center; padding: 10px"
      >
        <button
          class="btn btn-secondary detalles-btn"
          style="
            margin-left: auto;
            margin-bottom: auto;
            margin-top: 0px;
          "
          @click="mostrarDetalles"
        >
          Detalles
        </button>
      </div>

      <div class="profile-content">
        <img :src="usuario.imagen" alt="Foto de perfil" class="profile-image" />
        <i class="fa fa-pencil edit-icon" @click="triggerFileInput"></i>
        <input
          type="file"
          ref="fileInput"
          accept="image/*"
          style="display: none"
          @change="handleFileChange"
        />
        <div class="profile-info">
          <h3>{{ usuario.nombre }} {{ usuario.apellidos }}</h3>
          <p>{{ usuario.curso }}</p>
        </div>
        <div class="profile-buttons text-end">
          <button
            class="btn btn-secondary me-2"
            style="
              margin-left: auto;
              margin-bottom: auto;
            "
            @click="mostrarFormularioContrasena()"
          >
            Editar Contraseña
          </button>
          <button
            class="btn botoncrearcurso me-0"
            style="margin-left: 10px;"
            @click="abrirModalCrearCurso"
          >
            Crear Curso
          </button>
        </div>
      </div>
      <hr />

      <div v-if="cargando" class="text-center mb-4">
        <div class="spinner-border text-success" style="margin-top: 20px" role="status">
          <span class="visually-hidden">Cargando cursos...</span>
        </div>
      </div>

      <div
        class="row row-cols-xl-3 row-cols-lg-2 row-cols-1 d-flex"
        v-if="!cargando"
      >
        <div
          class="col-12 col-sm-6 col-md-4"
          style="margin-bottom: 20px"
          v-for="(cursoData, index) in cursos"
          :key="index"
        >
          <div class="course-card">
            <div
              class="card-header d-flex justify-content-between align-items-center"
            >
              <button
                style="margin-left: auto"
                class="btn no-hover"
                :class="cursoData.curso.activo ? 'btn-success' : 'btn-danger'"
              >
                {{ cursoData.curso.activo ? "Activo" : "Inactivo" }}
              </button>
            </div>
            <div class="card-body">
              <h5>{{ cursoData.curso.nombre }}</h5>
              <p>Alumnos: {{ cursoData.numeroAlumnos }}</p>
            </div>
            <div class="card-footer" style="margin-bottom: 20px">
              <small class="text-body-secondary pequeno">
                <button
                  class="btn btn-ver mt-3"
                  @click="
                    verAlumnos(cursoData.curso.idCurso, cursoData.curso.activo)
                  "
                >
                  Ver Alumnos
                </button>
                <button
                  class="btn btn-danger mt-3"
                  @click="eliminarCurso(cursoData.curso.idCurso)"
                >
                  Eliminar
                </button>
                <button
                  class="btn botoncrearcurso mt-3"
                  @click="modificarEstadoCurso(cursoData.curso)"
                >
                  Editar
                </button>
              </small>
            </div>
          </div>
        </div>
      </div>

      <!-- Detalles del usuario -->
      <div v-if="showDetails">
        <div class="list-group">
          <div class="list-group-item">
            <strong>Nombre:</strong> {{ usuario.nombre }}
          </div>
          <div class="list-group-item">
            <strong>Apellidos:</strong> {{ usuario.apellidos }}
          </div>
          <div class="list-group-item">
            <strong>Email:</strong> {{ usuario.email }}
          </div>
          <div class="list-group-item">
            <strong>Curso:</strong> {{ usuario.curso }}
          </div>
        </div>
      </div>
    </div>
  </div>
  <router-view />
</template>


<script>
import PerfilService from "@/services/PerfilService";
import Swal from "sweetalert2";

export default {
  name: "PerfilProfesorComponent",
  data() {
    return {
      usuario: null,
      rondas: [],
      alumnos: [],
      cursos: [],
      seccionActiva: null, // 'rondas' o 'alumnos'
      perfilService: new PerfilService(),
      cargando: false,
    };
  },
  methods: {
    mostrarFormularioContrasena() {
      Swal.fire({
        title: "Editar Contraseña",
        html: ` 
      <div class="form-group">
        <input type="password" id="contraseniaNueva" class="form-control" placeholder="Contraseña Nueva">
      </div>
    `,
        focusConfirm: false,
        showCancelButton: true,
        customClass: {
          popup: "swal-popup-bootstrap",
          title: "swal-title-bootstrap",
          input: "swal-input-bootstrap",
          confirmButton: "swal-confirm-btn",
          cancelButton: "swal-cancel-btn",
        },
        preConfirm: async () => {
          const contraseniaNueva =
            Swal.getPopup().querySelector("#contraseniaNueva").value;

          // Validación de la contraseña: debe tener entre 8 y 20 caracteres, letras y números, y sin caracteres especiales ni espacios
          const regex =
            /^(?=.*[a-zA-Z])(?=.*\d)(?!.*\s)(?!.*[^a-zA-Z0-9]).{8,20}$/;

          if (!contraseniaNueva) {
            Swal.showValidationMessage(
              "Por favor, llena el campo de la nueva contraseña"
            );
            return false;
          }

          if (!regex.test(contraseniaNueva)) {
            Swal.showValidationMessage(
              "La contraseña debe tener entre 8 y 20 caracteres, incluir letras y números, y no contener espacios ni caracteres especiales"
            );
            return false;
          }

          try {
            await this.perfilService.updateContrasenia(contraseniaNueva);
            Swal.fire("Éxito", "Contraseña actualizada con éxito", "success");
          } catch (error) {
            console.error("Error al actualizar la contraseña:", error);
            Swal.fire("Error", "No se pudo actualizar la contraseña.", "error");
          }
        },
      });
    },
    async modificarEstadoCurso(curso) {
      try {
        // Mostrar la alerta de confirmación antes de cambiar el estado
        const result = await Swal.fire({
          title: "¿Estás seguro?",
          text: `¿Deseas cambiar el estado del curso a ${
            curso.activo ? "inactivo" : "activo"
          }?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Sí, cambiar",
          cancelButtonText: "Cancelar",
        });

        if (!result.isConfirmed) return;

        // Mostrar Swal con spinner mientras se ejecutan los métodos
        Swal.fire({
          title: "Actualizando...",
          text: "Por favor, espera.",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        const cursosData = await this.perfilService.getAlumnosCursoProfesor();
        const hayCursoActivo = cursosData.some((c) => c.curso.activo);

        if (!curso.activo && hayCursoActivo) {
          Swal.fire(
            "Error",
            "Ya existe un curso activo. Debes desactivarlo primero.",
            "warning"
          );
          return;
        }

        const nuevoEstado = !curso.activo;
        await this.perfilService.updateEstadoCurso(curso.idCurso, nuevoEstado);

        Swal.fire(
          "Éxito",
          "El estado del curso ha sido actualizado.",
          "success"
        );

        this.cargarCursos();
      } catch (error) {
        console.error("Error al modificar el estado del curso:", error);
        Swal.fire(
          "Error",
          "No se pudo actualizar el estado del curso.",
          "error"
        );
      }
    },
    async eliminarCurso(idCurso) {
      try {
        // Mostrar una alerta de confirmación antes de eliminar
        const result = await Swal.fire({
          title: "¿Estás seguro?",
          text: "Este curso será eliminado permanentemente.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Sí, eliminar",
          cancelButtonText: "Cancelar",
        });

        if (result.isConfirmed) {
          // Realizar la solicitud DELETE al servidor
          await this.perfilService.eliminarCurso(idCurso);
          // Actualizar la lista de cursos
          this.cargarCursos();
          Swal.fire(
            "¡Eliminado!",
            "El curso ha sido eliminado con éxito.",
            "success"
          );
        }
      } catch (error) {
        console.error("Error al eliminar el curso:", error);
        Swal.fire(
          "Error",
          "No se pudo eliminar el curso. Inténtalo más tarde.",
          "error"
        );
      }
    },
    async abrirModalCrearCurso() {
      const { value: formValues, isConfirmed } = await Swal.fire({
        title: "Crear Curso",
        html:
          '<input id="idCurso" class="swal2-input" placeholder="ID curso">' +
          '<input id="nombre" class="swal2-input" placeholder="Nombre curso">' +
          '<input id="fechaInicio" type="date" class="swal2-input" placeholder="Fecha de inicio">' +
          '<input id="fechaFin" type="date" class="swal2-input" placeholder="Fecha de fin">',
        focusConfirm: false,
        showCancelButton: true, // Mostrar el botón de cancelar
        confirmButtonText: "Crear", // Cambiar texto del botón "Confirmar"
        cancelButtonText: "Cancelar", // Cambiar texto del botón "Cancelar"
        preConfirm: () => {
          const idCurso = parseInt(document.getElementById("idCurso").value); // Permite un ID vacío que se pone como 0 por defecto
          const nombre = document.getElementById("nombre").value;
          const fechaInicio = document.getElementById("fechaInicio").value;
          const fechaFin = document.getElementById("fechaFin").value;
          if (!nombre || !fechaInicio || !fechaFin) {
            Swal.showValidationMessage("Todos los campos son obligatorios");
            return;
          }
          return { idCurso, nombre, fechaInicio, fechaFin }; // Retornamos el objeto completo
        },
      });

      if (isConfirmed && formValues) {
        try {
          // Convertir las fechas a formato ISO
          const fechaInicioISO = new Date(formValues.fechaInicio).toISOString();
          const fechaFinISO = new Date(formValues.fechaFin).toISOString();

          // Obtener la lista de cursos antes de crear uno nuevo
          const cursosData = await this.perfilService.getAlumnosCursoProfesor();
          console.log("Cursos obtenidos:", cursosData);

          // Verificar si hay un curso activo
          const hayCursoActivo = cursosData.some((curso) => curso.curso.activo);

          // Determinar si el nuevo curso será activo o inactivo
          const activo = !hayCursoActivo; // Será activo solo si no hay otro curso activo
          console.log("¿Hay un curso activo?", hayCursoActivo);

          // Pasar el formulario completo al método crearCurso
          const cursoData = {
            idCurso: formValues.idCurso, // Ahora tomamos el ID ingresado
            nombre: formValues.nombre, // nombre
            fechaInicio: fechaInicioISO, // fechaInicio
            fechaFin: fechaFinISO, // fechaFin
            activo: activo, // activo
          };

          // Llamar a crearCurso pasando el objeto completo y esperar la respuesta
          await this.perfilService.crearCurso(cursoData);

          Swal.fire("Éxito", "Curso creado correctamente", "success");
          this.cargarCursos(); // Recargar lista de cursos con el nuevo curso
        } catch (error) {
          console.error("Error al crear el curso:", error);
          Swal.fire(
            "Error",
            error.message || "No se pudo crear el curso",
            "error"
          );
        }
      } else if (!isConfirmed) {
        console.log("El usuario canceló la creación del curso.");
      }
    },

    async verAlumnos(idCurso, activo) {
      try {
        this.cargando = true; // Mostrar spinner
        let data;

        // Si el curso está activo, filtrar por ID del curso
        if (activo) {
          // Si el curso no está activo, realiza la consulta directamente por ID
          data = await this.perfilService.getAlumnosCursoActivoProfesor(
            idCurso
          );
        } else {
          // const cursosData = await this.perfilService.getAlumnosCursoProfesor();
          // data = cursosData.find((curso) => curso.curso.idCurso === idCurso);
          // Si el curso no está activo, usa el método para cursos inactivos (historial)
          console.log("Hola");
          data = await this.perfilService.getAlumnosCursoHistorialProfesor(
            idCurso
          );
        }

        if (data && data.alumnos && data.alumnos.length > 0) {
          this.alumnos = data.alumnos; // Almacena los alumnos del curso seleccionado
          this.$router.push(`/perfilprofesor/alumnos?idCurso=${idCurso}&activo=${activo}`);
        } else {
          Swal.fire({
            icon: "warning",
            title: "Sin datos",
            text: "No se encontraron alumnos para el curso seleccionado.",
          });
        }
      } catch (error) {
        console.error("Error al cargar los alumnos:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un problema al cargar los datos. Inténtalo de nuevo.",
        });
      } finally {
        this.cargando = false; // Ocultar spinner
      }
    },
    mostrarDetalles() {
      Swal.fire({
        title: "Detalles del Usuario", // Título del SweetAlert
        html: `
        <div style="text-align: left;">
          <strong>Nombre:</strong> ${this.usuario.nombre} <br>
          <strong>Apellidos:</strong> ${this.usuario.apellidos} <br>
          <strong>Email:</strong> ${this.usuario.email} <br>
          <strong>Curso Actual:</strong> ${this.usuario.curso} <br>
          <strong>Estado:</strong> ${
            this.usuario.estadoUsuario ? "Activo" : "Inactivo"
          } <br>
          </div>
        `,
        icon: "info", // Tipo de ícono (puedes cambiarlo por otro si lo deseas)
        confirmButtonText: "Cerrar", // Botón para cerrar el alert
      });
    },
    async cargarPerfil() {
      try {
        const data = await this.perfilService.getUsuarioPerfil();
        this.usuario = data.usuario; // Guardamos los datos del usuario en el estado
        this.editedUsuario = { ...this.usuario }; // Inicializamos editedUsuario
      } catch (error) {
        console.error("Error al cargar el perfil:", error);
        alert("No se pudo cargar la información del perfil.");
      }
    },
    cancelarEdicion() {
      this.editMode = false; // Cancelar edición
      this.editedUsuario = { ...this.usuario }; // Revertir cambios no guardados
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    async handleFileChange(event) {
      const file = event.target.files[0];
      if (!file) return; // Si no se seleccionó archivo, salir
      try {
        const base64Content = await this.convertFileToBase64(file);
        await this.perfilService.uploadUserImage(
          this.usuario.idUsuario,
          file.name,
          base64Content
        );
        this.usuario.imagen = URL.createObjectURL(file); // Actualiza la imagen mostrada
      } catch (error) {
        console.error("Error al subir la imagen:", error);
        alert("No se pudo subir la imagen. Inténtalo de nuevo.");
      }
    },
    convertFileToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(",")[1]); // Solo el contenido base64
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });
    },
    async mostrarRondas() {
      try {
        this.seccionActiva = "rondas";
        this.cargando = true;
        const data = await this.perfilService.getRondasProfesor();
        this.rondas = data;
      } catch (error) {
        console.error("Error al cargar las rondas:", error);
        alert("No se pudieron cargar las rondas.");
      } finally {
        this.cargando = false; // Ocultar spinner
      }
    },
    async cargarCursos() {
      try {
        this.cargando = true;
        const cursosData = await this.perfilService.getAlumnosCursoProfesor(); // Obtener todos los cursos
        console.log("Cursos obtenidos:", cursosData);

        // Ahora se filtrarán los cursos activos o inactivos, dependiendo de su estado
        this.cursos = await Promise.all(
          cursosData.map(async (cursoData) => {
            let alumnos = [];

            // Verifica si el curso está activo
            if (cursoData.curso.activo) {
              // Si está activo, se usa el método para obtener los alumnos del curso activo
              alumnos = await this.perfilService.getAlumnosCursoActivoProfesor(
                cursoData.curso.idCurso
              );
              console.log(
                `Alumnos del curso activo ${cursoData.curso.nombre}:`,
                alumnos
              );
            } else {
              // Si está inactivo, se usa el método para obtener el historial de alumnos
              alumnos =
                await this.perfilService.getAlumnosCursoHistorialProfesor(
                  cursoData.curso.idCurso
                );
              console.log(
                `Alumnos del curso inactivo ${cursoData.curso.nombre}:`,
                alumnos
              );
            }

            return {
              curso: cursoData.curso,
              numeroAlumnos: alumnos.numeroAlumnos, // Asegúrate de que la longitud no sea undefined
              alumnos: alumnos,
            };

            
          })
        );

        // Asegurarse de que los cursos se asignen correctamente después de la carga
        console.log("Cursos con alumnos cargados:", this.cursos);
      } catch (error) {
        console.error("Error al cargar los cursos:", error);
        alert("No se pudieron cargar los cursos.");
      } finally {
        this.cargando = false; // Desactiva el spinner
      }
    },
    async mostrarAlumnos() {
      try {
        this.seccionActiva = "alumnos";
        this.cargando = true;
        const data = await this.perfilService.getAlumnosCursoProfesor();
        // Si 'data' es un array de cursos con sus alumnos
        // Filtrar solo alumnos con estadoUsuario activo
        this.alumnos =
          data.length > 0
            ? data[0].alumnos.filter(
                (alumno) => alumno.alumno.estadoUsuario == true
              )
            : [];
      } catch (error) {
        console.error("Error al cargar los alumnos:", error);
        alert("No se pudieron cargar los alumnos.");
      } finally {
        this.cargando = false; // Ocultar spinner
      }
    },
    abrirAlerta(alumno) {
      if (alumno.estadoUsuario == true) {
        Swal.fire({
          title: "¿Estás seguro?",
          text: `Estás a punto de desactivar al usuario "${alumno.usuario}"`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Sí, cambiar",
          cancelButtonText: "Cancelar",
        }).then((result) => {
          if (result.isConfirmed) {
            this.cambiarEstadoAlumno(alumno);
          }
        });
      }
    },
    async cambiarEstadoAlumno(alumno) {
      if (alumno.estadoUsuario == true) {
        try {
          // Realizar la eliminación en el servidor
          await this.perfilService.updateEstadoUsuario(
            alumno.idUsuario,
            !alumno.estadoUsuario
          );
          Swal.fire(
            "Estado cambiado",
            `El usuario "${alumno.usuario}" ha sido desactivado correctamente. Ahora no podrá acceder al sistema.`,
            "success"
          );
          await this.mostrarAlumnos();
        } catch (error) {
          console.error("Error al eliminar el alumno:", error);
          Swal.fire(
            "Error en la Operación",
            "No se pudo desactivar al usuario. Por favor, inténtalo más tarde.",
            "error"
          );
        }
      }
    },
  },
  created() {
    this.cargarPerfil();
    this.cargarCursos();
  },
};
</script>

<style scoped>
.pie {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 15px;
  margin-top: auto;
}

.no-hover:active,
.no-hover {
  pointer-events: none;
  border-radius: 16px;
}

.image-container {
  position: relative;
  display: inline-block;
}
.profile-image {
  border: 4px solid #314b78;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.edit-icon {
  height: 10%;
  position: relative;
  top: 0px;
  right: 15px;
  font-size: 20px;
  color: white;
  background-color: #314b78;
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 10;
}

.edit-icon:hover {
  background-color: #41619a;
}

.card {
  background-color: #f8f9fa;
}

.card h4 {
  color: #333;
}

.list-group-item {
  font-size: 1.1em;
  padding: 15px;
  border: 1px solid #ddd;
  background-color: #ffffff;
  margin-bottom: 10px;
}

.list-group-item strong {
  color: #314b78;
}

.btn-ver{
  color: white;
  background-color: #314b78 !important;
}

.detalles-btn {
  margin-left: auto;
  margin-bottom: auto;
  margin-top: 0px;
  background-color: #314b78 !important;
  cursor: pointer;
  color: white;
}

.detalles-btn:hover {
  border-color: #41619a !important;
  background-color: #41619a !important;
  color: white;
}

.detalles-btn:active {
  border-color: #41619a !important;
  background-color: #41619a !important;
  color: white;
}

.botoncrearcurso {
  margin-left: 0px !important;
  background-color: #40685c !important; 
  color: white;
  cursor: pointer;
}

.botoncrearcurso:active {
  border-color: #578e73 !important;
  background-color: #578e73 !important;
  color: white;
}

.botoncrearcurso:hover {
  border-color: #578e73 !important;
  background-color: #578e73 !important;
  color: white;
}

@media (min-width: 768px) {
  .card {
    padding: 30px;
  }

  .profile-image {
    width: 150px;
    height: 150px;
  }
}

@media (min-width: 1200px) {
  .container {
    max-width: 1200px;
  }
  .card {
    padding: 40px;
  }
  .profile-image {
    width: 180px;
    height: 180px;
  }
}

@media (min-width: 991px) {
  .profile-buttons {
    width: 50%;
  }
}

@media (min-width: 991px) and (max-width: 1200px) {
  .profile-info {
    padding-bottom: 50px !important;
  }
}

@media (min-width: 500px) {
  .pequeno {
    display: flex;
    justify-content: center;
    gap: 15px;
  }
}

@media (max-width: 500px) {
  .pequeno {
    display: grid;
  }
}

body {
  background-color: #f5f5f5;
}

.profile-card {
  background-color: #e0e0e0;
  border-radius: 10px;
  padding: 20px;
}

.profile-header {
  background-color: #7782c6 !important;
  height: 150px;
  border-radius: 10px 10px 0 0;
}

.profile-content {
  display: flex;
  margin-top: -80px;
  gap: 20px;
}

.profile-image {
  width: 240px;
  height: 240px;
  border-radius: 30px;
  object-fit: cover;
  margin-left: 20px;
  margin-bottom: 30px;
}

.profile-info {
  display: block;
  flex-grow: 1;
  margin-top: auto;
  padding-bottom: 80px;
}

.profile-info h3 {
  margin: 0;
}

.profile-buttons {
  margin-top: 20px;
  margin-top: auto;
  padding-bottom: 0px;
}

.profile-buttons button {
  margin-right: 20px;
}

.row {
  display: flex;
  margin-left: 0;
  margin-right: 0;
}

.course-card {
  background-color: #d6d6d6;
  border-radius: 10px;
  position: relative;
  height: 100%;
  width: 100%;
}

.course-card .card-header {
  background-color: #a0a0a0;
  padding: 20px;
  border-radius: 10px 10px 0 0;
  font-size: 18px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.course-card .status {
  font-size: 12px;
  padding: 5px 10px;
  margin-left: auto;
}

.course-card .card-body {
  padding: 15px;
  height: 150px;
}

.course-card .add-button {
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 25px;
  height: 25px;
  background-color: #fff;
  border: none;
  border-radius: 50%;
  font-weight: bold;
  line-height: 1;
  text-align: center;
  cursor: pointer;
}
@media (max-width: 991px) {
  .d-flex {
    justify-content: center !important;
  }

  .col-12 {
    width: 80% !important;
  }

  .profile-content {
    flex-wrap: wrap;
  }

  .profile-info {
    flex: 1;
    text-align: left;
    margin-bottom: 0;
  }

  .profile-info h3 {
    margin-bottom: 5px;
  }

  .profile-buttons {
    width: 75%;
    margin-top: 20px;
    display: flex;
    align-items: center;
    margin-left: auto;
    margin-right: auto;
    gap: 15px;
  }

  .profile-buttons button {
    flex: 1 1 auto;
    margin: 0 auto;
    white-space: nowrap;
  }

  @media (max-width: 767px) {
    .profile-info {
      text-align: center;
      padding-bottom: 0px;
      flex: auto;
    }
    .profile-image {
      width: 200px;
      height: 200px;
      border-radius: 30px;
      object-fit: cover;
      margin-left: 20px;
      margin-bottom: 30px;
    }
  }

  @media (max-width: 400px) {
    .profile-image {
      width: 200px;
      height: 200px;
      border-radius: 30px;
      object-fit: cover;
      margin-left: 20px;
      margin-bottom: 30px;
    }
  }

  @media (max-width: 360px) {
    .profile-image {
      width: 150px;
      height: 150px;
      border-radius: 30px;
      object-fit: cover;
      margin-left: 20px;
      margin-bottom: 30px;
    }
    .profile-buttons {
      display: contents;
    }
    .botoncrearcurso {
      margin-left: 0px !important;
    }
  }

  @media (max-width: 450px) {
    .profile-buttons {
      width: auto;
    }
  }
}
</style>
