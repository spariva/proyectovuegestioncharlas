<template>
  <div class="nav">
    <div class="container d-flex align-items-center justify-content-between">
      <!-- Logo a la izquierda -->
      <div class="logo-container">
        <img
          src="../assets/logo-tajamar.png"
          alt="logo tajamar"
          class="logo_tajamar"
        />
      </div>

      <!-- Links centrados -->
      <ul class="nav nav-custom justify-content-center m-0">
        <li
          class="nav-item"
          v-for="(item, index) in filteredNavItems"
          :key="index"
          :class="{ active: activeIndex === index || isActiveRoute(item) }"
        >
          <router-link
            class="nav-link"
            :class="{ hovered: hoveredIndex === index || isActiveRoute(item) }"
            @mouseenter="hoveredIndex = index"
            @mouseleave="hoveredIndex = null"
            @click="setActive(index)"
            :to="item.link"
          >
            <i :class="item.icon"></i>
            {{ item.name }}
          </router-link>
        </li>
      </ul>

      <div class="profile-container justify-content-center">
        <!-- Botón desplegable -->
        <div
          class="d-flex align-items-center dropdown-toggle"
          data-bs-offset="absolute"
          id="dropdownProfile"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          role="button"
        >
          <!-- Imagen de perfil -->
          <div class="profile-circle">
            <img :src="imagen || perro" alt="profile" class="img-fluid rounded-circle"
     @error="setImagenAlternativa" />

          </div>
          <!-- Nombre del usuario -->
          <h2 class="profile-name ms-2">{{ nombre }} </h2>
        </div>

        <!-- Menú desplegable -->
        <ul
          class="dropdown-menu dropdown-menu-end "
          aria-labelledby="dropdownProfile"
        >
          <li class="d-flex justify-content-center">
            <hr
              class="dropdown-divider"
              style="width: 175px; border: 0.1px solid #3d3d3d; margin-bottom: 15px;" 
            />
          </li>

          <!-- Ítems móviles -->
  <li v-for="(item, index) in dropdownNavItems" :key="'mobile-' + index">
    <a class="dropdown-item pill-link" :href="item.link">
      <i :class="item.icon"></i> {{ item.name }}
    </a>
  </li>

          <li><a class="dropdown-item pill-link" href="/perfilalumno"><i class="fas fa-user"></i> Mi Perfil</a></li>

          <li>
            <a class="dropdown-item pill-link" href="#" @click.prevent="logout">
              <i class="fas fa-sign-out-alt"></i> Cerrar Sesión</a
            >
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import PerfilService from "@/services/PerfilService";
import Cookies from "cookies-js";
import Swal from "sweetalert2";
import perro from '@/assets/perro.jpg';
const servicePerf = new PerfilService();
export default {
  name: "MenuAlumnoComponent",
  data() {
    return {
      nombre: "",
      imagen: "",
      activeIndex: null, // Índice del enlace activo
      hoveredIndex: null, // Índice del enlace con hover
      isMobile: window.innerWidth <= 991, // Detecta si es móvil inicialmente
      navItems: [
        { name: "Home", link: "/", icon: "fa-solid fa-house" },
        { name: "Charlas", link: "/charlas", icon: "fa-solid fa-comments" },
      ], // Elementos del menú
    };
  },
  computed: {
    filteredNavItems() {
    // Muestra los elementos solo si no es móvil
    return this.isMobile ? [] : this.navItems;
  },
  dropdownNavItems() {
    // Muestra los elementos solo si es móvil
    return this.isMobile ? this.navItems : [];
  },
  },
  methods: {
    // Función para cambiar la imagen cuando falle la carga
    setImagenAlternativa (event) {
      event.target.src = perro;
    },
    setActive(index) {
      this.activeIndex = index; // Define el índice activo
    },
    isActiveRoute(item) {
      return this.$route.path === item.link; // Verifica si la ruta actual coincide con el enlace
    },
    logout() {
      Swal.fire({
        title: "¿Quieres cerrar la sesión?",
        text: "Una vez cerrada, necesitarás iniciar sesión de nuevo.",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Cerrar sesión",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          Cookies.expire("bearer_token");
          localStorage.removeItem('perfilUser');          
          this.$router.push("/login");
        }
      });
    },
    updateIsMobile() {
      this.isMobile = window.innerWidth <= 991; // Actualiza el estado
    },
  },
  mounted() {
    servicePerf
      .getUsuarioPerfil()
      .then((response) => {
        this.nombre = response.usuario.nombre;
        this.imagen = response.usuario.imagen;
      })
      .catch((error) => {
        console.error("Error al obtener los datos de usuario:", error);
      });
    window.addEventListener("resize", this.updateIsMobile); // Detecta cambios de tamaño
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.updateIsMobile); // Limpia los eventos
  },
};

</script>

<style scoped>
@media (max-width: 350px) {
  .logo-container[data-v-26366dfa]  {
    left: 0px;
  }
  .profile-container[data-v-26366dfa] {
    right: 0px;
  }
}
@media (max-width: 475px) {
  .logo_tajamar {
    content: url('../assets/icono.png'); /* Cambia la imagen aquí */
  }
}
@media (max-width: 991px) {
  .nav-custom {
    display: none !important; /* Oculta los links centrados */
  }

  .profile-container .dropdown-menu {
    text-align: center;
  }
}

.dropdown-menu {
  min-width: 150px;
  font-family: "Montserrat", serif;
  font-weight: 600;
  font-size: 16px;

}
.pill-link {
  display: inline-block; /* Ajusta el ancho al contenido del texto */
  text-align: center; /* Centra el texto dentro de la píldora */
  border-radius: 20px; /* Forma de píldora */
  padding: 10px 15px; /* Espaciado interno */
  width: 80%; /*Para el ancho de las pildoritas */
  background-color: #f8f9fa; /* Fondo similar a btn-light */
  color: #212529; /* Color del texto */
  text-decoration: none; /* Elimina el subrayado */
  font-family: "Montserrat", serif; /* Fuente consistente */
  transition: background-color 0.3s ease, transform 0.2s ease; /* Animación */
  margin-bottom: 10px; /* Separación entre píldoras */
}

/* Hover y focus */
.pill-link:hover,
.pill-link:focus {
  background-color: #e2e6ea; /* Fondo más oscuro al pasar el cursor */
  color: #212529; /* Mantén el color del texto */
}

/* Estado activo */
.pill-link:active {
  background-color: #ced4da; /* Fondo más oscuro al hacer clic */
  color: #212529;
}

/* Centrar las píldoras dentro del dropdown */
.dropdown-menu {
  text-align: center; /* Centra los elementos dentro del menú */
}

/* Contenedor principal del nav */
.nav {
  position: relative;
  padding: 20px;
  background-image: radial-gradient(circle, #a8d1ac, #7ca982);
  box-shadow: 0px 3px 12px rgba(0, 0, 0, 0.5);
}

/* Contenedor interno con flex */
.container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* Distribuye los elementos */
  position: relative;
}

/* Logo a la izquierda */
.logo-container {
  position: absolute;
  left: 20px;
  /* Ajusta la distancia desde el borde izquierdo */
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
}

.logo_tajamar {
  height: 50px;
  object-fit: contain;
}

/* Menú de links centrado */
.nav-custom {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  /* Centrado horizontal */
  margin: 0;
  /* Sin margen para evitar desplazamientos */
  display: flex;
  gap: 15px;
  /* Espaciado entre los enlaces */
  list-style: none;
  background-image: none !important;
  box-shadow: none !important;
}

/* Links del menú */
.nav-link {
  border-radius: 20px;
  color: #3d3d3d;
  font-size: 18px;
  font-family: "Montserrat", serif;
  font-weight: semibold;
  text-decoration: none;
}

.dropdown-toggle {
  padding: 5px 20px 5px 20px;
}

.dropdown-menu {
  width: 100%;
  /* Igualar el ancho del contenedor */
  border: none;
  /* Eliminar bordes predeterminados de Bootstrap */
  padding: 0;
  /* Eliminar espacio extra interno */
  background-color: #749d78;
  /* Mismo fondo que en hovered */
  border: 2px solid #3d3d3d;
  border-top: none;
  border-radius: 10px;
}

.dropdown-item {
  border: none;
  /* Sin bordes entre elementos */
  color: #3d3d3d;
  /* Color del texto */
  padding: 10px 20px;
  /* Espaciado interno */
  font-family: "Montserrat", serif;
  font-size: 16px;
}

.profile-container .dropdown-toggle:hover {
  background-color: rgba(82, 124, 88, 0.6);
  /* Fondo al hacer hover */
  color: #3d3d3d;
  border-radius: 10px;
  /* Redondear bordes */
}

.profile-container .dropdown-toggle:active,
.profile-container .dropdown-toggle[aria-expanded="true"] {
  background-color: #749d78;
  /* Fondo del dropdown */
  color: white;
  /* Color del texto en el estado activo */
  border-radius: 10px;
  /* Redondear bordes */
}

.profile-container .dropdown-toggle[aria-expanded="true"] {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border: 2px solid #3d3d3d;
  border-bottom: none;
}

/* Cuando el dropdown está abierto (menú desplegable) */
.profile-container .dropdown-menu {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}


/* Estado hover */
.nav-link.hovered {
  background-color: rgba(82, 124, 88, 60%);
  color: #3d3d3d;
  transition-delay: 0.1s;
}

/* Estado activo */
.nav-link.active {
  background-color: #527c58;
  font-size: 20px;
  color: #3d3d3d;
}

.nav-link {
  font-family: "Montserrat", serif;
  font-optical-sizing: auto;
  font-weight: 600;
  font-style: normal;
}

/* Contenedor del perfil a la derecha */
.profile-container {
  position: absolute;
  right: 20px;
  /* Ajusta la distancia desde el borde derecho */
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  /* Alinea verticalmente imagen y texto */
  gap: 10px;
  /* Espaciado entre la imagen y el nombre */
  z-index: 1060;
}

/* Círculo para la imagen de perfil */
.profile-circle {
  width: 50px;
  height: 50px;
  overflow: hidden;
  border: 2px solid #3d3d3d;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  margin-right: 15px;
}

/* Imagen dentro del círculo */
.profile-circle img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Estilo del nombre del usuario */
.profile-name {
  margin: 0;
  font-size: 18px;
  font-family: "Montserrat", serif;
  font-weight: bold;
  color: #3d3d3d;
  white-space: nowrap;
  margin-right: 10px;
  min-width: 90px;
  text-align: center;
  overflow: hidden;/*Para ocularlo */
  text-overflow: ellipsis;
  max-width: calc(6ch + 1px);
}
</style>