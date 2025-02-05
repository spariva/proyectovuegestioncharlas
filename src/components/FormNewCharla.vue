<template>
  <div>
    <!-- Button trigger modal -->
    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalCharla">
        Subir charla
    </button>

    <!-- Modal Principal (Crear Charla) -->
    <div class="modal fade" id="modalCharla" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="staticBackdropLabel">Registrar charla</h1>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" @click="clearForm()" id="cancelarFormNew"></button>
            </div>
            <div class="modal-body text-start">
                <form id="formCharla">
                    <div class="row g-3">
                        <!-- Título -->
                        <div class="col-md-12">
                        <label for="titulo" class="form-label">Título: <span class="text-danger">*</span></label>
                        <input type="text" class="form-control" id="titulo" v-model="form.titulo" required>
                        </div>

                        <!-- Descripción -->
                        <div class="col-md-12">
                        <label for="descripcion" class="form-label">Descripción: <span class="text-danger">*</span></label>
                        <textarea class="form-control" id="descripcion" v-model="form.descripcion" required></textarea>
                        </div>

                         <!-- Fecha Propuesta -->
                         <div class="col-md-6">
                            <label for="fechaPropuesta" class="form-label">Fecha propuesta: <span class="text-danger">*</span></label>
                            <input
                                type="date"
                                class="form-control"
                                id="fechaPropuesta"
                                v-model="form.fechaPropuesta"
                                :min="fechaPropuesta"
                                disabled
                                required
                            />
                        </div>

                        <!-- ID Ronda -->
                        <div class="col-md-6">
                        <label for="idRonda" class="form-label">Ronda disponible:</label>
                        <select class="form-select" v-model="form.idRonda" required>
                            <option value="" disabled selected>--- Seleccionar ---</option>
                            <option v-for="ronda in rondasDisponibles" :key="ronda.id" :value="ronda.id">
                            {{ ronda.descripcion }}
                            </option>
                        </select>
                        </div>

                        <!-- Tiempo -->
                        <div class="col-md-12">
                            <label for="tiempo" class="form-label">
                                Duración (en minutos): <span class="text-danger">*</span>
                            </label>
                            <div class="d-flex align-items-center justify-content-between">
                                <!-- Input tipo range -->
                                <input 
                                    type="range" 
                                    class="form-range" 
                                    min="1" 
                                    :max="maxTiempo" 
                                    step="1" 
                                    id="tiempo" 
                                    v-model="form.tiempo" 
                                    required 
                                    :disabled="!form.idRonda" 
                                />
                                <!-- Mostrar el valor de tiempo -->
                                <span style="font-weight: bold; font-size: 1em; width: 100px; padding-left: 20px;">{{ form.tiempo }} mins</span>
                            </div>
                        </div>

                        <!-- Checkbox para agregar recurso con botón alineado a la derecha -->
                        <div class="col-md-12 mt-4 d-flex align-items-center justify-content-between">
                            <!-- Checkbox -->
                            <div>
                                <input type="checkbox" id="tieneRecursos" class="form-check-input" v-model="tieneRecursos">
                                <label for="tieneRecursos" class="form-label ms-2">Agregar recursos</label>
                            </div>

                            <!-- Botón (solo se muestra si tieneRecursos es verdadero) -->
                            <button v-if="tieneRecursos" type="button" class="btn btn-secondary mt-0" data-bs-toggle="modal" data-bs-target="#modalRecursos">
                                <i class="fa-solid fa-plus"></i>
                            </button>
                        </div>

                        <!-- Sección de recursos añadidos -->
                        <div v-if="recursos.length > 0 && tieneRecursos">
                            <h5 class="mt-0">Recursos añadidos:</h5>
                            <ul class="list-group">
                                <li v-for="(recurso, index) in recursos" :key="index" class="list-group-item">
                                {{ recurso.nombre }} - <a :href="recurso.url" target="_blank">Ver recurso</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="submit" class="btn btn-primary mt-1" form="formCharla" @click.prevent="submitCharla">Subir</button>
            </div>
            </div>
        </div>
    </div>

    <!-- Modal Secundario (Agregar Recurso) -->
    <div class="modal fade" id="modalRecursos" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="modalRecursosLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="modalRecursosLabel">Agregar Recurso</h1>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body text-start">
                <form id="formRecurso">
                <div class="row g-3">
                    <div class="col-md-12">
                        <label for="nombreRecurso" class="form-label">Nombre:</label>
                        <input type="text" class="form-control" id="nombreRecurso" v-model="formRecurso.nombre" placeholder="Ej. Documento de referencia" required>
                    </div>
                    <div class="col-md-12">
                        <label for="urlRecurso" class="form-label">URL:</label>
                        <input type="url" class="form-control" id="urlRecurso" v-model="formRecurso.url" placeholder="Ej. https://www.ejemplo.com" required>
                    </div>
                    <div class="col-md-12">
                        <label for="descRecurso" class="form-label">Descripción:</label>
                        <textarea class="form-control" id="descRecurso" v-model="formRecurso.descripcion"  placeholder="Añade una breve descripción del recurso"></textarea>
                    </div>
                </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary mt-1" data-bs-toggle="modal" data-bs-target="#modalCharla">Atrás</button>
                <button type="submit" class="btn btn-primary mt-1" form="formRecurso" @click.prevent="agregarRecurso">Agregar</button>
            </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';
import CharlasService from '@/services/CharlasService';

const serviceChar = new CharlasService();

export default {
    data() {
        return {
            form: {
                titulo: "",
                descripcion: "",
                tiempo: 0,
                fechaPropuesta: this.getCurrentDate(),
                idRonda: "",
            },
            formRecurso: { 
                url: "", 
                nombre: "", 
                descripcion: "" 
            },
            rondasDisponibles: [],
            tieneRecursos: false,
            recursos: [],
            maxTiempo: 30
        };
    },
    mounted(){
        serviceChar.getRondas()
        .then(response => {
            const rondas = response;
            const fechaActual = new Date();

            // Filtrar rondas abiertas antes de la fecha de cierre
            this.rondasDisponibles = rondas
            .filter(ronda => new Date(ronda.fechaCierre) > fechaActual)
            .map(ronda => ({
                id: ronda.idRonda,
                descripcion: ronda.descripcionModulo,
                fechaPresentacion: ronda.fechaPresentacion,
                tiempo: ronda.duracion
            }));

            // Obtener las charlas del alumno
            serviceChar.getCharlasAlumno()
            .then(charlasResponse => {
                this.rondasDisponibles.forEach(ronda => {
                    ronda.puedeSubirCharla = this.puedeSubirCharlaEnRonda(ronda, charlasResponse);
                });

                // Filtrar solo las rondas donde el alumno pueda subir una charla
                this.rondasDisponibles = this.rondasDisponibles.filter(ronda => ronda.puedeSubirCharla);
            })
            .catch(error => {
                console.error("Error al obtener las charlas del alumno en new charla:", error);
            });
        })
        .catch(error => {
            console.error('Error al obtener las rondas de charlas en new charla:', error);
        });
    },
    methods: {
        puedeSubirCharlaEnRonda(ronda, charlas) {
            const charlasEnRonda = charlas.filter(charla => charla.charla.idRonda === ronda.id);
            return charlasEnRonda.length === 0 ? true : false;
        },

        getCurrentDate() {
            const today = new Date();
            const year = today.getFullYear();
            const month = ("0" + (today.getMonth() + 1)).slice(-2); 
            const day = ("0" + today.getDate()).slice(-2);
            return `${year}-${month}-${day}`;
        },

        isValidForm() {
            return (
                this.form.titulo.trim() !== "" &&
                this.form.descripcion.trim() !== "" &&
                this.form.tiempo > 0 &&
                this.form.fechaPropuesta !== "" &&
                this.form.idRonda !== ""
            );
        },

        async submitCharla() {
            if (!this.isValidForm()) {
                Swal.fire({
                    icon: "error",
                    title: "Campos incompletos",
                    text: "Por favor, asegúrate de rellenar los campos obligatorios.",
                });
                return;
            } 

            try {
                const charla = await serviceChar.setCharla(this.form);

                // Verificamos si tiene recursos
                if (this.tieneRecursos && this.recursos.length > 0) {
                    for (const recurso of this.recursos) {
                        await serviceChar.setRecurso({ ...recurso, idCharla: charla.idCharla });
                    }
                }

                Swal.fire({
                    title: "Charla registrada con éxito!",
                    icon: "success",
                    draggable: true
                })
                .then(() => {
                    document.getElementById('cancelarFormNew').click();
                    this.$emit('evaluarRondas');
                });
                
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "No se pudo crear la charla",
                    text: "Hubo un problema al intentar crear la charla. Por favor, inténtalo de nuevo más tarde.",
                });
            }
        },

        agregarRecurso() {
            // Validar que todos los campos estén llenos
            if (!this.formRecurso.nombre.trim() || !this.formRecurso.url.trim() || !this.formRecurso.descripcion.trim()) {
                Swal.fire({
                    icon: "error",
                    title: "Campos incompletos",
                    text: "Rellena todos los campos antes de agregar el recurso."
                });
                return;
            }

            // Expresión regular para validar una URL
            const urlPattern = /^https?:\/\/.+$/;
            if (!urlPattern.test(this.formRecurso.url.trim())) {
                Swal.fire({
                    icon: "error",
                    title: "URL inválida",
                    text: "Ingresa una URL válida que comience con \"https://\" o \"http://\", seguida del dominio y la extensión."
                });
                return;
            }

            // Agregar recurso si la validación es exitosa
            this.recursos.push({ ...this.formRecurso });

            // Limpiar formulario
            this.formRecurso = { url: "", nombre: "", descripcion: "" };
                    
            Swal.fire({
                icon: "success",
                title: "Recurso agregado",
                text: "El recurso se ha agregado correctamente."
            });
        },

        clearForm() {
            this.form = {
                titulo: "",
                descripcion: "",
                tiempo: 0,
                fechaPropuesta: "",
                idRonda: "",
            };

            this.formRecurso ={ 
                url: "", 
                nombre: "", 
                descripcion: "" 
            };

            this.tieneRecursos = false;
            this.recursos = [];
        },

        changeRangeMax(){
            if (this.form.idRonda) {
                // Encuentra la ronda seleccionada
                const rondaSeleccionada = this.rondasDisponibles.find(ronda => ronda.id === this.form.idRonda);

                // Actualiza maxTiempo basado en la ronda seleccionada
                if (rondaSeleccionada) {
                    console.log(rondaSeleccionada);
                    this.maxTiempo = rondaSeleccionada.tiempo;
                    this.form.tiempo = 0;
                } else {
                    this.form.tiempo = 0;
                    this.maxTiempo = 0; // Valor predeterminado si no encuentra la ronda
                }
            } else {
                this.form.tiempo = 0;
                this.maxTiempo = 0;
            }
        }
    }
}
</script>

<style scoped>
    .modal {
        --bs-modal-border-color: none;
    }

    .modal-header{
        background-color: #578e73 ;
        color: white;
    }

    input:focus:not([type="range"]), 
    textarea:focus, 
    select:focus {
        outline: none; 
        border-color: #578e73; 
        box-shadow: 0 0 5px rgba(40, 167, 69, 0.5); 
    }

    /* .form-range::-moz-range-thumb {
        width: 1rem;
        height: 1rem;
        -moz-appearance: none;
        appearance: none;
        background-color: #40685c;
        border: 0;
        border-radius: 1rem;
        -moz-transition: background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
        transition: background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
    } */

    .form-range::-webkit-slider-thumb {
        -webkit-appearance: none; /* Quitar el estilo predeterminado */
        appearance: none;
        width: 1rem;
        height: 1rem;
        background-color: #578e73;
        border: 0;
        border-radius: 1rem;
        box-shadow: 0 0 5px rgba(40, 167, 69, 0.5); 
        transition: background-color 0.15s ease-in-out, 
                    border-color 0.15s ease-in-out, 
                    box-shadow 0.15s ease-in-out;
        cursor: pointer;
    }

    .form-range:active::-webkit-slider-thumb {
        box-shadow: 0 0 10px 3px rgba(40, 167, 69, 0.5); 
    }

    .form-range::-moz-range-thumb {
        width: 1rem;
        height: 1rem;
        -moz-appearance: none;
        appearance: none;
        background-color: #40685c; /* Color del "circulito" */
        border: 0;
        border-radius: 1rem;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
        transition: background-color 0.15s ease-in-out, 
                    border-color 0.15s ease-in-out, 
                    box-shadow 0.15s ease-in-out;
        cursor: pointer;
    }

    .form-range:active::-moz-range-thumb {
        box-shadow: 0 0 10px 3px rgba(40, 167, 69, 0.5); /* Sombra verde intensa al mover */
    }
</style>