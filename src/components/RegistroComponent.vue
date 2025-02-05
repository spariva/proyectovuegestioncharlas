<template>
  <div class="login-background position-relative vh-sm-auto d-flex align-items-center justify-content-center my-lg-0 my-md-2 mx-2 my-4 mx-sm-4">
    <!-- Contenedor principal -->
    <div class="row shadow-lg mx-2 mx-md-2 mx-lg-0 p-md-3 rounded-3 login-container" style="max-width: 900px;">
      
      <!-- Columna del Formulario -->
      <div class="col-md-8 px-3 py-4 pe-md-5 ps-md-4">
        <h3 class="text-center fw-bold mb-4 w-100 mt-3 mt-md-2">Crear tu cuenta</h3>
        <!-- Formulario -->
        <form @submit.prevent="registerUser">
            <div class="row row-cols-md-2 row-cols-1">
                <div class="mb-3 pe-2">
                    <label for="nombre" class="form-label">Nombre <span class="text-danger">*</span></label>
                    <input
                    type="text"
                    class="form-control shadow-input"
                    id="nombre"
                    v-model="form.nombre"
                    :readonly="isLoading"
                    required
                    />
                </div>

                <div class="mb-3 ps-2">
                    <label for="apellidos" class="form-label">Apellidos <span class="text-danger">*</span></label>
                    <input
                    type="text"
                    class="form-control shadow-input"
                    id="apellidos"
                    v-model="form.apellidos"
                    :readonly="isLoading"
                    required
                    />
                </div>
            </div>

          <div class="mb-3">
            <label for="email" class="form-label">Correo educativo <span class="text-danger">*</span></label>
            <div class="input-group">
              <input
                type="text"
                class="form-control shadow-input"
                id="email"
                v-model="form.email"
                :readonly="isLoading"
                placeholder="username"
                required
              />
              <span class="input-group-text px-2 px-sm-3">@tajamar365.com</span>
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
                    aria-describedby="addon-wrapping passwordHelpBlock"
                    v-model="form.password"
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
            <div id="passwordHelpBlock" class="form-text">
                Tu contraseña debe tener entre 8 y 20 caracteres, incluir letras y números, y no contener espacios ni caracteres especiales.
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label">Rol <span class="text-danger">*</span></label>
            <div>
              <div class="form-check form-check-inline">
                <input
                  class="form-check-input"
                  type="radio"
                  id="rolAlumno"
                  value="Alumno"
                  v-model="form.idRole"
                  :disabled="isLoading"
                  required
                />
                <label class="form-check-label" for="rolAlumno">Alumno</label>
              </div>
              <div class="form-check form-check-inline">
                <input
                  class="form-check-input"
                  type="radio"
                  id="rolProfesor"
                  value="Profesor"
                  v-model="form.idRole"
                  :disabled="isLoading"
                  required
                />
                <label class="form-check-label" for="rolProfesor">Profesor</label>
              </div>
            </div>
          </div>

          <!-- Curso (solo para Alumno) -->
                <div class="mb-3" v-if="form.idRole === 'Alumno'">
                  <label for="idCurso" class="form-label">
                    Curso <span class="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    id="idCurso"
                    v-model="form.idCurso"
                    :readonly="isLoading"
                    class="form-control shadow-input"
                    placeholder="XXXX"
                  />
                </div>

                <!-- Contraseña especial (solo para Profesor) -->
                <div class="mb-3" v-if="form.idRole === 'Profesor'">
                  <label for="profesorPassword" class="form-label">
                    Clave de acceso <span class="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    id="profesorPassword"
                    v-model="profesorPassword"
                    :readonly="isLoading"
                    class="form-control shadow-input"
                    placeholder="Introduce tu clave de profesor"
                  />
                </div>

          <button
            type="submit"
            class="btn btn-success w-100"
            :disabled="isLoading"
          >
            Crear cuenta
          </button>
        </form>

        <!-- Spinner de Carga -->
        <!-- Manto blanco sobre el formulario -->
        <div v-if="isLoading" class="overlay">
          <div class="spinner-border text-success" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
        </div>

        <hr class="mt-4">
        <p class="text-center mt-2">
          ¿Ya tienes cuenta?
          <router-link to="/login" class="border-bottom fw-bold text-black">Inicia sesión</router-link>
        </p>
      </div>

      <!-- Columna de Ilustración -->
      <div class="col-md-4 p-5 m-0 bg-white d-flex align-items-center justify-content-center rounded-3">
        <img
          src="../assets/icono.png"
          alt="Ilustración de registro"
          class="imagen-ajustada "
        />
      </div>
    </div>
  </div>
</template>

<script scoped>
import Swal from "sweetalert2";
import AuthService from "@/services/AuthService";

const service = new AuthService();

export default {
  data() {
    return {
      form: {
        idUsuario: 0,
        nombre: '',
        apellidos: '',
        email: '',
        password: '',
        estadoUsuario: true,
        imagen:
          "https://cdn.pixabay.com/photo/2017/11/10/05/48/user-2935527_640.png",
        idRole: '',
        idCurso: "",
      },
      isLoading: false,
      passwordVisible: false,
      profesorPassword: "",
    };
  },
  methods: {
    togglePasswordVisibility() {
      this.passwordVisible = !this.passwordVisible;
    },
    async registerUser() {
        // Verificar que todos los campos obligatorios estén llenos
        if (
            !this.form.nombre ||
            !this.form.apellidos ||
            !this.form.email || 
            !this.form.password ||
            !this.form.idRole
        ) {
            Swal.fire({
                icon: "error",
                title: "Campos incompletos",
                text: "Por favor, asegúrate de rellenar los campos obligatorios.",
            });
            return;
        }

        // Validar que el username no contenga el símbolo '@'
        const usernameRegex = /^[a-zA-ZÑñ0-9._-]+$/; // Permitir solo letras, números, puntos, guiones bajos y guiones
        if (!usernameRegex.test(this.form.email)) {
            Swal.fire({
                icon: "error",
                title: "Formato incorrecto",
                text: "El nombre de usuario solo debe contener letras, números, puntos, guiones bajos y guiones, y no debe incluir '@'.",
            });
            return;
        }

        // Validar la contraseña
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/; // Debe tener entre 8 y 20 caracteres, al menos una letra y un número
        if (!passwordRegex.test(this.form.password)) {
            Swal.fire({
                icon: "error",
                title: "Contraseña inválida",
                text: "Tu contraseña debe tener entre 8 y 20 caracteres, incluir letras y números, y no contener espacios ni caracteres especiales.",
            });
            return;
        }

        // Verifica si el rol es Alumno
        if (this.form.idRole === 'Alumno') {
            this.isLoading = true; 
            this.form.idRole = 2; 
            service.setAlumno(this.form)
            .then((response) => {
                console.log(response);

                const Toast = Swal.mixin({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.onmouseenter = Swal.stopTimer;
                        toast.onmouseleave = Swal.resumeTimer;
                    },
                });
                Toast.fire({
                    icon: "success",
                    title: "Cuenta de alumno creada exitosamente!",
                });

                this.isLoading = false;
                this.clearForm();
                this.$router.push("/login");
            })
            .catch((error) => {
                this.isLoading = false; 
                this.form.idRole = 'Alumno'; 
                console.error("Error al crear el usuario: ", error);
                Swal.fire({
                    icon: "error",
                    title: "Error al crear el usuario",
                    text: "No se pudo crear el usuario. Por favor, inténtalo de nuevo más tarde.",
                });
            });
        } else {
            // Maneja el caso para profesores
            this.isLoading = true; 
            this.form.idRole = 1; 
            service.setProfesor(this.form, this.profesorPassword) 
            .then((response) => {
                console.log(response);

                const Toast = Swal.mixin({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.onmouseenter = Swal.stopTimer;
                        toast.onmouseleave = Swal.resumeTimer;
                    },
                });
                Toast.fire({
                    icon: "success",
                    title: "Cuenta de profesor creada exitosamente!",
                });

                this.isLoading = false; 
                this.clearForm();
                this.$router.push("/login");
            })
            .catch((error) => {
                this.isLoading = false; 
                this.form.idRole = 'Profesor'; 
                console.error("Error al crear el usuario: ", error);
                Swal.fire({
                    icon: "error",
                    title: "Error al crear el usuario",
                    text: "No se pudo crear el usuario. Por favor, inténtalo de nuevo más tarde.",
                });
            });
        }
    },

    clearForm() {
        this.form = {
            nombre: "",
            apellidos: "",
            email: "",
            password: "",
            idRole: "",
            idCurso: "",
        };
        this.profesorPassword = ""; 
    },
  },
};
</script>

<style>
  .login-background{
    background-color: #fdfafa00;
  }

  .login-container {
    background-color: #abceaf;
    height: auto;
  }

  .btn-success {
    background-color: #314B78;
    border-color: #314B78;
  }

  .btn-success:active, .btn-success:hover {
    border-color: #5772A6;
    background-color: #5772A6;
  }

  .btn-success:disabled {
    border-color: #40685C;
    background-color: #40685C;
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

  .shadow-input {
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1); 
    border-radius: 0.375rem; 
    border: 1px solid #ccc; 
    padding: 0.5rem; 
  }

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

  .vh-sm-auto {
    height: auto;
  }

  .form-check-input:checked, .form-check-input:active{
    background-color: #578E7E; /* Verde oscuro */
    border-color: #436c60; /* Borde más oscuro */
    box-shadow: 0 0 8px rgba(87, 142, 126, 0.5); 
  }


  @media (min-width: 768px) {
    .login-container {
      max-height: 760px;
    }

    .vh-sm-auto {
      height: 100vh; 
    }
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
