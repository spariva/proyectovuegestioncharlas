<template>
  <div class="container my-3 my-md-5" v-if="usuario">
    <div class="profile-card">
      <div
        class="profile-header"
        style="background-color: #a0a0a0; height: 200px"
      >
        <div class="profile-info text-center"></div>
      </div>

      <div class="profile-content row align-items-center position-relative">
        <div class="col-12 col-md-3 d-flex justify-content-center mb-3 mb-md-0">
          <img
            :src="usuario.imagen"
            alt="Foto de perfil"
            class="profile-image"
            @click="triggerFileInput"
          />
          <i class="fa fa-pencil edit-icon ms-2" @click="triggerFileInput"></i>
          <input
            type="file"
            ref="fileInput"
            accept="image/*"
            style="display: none"
            @change="handleFileChange"
          />
          <button class="button-detalle" @click="mostrarDetalles">
            Detalles
          </button>
        </div>

        <div class="col-12 col-md-9 mt-3 pt-3">
          <h1 class="name text-center text-md-start">
            {{ usuario.nombre }} {{ usuario.apellidos }}
          </h1>
          <p class="bio text-center text-md-start">
            {{ usuario.idRole === 2 ? "Alumno" : "Profesor" }}
          </p>
          <div
            class="profile-buttons mt-3 d-flex justify-content-end flex-column flex-md-row"
          >
            <!-- <button class="btn btn-password me-2" @click="mostrarMisComentarios">Mis Comentarios</button> -->
            <button
              class="btn btn-password me-2"
              @click="mostrarFormularioContrasena"
            >
              Editar Contraseña
            </button>
            <button
              class="btn btn-activo"
              :class="{ 'btn-activo': usuario.estadoUsuario === 'Activo' }"
              :disabled="usuario.estadoUsuario === 'Activo'"
              style="pointer-events: none"
            >
              {{ usuario.estadoUsuario === true ? "Activo" : "Inactivo" }}
            </button>
          </div>
        </div>
      </div>
      <hr />
      <CharlasAlumnoComponent :usuario="usuario" />
    </div>
  </div>

  <!-- Modal para mostrar los comentarios -->
  <!-- Modal para mostrar los comentarios -->
  <div
    v-if="modalVisible"
    class="modal fade show"
    tabindex="-1"
    role="dialog"
    style="display: block; background: rgba(0, 0, 0, 0.8)"
  >
    <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
      <div class="modal-content">
        <!-- Encabezado del modal con fondo verde clarito -->
        <div
          class="modal-header"
          style="background-color: #a8e6a1; color: #333"
        >
          <h5 class="modal-title">Mis Comentarios</h5>
          <button
            type="button"
            class="btn-close"
            aria-label="Close"
            @click="cerrarModal"
          >
            X
          </button>
        </div>
        <div v-if="comentarios.length > 0" class="modal-body">
          <div class="comments-container">
            <div
              v-for="comentario in comentarios"
              :key="comentario.idComentario"
              class="comment-container mb-3"
            >
              <div class="comment-header">
                <span class="comment-user">{{ comentario.usuarioNombre }}</span>
                <span class="comment-date">{{
                  new Date(comentario.fecha).toLocaleString()
                }}</span>
              </div>
              <div class="comment-content">
                {{ comentario.contenido }}
              </div>
              <div class="comment-actions mt-2">
                <button
                  class="btn btn-trash"
                  @click="eliminarComentario(comentario.idComentario)"
                >
                  <i class="fa fa-trash"></i>
                </button>
              </div>
              <hr />
            </div>
          </div>
        </div>
        <div v-else>
          <p>No tienes comentarios registrados.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import PerfilService from "@/services/PerfilService";
import CharlasService from "@/services/CharlasService";
const charlasService = new CharlasService();
import CharlasAlumnoComponent from "@/components/CharlasAlumnoComponent";

export default {
  name: "PerfilAlumnoComponent",
  components: {
    CharlasAlumnoComponent,
  },
  data() {
    return {
      usuario: null,
      perfilService: new PerfilService(),
      comentarios: [],
      modalVisible: false,
    };
  },
  methods: {
    async cargarPerfil() {
      try {
        const data = await this.perfilService.getUsuarioPerfil();
        this.usuario = data.usuario;
      } catch (error) {
        console.error("Error al cargar el perfil:", error);
        Swal.fire(
          "Error",
          "No se pudo cargar la información del perfil.",
          "error"
        );
      }
    },
    mostrarDetalles() {
      Swal.fire({
        title: "Detalles del Usuario",
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

    mostrarMisComentarios() {
      this.cargarComentarios();
      this.modalVisible = true;
    },

    // Método para cerrar el modal
    cerrarModal() {
      this.modalVisible = false;
    },

    cargarComentarios() {
      charlasService
        .getComentarioUsuario()
        .then((response) => {
          this.comentarios = response;
        })
        .catch((error) => {
          console.error("Error al cargar los comentarios:", error);
          Swal.fire("Error", "No se pudieron cargar los comentarios.", "error");
        });
    },

    eliminarComentario(idComentario) {
      // Confirmación antes de eliminar el comentario
      Swal.fire({
        title: "¿Estás seguro?",
        text: "¡No podrás recuperar este comentario!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminarlo",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          // Lógica para eliminar un comentario
          console.log("Comentario a eliminar:", idComentario);
          charlasService
            .deleteComentario(idComentario) // Suponiendo que este método hace la eliminación
            .then((response) => {
              if (response && response.status === 200) {
                // Si la eliminación fue exitosa, recargar los comentarios
                Swal.fire(
                  "¡Eliminado!",
                  "El comentario ha sido eliminado.",
                  "success"
                );
                this.cargarComentarios(); // Recargar los comentarios después de eliminar
              } else {
                throw new Error("Error al eliminar el comentario.");
              }
            })
            .catch((error) => {
              console.error("Error al eliminar el comentario:", error);
              Swal.fire("Error", "No se pudo eliminar el comentario.", "error");
            });
        }
      });
    },

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

    mostrarEstadoActivo() {
      if (this.usuario.estadoUsuario === "Activo") {
        return;
      }
    },
  },

  created() {
    this.cargarPerfil();
  },
};
</script>

<style scoped>
.profile-card {
  background-color: #e0e0e0;
  border-radius: 10px;
  padding: 20px;
}

.profile-header {
  background-color: #7782c6 !important;
  height: 200px;
  border-radius: 10px 10px 0 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.profile-info {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.profile-image {
  width: 250px;
  height: 250px;
  border-radius: 20px;
  border: 8px solid #e0e0e0;
  object-fit: cover;
  border: 4px solid #314b78;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: -200px;
  margin-right: -120px; /* Añadimos este margen */
}

.image-container {
  position: relative;
  display: inline-block;
}

.edit-icon {
  height: 10%;
  position: relative;
  top: -200px;
  right: -120px;
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

@media (max-width: 768px) {
  .edit-icon {
    height: 10%;
    position: relative;
    top: -100px;
    right: -5px;
    font-size: 20px;
    color: white;
    background-color: #314b78;
    padding: 8px;
    border-radius: 50%;
    cursor: pointer;
    z-index: 10;
  }
}

@media (max-width: 768px) {
  .profile-image {
    width: 200px;
    height: 200px;
    border-radius: 20px;
    border: 8px solid #e0e0e0;
    object-fit: cover;
    margin-top: -100px;
    margin-right: -5px; /* Añadimos este margen */
  }

  .col-12.col-md-4 {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.name {
  font-size: 24px;
  font-weight: bold;
  color: #474747;
  text-align: center;
  margin: 70px 70px 40px 70px;
  margin-top: -10px;
}

.bio {
  font-size: 14px;
  color: #474747;
  font-weight: bold;
  margin: 30px 0;
  text-align: center;
  margin: 70px;
  margin-top: -30px;
}

.profile-buttons {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
}

.profile-buttons button {
  width: auto;
  margin: 5px;
  padding: 10px 15px;
}

@media (max-width: 768px) {
  .profile-buttons {
    flex-direction: row;
    justify-content: flex-end;
  }
}
.swal-popup-bootstrap {
  border-radius: 0px !important;
  width: 100% !important;
  max-width: 500px;
  padding: 20px;
  box-sizing: border-box;
}

.swal-title-bootstrap {
  font-size: 22px;
  font-weight: bold;
  color: #333;
  text-align: center;
}

.swal-input-bootstrap {
  width: 100%;
  border-radius: 0px;
  padding: 10px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
}

.swal-confirm-btn,
.swal-cancel-btn {
  width: 48%;
  font-size: 16px;
  padding: 12px 0;
  border-radius: 0px;
}

.swal-confirm-btn {
  background-color: #4caf50;
  color: white;
  border: none;
}

.swal-cancel-btn {
  background-color: #f44336;
  color: white;
  border: none;
}

@media (max-width: 600px) {
  .swal-popup-bootstrap {
    width: 90%;
  }

  .swal-title-bootstrap {
    font-size: 18px;
  }

  .swal-input-bootstrap {
    font-size: 16px;
  }
}

.button-detalle {
  position: absolute;
  top: -180px;
  right: 40px;
  background-color: #314b78 !important;
  color: white;
  padding: 10px 15px;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-size: 1.2em;
}

.button-detalle:hover {
  border-color: #41619a !important;
  background-color: #41619a !important;
  color: white;
}

.button-detalle:active {
  border-color: #41619a !important;
  background-color: #41619a !important;
  color: white;
}

@media (max-width: 768px) {
  .button-detalle {
    position: absolute;
    top: -170px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 1em;
    right: auto;
  }
}
button {
  background: #314b78;
  color: #fff;
  border: none;
  position: relative;
  height: 50px;
  font-size: 1.2em;
  padding: 0 2em;
  cursor: pointer;
  outline: none;
}

button:hover {
  background: #fff;
  color: #41619a;
}

button:active {
  background: #fff;
  color: #41619a;
}

button:after {
  right: inherit;
  top: inherit;
  left: 0;
  bottom: 0;
}

button:hover:before,
button:hover:after {
  width: 100%;
  transition: 800ms ease all;
}

.btn-activo {
  background-color: #40685c !important;
  color: #fff;
  border: none;
  position: relative;
  height: 50px;
  font-size: 1.2em;
  padding: 0 2em;
  cursor: pointer;
}

.btn-activo:active {
  border-color: #578e73 !important;
  background-color: #578e73 !important;
  color: white;
}

.btn-activo:hover {
  border-color: #578e73 !important;
  background-color: #578e73 !important;
  color: white;
}

@media (max-width: 768px) {
  button {
    height: 45px;
    font-size: 1em;
  }
}

.modal-header {
  background-color: #a8e6a1;
  color: #333;
  font-weight: bold;
  border-bottom: 2px solid #ccc;
}

.modal-title {
  font-size: 1.5rem;
}

.comments-container {
  max-height: 350px;
  overflow-y: scroll;
  padding-right: 10px;
}

.comment-container {
  background-color: #fff;
  border-radius: 10px;
  padding: 15px;
  border: 1px solid #ddd;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
}

.comment-container:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.comment-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 10px;
}

.comment-user {
  font-weight: bold;
}

.comment-date {
  font-style: italic;
  color: #888;
}

.comment-content {
  font-size: 1rem;
  color: #333;
  margin-bottom: 10px;
}

.btn-trash {
  background-color: transparent;
  border: none;
  color: #504c4d;
  font-size: 20px;
  cursor: pointer;
  padding: 5px;
  transition: all 0.3s ease;
}

.btn-trash i {
  margin-right: 5px;
}

.btn-trash:hover {
  color: #201f1f;
}

.comment-actions {
  display: flex;
  justify-content: flex-end;
}
</style>
