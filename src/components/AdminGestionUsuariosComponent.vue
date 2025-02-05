<template>
  <div class="container my-4 p-4">
    <h2 class="mb-4 text-center" style="font-size: 42px; font-weight: 400px">
      Gestión de Usuarios
    </h2>
    <hr
      class="linea-separadora"
      style="width: 160px; margin: 10px auto 20px auto"
    />
    <div class="row g-3">
      <!-- Filtro por Rol -->
      <div class="col-md-3 col-12">
        <label for="filtroRol" class="form-label subtitulo"
          >Filtrar por Rol</label
        >
        <select
          id="filtroRol"
          class="form-select"
          v-model="rolSeleccionado"
          @change="filtrarUsuarios"
        >
          <option value="">Todos</option>
          <option v-for="role in roles" :key="role.idRole" :value="role.idRole">
            {{ role.roleName }}
          </option>
        </select>
      </div>

      <!-- Filtro por Curso -->
      <div class="col-md-3 col-12">
        <label for="filtroCurso" class="form-label subtitulo"
          >Filtrar por Curso</label
        >
        <select
          id="filtroCurso"
          class="form-select"
          v-model="cursoSeleccionado"
          @change="filtrarUsuarios"
        >
          <option value="">Todos</option>
          <option
            v-for="curso in cursos"
            :key="curso.idCurso"
            :value="curso.idCurso"
          >
            {{ curso.nombre }}
          </option>
        </select>
      </div>

      <!-- Filtro por Estado -->
      <div class="col-md-3 col-12">
        <label for="filtroEstado" class="form-label subtitulo"
          >Filtrar por Estado</label
        >
        <select
          id="filtroEstado"
          class="form-select"
          v-model="estadoSeleccionado"
          @change="filtrarUsuarios"
        >
          <option value="">Todos</option>
          <option value="true">Activo</option>
          <option value="false">Inactivo</option>
        </select>
      </div>

      <!-- Campo de Búsqueda -->
      <div class="col-md-3 col-12">
        <label for="buscadorNombre" class="form-label subtitulo">Buscar</label>
        <input
          type="text"
          id="buscadorNombre"
          class="form-control"
          v-model="busqueda"
          @input="filtrarUsuarios"
          placeholder="Introduce el nombre o apellidos"
        />
      </div>
    </div>

    <hr class="linea-separadora" />
    <!-- Mensaje cuando no hay usuarios filtrados -->
    <div v-if="noUsuariosMensaje" class="alert alert-warning text-center">
      {{ noUsuariosMensaje }}
    </div>

    <!-- Tarjetas de Usuarios -->
    <div class="row row-cols-xl-3 row-cols-lg-2 row-cols-1 d-flex">
      <div
        class="col"
        v-for="usuario in usuariosFiltrados"
        :key="usuario.idUsuario"
      >
        <div class="card-usuario">
          <div class="card-encabezado" style="background-color: #7782c6">
            <i
              class="fas fa-info-circle info-icon"
              @click="mostrarInformacionUsuario(usuario)"
            ></i>
          </div>
          <div class="card-cuerpo">
            <div class="profile-info">
              <img :src="usuario.imagen" />
              <div class="user-details">
                <div class="titulo" style="font-weight: 600">
                  {{ usuario.nombre }} {{ usuario.apellidos }}
                </div>
                <div class="user-curso subtitulo" style="font-size: 13px">
                  {{ usuario.cursoNombre }}
                </div>
              </div>
            </div>
            <div class="btn-group">
              <button @click="cambiarCurso(usuario)">Cambiar Curso</button>
              <button @click="cambiarRol(usuario)">Cambiar Rol</button>
              <button @click="cambiarEstado(usuario)">Cambiar Estado</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AdminService from "@/services/AdminService";
import Swal from "sweetalert2";

export default {
  name: "AdminGestionUsuariosComponent",
  data() {
    return {
      usuariosActivos: [],
      usuariosFiltrados: [],
      roles: [],
      cursos: [],
      cursosUsuarios: [],
      rolSeleccionado: "",
      cursoSeleccionado: "",
      estadoSeleccionado: "",
      busqueda: "",
      modalAbierto: false,
      tipoCambio: "",
      datosCambio: {
        usuarioId: null,
        curso: "",
        rol: null,
        estado: null,
      },
      adminService: new AdminService(),
      noUsuariosMensaje: "",
    };
  },
  methods: {
    async cambiarCurso(usuario) {
      const { value: nuevoCurso } = await Swal.fire({
        title: "Seleccione un nuevo curso",
        html: `
      <div style="text-align: left; margin-top: 10px;">
        ${this.cursos
          .map(
            (curso) => `
          <div style="margin-bottom: 10px;">
            <input 
              type="radio" 
              id="curso-${curso.idCurso}" 
              name="curso" 
              value="${curso.idCurso}" 
              ${curso.idCurso === usuario.idCurso ? "checked" : ""}>
            <label for="curso-${curso.idCurso}">${curso.nombre}</label>
          </div>
        `
          )
          .join("")}
      </div>
    `,
        preConfirm: () => {
          const selected = Swal.getPopup().querySelector(
            'input[name="curso"]:checked'
          );
          return selected ? selected.value : null;
        },
        showCancelButton: true,
        confirmButtonText: "Guardar",
        cancelButtonText: "Cancelar",
        customClass: {
          cancelButton: "btn-red", // Aplica una clase personalizada al botón cancelar
        },
        focusConfirm: false,
        allowOutsideClick: false, // Evita que se cierre al hacer clic fuera
      });

      if (nuevoCurso) {
        // Mantén el SweetAlert visible y muestra el indicador de carga
        Swal.fire({
          title: "Guardando...",
          text: "Por favor, espere mientras se actualiza el curso.",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        try {
          // Realiza la actualización en la API
          await this.adminService.updateCursoUsuario(
            usuario.idUsuario,
            nuevoCurso
          );

          // Recarga los datos
          await this.cargarDatos();

          // Muestra un mensaje de éxito y cierra el SweetAlert
          Swal.fire("¡Éxito!", "El curso ha sido actualizado.", "success");
        } catch (error) {
          // Muestra un mensaje de error sin cerrar el SweetAlert principal
          Swal.fire({
            title: "¡Error!",
            text: "No se pudo actualizar el curso. Por favor, inténtelo de nuevo.",
            icon: "error",
            confirmButtonText: "Cerrar",
          });
        }

        this.resetFiltros();
      }
    },
    async cambiarRol(usuario) {
      const { value: nuevoRol } = await Swal.fire({
        title: "Seleccione un nuevo rol",
        html: `
        <div style="text-align: left; margin-top: 10px;">
          ${this.roles
            .map(
              (role) => `
            <div style="margin-bottom: 10px;">
              <input 
                type="radio" 
                id="rol-${role.idRole}" 
                name="rol" 
                value="${role.idRole}" 
                ${role.idRole === usuario.idRole ? "checked" : ""}>
              <label for="rol-${role.idRole}">${role.roleName}</label>
            </div>
          `
            )
            .join("")}
        </div>
      `,
        preConfirm: () => {
          const selected = Swal.getPopup().querySelector(
            'input[name="rol"]:checked'
          );
          return selected ? selected.value : null;
        },
        showCancelButton: true,
        confirmButtonText: "Guardar",
        cancelButtonText: "Cancelar",
        customClass: {
          cancelButton: "btn-red", // Aplica una clase personalizada al botón cancelar
        },
        focusConfirm: false,
        allowOutsideClick: false, // Evita que se cierre al hacer clic fuera
      });

      if (nuevoRol) {
        // Mantén el SweetAlert visible y muestra el indicador de carga
        Swal.fire({
          title: "Guardando...",
          text: "Por favor, espere mientras se actualiza el rol.",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        try {
          // Realiza la actualización en la API
          await this.adminService.updateRolUsuario(usuario.idUsuario, nuevoRol);

          // Recarga los datos
          await this.cargarDatos();

          // Muestra un mensaje de éxito y cierra el SweetAlert
          Swal.fire("¡Éxito!", "El rol ha sido actualizado.", "success");
        } catch (error) {
          // Muestra un mensaje de error sin cerrar el SweetAlert principal
          Swal.fire({
            title: "¡Error!",
            text: "No se pudo actualizar el rol. Por favor, inténtelo de nuevo.",
            icon: "error",
            confirmButtonText: "Cerrar",
          });
        }

        this.resetFiltros();
      }
    },
    async cambiarEstado(usuario) {
      const { value: nuevoEstado, isConfirmed } = await Swal.fire({
        title: "Cambiar Estado",
        text: `Selecciona el nuevo estado de usuario`,
        icon: "warning",
        html: `
      <div style="text-align: left; margin-top: 10px;">
        <div>
          <input 
            type="radio" 
            id="activo" 
            name="estado" 
            value="true" 
            ${usuario.estadoUsuario ? "checked" : ""}>
          <label for="activo">Activo</label>
        </div>
        <div>
          <input 
            type="radio" 
            id="inactivo" 
            name="estado" 
            value="false" 
            ${!usuario.estadoUsuario ? "checked" : ""}>
          <label for="inactivo">Inactivo</label>
        </div>
      </div>
    `,
        preConfirm: () => {
          const selected = Swal.getPopup().querySelector(
            'input[name="estado"]:checked'
          );
          return selected ? selected.value : null;
        },
        showCancelButton: true,
        confirmButtonText: "Guardar",
        cancelButtonText: "Cancelar",
        customClass: {
          cancelButton: "btn-red",
        },
        focusConfirm: false,
        allowOutsideClick: false,
      });

      // Solo continuar si el usuario presiona "Guardar" (isConfirmed es true)
      if (isConfirmed && nuevoEstado !== null) {
        // Mostrar mensaje de carga mientras se actualiza el estado
        Swal.fire({
          title: "Guardando...",
          text: "Por favor, espere mientras se actualiza el estado.",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        try {
          // Actualizar el estado del usuario
          await this.adminService.updateEstadoUsuario(
            usuario.idUsuario,
            nuevoEstado === "true"
          );
          await this.cargarDatos();
          Swal.fire(
            "¡Éxito!",
            `El estado ha sido actualizado a ${
              nuevoEstado === "true" ? "activo" : "inactivo"
            }.`,
            "success"
          );
        } catch (error) {
          Swal.fire({
            title: "¡Error!",
            text: "No se pudo actualizar el estado. Por favor, inténtelo de nuevo.",
            icon: "error",
            confirmButtonText: "Cerrar",
          });
        }

        this.resetFiltros();
      }
    },

    resetFiltros() {
      this.rolSeleccionado = "";
      this.cursoSeleccionado = "";
      this.estadoSeleccionado = "";
    },
    mostrarInformacionUsuario(usuario) {
      Swal.fire({
        title: "Información del Usuario",
        html: `
      <div style="text-align: left;">
        <strong>Nombre:</strong> ${usuario.nombre} ${usuario.apellidos}<br>
        <strong>Curso:</strong> ${usuario.cursoNombre}<br>
        <strong>Rol:</strong> ${usuario.rolNombre}<br>
        <strong>Estado:</strong> ${
          usuario.estadoUsuario ? "Activo" : "Inactivo"
        }
      </div>
    `,
        icon: "info",
        confirmButtonText: "OK",
      });
    },
    async cargarDatos() {
      try {
        const [usuarios, cursos, cursosUsuarios] = await Promise.all([
          this.adminService.getUsuarios(),
          this.adminService.getCursos(),
          this.adminService.getCursosUsuarios(),
          this.adminService.getRoles(),
        ]);

        this.cursosUsuarios = cursosUsuarios;

        const usuariosConCursos = usuarios.map((usuario) => {
          const relacion = cursosUsuarios.find(
            (cu) => cu.idUsuario === usuario.idUsuario
          );
          const curso = relacion
            ? cursos.find((c) => c.idCurso === relacion.idCurso)
            : null;

          const rol = this.roles.find((r) => r.idRole === usuario.idRole);

          return {
            ...usuario,
            cursoNombre: curso ? curso.nombre : "Sin curso",
            idCurso: curso ? curso.idCurso : null,
            rolNombre: rol ? rol.roleName : "Sin rol",
          };
        });

        this.usuariosActivos = usuariosConCursos;
        this.usuariosFiltrados = usuariosConCursos;
        this.cursos = cursos;
        console.log(
          "Datos de usuarios activos cargados:",
          this.usuariosActivos
        );
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    },
    async cargarRoles() {
      try {
        this.roles = await this.adminService.getRoles();
        console.log("Roles cargados:", this.roles);
      } catch (error) {
        console.error("Error al cargar roles:", error);
      }
    },

    filtrarUsuarios() {
      let usuariosFiltrados = this.usuariosActivos;

      if (this.rolSeleccionado !== undefined && this.rolSeleccionado !== "") {
        usuariosFiltrados = usuariosFiltrados.filter(
          (usuario) => usuario.idRole === this.rolSeleccionado
        );
      }

      if (
        this.cursoSeleccionado !== undefined &&
        this.cursoSeleccionado !== ""
      ) {
        usuariosFiltrados = usuariosFiltrados.filter(
          (usuario) => usuario.idCurso === this.cursoSeleccionado
        );
      }

      if (this.estadoSeleccionado !== "") {
        usuariosFiltrados = usuariosFiltrados.filter(
          (usuario) =>
            usuario.estadoUsuario === (this.estadoSeleccionado === "true")
        );
      }

      // Filtro por búsqueda en nombre y apellidos
      if (this.busqueda.trim() !== "") {
        const busquedaLower = this.busqueda.toLowerCase();
        usuariosFiltrados = usuariosFiltrados.filter(
          (usuario) =>
            usuario.nombre.toLowerCase().includes(busquedaLower) ||
            usuario.apellidos.toLowerCase().includes(busquedaLower)
        );
      }

      this.usuariosFiltrados = usuariosFiltrados;

      if (this.usuariosFiltrados.length === 0) {
        this.noUsuariosMensaje =
          "No se encontraron usuarios con los filtros seleccionados.";
      } else {
        this.noUsuariosMensaje = "";
      }
    },

    async guardarCambio() {
      try {
        if (this.tipoCambio === "curso") {
          await this.adminService.updateCursoUsuario(
            this.datosCambio.usuarioId,
            this.datosCambio.curso
          );
          await this.cargarDatos();
        } else if (this.tipoCambio === "rol") {
          await this.adminService.updateRolUsuario(
            this.datosCambio.usuarioId,
            this.datosCambio.rol
          );
          await this.cargarDatos();
        } else if (this.tipoCambio === "estado") {
          await this.adminService.updateEstadoUsuario(
            this.datosCambio.usuarioId,
            this.datosCambio.estado
          );
          await this.cargarDatos();
        }
        this.cerrarModal();

        // resetear filtros
        this.rolSeleccionado = "";
        this.cursoSeleccionado = "";
        this.estadoSeleccionado = "";

        Swal.fire("¡Éxito!", `El curso fue actualizado.`, "success");
      } catch (error) {
        Swal.fire(
          "¡Error!",
          `No se pudo actualizar el ${this.tipoCambio}.`,
          "error"
        );
      }
    },
  },
  created() {
    this.cargarRoles().then(() => {
      this.cargarDatos();
    });
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
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: -60px;
}

.profile-info img {
  width: 100px;
  height: 100px;
  border-radius: 10%;
  margin-right: 20px;
}

.user-details {
  text-align: left;
  margin-top: 40px;
}

.btn-group {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

@media (max-width: 991px) {
  .d-flex {
    display: grid !important;
    justify-content: center !important;
  }
}

.swal2-cancel.btn-red {
  background-color: #ff4d4f !important; /* Rojo intenso */
  color: white !important; /* Texto blanco */
  border: none !important; /* Sin borde */
  box-shadow: none !important; /* Sin sombra */
}
</style>