import { createRouter, createWebHistory } from "vue-router";
import Cookies from 'cookies-js';
import HomeComponent from './components/HomeComponent.vue';
// import LoginComponent from './components/LoginComponent.vue';
import InicioSesionComponent from './components/InicioSesionComponent.vue';
import RegistroComponent from './components/RegistroComponent.vue';
import PerfilAlumnoComponent from './components/PerfilAlumnoComponent.vue';
import PerfilProfesorComponent from './components/PerfilProfesorComponent.vue';
import CharlasComponent from './components/CharlasComponent.vue';
import CharlasAlumnoComponent from './components/CharlasAlumnoComponent.vue';
import AdminGestionUsuariosComponent from "@/components/AdminGestionUsuariosComponent";
import NotFoundComponent from "./components/NotFoundComponent.vue";
import AlumnosCursoProfesorComponent from "@/components/AlumnosCursoProfesorComponent";
import CharlasDetalleComponent from "@/components/CharlasDetalleComponent";
import SeleccionRondasProfesor from "@/components/SeleccionRondasProfesor";

const routes = [
    {
        path: '/login',
        component: InicioSesionComponent,
        beforeEnter: (to, from, next) => {
            const token = Cookies.get('bearer_token'); // Verifica si la cookie 'bearer_token' existe
            if (!token) {
                next(); // Si no tiene token, accede a la página de login
            } else {
                next('/'); // Si tiene token, redirige al Home
            }
        }
    },
    {
        path: '/register',
        component: RegistroComponent,
        beforeEnter: (to, from, next) => {
            const token = Cookies.get('bearer_token'); // Verifica si la cookie 'bearer_token' existe
            if (!token) {
                next(); // Si no tiene token, accede a la página de login
            } else {
                next('/'); // Si tiene token, redirige al Home
            }
        }
    },
    {
        path: '/',
        component: HomeComponent,
        beforeEnter: (to, from, next) => {
            const token = Cookies.get('bearer_token');  // Obtiene el token desde la cookie
            if (token) {
                next(); // Si tiene token, permite el acceso
            } else {
                next('/login'); // Si no tiene token, redirige a la página de login
            }
        }
    },
    {
        path: '/perfilalumno',
        component: PerfilAlumnoComponent,
        beforeEnter: (to, from, next) => {
            const token = Cookies.get('bearer_token');
            if (token) {
                next();
            } else {
                next('/login');
            }
        }
    },
    {
        path: '/perfilprofesor',
        component: PerfilProfesorComponent,
        beforeEnter: (to, from, next) => {
            const token = Cookies.get('bearer_token');
            if (token) {
                next();
            } else {
                next('/login');
            }
        },
    },
    {
        path: '/charlas',
        component: CharlasComponent,
        beforeEnter: (to, from, next) => {
            const token = Cookies.get('bearer_token');
            if (token) {
                next();
            } else {
                next('/login');
            }
        }
    },
    {
        path: '/detallescharla/:id',
        name: 'DetallesCharla',
        component: CharlasDetalleComponent,
        beforeEnter: (to, from, next) => {
            const token = Cookies.get('bearer_token');
            if (token) {
                next();
            } else {
                next('/login');
            }
        }
    },
    {
        path: '/charlasalumno',
        component: CharlasAlumnoComponent,
        beforeEnter: (to, from, next) => {
            const token = Cookies.get('bearer_token');
            if (token) {
                next();
            } else {
                next('/login');
            }
        }
    },
    {
        path: '/gestionusuarios',
        component: AdminGestionUsuariosComponent,
        beforeEnter: (to, from, next) => {
            const token = Cookies.get('bearer_token');
            if (token) {
                next();
            } else {
                next('/login');
            }
        }
    },
    {
        path: '/perfilprofesor/alumnos',
        name: 'alumnos',
        component: AlumnosCursoProfesorComponent,
        beforeEnter: (to, from, next) => {
            const token = Cookies.get('bearer_token');
            if (token) {
                next();
            } else {
                next('/login');
            }
        }
    },
    {
        path: '/rondasprofesor',
        name: 'rondasprofesor',
        component: SeleccionRondasProfesor,
        beforeEnter: (to, from, next) => {
            const token = Cookies.get('bearer_token');
            if (token) {
                next();
            } else {
                next('/login');
            }
        }
    },

    // Ruta catch-all para manejar Not Found
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFoundComponent
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes: routes
});

export default router;