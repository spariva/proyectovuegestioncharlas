<template>
  <div class="d-inline">
        <!-- Botón para abrir el modal -->
        <button type="button" class="btn btn-primary ms-1" data-bs-toggle="modal" data-bs-target="#votarModal">
            Crear ronda
        </button>
  
        <!-- Modal para crear ronda -->
        <div class="modal fade" id="votarModal" tabindex="-1" aria-labelledby="votarModalLabel" aria-hidden="true" data-bs-backdrop="static">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="votarModalLabel">Crear ronda</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" id="cierraFormRonda" @click="resetForm()"></button>
                </div>
                <div class="modal-body">
                    <!-- Formulario de voto -->
                    <form @submit.prevent="crearRonda">
                        <!-- Primera fila -->
                        <div class="row row-cols-1 row-cols-md-2 gy-4 text-black text-start">
                            <!-- Fecha de Presentación -->
                            <div class="col">
                                <label for="fechaPresentacion" class="form-label mb-3">Fecha de presentación: <span class="text-danger">*</span></label>
                                <input
                                type="date"
                                id="fechaPresentacion"
                                v-model="form.fechaPresentacion"
                                class="form-control mb-1"
                                :min="fechaActual"
                                required
                                />
                                <small class="text-danger"><b>Nota:</b> Es la fecha en la que debe realizarse la charla.</small>
                            </div>
                            <!-- Fecha de Cierre -->
                            <div class="col">
                                <label for="fechaCierre" class="form-label mb-3">Fecha de cierre: <span class="text-danger">*</span></label>
                                <input
                                type="date"
                                id="fechaCierre"
                                v-model="form.fechaCierre"
                                class="form-control mb-1"
                                :min="fechaActual"
                                required
                                />
                                <small class="text-danger"><b>Nota:</b> Es la última fecha para proponer charlas.</small>
                            </div>
                            <!-- Fecha Límite de Votación -->
                            <div class="col">
                                <label for="fechaLimiteVotacion" class="form-label mb-3">Fecha límite de votación: <span class="text-danger">*</span></label>
                                <input
                                type="date"
                                id="fechaLimiteVotacion"
                                v-model="form.fechaLimiteVotacion"
                                class="form-control mb-1"
                                :min="fechaActual"
                                required
                                />
                                <small class="text-danger"><b>Nota:</b> Es el período para votar, desde la fecha de cierre.</small>
                            </div>
                            <!-- Duración -->
                            <div class="col">
                                <label for="duracion" class="form-label mb-3">Duración (minutos): <span class="text-danger">*</span></label>
                                <input
                                    type="number"
                                    id="duracion"
                                    v-model="form.duracion"
                                    class="form-control"
                                    required
                                    min="1"
                                    max="300"
                                />
                            </div>
                            <!-- Descripción del Módulo -->
                            <div class="col-12 w-100">
                                <label for="descripcionModulo" class="form-label mb-3">Nombre del módulo: <span class="text-danger">*</span></label>
                                <input
                                type="text"
                                id="descripcionModulo"
                                v-model="form.descripcionModulo"
                                class="form-control"
                                required
                                maxlength="255"
                                />
                            </div>
                        </div>
                        <!-- Botón -->
                        <div class="text-center mt-4">
                        <button type="submit" class="btn btn-primary" :disabled="isLoading">
                            <span
                            v-if="isLoading"
                            class="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                            ></span>
                            Crear ronda
                        </button>
                        </div>
                    </form>
                </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Swal from "sweetalert2";
import CharlasService from '@/services/CharlasService';
const serviceCharlas = new CharlasService();

export default {
    data(){
        return {
            form: {
                fechaPresentacion: '',
                fechaCierre: '',
                duracion: 0,
                descripcionModulo: '',
                fechaLimiteVotacion: ''
            },
            fechaActual: '',
            isLoading: false
        };
    },
    created() {
        const hoy = new Date();
        this.fechaActual = hoy.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    },
    methods: {
        crearRonda() {
            this.isLoading = true;

            // Validar que las fechas están correctamente ordenadas
            const { fechaPresentacion, fechaCierre, fechaLimiteVotacion } = this.form;

            if (!fechaPresentacion || !fechaCierre || !fechaLimiteVotacion) {
                Swal.fire({
                    icon: "error",
                    title: "Error de validación",
                    text: "Por favor, complete todas las fechas",
                });
                this.isLoading = false;
                return;
            }

            if (fechaCierre > fechaLimiteVotacion || fechaCierre > fechaPresentacion) {
                Swal.fire({
                    icon: "error",
                    title: "Error de validación",
                    text: "La fecha de cierre debe ser la más cercana",
                });
                this.isLoading = false;
                return;
            }

            if (fechaLimiteVotacion > fechaPresentacion) {
                Swal.fire({
                    icon: "error",
                    title: "Error de validación",
                    text: "La fecha límite de votación debe ser intermedia entre la fecha de cierre y la fecha de presentación",
                });
                this.isLoading = false;
                return;
            }

            if (fechaPresentacion <= fechaLimiteVotacion || fechaPresentacion <= fechaCierre) {
                Swal.fire({
                    icon: "error",
                    title: "Error de validación",
                    text: "La fecha de presentación debe ser la más lejana",
                });
                this.isLoading = false;
                return;
            }

            // Formatear las fechas al formato ISO 8601
            const formatearFecha = (fecha) => {
                const date = new Date(fecha);
                return date.toISOString();
            };

            // Crear el objeto con las fechas formateadas
            const rondaFormateada = {
                fechaPresentacion: formatearFecha(this.form.fechaPresentacion),
                fechaCierre: formatearFecha(this.form.fechaCierre),
                duracion: this.form.duracion,
                descripcionModulo: this.form.descripcionModulo,
                fechaLimiteVotacion: formatearFecha(this.form.fechaLimiteVotacion),
            };
            
            serviceCharlas.setRonda(rondaFormateada)
            .then(response => {
                console.log('Charlas cargadas:', response);
                this.form = {
                    fechaPresentacion: '',
                    fechaCierre: '',
                    duracion: 0,
                    descripcionModulo: '',
                    fechaLimiteVotacion: ''
                };
                this.isLoading = false;
                document.getElementById('cierraFormRonda').click();
                this.$emit('evaluarRondas');
            })
            .catch(error => {
                this.isLoading = false;
                Swal.fire({
                    icon: "error",
                    title: "Error en la creación",
                    text: "No se ha podido crear la ronda, revise los datos enviados",
                });
                console.error('Error al crear la ronda profesor:', error);
            });
        },

        resetForm() {
            this.form = {
                fechaPresentacion: '',
                fechaCierre: '',
                duracion: 0,
                descripcionModulo: '',
                fechaLimiteVotacion: ''
            };
        },
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
</style>