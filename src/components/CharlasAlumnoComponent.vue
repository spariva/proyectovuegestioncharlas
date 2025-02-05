<template>
  <div class="container mt-5">
    <div
      v-if="cargando"
      class="d-flex justify-content-center align-items-center"
      style="height: 200px"
    >
      <div class="spinner-border text-success" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <div
      v-if="charlas.length == 0"
      class="alert alert-gris text-center"
      role="alert"
    >
      <i class="bi bi-info-circle"></i> No hay charlas disponibles en este
      momento.
    </div>

    <div v-else>
      <div class="chats">
        <div
          v-for="charla in charlas"
          :key="charla.charla.idCharla"
          class="card custom-card"
        >
          <!-- Imagen de la charla -->
          <div class="card-img-container">
            <img
              :src="charla.charla.imagenCharla || defaultImage"
              alt="Imagen charla"
              class="card-img"
              @error="onImageError"
            />
            <!-- Estado de la charla (si lo hay) -->
            <div
              v-if="charla.charla.estadoCharla"
              :class="estadoClass(charla.charla.estadoCharla)"
              class="estado-btn"
            >
              {{ charla.charla.estadoCharla }}
            </div>
          </div>

          <!-- Información de la charla -->
          <div class="card-body custom-card-body">
            <h5 class="card-title">{{ charla.charla.titulo }}</h5>
            <p class="card-text">{{ charla.charla.descripcion }}</p>
          </div>

          <!-- Botón Detalle -->
          <div class="card-footer text-center">
            <button
              @click="mostrarDetalles(charla.charla)"
              class="btn custom-button me-1"
            >
              Ver Detalles
            </button>
            <button
              @click="editarCharla(charla.charla)"
              class="btn custom-button ms-1"
            >
              Editar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para mostrar los detalles de la charla -->
    <div
      v-if="modalVisible" @click.self="cerrarModal"
      class="modal fade show"
      tabindex="-1"
      role="dialog"
      style="display: block; background: rgba(0, 0, 0, 0.8)"
    >
      <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ charlaSeleccionada.titulo }}</h5>
            <button
              type="button"
              class="btn-close"
              aria-label="Close"
              @click="cerrarModal"
            ></button>
          </div>
          <div class="modal-body">
            <p>
              <strong>Fecha Propuesta:</strong>
              {{ charlaSeleccionada.fechaPropuesta }}
            </p>
            <p><strong>Usuario:</strong> {{ charlaSeleccionada.usuario }}</p>
            <p><strong>Curso:</strong> {{ charlaSeleccionada.nombreCurso }}</p>
            <p>
              <strong>Estado:</strong> {{ charlaSeleccionada.estadoCharla }}
            </p>

            <!-- Botones para cambiar entre Descripción, Comentarios y Recursos -->
            <div class="d-flex custom-buttons-container">
              <button
                class="custom-button me-3"
                @click="
                  mostrarDescripcion = !mostrarDescripcion;
                  mostrarComentarios = false;
                  mostrarRecursos = false;
                "
                :class="{ active: mostrarDescripcion }"
              >
                <i class="fa-solid fa-circle-info iconos"></i>
                Descripción
              </button>
              <button
                class="custom-button me-3"
                @click="
                  mostrarDescripcion = false;
                  mostrarComentarios = !mostrarComentarios;
                  mostrarRecursos = false;
                "
                :class="{ active: mostrarComentarios }"
              >
                <i class="fa-solid fa-comments iconos"></i>
                Comentarios
              </button>
              <button
                class="custom-button"
                @click="
                  mostrarDescripcion = false;
                  mostrarComentarios = false;
                  mostrarRecursos = !mostrarRecursos;
                "
                :class="{ active: mostrarRecursos }"
              >
                <i class="fa-solid fa-book iconos"></i>
                Recursos
              </button>
            </div>

            <hr
              v-if="mostrarDescripcion || mostrarComentarios || mostrarRecursos"
            />
            <!-- Sección de Descripción -->
            <div
              v-if="mostrarDescripcion"
              class="custom-background custom-descripcion"
            >
              <p>{{ charlaSeleccionada.descripcion }}</p>
            </div>

            <!-- Sección de Comentarios -->
            <div v-if="mostrarComentarios">
              <div v-if="comentarios.length > 0" class="custom-background">
                <ul class="comment-list">
                  <li
                    v-for="comentario in comentarios"
                    :key="comentario.idComentario"
                    class="comment-item"
                  >
                    <div class="comment-header">
                      <img
                        src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
                        alt="avatar"
                        class="avatar"
                      />
                      <div>
                        <p class="username">{{ comentario.usuario }}</p>
                        <p class="timestamp">{{ comentario.fecha }}</p>
                      </div>
                    </div>
                    <hr />
                    <p class="comment-text">{{ comentario.contenido }}</p>
                  </li>
                </ul>
              </div>
              <div v-else>
                <p class="no-comments">No hay comentarios aún.</p>
              </div>
              <div class="comment-form">
                <textarea
                  v-model="newComment"
                  class="form-control"
                  rows="3"
                  placeholder="Escribe tu comentario aquí..."
                ></textarea>
                <button class="btn custom-button mt-2" @click="addComment">
                  Agregar comentario
                </button>
              </div>
            </div>

            <!-- Sección de Recursos -->
            <div v-if="mostrarRecursos" class="custom-background">
              <div v-if="recursos.length > 0">
                <ul class="recurso-list">
                  <li
                    v-for="recurso in recursos"
                    :key="recurso.idRecurso"
                    class="recurso-item"
                  >
                    <div class="recurso-header">
                      <h6 class="recurso-title">{{ recurso.nombre }}</h6>
                      <a
                        :href="recurso.url"
                        target="_blank"
                        class="recurso-link"
                      >
                        <i class="fa-solid fa-link"></i> Ver Recurso
                      </a>
                      <!-- Botón de editar -->
                      <button
                        @click="editarRecurso(recurso)"
                        class="btn btn-lg"
                        style="font-size: 1.5rem; padding: 0.75rem 1.25rem"
                      >
                        <i class="fa-solid fa-edit"></i>
                      </button>
                    </div>
                    <p class="recurso-description">{{ recurso.descripcion }}</p>
                  </li>
                </ul>
              </div>
              <div v-else>
                <p class="no-recursos">No hay recursos disponibles.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
 
<script>
import PerfilService from "@/services/PerfilService";
import CharlasService from "@/services/CharlasService";
const serviceCharlas = new CharlasService();
import Swal from "sweetalert2";
import moment from "moment";
import "moment/locale/es";

export default {
  name: "CharlasAlumnoComponent",
  data() {
    return {
      charlas: [],
      modalVisible: false,
      charlaSeleccionada: {},
      mostrarDescripcion: false,
      mostrarComentarios: false,
      comentarios: [],
      newComment: "",
      recursos: [],
      mostrarRecursos: false,
      defaultImage: require("../assets/banner_default.jpg"),
      cargando: true,
    };
  },
  methods: {
    cargarRecursos(idCharla) {
      serviceCharlas
        .getRecursosCharlas(idCharla)
        .then((response) => {
          this.recursos = response.recursos || [];
          console.log(response.recursos);
        })
        .catch((error) => {
          console.error("Error al cargar los recursos:", error);
          Swal.fire("Error", "No se pudieron cargar los recursos.", "error");
        });
    },
    editarRecurso(recurso) {
      Swal.fire({
        title: "Editar Recurso",
        html: `
      <div style="display: flex; flex-direction: column; align-items: center; gap: 10px;">
        <input id="swal-nombre" class="swal2-input" placeholder="Nombre" value="${recurso.nombre}" style="width: 90%;">
        <textarea id="swal-descripcion" class="swal2-textarea" placeholder="Descripción" style="width: 90%; height: 120px;">${recurso.descripcion}</textarea>
        <input id="swal-url" class="swal2-input" placeholder="URL" value="${recurso.url}" style="width: 90%;">
      </div>
    `,
        showCancelButton: true,
        confirmButtonText: "Guardar",
        cancelButtonText: "Cancelar",
        preConfirm: () => {
          return {
            idRecurso: recurso.idRecurso, // Se mantiene el idRecurso
            idCharla: recurso.idCharla, // Se mantiene el idCharla
            nombre: document.getElementById("swal-nombre").value, // Nombre
            descripcion: document.getElementById("swal-descripcion").value, // Descripción
            url: document.getElementById("swal-url").value, // URL
          };
        },
      }).then((result) => {
        if (result.isConfirmed) {
          serviceCharlas
            .editarRecurso(result.value) // Pasa el objeto con la nueva estructura
            .then(() => {
              Swal.fire(
                "Éxito",
                "Recurso actualizado correctamente",
                "success"
              );
              this.cargarRecursos(this.charlaSeleccionada.idCharla); // Recargar los recursos
            })
            .catch(() => {
              Swal.fire("Error", "No se pudo actualizar el recurso", "error");
            });
        }
      });
    },

    // Formatea la fecha en formato local
    formatDate(date) {
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      };
      return new Date(date).toLocaleDateString("es-ES", options);
    },

    // Carga las charlas del usuario
    async cargarCharlas() {
      this.cargando = true;
      const perfilService = new PerfilService();
      try {
        const data = await perfilService.getCharlasUsuario();
        this.charlas = data;
        this.cargando = false;
      } catch (error) {
        console.error("Error al cargar las charlas:", error);
        alert("No se pudo cargar las charlas.");
      }
    },

    // Retorna la clase según el estado de la charla
    estadoClass(estado) {
      switch (estado) {
        case "PROPUESTA":
          return "btn btn-secondary"; // Gris para Propuesta
        case "ACEPTADA":
          return "btn btn-success"; // Verde para Aceptada
        case "RECHAZADA":
          return "btn btn-danger"; // Rojo para Rechazada
        default:
          return "btn btn-info"; // Azul para otros estados
      }
    },

    editarCharla(charla) {
      Swal.fire({
        title: "Editar Charla",
        html: `
      <div style="display: flex; flex-direction: column; align-items: center; gap: 10px;">
        <input id="swal-titulo" class="swal2-input" placeholder="Título" value="${charla.titulo}" style="width: 90%;">
        <textarea id="swaldescripcion" class="swal2-textarea" placeholder="Descripción" style="width: 90%; height: 120px;">${charla.descripcion}</textarea>
        <input id="swal-tiempo" type="number" class="swal2-input" placeholder="Tiempo (minutos)" value="${charla.tiempo}" style="width: 90%;">
        <input id="swal-fecha" type="datetime-local" class="swal2-input" value="${charla.fechaPropuesta}" style="width: 90%;">
        <input id="swal-imagen" class="swal2-input" placeholder="URL Imagen" value="${charla.imagenCharla}" style="width: 90%;">
      </div>
    `,
        showCancelButton: true,
        confirmButtonText: "Guardar",
        cancelButtonText: "Cancelar",
        preConfirm: () => {
          return {
            idCharla: charla.idCharla,
            titulo: document.getElementById("swal-titulo").value,
            descripcion: document.getElementById("swaldescripcion").value,
            tiempo: parseInt(document.getElementById("swal-tiempo").value),
            fechaPropuesta: document.getElementById("swal-fecha").value,
            idUsuario: charla.idUsuario,
            idEstadoCharla: charla.idEstadoCharla,
            idRonda: charla.idRonda,
            imagenCharla: document.getElementById("swal-imagen").value,
          };
        },
      }).then((result) => {
        if (result.isConfirmed) {
          serviceCharlas
            .editarCharla(result.value)
            .then(() => {
              Swal.fire("Éxito", "Charla actualizada correctamente", "success");
              this.cargarCharlas();
            })
            .catch(() => {
              Swal.fire("Error", "No se pudo actualizar la charla", "error");
            });
        }
      });
    },

    // Carga los comentarios de una charla
    cargarComentarios(idCharla) {
      serviceCharlas
        .getCharlasComentarios(idCharla)
        .then((response) => {
          // Formatear las fechas de los comentarios al cargar
          this.comentarios = response.comentarios.map((comentario) => {
            comentario.fecha = moment(comentario.fecha)
              .locale("es")
              .format("DD/MM/YYYY HH:mm");
            return comentario;
          });
        })
        .catch((error) => {
          console.error("Error al cargar los comentarios:", error);
          Swal.fire("Error", "No se pudieron cargar los comentarios.", "error");
        });
    },

    // Agrega un nuevo comentario
    addComment() {
      if (!this.newComment.trim()) {
        return;
      }

      const fechaActual = moment().locale("es").format("DD/MM/YYYY HH:mm");
      const comentario = {
        idCharla: this.charlaSeleccionada.idCharla,
        idUsuario: 13,
        contenido: this.newComment,
        fecha: fechaActual,
      };

      serviceCharlas
        .setComentario(comentario)
        .then(() => {
          Swal.fire({
            icon: "success",
            title: "Comentario agregado exitosamente!",
          });

          this.newComment = "";
          this.cargarComentarios(this.charlaSeleccionada.idCharla); // Recargar comentarios
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Error al agregar comentario",
            text: "No se pudo agregar el comentario. Revisa los datos enviados.",
          });
          console.error("Error al agregar el comentario:", error);
        });
    },

    // Muestra los detalles de la charla en el modal
    mostrarDetalles(charla) {
      this.charlaSeleccionada = charla;
      this.modalVisible = true;
      this.cargarComentarios(charla.idCharla);
      this.cargarRecursos(charla.idCharla);
    },
    // Cierra el modal
    cerrarModal() {
      this.modalVisible = false;
    },

    // Vuelve a la página anterior
    volverPaginaAnterior() {
      this.$router.go(-1);
    },

    // Maneja el error al cargar una imagen
    onImageError(event) {
      event.target.src = require("../assets/banner_default.jpg");
    },
  },

  created() {
    this.cargarCharlas();
  },
};
</script>
 
<style scoped>
/* Estilos para la tarjeta */
.alert-gris {
  background-color: #33333355;
  font-family: "Poppins", sans-serif;
}
.container {
  padding: 30px;
}

.chats:has(.card:nth-of-type(3)) {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 20px;
  margin-top: -30px;
}
.chats:has(.card:nth-of-type(2)) {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: -30px;
}

.custom-card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s, box-shadow 0.3s;
  margin-bottom: 20px;
  margin-top: 10px;
  max-width: 350px;
  width: 100%;
  height: 450px; /* Altura fija */
  border-radius: 12px;
  overflow: hidden;
  background-color: #fff;
}

.custom-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
}

/* Estilos para la imagen */
.card-img-container {
  position: relative;
}

.card-img {
  width: 100%;
  height: 200px; /* Altura de la imagen fija */
  object-fit: cover;
  border-bottom: 4px solid #f1f1f1; /* Separación de la imagen */
}

.estado-btn {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 5px;
  color: white;
  font-weight: bold;
  border-radius: 5px;
  z-index: 10;
  pointer-events: none;
}

/* Información de la tarjeta */
.custom-card-body {
  padding: 20px;
  height: calc(100% - 220px); /* Ajuste del espacio de la tarjeta */
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.card-text {
  font-size: 14px;
  color: #6c757d;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap; /* Evita que el texto se rompa en varias líneas */
  height: 50px; /* Limitamos la altura de la descripción */
}

/* Estilos para el botón detalle */
.card-footer {
  padding: 15px;
  background-color: #f8f9fa;
  border-top: 1px solid #ddd;
}

.custom-button {
  border-radius: 20px; /* Bordes redondeados */
  color: #3d3d3d; /* Color del texto */
  font-size: 15px; /* Tamaño del texto */
  font-family: "Montserrat", serif; /* Fuente consistente */
  font-weight: 600; /* Peso del texto */
  text-decoration: none; /* Sin subrayado */
  padding: 10px 20px; /* Espaciado interno */
  background-color: #f8f9fa; /* Fondo similar a btn-light */
  transition: background-color 0.3s ease, transform 0.2s ease; /* Animaciones */
  border: 1px solid #527c58; /* Bordes que combinan con el tema */
}

.custom-button:hover {
  background-color: #527a5899;
  border-radius: 20px;
  color: #3d3d3d; /* Texto blanco en hover */
  font-family: "Montserrat", serif; /* Fuente consistente */
  font-weight: bold;
  transition: all 0.3s ease-in-out;
}

.custom-button.active {
  background-color: #527c58; /* Fondo en active */
  color: #fff; /* Texto blanco en active */
}

/* Modal */
.modal-content {
  border-radius: 10px;
}
.modal-title {
  font-family: "Montserrat", serif;
  font-weight: 600;
}

.modal-header {
  background-color: #7ca982;
  border-bottom: 1px solid #ddd;
}

.modal-body {
  background-color: #fff;
}

/* Estilos Responsivos */
@media (max-width: 768px) {
  .custom-card {
    width: 100%;
    max-width: 280px;
    height: 460px; /* Aseguramos un tamaño fijo para dispositivos pequeños */
  }

  .card-title {
    font-size: 16px;
  }

  .card-text {
    font-size: 13px;
  }

  .custom-button {
    font-size: 12px;
  }
}
/* Estilo para la sección de comentarios */
.custom-background {
  background-color: #f8f9fa; /* Fondo suave, similar a las tarjetas */
  padding: 50px;
  border-radius: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Sombra sutil para destacar */
  margin-top: 10px;
}

.custom-descripcion {
  font-size: 16px;
  color: #333;
  line-height: 1.6;
}
.comment-list {
  max-height: 400px; /* Altura aumentada para mostrar más comentarios */
  overflow-y: auto; /* Activar scroll vertical */
  padding-right: 10px; /* Espacio a la derecha para evitar que el scroll se superponga */
  background-color: #d1e7d7; /* Fondo verde claro */
  border-radius: 10px; /* Bordes redondeados */
}

/* Estilo de cada comentario */
.comment-item {
  background-color: #ffffff; /* Fondo blanco para los comentarios */
  padding: 15px;
  margin-bottom: 15px;
  margin-top: 15px;
  list-style-type: none;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Sombra más sutil */
  transition: transform 0.3s ease-in-out;
  color: #333; /* Color del texto más oscuro para asegurar buena visibilidad */
}

.comment-item:hover {
  background-color: #f1f1f1; /* Fondo más claro al pasar el mouse */
}

.no-comments {
  font-size: 16px;
  color: #888;
  text-align: center;
  margin-top: 10px;
}

.comment-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 15px;
  border: 2px solid #888; /* Espacio entre la imagen y el texto */
}

.username {
  font-weight: bold;
  font-size: 14px;
  color: #333; /* Color más oscuro para el nombre */
}

.timestamp {
  font-size: 12px;
  color: #888;
  margin-top: 5px;
}

.comment-text {
  font-size: 14px;
  color: #555;
  margin-top: 10px;
}

.no-comments {
  font-size: 16px;
  color: #888;
  text-align: center;
  margin-top: 10px;
}

/* Estilo para el formulario de agregar comentario */
.comment-form {
  margin-top: 20px;
}

.comment-form textarea {
  width: 100%;
  resize: none;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 14px;
  color: #333;
  background-color: #f1f1f1;
  margin-bottom: 10px;
}

.comment-form button {
  width: 100%;
  padding: 12px;
  background-color: #527c58; /* Fondo del botón acorde con los otros botones */
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.comment-form button:hover {
  background-color: #406b45; /* Fondo más oscuro al hacer hover */
}

@media (max-width: 576px) {
  .custom-card {
    width: 100%;
    height: 460px; /* Aseguramos un tamaño fijo para dispositivos pequeños */
  }

  .card-title {
    font-size: 15px;
  }

  .card-text {
    font-size: 12px;
  }

  .custom-button {
    font-size: 11px;
  }
}
/* Estilo para la sección de recursos */

.recurso-list {
  list-style-type: none;
  padding: 0;
}

.recurso-item {
  background-color: #d1e7d7;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
}

.recurso-item:hover {
  transform: translateY(-8px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.recurso-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.recurso-title {
  font-size: 18px;
  font-weight: bold;
  color: #527c58;
  margin: 0;
}

.recurso-link {
  font-size: 14px;
  color: #527c58;
  text-decoration: none;
  display: flex;
  align-items: center;
}

.recurso-link:hover {
  text-decoration: underline;
  color: #406b45;
}

.recurso-link i {
  margin-right: 5px;
}

.recurso-description {
  font-size: 14px;
  color: #555;
  margin-top: 10px;
}

.no-recursos {
  font-size: 16px;
  color: #888;
  text-align: center;
  margin-top: 10px;
}
</style>