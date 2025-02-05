<template>
  <div class="login-background position-relative vh-100 d-flex align-items-center justify-content-center my-lg-0 my-md-2 mx-2 my-4 mx-sm-4">
    <!-- Contenedor principal -->
    <div class="row shadow-lg mx-2 mx-md-2 mx-lg-0 rounded-3 overflow-hidden login-container" style="max-width: 900px;">
      <!-- Columna de Ilustración -->
      <div class="col-md-4 p-4 m-0 m-md-3 bg-white d-flex align-items-center justify-content-center rounded-3">
        <img
          src="../assets/ilustracion_login.jpg"
          alt="Ilustración de inicio de sesión"
          class="imagen-ajustada"
        />
      </div>

      <!-- Columna del Formulario -->
      <div class="col-md-7 px-3 py-4 p-md-5">
        <h3 class="text-center fw-bold mb-4 w-100 mt-3 mt-md-0">Iniciar sesión</h3>

        <!-- Formulario -->
        <form @submit.prevent="loginUser">
          <div class="mb-3">
                <label for="email" class="form-label">Correo educativo <span class="text-danger">*</span></label>
                <div class="input-group">
                  <input 
                    type="text" 
                    class="form-control shadow-input" 
                    id="username" 
                    aria-describedby="basic-addon3"
                    placeholder="username"
                    v-model="userName"
                    :readonly="isLoading"
                    required
                  >
                  <span class="input-group-text px-2 px-sm-3" id="basic-addon3">@tajamar365.com</span>
                </div>
            </div>

          <div class="mb-3">
            <label for="password" class="form-label">Contraseña <span class="text-danger">*</span></label>
            <div class="input-group flex-nowrap">
                <input 
                  :type="!passwordVisible ? 'Password' : 'Text'" 
                  id="password"
                  class="form-control shadow-input" 
                  :placeholder="passwordVisible ? 'Ejemplo123' : '••••••••••'" 
                  aria-label="password" 
                  aria-describedby="addon-wrapping"
                  v-model="password"
                  :readonly="isLoading"
                  required
                >
                <span 
                  class="input-group-text" 
                  id="addon-wrapping"
                  @click="togglePasswordVisibility"
                  v-html="!passwordVisible ? '<i class=\'fa-solid fa-eye-slash\'></i>' : '<i class=\'fa-solid fa-eye\'></i>'"
                ></span>
            </div>
          </div>
          <button
            type="submit"
            class="btn btn-success w-100"
            :disabled="isLoading"
          >
            Iniciar sesión
          </button>
        </form>

        <!-- Spinner de Carga -->
        <!-- Manto blanco sobre el formulario -->
        <div
          v-if="isLoading"
          class="overlay"
        >
          <div class="spinner-border text-success" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
        </div>

        <hr class="mt-4">

        <p class="text-center mt-2">
            ¿No tienes cuenta?
            <router-link
            to="/register"
            class="border-bottom fw-bold text-black"
            >
            Regístrate
            </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import Cookies from "cookies-js";
import Swal from "sweetalert2";
import AuthService from "@/services/AuthService";

const service = new AuthService();

export default {
  data() {
    return {
      userName: "",
      password: "",
      isLoading: false,
      passwordVisible: false,
    };
  },
  methods: {
    togglePasswordVisibility() {
      this.passwordVisible = !this.passwordVisible;
    },

    async loginUser() {
        this.isLoading = true;
        
        // Validaciones adicionales antes de hacer la llamada al servicio
        if (!this.validateInputs()) {
            this.isLoading = false;
            return;
        }

        try {
            const data = await service.getToken(this.userName, this.password);
            const fechaCaducidad = new Date();
            fechaCaducidad.setTime(fechaCaducidad.getTime() + (4 * 60 * 60 * 1000)); // 4 horas en milisegundos

            const token = "bearer " + data.response;
            Cookies.set("bearer_token", token, { expires: fechaCaducidad });

            this.isLoading = false;

            const role = data.role;
            Cookies.set('user_role', role, { expires: fechaCaducidad });

            Cookies.set('user_id', data.idrole, { expires: fechaCaducidad });

            if (role === "ADMINISTRADOR") {
            this.$router.push("/gestionusuarios");
            } else {
            this.$router.push("/");
            }
        } catch (error) {
            this.isLoading = false;
            console.error('Error during login:', error);
            Swal.fire({
                icon: "error",
                title: "Error al iniciar sesión",
                text: "Por favor, revisa tus credenciales",
            });
        }
    },
    validateInputs() {
        if (!this.userName || !this.password) {
            Swal.fire({
                icon: "warning",
                title: "Campos incompletos",
                text: "Por favor, completa todos los campos requeridos.",
            });
            return false;
        }

        // Verificar que el username no contenga el formato de correo
        const usernameRegex = /^[^@]+$/; // Asegurarse de que no contenga '@'
        if (!usernameRegex.test(this.userName)) {
            Swal.fire({
                icon: "warning",
                title: "Formato incorrecto",
                text: "El nombre de usuario no debe contener '@' ni ningún otro formato de correo.",
            });
            return false;
        }

        return true;
    },
  },
};
</script>

<style scoped>
  .login-background {
    background-color: #fdfafa00;
  }

  .logo-container {
    z-index: 10;
  }

  .login-container{
    background-color: #abceaf;
  }

  .btn-success{
    background-color: #314B78;
    border-color: #314B78;
  }

  .btn-success:active, .btn-success:hover{
    border-color: #5772A6;
    background-color: #5772A6;
  }

  .btn-success:disabled{
    border-color: #40685C;
    background-color: #40685C;
  }

  .hover-effect:hover {
    color: #007bff; /* Cambiar el color del enlace al pasar el cursor */
    text-decoration: underline; /* Subrayar el enlace */
    cursor: pointer; /* Mostrar puntero como mano */
  }

  #addon-wrapping:hover{
    cursor: pointer;
  }

  ::v-deep(.swal2-popup.swal2-modal) {
    border-radius: 10px !important;
  }

  /* Si necesitas personalizar los botones */
  ::v-deep(.swal2-confirm, .swal2-cancel) {
    background: #578E7E;
  }
    
  .overlay {
    position: fixed; /* Fijo para cubrir toda la pantalla */
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.8); /* Color blanco con opacidad */
    z-index: 999; /* Asegúrate de que esté por encima de otros elementos */
    display: flex; /* Para centrar el spinner */
    align-items: center; /* Centrado vertical */
    justify-content: center; /* Centrado horizontal */
  }

  /* Sombreado interno para las cajas de entrada */
  .shadow-input {
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1); /* Sombra interna ligera */
    border-radius: 0.375rem; 
    border: 1px solid #ccc; 
    padding: 0.5rem; 
  }

  /* Cambiar color de sombreado al enfocar */
  .shadow-input:focus {
    box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.2), 0 0 4px rgba(87, 142, 126, 0.5); 
    border-color: #578E7E; 
    outline: none; 
  }
  
  .imagen-ajustada {
    max-height: 400px; 
    width: auto;
    max-width: 100%; 
  }

  @media (max-width: 768px) {
    .imagen-ajustada {
      max-height: 150px; /* Ajuste para pantallas más pequeñas */
    }
  }

  @media (max-width: 576px) {
    .imagen-ajustada {
      max-height: 100px; 
    }
  }

  @media (max-width: 350px) {
    .imagen-ajustada {
      max-height: 60px; 
    }
  }

</style>
