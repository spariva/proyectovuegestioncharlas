<template>
  <div>
    <!-- Mostrar spinner mientras se cargan los alumnos -->
    <div
      v-if="cargando"
      class="d-flex justify-content-center align-items-center vh-100"
    >
      <div class="spinner-border text-success" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <div class="container my-3" v-if="role == 2 && !cargando">
      <h1 class="fw-bold">Hola, {{ nombre }} !</h1>
      <div class="row row-cols-1 row-cols-md-2 mb-3 mt-4 pt-4">
        <!-- Card para ronda abierta -->
        <div class="col mb-3">
          <div class="custom-card active-card">
            <!-- Sección superior con forma de pestaña -->
            <div class="card-header">
              <div class="tab-header" :class="{'active-tab': isRondaAbierta, 'inactive-tab': !isRondaAbierta}">
                <i class="fa-regular fa-folder-open me-2"></i> {{ isRondaAbierta ? 'Rondas abiertas' : 'Sin rondas abiertas' }}
              </div>
            </div>

            <!-- Contenido principal de la tarjeta -->
            <div class="card-body p-4 text-center">
              <p class="card-text px-lg-5">
                <span v-if="isRondaAbierta">
                  {{ puedeSubirCharla 
                    ? 'Actualmente hay una ronda abierta para subir charlas. ¡Aprovecha la oportunidad de compartir tus ideas!' 
                    : 'Actualmente hay una ronda abierta, pero ya tienes una charla registrada para esta ronda.' }}
                </span>
                <span v-else>
                  No hay rondas abiertas para subir charlas.
                </span>
              </p>

              <!-- Botón o formulario -->
              <button 
                class="btn mt-2" :class="isRondaAbierta && puedeSubirCharla ? 'btn-primary' : 'btn-secondary text-white'"
                :disabled="!isRondaAbierta || !puedeSubirCharla"
                v-if="!isRondaAbierta || !puedeSubirCharla"
              >
                Subir charla
              </button>
              <FormNewCharla @evaluarRondas="actualizarContenido" v-else />
            </div>
          </div>
        </div>

        <!-- Card para votación activa (activa o no activa) -->
        <div class="col mb-3">
          <div class="custom-card border-0 active-card">
            
            <!-- Sección superior con forma de pestaña -->
            <div class="card-header border-0">
              <div class="tab-header" :class="{'active-tab': isVotacionActiva, 'inactive-tab': !isVotacionActiva}">
                <i class="fa-solid fa-bell me-2"></i> {{ isVotacionActiva ? 'Votaciones activas' : 'Sin votaciones activas' }}
              </div>
            </div>

            <!-- Contenido principal -->
            <div class="card-body p-4 text-center">
              <p class="card-text px-lg-5">
                <span v-if="isVotacionActiva">
                  {{ !puedeVotar 
                    ? 'La votación está activa, pero ya has emitido tu voto. ¡Gracias por participar!' 
                    : 'Actualmente hay una votación activa para elegir las próximas charlas. ¡Haz que tu voz cuente!' 
                  }}
                </span>
                <span v-else>
                  No hay votaciones activas en este momento.
                </span>
              </p>

              <!-- Contenedor de los botones -->
              <div class="d-flex justify-content-center mt-2">
                <!-- Botón para ir a charlas -->
                <button 
                  class="btn btn-mover me-1 mt-2"
                  @click="$router.push('/charlas')"
                >
                  Ir a charlas
                </button>

                <!-- Botón charlas o formulario -->
                <button 
                  class="btn ms-2 mt-2" :class="isVotacionActiva && puedeVotar ? 'btn-primary' : 'btn-secondary text-whiite'"
                  :disabled="!isVotacionActiva || !puedeVotar"
                  v-if="!isVotacionActiva || !puedeVotar"
                >
                  Votar charla
                </button>
                <FormVotacion @evaluarRondas="actualizarContenido"  v-else />
              </div>
            </div> 
          </div>
        </div>
      </div>

      <hr class="my-4 py-2">

      <div class="row mt-3 mb-4 pt-0">
        <div class="mb-3 mb-md-4 col-lg-8">
          <h1 class="mb-4 mt-2 pt-0 fw-light">Calendario</h1>
            <!-- Guía de colores -->
            <div>
              <div class="row">
                <!-- Ronda Abierta -->
                <div class="col-md-auto">
                  <div class="d-flex align-items-md-center">
                    <div class="color-box" style="background-color: #d76060;"></div>
                    <span class="ms-2">Ronda abierta</span>
                  </div>
                </div>
                <!-- Votación Activa -->
                <div class="col-md-auto">
                  <div class="d-flex align-items-md-center">
                    <div class="color-box" style="background-color: #578e73;"></div>
                    <span class="ms-2">Votación activa</span>
                  </div>
                </div>
                <!-- Votación Terminada -->
                <div class="col-md-auto">
                  <div class="d-flex align-items-md-center">
                    <div class="color-box" style="background-color: #314B78;"></div>
                    <span class="ms-2">Presentación</span>
                  </div>
                </div>
              </div>
              <p class="text-secondary small mt-2">
                <b>Nota:</b> Para ver los detalles de un día específico, haz clic en la parte de la casilla correspondiente a ese día.
              </p>
            </div>

            <!-- Calendario -->
            <div class="mt-3">
              <!-- Contenedor con scroll horizontal -->
              <div class="parent-container">
                <div class="calendar-wrapper">
                  <FullCalendar :options="calendarOptions"/>
                </div>
              </div>
            </div>
          </div>
          
          <div class="mb-4 ps-lg-2 col-12 col-lg-4">
            <h2 class="mb-3 pb-2 pt-0 espacio-150">Presentaciones</h2>
            <div class="list-group pt-1">
              <!-- Mostrar solo los primeros cinco eventos si no se ha hecho clic en "Ver más" -->
              <div 
                class="list-group-item d-flex align-items-center" 
                v-for="(evento, index) in (mostrarTodos ? eventosPresentaciones : eventosPresentaciones.slice(0, 5))" 
                :key="index"
              >
                <span 
                  class="badge rounded-circle me-3 p-3"
                  style=" color: white; min-width: 40px; height: 40px; display: flex; justify-content: center; align-items: center;"
                >{{ new Date(evento.date).getDate() }}</span>
                <span>{{ evento.title }}</span>
                <small class="text-muted ms-3">
                  {{ formatoMes(evento.date) }}
                </small>
              </div>

              <!-- Botón "Ver más" o "Ver menos" -->
              <div v-if="eventosPresentaciones.length > 5" class="text-end mt-1">
                <button 
                  class="btn btn-primary" 
                  @click="toggleMostrarTodos"
                >
                  {{ mostrarTodos ? 'Ver menos' : 'Ver más' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    <div class="container my-5 pb-4" v-if="role == 1 && !cargando">
      <h1 class="fw-bold">Bienvenido, {{ nombre }} !</h1>
      <div class="row mt-lg-4 mt-2 pt-3">
        <!-- Columna izquierda: Presentaciones -->
        <div class="col-12 col-lg-6 mb-4 mb-lg-0 pe-lg-4">
          <h2 class="mb-4 fw-semibold">Próximas charlas:</h2>
          <div class="list-group">
            <!-- Verificar si hay presentaciones pendientes -->
            <div v-if="presentacionesPendientes.length == 0" class="alert alert-secondary">
              <span>No hay charlas programadas en este momento.</span>
            </div>

            <!-- Mostrar solo los primeros cinco eventos si no se ha hecho clic en "Ver más" -->
            <div 
              class="list-group-item d-flex align-items-center" 
              v-for="(evento, index) in (mostrarTodos ? presentacionesPendientes : presentacionesPendientes.slice(0, 4))" 
              :key="index"
            >
              <span 
                class="badge rounded-circle me-3 p-3"
                style=" color: white; min-width: 40px; height: 40px; display: flex; justify-content: center; align-items: center;"
              >{{ new Date(evento.fechaPresentacion).getDate() }}</span>
              <span>{{ evento.descripcionModulo }}</span>
              <small class="text-muted ms-3">
                {{ formatoMes(evento.fechaPresentacion) }}

                <!-- Botón de edición -->
                <button class="btn btn-primary btn-sm mt-0 ms-3" @click="editarRonda(evento.idRonda)">
                  <i class="fa-solid fa-pen"></i>
                </button>
              </small>
            </div>

            <!-- Botón "Ver más" o "Ver menos" -->
            <div v-if="presentacionesPendientes.length > 4" class="text-end mt-1">
              <button 
                class="btn btn-primary" 
                @click="toggleMostrarTodos"
              >
                {{ mostrarTodos ? 'Ver menos' : 'Ver más' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Columna derecha: Formulario (simulado con un cuadrado de color) -->
        <div 
          class="col-12 col-lg-6 ps-lg-4 pt-0 pb-1 d-flex justify-content-center align-items-center"
          :class="presentacionesPendientes.length > 4 ? 'mt-md-0' : 'mt-md-5 pt-2'"
        >
          <div 
            class="border rounded-4 p-4" 
            style="width: 100%; height: 100%; max-height: 285px; background-color: #a0a0a0;">
            
            <!-- Contenedor interno -->
            <div 
              class="text-center text-muted h-100 d-flex flex-column justify-content-center align-items-center p-4" 
              style="background-color: #e0e0e0; border-radius: 15px;">

              <!-- Mensaje -->
              <p class="mb-2 fw-semibold h5 px-2 px-lg-5 mx-1 mx-lg-3">
                Crea rondas o actualiza el estado de las charlas de propuestas.
              </p>

              <FormNewRonda @evaluarRondas="actualizarContenidoProfe"/>
              <UpdateEstadoCharlas/>
            </div>
          </div>
        </div>
      </div>

      <!-- <hr class="my-5 py-3"/> -->

      <h2 class="mt-5 pt-3 mb-3 fw-semibold">Estadísticas:</h2>
      <!-- <p class="mb-4 small"><b>Nota:</b> pulsa sobre los botones para generar los gráficos a tiempo real.</p> -->

      <!-- Botones para mostrar gráficos -->
      <div class="button-container mb-3">
        <button class="btn btn-mover me-2" @click="mostrarGrafico('rondas')">Rondas</button>
        <button class="btn btn-mover me-2" @click="mostrarGrafico('alumnos')">Alumnos</button>
        <button 
          v-if="graficoSeleccionado && !loadChart" 
          class="btn btn-secondary" 
          @click="limpiarGrafico()"
        >
          Limpiar
        </button>
      </div>
      
      <!-- Contenedor del gráfico -->
      <div class="grafico-container">
        <template v-if="graficoSeleccionado">
          <div class="grafico-wrapper">
            
          <!-- Spinner que se superpone al gráfico -->
          <div v-if="loadChart" class="spinner-container">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Cargando...</span>
            </div>
          </div>
          
          <!-- Contenedor para gráfico -->
          <div class="grafico-responsive">
            <canvas id="chart"></canvas>
          </div>
        </div>
        </template>
        <p v-else class="text-muted mensaje-vacio">
          Selecciona una opción para ver el gráfico
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es'; 
import Swal from 'sweetalert2';
import PerfilService from '@/services/PerfilService';
import CharlasService from '@/services/CharlasService';
import FormNewCharla from './FormNewCharla.vue';


import { Chart, CategoryScale, LinearScale, DoughnutController, ArcElement, LineController, LineElement, Title, Tooltip, Legend, PointElement } from 'chart.js';
import FormVotacion from './FormVotacion.vue';
import FormNewRonda from './FormNewRonda.vue';
import UpdateEstadoCharlas from './UpdateEstadoCharlas.vue';

// Registrar las escalas, elementos, y otros componentes
Chart.register(CategoryScale, LinearScale, LineController, LineElement, DoughnutController, ArcElement, Title, Tooltip, Legend, PointElement);

const servicePerf = new PerfilService();
const serviceChar = new CharlasService();

export default {
  name: "HomeComponent",
  components: {
    FullCalendar,
    FormNewCharla,
    FormVotacion,
    FormNewRonda,
    UpdateEstadoCharlas
  },
  data() {
    return {
      calendarOptions: {
        plugins: [ dayGridPlugin, interactionPlugin ],
        initialView: 'dayGridMonth',
        dateClick: this.handleDateClick,
        locale: esLocale, 
        events: []
      },
      eventosPresentaciones: [],
      nombre: "",
      role: "",
      curso:"",
      isRondaAbierta: false, 
      isVotacionActiva: false,
      puedeSubirCharla: false, 
      puedeVotar: false, 
      rondas: [],
      rondasProfe: [],
      presentacionesPendientes:[],
      cargando: false,
      loadChart: false,
      mostrarTodos: false,
      graficoSeleccionado: null,
      chartInstance: null,
    };
  },
  mounted() {
    servicePerf.getUsuarioPerfil()
    .then(response => {
      //NUEVO
      this.nombre = response.usuario.nombre;
      this.role = response.usuario.idRole;
      //ALMACENAMOS LOS DATOS DEL USUARIO DE SU PERFIL
      const perfil = JSON.stringify(response.usuario);
      localStorage.setItem('perfilUser', perfil)

      if(this.role == 1){
        this.evaluarAlumnos();
      }

      if(this.role == 2){
        this.evaluarRondas(); 
      } 
    })
    .catch(error => {
      console.error('Error al obtener los datos de usuario:', error);
      this.cargando = false; 
    });
  },
  methods: {
    handleDateClick(info) {
      const clickedDate = info.date;

      // Formatear la fecha de forma legible
      const formattedDate = clickedDate.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      // Filtrar eventos que coinciden con la fecha seleccionada
      let eventList = "";
      if (this.calendarOptions.events.length > 0) {
        const eventsOnSelectedDate = this.calendarOptions.events.filter((event) => {
          const eventStartDate = new Date(event.start || event.date);  // Fecha de inicio
          const eventEndDate = event.end ? new Date(event.end) : eventStartDate;  // Fecha de fin, si existe

          // Asegurarse de comparar solo el día, mes y año (sin horas)
          const startDate = new Date(eventStartDate.setHours(0, 0, 0, 0));
          const endDate = new Date(eventEndDate.setHours(0, 0, 0, 0));
          const selectedDate = new Date(clickedDate.setHours(0, 0, 0, 0));  // Fecha seleccionada sin hora

          // Comprobar si la fecha seleccionada está dentro del rango de fechas del evento
          return selectedDate >= startDate && selectedDate < endDate || startDate.toISOString().split('T')[0] === selectedDate.toISOString().split('T')[0];
        });

        if (eventsOnSelectedDate.length > 0) {
          eventList = eventsOnSelectedDate.map((event, index) => {
            let eventType = "";

            // Determinar el tipo de evento según el color
            switch (event.color) {
              case '#d76060':
                eventType = "Ronda Abierta";
                break;
              case '#578e73':
                eventType = "Votación Activa";
                break;
              case '#314B78':
                eventType = "Presentación";
                break;
              default:
                eventType = "Evento desconocido";
            }

            // Retorna el evento con el título y tipo
            return `<b>${index + 1}. ${eventType}:</b> ${event.title}`;
          }).join("<br>");
        } else {
          eventList = "No hay eventos para esta fecha.";
        }
      } else {
        eventList = "No hay eventos para esta fecha.";
      }

      // Mostrar la fecha clickeada y los eventos en el SweetAlert
      Swal.fire({
        title: `${formattedDate}`,  // Título con fecha formateada
        html: `${eventList}`,
        icon: 'info',
      });
    },

    evaluarRondas(){
      this.cargando = true;
      // Obtener las rondas.
      serviceChar.getRondas()
      .then(response => {
        this.rondas = response;
        const ahora = new Date();

        let isRondaAbierta = false;
        let isVotacionActiva = false;
        this.puedeSubirCharla = false;
        const events = []; // Para llenar el calendario

        // Obtener las charlas del alumno
        serviceChar.getCharlasAlumno()
        .then(charlasAlumno => {
          
          // Obtener los votos del alumno
          serviceChar.getVotosAlumno()
          .then(votosAlumno => {
            let lanzarMensaje = false;
            let rondasPromises = []; // Array para almacenar las promesas de las rondas
            
            this.rondas.forEach(ronda => {
              const fechaCierre = new Date(ronda.fechaCierre + 'Z'); // Agregar "Z" al final para interpretar como UTC
              const fechaLimiteVotacion = new Date(ronda.fechaLimiteVotacion + 'Z');
              const fechaPresentacion = new Date(ronda.fechaPresentacion + 'Z');

              const fechaCierreDia = new Date(fechaCierre.getFullYear(), fechaCierre.getMonth(), fechaCierre.getDate());

              // Comprobar si la ronda está abierta para solicitar charlas
              if (ahora < fechaCierreDia) {
                isRondaAbierta = true;

                events.push({
                  title: `${ronda.descripcionModulo}`,
                  start: ahora.toISOString().split('T')[0],
                  end: fechaCierre.toISOString().split('T')[0],
                  color: '#d76060'
                });

                // Verificar si el alumno ya tiene una charla asociada a esta ronda
                const charlaEnRonda = charlasAlumno.some(charla => charla.charla.idRonda === ronda.idRonda);

                // Si no tiene charla en esta ronda, puede subir una nueva
                if (!charlaEnRonda) {
                  this.puedeSubirCharla = true;
                }
              }

              // Comprobar si hay una votación activa (entre la fecha de cierre y la fecha límite de votación)
              if (ahora <= fechaLimiteVotacion) {
                if (ahora > fechaCierreDia && ahora <= fechaLimiteVotacion){
                  isVotacionActiva = true;

                  // Verificar si el alumno ya votó en esta ronda
                  const votoEnRonda = votosAlumno.some(voto => voto.idRonda === ronda.idRonda);
  
                  if (!votoEnRonda) {
                    this.puedeVotar = true;
                  }
                }

                events.push({
                  title: `${ronda.descripcionModulo}`,
                  start: fechaCierre.toISOString().split('T')[0],
                  end: fechaLimiteVotacion.toISOString().split('T')[0],
                  color: '#578e73'
                });
              }

              if (ahora <= fechaPresentacion) {
                // Evento de presentación de la charla
                const eventoPresentacion = {
                  title: `${ronda.descripcionModulo}`,
                  date: fechaPresentacion.toISOString().split('T')[0],
                  color: '#314B78',
                };

                events.push(eventoPresentacion);

                // Añadir directamente a eventosPresentaciones
                this.eventosPresentaciones.push(eventoPresentacion);
                this.eventosPresentaciones.sort((a, b) => new Date(a.date) - new Date(b.date));
              }

              // Verificar si la fecha actual está entre fechaLimiteVotacion y fechaPresentacion
              if (ahora >= fechaLimiteVotacion && ahora <= fechaPresentacion) {
                // Agregar la promesa a un array para esperar que todas se resuelvan
                rondasPromises.push(
                  serviceChar.getCharlasRonda(ronda.idRonda)
                    .then(charlasRonda => {
                      // Filtrar las charlas aceptadas (idEstadoCharla == 2)
                      const charlasAceptadas = charlasRonda.filter(charla => charla.idEstadoCharla === 2);
                      if (charlasAceptadas.length > 0) {
                        lanzarMensaje = true;
                      }
                    })
                    .catch(error => {
                      console.error('Error al obtener las charlas de la ronda:', error);
                    })
                );
              }
            });

            // Esperamos a que todas las promesas se resuelvan antes de proceder
            Promise.all(rondasPromises).then(() => {
              if (lanzarMensaje && this.$route.path === "/") {
                Swal.fire({
                  title: `Charlas aceptadas`,
                  text: 'Se han aceptado nuevas charlas en una de las rondas. Revisa si estás entre los seleccionados.',
                  icon: 'info',
                  confirmButtonText: 'Ir a charlas',
                  cancelButtonText: 'Vale',
                  showCancelButton: true, 
                  preConfirm: () => {
                    this.$router.push('/charlas');
                  },
                  reverseButtons: false  
                });
              }
            });

            // Actualizar variables de estado
            this.isRondaAbierta = isRondaAbierta;
            this.isVotacionActiva = isVotacionActiva;
            this.calendarOptions.events = events;

            // Si no hay rondas abiertas, no se puede subir charla
            if (!isRondaAbierta) {
              this.puedeSubirCharla = false;
            }

            this.cargando = false;
          })
          .catch(error => {
            console.error('Error al obtener los votos del alumno:', error);
            this.cargando = false;
          });
        })
        .catch(error => {
          console.error('Error al obtener las charlas del alumno:', error);
          this.cargando = false;
        });
      })
      .catch(error => {
        console.error('Error al obtener las rondas de charlas:', error);
        this.cargando = false;
      });
    },

    formatoMes(fecha) {
      const opciones = { month: 'long' };  // 'long' te da el nombre completo del mes, 'short' lo da abreviado.
      return new Date(fecha).toLocaleDateString('es-ES', opciones).replace(/^./, letra => letra.toUpperCase());
    },

    actualizarContenidoProfe() {
      this.evaluarAlumnos();
    },

    actualizarContenido() {
      this.evaluarRondas();
    },

    evaluarAlumnos(){
      this.cargando = true;
      servicePerf.getRondasProfesor()
      .then(rondas => {
        // Obtenemos la fecha actual
        const fechaActual = new Date();

        // Filtramos las rondas con fecha de presentación futura
        this.presentacionesPendientes = rondas
        .filter(ronda => new Date(ronda.fechaPresentacion) > fechaActual) 
        .map(({ idRonda, fechaPresentacion, descripcionModulo }) => ({
          idRonda,
          fechaPresentacion,
          descripcionModulo
        }))
        .sort((a, b) => new Date(a.fechaPresentacion) - new Date(b.fechaPresentacion)); 

        this.rondasProfe = rondas;
        this.cargando = false;
      })
      .catch(error => {
        console.error('Error al obtener las rondas de un profesor:', error);
        this.cargando = false;
      });
    },

    toggleMostrarTodos() {
      this.mostrarTodos = !this.mostrarTodos;
    },

    async editarRonda(idRonda) {
      // Buscar la ronda a editar
      const ronda = this.rondasProfe.find(r => r.idRonda === idRonda);
      if (!ronda) return;

      // Mostrar el formulario con SweetAlert2
      const { isConfirmed, isDenied, value } = await Swal.fire({
        title: 'Editar Ronda',
        html: `
          <div style="text-align: left; display: flex; flex-direction: column; gap: 15px; width: 100%;">
            <label for="swal-descripcion">Descripción: <span class="text-danger">*</span></label>
            <input id="swal-descripcion" class="swal2-input m-0" style="width: 100%; box-sizing: border-box;" value="${ronda.descripcionModulo || ''}">
            <label for="swal-duracion">Duración (minutos): <span class="text-danger">*</span></label>
            <input id="swal-duracion" type="number" class="swal2-input m-0" style="width: 100%; box-sizing: border-box;" value="${ronda.duracion || ''}">
            <label for="swal-fechacierre">Fecha cierre: <span class="text-danger">*</span></label>
            <input id="swal-fechacierre" type="date" class="swal2-input m-0" style="width: 100%; box-sizing: border-box;" 
              value="${ronda.fechaCierre ? ronda.fechaCierre.split('T')[0] : ''}" 
              min="${new Date().toISOString().split('T')[0]}"
            >
            <label for="swal-fechalimitevotacion">Fecha límite votación: <span class="text-danger">*</span></label>
            <input id="swal-fechalimitevotacion" type="date" class="swal2-input m-0" style="width: 100%; box-sizing: border-box;" 
              value="${ronda.fechaLimiteVotacion ? ronda.fechaLimiteVotacion.split('T')[0] : ''}" 
              min="${ronda.fechaCierre ? ronda.fechaCierre.split('T')[0] : new Date().toISOString().split('T')[0]}"
            >
            <label for="swal-fechapresentacion">Fecha presentación: <span class="text-danger">*</span></label>
            <input id="swal-fechapresentacion" type="date" class="swal2-input m-0" style="width: 100%; box-sizing: border-box;" 
              value="${ronda.fechaPresentacion ? ronda.fechaPresentacion.split('T')[0] : ''}" 
              min="${ronda.fechaLimiteVotacion ? ronda.fechaLimiteVotacion.split('T')[0] : (ronda.fechaCierre ? ronda.fechaCierre.split('T')[0] : new Date().toISOString().split('T')[0])}" 
            >
          </div>
        `,
        showCancelButton: true,
        showDenyButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: '<i class="fa-solid fa-check"></i> Actualizar',
        denyButtonText: '<i class="fa-solid fa-trash-can"></i> Eliminar',
        preConfirm: () => {
          // Obtener los valores de los campos
          const idCursoUsuario = ronda.idCursoUsuario;
          const descripcionModulo = document.getElementById('swal-descripcion').value;
          const duracion = parseInt(document.getElementById('swal-duracion').value, 10);
          const fechaPresentacion = document.getElementById('swal-fechapresentacion').value;
          const fechaCierre = document.getElementById('swal-fechacierre').value;
          const fechaLimiteVotacion = document.getElementById('swal-fechalimitevotacion').value;

          // Hacer un console.log para ver los valores obtenidos
          console.log('Descripción:', descripcionModulo);
          console.log('Duración:', duracion);
          console.log('Fecha de Presentación:', fechaPresentacion);
          console.log('Fecha de Cierre:', fechaCierre);
          console.log('Fecha Límite de Votación:', fechaLimiteVotacion);

          // Validar que todos los campos están completos
          if (!descripcionModulo || !duracion || !fechaPresentacion || !fechaCierre || !fechaLimiteVotacion) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Todos los campos son obligatorios.'
            });
            return null;  // Retornar null para evitar continuar
          }

          // Retornar los valores para ser usados después
          return {
            idCursoUsuario,
            descripcionModulo,
            duracion,
            fechaPresentacion,
            fechaCierre,
            fechaLimiteVotacion
          };
        }
      });

      // Si se confirma la actualización
      if (isConfirmed && value) {
        // Validación de fechas
        const fechaCierre = new Date(value.fechaCierre);
        const fechaLimiteVotacion = new Date(value.fechaLimiteVotacion);
        const fechaPresentacion = new Date(value.fechaPresentacion);

        // Validar que la fecha de límite de votación no sea antes de la fecha de cierre
        if (fechaLimiteVotacion < fechaCierre) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'La fecha límite de votación no puede ser antes de la fecha de cierre.'
          });
          return;
        }

        // Validar que la fecha de presentación no sea antes de la fecha límite de votación
        if (fechaPresentacion < fechaLimiteVotacion) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'La fecha de presentación no puede ser antes de la fecha límite de votación.'
          });
          return;
        }

        // Llamar a la función de actualización con los datos
        const rondaActualizada = {
          idRonda,
          idCursoUsuario: value.idCursoUsuario,
          fechaPresentacion: new Date(value.fechaPresentacion).toISOString(),
          fechaCierre: new Date(value.fechaCierre).toISOString(),
          duracion: value.duracion,
          descripcionModulo: value.descripcionModulo,
          fechaLimiteVotacion: new Date(value.fechaLimiteVotacion).toISOString()
        };

        try {
          await this.actualizarRonda(rondaActualizada);
          Swal.fire({
            icon: 'success',
            title: 'Actualización exitosa',
            text: 'La ronda ha sido actualizada correctamente.'
          });
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al actualizar la ronda. Intente nuevamente.'
          });
        }

      } else if (isDenied) {
        // Confirmar la eliminación
        const confirmDelete = await Swal.fire({
          title: '¿Estás seguro?',
          text: "Esta acción eliminará la ronda permanentemente.",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Eliminar',
          cancelButtonText: 'Cancelar'
        });

        if (confirmDelete.isConfirmed) {
          await this.eliminarRonda(idRonda);
        }
      }
    },


    async actualizarRonda(ronda) {
      try {
        await servicePerf.updateRonda(ronda);
        Swal.fire('Actualizado', 'La ronda ha sido actualizada con éxito', 'success');
        this.evaluarAlumnos(); 
      } catch (error) {
        error
        Swal.fire('Error', 'Hubo un problema al actualizar la ronda', 'error');
      }
    },

    async eliminarRonda(idRonda) {
      try {
        // Llamada a la función para eliminar la ronda
        const response = await servicePerf.deleteRonda(idRonda);

        // Evaluar el estado de la respuesta del servidor
        if (response.status === 200 || response.status === 201) {
          Swal.fire('Eliminado', 'La ronda ha sido eliminada con éxito', 'success');
        } 
        
        this.evaluarAlumnos(); 
      } catch (error) {
        if (error.response) {
          // Manejar errores específicos
          if (error.response.status === 500) {
            Swal.fire({
              icon: 'error',
              title: 'No se pudo eliminar',
              text: 'Probablemente la ronda ya tiene charlas con votos registrados y no puede eliminarse.',
            });
          } else if (error.response.status === 404) {
            Swal.fire({
              icon: 'error',
              title: 'Ronda no encontrada',
              text: 'La ronda que intentas eliminar no existe o ya fue eliminada.',
            });
          } else {
            // Otro tipo de error HTTP
            Swal.fire({
              icon: 'error',
              title: `Error`,
              text: 'Ocurrió un problema inesperado. Vuelve a intentarlo más tarde.',
            });
          }
        } else {
          // Error sin respuesta del servidor (problema de red, CORS, etc.)
          Swal.fire({
            icon: 'error',
            title: 'Error de conexión',
            text: 'No se pudo conectar con el servidor. Verifica tu conexión a internet.',
          });
        }
      }
    },

    mostrarGrafico(tipo) {
      this.graficoSeleccionado = tipo;

      // Generar el gráfico correspondiente (placeholder para el código real)
      if (tipo === "rondas") {
        this.generarGraficoDoughnut();
      } else if (tipo === "alumnos") {
        this.generarGraficoLineal();
      }
    },

    generarGraficoLineal() {
      this.limpiarCanvas();
      this.loadChart = true;

      servicePerf.getAlumnosActivoProfesor()
        .then(response => {
          const data = response;

          // Verifica si hay alumnos
          if (!data || data.length === 0) {
            console.error('No hay alumnos en la respuesta');
            this.cargando = false;
            return;
          }

          // Filtrar solo alumnos válidos y extraer los datos relevantes
          const alumnos = data.filter(entry => entry.alumno.role === "ALUMNO" && entry.alumno.estadoUsuario === true)
                              .map(entry => ({
                                id: entry.alumno.idUsuario,
                                nombre: entry.alumno.usuario,
                                charlasPropuestas: entry.charlasPropuestas || 0,
                                charlasAceptadas: entry.charlasAceptadas || 0,
                              }));

          // Preparar los datos para el gráfico de líneas
          const labels = alumnos.map(alumno => alumno.nombre);
          const propuestas = alumnos.map(alumno => alumno.charlasPropuestas);
          const aceptadas = alumnos.map(alumno => alumno.charlasAceptadas);

          // Encontrar el valor máximo entre charlas propuestas y aceptadas.
          const maxCharlasPropuestas = Math.max(...propuestas);
          const maxCharlasAceptadas = Math.max(...aceptadas);

          // El valor máximo para la escala Y será el máximo entre ambos más 1.
          const maxCharlas = Math.max(maxCharlasPropuestas, maxCharlasAceptadas) + 1;

          // Configurar los datos para el gráfico de líneas
          const lineData = {
            labels: labels, 
            datasets: [
              {
                label: 'Charlas Propuestas',
                data: propuestas, 
                fill: false, 
                borderColor: 'rgba(255, 99, 132, 1)', 
                tension: 0.1,
              },
              {
                label: 'Charlas Aceptadas',
                data: aceptadas, 
                fill: false,
                borderColor: 'rgba(75, 192, 192, 1)', 
                tension: 0.1,
              }
            ]
          };

          // Mostrar el gráfico de tipo lineal en un canvas
          this.$nextTick(() => {
            const ctx = document.getElementById('chart').getContext('2d');
            if (ctx) {
              this.chartInstance = new Chart(ctx, {
                type: 'line',
                data: lineData,
                options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true, 
                      max: maxCharlas, 
                    }
                  },
                  plugins: {
                    title: {
                      display: true,
                      text: 'Alumnos', 
                      font: {
                        size: 20, 
                        weight: 'bold', 
                        family: 'Arial', 
                      },
                      padding: {
                        top: 10,
                        bottom: 20,
                      }
                    },
                    legend: {
                      position: 'top', 
                    },
                    tooltip: {
                      enabled: true,
                    },
                  },
                },
              });
            } else {
              console.error("Error: No se pudo obtener el contexto del gráfico lineal.");
              this.loadChart = false;
            }
          });

          this.loadChart = false; 
        })
        .catch(error => {
          console.error('Error al obtener los alumnos de un profesor:', error);
          this.loadChart = false;
        });
    },

    generarGraficoDoughnut() {
      this.limpiarCanvas();
      this.loadChart = true;

      servicePerf.getAlumnosActivoProfesor()
        .then(response => {
          const data = response;

          // Verifica si hay alumnos
          if (!data || data.length === 0) {
            console.error('No hay alumnos en la respuesta');
            this.cargando = false;
            return;
          }

          // Filtrar solo alumnos válidos y extraer los datos relevantes
          const alumnos = data.filter(entry => entry.alumno.role === "ALUMNO" && entry.alumno.estadoUsuario === true)
                              .map(entry => ({
                                id: entry.alumno.idUsuario,
                                nombre: entry.alumno.usuario,
                                charlas: entry.charlas || [], // Lista de charlas del alumno
                              }));

          // Crear un mapa para contar el número de charlas por ronda
          const charlasPorRonda = {};

          this.rondasProfe.forEach(ronda => {
            const { idRonda, descripcionModulo } = ronda;

            // Inicializa el contador de charlas para cada ronda
            if (!charlasPorRonda[idRonda]) {
              charlasPorRonda[idRonda] = {
                descripcion: descripcionModulo,
                count: 0,
              };
            }

            // Sumar las charlas asociadas a esta ronda
            alumnos.forEach(alumno => {
              const charlasRonda = alumno.charlas.filter(charla => charla.idRonda === idRonda);
              charlasPorRonda[idRonda].count += charlasRonda.length;
            });
          });

          // Preparar los datos para el gráfico de doughnut
          const labels = Object.values(charlasPorRonda).map(r => r.descripcion || `Ronda ${r.idRonda}`);
          const dataDoughnut = Object.values(charlasPorRonda).map(r => r.count);

          const doughnutData = {
            labels: labels,
            datasets: [
              {
                label: 'Número de Charlas',
                data: dataDoughnut,
                backgroundColor: [
                  'rgba(255, 99, 132, 0.5)',  // 1
                  'rgba(54, 162, 235, 0.5)',  // 2
                  'rgba(255, 206, 86, 0.5)',  // 3
                  'rgba(75, 192, 192, 0.5)',  // 4
                  'rgba(153, 102, 255, 0.5)',  // 5
                  'rgba(255, 159, 64, 0.5)',  // 6
                  'rgba(255, 99, 71, 0.5)',   // 7
                  'rgba(0, 255, 127, 0.5)',   // 8
                  'rgba(255, 165, 0, 0.5)',   // 9
                  'rgba(238, 130, 238, 0.5)', // 10
                  'rgba(255, 20, 147, 0.5)',  // 11
                  'rgba(0, 0, 255, 0.5)',     // 12
                  'rgba(255, 0, 255, 0.5)',   // 13
                  'rgba(34, 193, 195, 0.5)',  // 14
                  'rgba(253, 187, 45, 0.5)'   // 15
                ],
                borderColor: [
                  'rgba(255, 99, 132, 1)',  // 1
                  'rgba(54, 162, 235, 1)',  // 2
                  'rgba(255, 206, 86, 1)',  // 3
                  'rgba(75, 192, 192, 1)',  // 4
                  'rgba(153, 102, 255, 1)',  // 5
                  'rgba(255, 159, 64, 1)',  // 6
                  'rgba(255, 99, 71, 1)',   // 7
                  'rgba(0, 255, 127, 1)',   // 8
                  'rgba(255, 165, 0, 1)',   // 9
                  'rgba(238, 130, 238, 1)', // 10
                  'rgba(255, 20, 147, 1)',  // 11
                  'rgba(0, 0, 255, 1)',     // 12
                  'rgba(255, 0, 255, 1)',   // 13
                  'rgba(34, 193, 195, 1)',  // 14
                  'rgba(253, 187, 45, 1)'   // 15
                ],
                borderWidth: 1,
              },
            ],
          };

          // Mostrar el gráfico de tipo doughnut en un canvas
          this.$nextTick(() => {
            const ctx = document.getElementById('chart').getContext('2d');
            if (ctx) {
              this.chartInstance = new Chart(ctx, {
                type: 'doughnut',
                data: doughnutData,
                options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    title: {
                      display: true,
                      text: 'Rondas', 
                      font: {
                        size: 20, 
                        weight: 'bold', 
                        family: 'Arial', 
                      },
                      padding: {
                        top: 10,
                        bottom: 20,
                      }
                    },
                    legend: {
                      position: 'top', // Posición de la leyenda
                    },
                    tooltip: {
                      enabled: true, // Habilitar tooltips
                    },
                  },
                },
              });
            } else {
              console.error("Error: No se pudo obtener el contexto del gráfico doughnut.");
              this.loadChart = false;
            }
          });

          this.loadChart = false;
        })
        .catch(error => {
          console.error('Error al obtener los alumnos de un profesor:', error);
          this.loadChart = false;
        });
    },

    limpiarCanvas() {
      // Verifica si ya existe una instancia del gráfico
      if (this.chartInstance) {
        this.chartInstance.destroy();
      }

      // Obtén el canvas por su ID
      const canvas = document.getElementById('chart');
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      } 
    },

    limpiarGrafico() {
      this.graficoSeleccionado = null;
      this.limpiarCanvas();
    },

    watch: {
      'calendarOptions.events': {
        handler(newEvents) {
          this.eventosPresentaciones = newEvents.filter(evento => evento.color === '#314B78');
        },
        immediate: true,
        deep: true
      }
    },
  },
}
</script>

<style scoped>
  .container{
    padding:55px 20px 0px 20px;
    margin-top: 0px !important;
    margin-bottom: 30px !important;
    border-radius: 18px;
    color: inherit;
  }

  .active-card {
    transition: box-shadow 0.3s ease-in-out;
  }

  .active-card:hover {
    box-shadow: 0 15px 30px -15px rgba(213, 206, 188, 0.55);
  }

  .color-box {
    width: 20px;
    height: 20px;
    border-radius: 50%;
  }

  span {
    font-size: 16px;
  }

  .parent-container {
    overflow-x: auto;
    width: 100%;
  }

  .calendar-wrapper {
    overflow-x: auto;
    width: 100%;
    max-width: 100%;
    min-width: 510px;
  }

  #barChart{
    height: 400px;
    width: 400px;
  }

  .custom-card {
    background-color: #f9f5ec; 
    border-radius: 15px; 
    position: relative; 
    overflow: hidden; 
    padding-top: 44px; 
    transition: all 0.3s ease;
  }

  .card-header{
    width: 100%;
    background-color: #FDFAFA;
    height: 43px;
    position: absolute;
    top: 0;
    left: 0;
  }

  .tab-header {
    position: absolute;
    top: 0;
    left: 0;
    background-color: #F5ECD5; 
    padding: 8px 24px;
    border-radius: 16px 16px 0 0; 
    font-size: 18px; 
    font-weight: bold;
    color: #333; 
    text-align: center;
    box-shadow: 2px 2px 4px #e2dbc787; 
    transition: background-color 0.3s ease;
  }

  .active-tab {
    background-color: #F5ECD5; 
  }

  .inactive-tab {
    background-color: #F5ECD5; 
  }

  div.card-body {
    padding: 20px;
    text-align: center;
    border: 2px solid #e2dbc787; 
    min-height: 175px;
    display: flex;
    flex-direction: column; 
    justify-content: center; 
    align-items: center; 
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important; 
  }

  div.card-body:hover {
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2) !important; /* Sombra más fuerte al hacer hover */
  }

  .card-title {
    font-size: 18px; 
    color: #333; 
    margin-bottom: 12px; 
    font-weight: bold;
  }

  .card-text {
    font-size: 17px;
    color: #555; 
    margin-bottom: 16px;
  }

  .btn {
    height: 35px;
  }

  ::v-deep(.btn-primary) {
    background-color: #527c58 !important; 
    border: none;
    color: white;
    border-radius: 8px;
    cursor: pointer;
  }

  ::v-deep(.btn-primary:active) {
    border-color: #40685c !important;
    background-color: #527c58 !important;
  }

  ::v-deep(.btn-primary:hover) {
    border-color: #40685c !important;
    background-color: #578e73 !important;
  }

  .btn-mover {
    background-color: #314B78 !important; 
    border: none;
    color: white;
    border-radius: 8px;
    cursor: pointer;
  }

  .btn-mover:active {
    border-color: #314B78 !important;
    background-color: #41619a !important;
    color: white;
  }

  .btn-mover:hover {
    border-color: #314B78 !important;
    background-color: #41619a !important;
    color: white;
  }

  ::v-deep(.btn-secondary) {
    background-color: #6a8d92 !important;
    border: none;
    color: white;
    border-radius: 8px;
  }

  ::v-deep(.btn-secondary:hover) {
    background-color: #577478 !important;
  }

  ::v-deep(.btn-secondary:active) {
    background-color: #577478 !important;
  }

  ::v-deep(button.fc-today-button.fc-button.fc-button-primary) {
    background-color: #40685c;
    border-color: #40685c;
    color: white;
  }

  ::v-deep(button.fc-today-button.fc-button.fc-button-primary:hover:not(:disabled)) {
    background-color: #578e73;
    border-color: #578e73;
    color: white;
  }

  ::v-deep(.fc-prev-button.fc-button.fc-button-primary){
    background-color: #40685c;
    border-color: #40685c;
    color: white;
  }

  ::v-deep(.fc-next-button.fc-button.fc-button-primary){
    background-color: #40685c;
    border-color: #40685c;
    color: white;
  }

  ::v-deep(
    .fc-prev-button.fc-button.fc-button-primary:hover, 
    .fc-prev-button.fc-button.fc-button-primary:active
  ){
    border-color: #578e73;
    background-color: #578e73;
    color: white;
  }

  ::v-deep(
    .fc-next-button.fc-button.fc-button-primary:hover,
    .fc-next-button.fc-button.fc-button-primary:active
  ){
    border-color: #578e73;
    background-color: #578e73;
    color: white;
  }

  ::v-deep(.fc-next-button.fc-button.fc-button-primary){
    background-color: #436c60;
    border-color: #436c60;
    color: white;
  }

  ::v-deep(.fc-toolbar-title::first-letter){
    text-transform: uppercase;
  }

  ::v-deep(.fc-scrollgrid.fc-scrollgrid-liquid){
    background-color: white;
    padding-bottom: 3px;
  }

  ::v-deep(.fc-daygrid-day-frame.fc-scrollgrid-sync-inner){
    min-height: 95px;
  }

  ::v-deep(.fc-col-header-cell.fc-day){
    background-color: #20324e;
  }
  ::v-deep(.fc-col-header-cell-cushion){
    color: white;
    font-weight: bold;
    text-decoration: none;
  }

  ::v-deep(.fc-daygrid-day-number){
    color: #20324e;
    cursor: pointer;
  }

  ::v-deep(.fc-daygrid-day.fc-day-today){
    background-color: #F5ECD5;
  }

  .list-group-item {
    background-color: #ced7e7;
    border: 1px solid #314b7882;
    /* background-color: #f9f5ec;
    border: 2px solid #F5ECD5; */
    border-radius: 8px;
    margin-bottom: 10px;
    padding: 10px 15px;
    display: flex; /* Para asegurar que el contenedor sea flexible */
    flex-direction: row; /* Alinea el contenido horizontalmente */
    align-items: center; /* Centra verticalmente */
    justify-content: space-between; /* Espacia los elementos */
  }

  .badge {
    background-color: #314B78;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
  }

  .espacio-150{
    margin-top: 10px;
  }

  @media (min-width: 992px) {
    .espacio-150 {
      margin-top: 149px;
    }
  } 

  .mensaje-vacio {
    font-size: 1.2rem;
    font-weight: 500;
    text-align: center;
    color: #6c757d;
  }

  .spinner-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 100; /* Asegura que el spinner quede encima del gráfico */
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }

  .grafico-container {
    background-color: #f4f4f4; /* Fondo gris */
    border: 2px solid #e0e0e0; /* Borde claro */
    border-radius: 10px; /* Bordes redondeados */
    padding: 20px; /* Espaciado interno */
    min-height: 300px; /* Altura mínima */
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }

  .grafico-wrapper {
    position: relative;
    display: block;
    width: 100%;
    height: 460px; 
    overflow-x: auto; 
    overflow-y: hidden;
  }

  .grafico-responsive {
    width: 100%;
    min-width: 550px; 
  }

  #chart {
    width: 100% !important;
    height: 460px; 
  }

  @media (max-width: 768px) {
    #chart {
      height: auto; 
      min-height: 460px;
    }

    .grafico-responsive, .grafico-wrapper {
      height: auto; 
      min-height: 200px; 
    }

    .spinner-container {
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }

  div:where(.swal2-container) input:where(.swal2-input):focus, 
  div:where(.swal2-container) input:where(.swal2-file):focus, 
  div:where(.swal2-container) textarea:where(.swal2-textarea):focus {
      border: 1px solid #4CAF50 !important; /* Borde verde */
      outline: none;
      box-shadow: inset 0 1px 1px rgba(0,0,0,.06), 0 0 0 3px rgba(76, 175, 80, 0.5) !important; /* Sombra verde */
  }


</style>