<template>
  <MenuAlumnoComponent v-if="isLoggedIn && userRole === 'ALUMNO'" />
  <MenuProfesorComponent v-if="isLoggedIn && userRole === 'PROFESOR'" />
  <MenuAdminComponent v-if="isLoggedIn && userRole === 'ADMINISTRADOR'" />
  <router-view></router-view>
</template>

<script>
import Cookies from "cookies-js";
import MenuProfesorComponent from "./components/MenuProfesorComponent.vue";
import MenuAdminComponent from "./components/MenuAdminComponent.vue";
import MenuAlumnoComponent from "./components/MenuAlumnoComponent.vue";

export default {
  name: "App",
  components: {
    MenuAlumnoComponent,
    MenuProfesorComponent,
    MenuAdminComponent,
  },
  data() {
    return {
      isLoggedIn: false,
      userRole: null,
    };
  },
  watch: {
    // Observamos los cambios en la ruta para verificar login
    $route() {
      this.checkAuthentication();
    },
  },
  created() {
    // Llamamos al método para comprobar si el usuario está autenticado
    this.checkAuthentication();
  },
  methods: {
    checkAuthentication() {
      const token = Cookies.get("bearer_token");
      const role = Cookies.get("user_role");
      this.isLoggedIn = !!token; // Determina si el usuario está logueado
      this.userRole = role;
    },
  },
};
</script>

<style>
h1{
  font-family: 'Montserrat', sans-serif;
}
p{
  font-family: "Nunito Sans", serif;
}
h2, h3, h4, h5{
  font-family: "Hind Guntur", serif;}
body{
  background-color: #FDFAFA!important;
  background: linear-gradient(
    to top,
    hsla(128, 21%, 57%, 0.5) 0%,   
    #FDFAFA 60%    
  );
  min-height: 100vh;
}
.swal2-confirm.swal2-styled {
  background-color: #578e73 !important;
}

.swal2-confirm.swal2-styled.swal2-default-outline{
  background-color: #578e73 !important;
}

.swal2-confirm.swal2-styled:hover {
  background-color: #40685c !important;
}

.swal2-cancel.swal2-styled.swal2-default-outline{
  background-color: #577478 !important;
}

.swal2-cancel.swal2-styled{
  background-color: #577478 !important;
}

.spinner-border.text-success{
  color: #578e73 !important;
}

.spinner-border.text-primary{
  color: #578e73 !important;
}

.swal2-loader {
  border-top-color: #578e73;
  border-bottom-color: #578e73;
}

div:where(.swal2-container) input:where(.swal2-input):focus, 
div:where(.swal2-container) input:where(.swal2-file):focus, 
div:where(.swal2-container) textarea:where(.swal2-textarea):focus, #contraseniaNueva {
    border: 1px solid #578e73 !important; /* Borde verde */
    outline: none;
    box-shadow: inset 0 1px 1px rgba(0,0,0,.06), 0 0 0 3px #578e737f !important; /* Sombra verde */
}
</style>