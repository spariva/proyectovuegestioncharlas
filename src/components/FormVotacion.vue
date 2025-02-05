<template>
    <div class="d-inline">
        <!-- Botón para abrir el modal -->
        <button type="button" class="btn btn-primary ms-1 mt-2" data-bs-toggle="modal" data-bs-target="#votarModal">
            Votar Charla
        </button>
  
        <!-- Modal para votar charla -->
        <div class="modal fade" id="votarModal" tabindex="-1" aria-labelledby="votarModalLabel" aria-hidden="true" data-bs-backdrop="static">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="votarModalLabel">Votar Charla</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" @click="clearForm()"></button>
                </div>
                <div class="modal-body">
                    <!-- Formulario de voto -->
                    <form id="formCharla" @submit.prevent="submitVote">
                        <div class="row g-3">
                            <!-- ID Ronda -->
                            <div class="col-md-12">
                                <label for="idRonda" class="form-label">Rondas disponibles: <span class="text-danger">*</span></label>
                                <select class="form-select" v-model="form.idRonda" @change="this.changeRonda()" required>
                                    <option value="" disabled selected>--- Seleccionar ronda ---</option>
                                    <option v-for="ronda in rondasVotar" :key="ronda.id" :value="ronda.id">
                                    {{ ronda.descripcion }}
                                    </option>
                                </select>
                            </div>

                            <!-- ID Charla -->
                            <div class="col-md-12">
                                <label for="idCharla" class="form-label">Charlas por ronda: <span class="text-danger">*</span></label>       
                                <select class="form-select" v-model="form.idCharla" required>
                                    <option value="" disabled selected> 
                                        <!-- Si no hay ronda seleccionada, muestra un mensaje indicativo -->
                                        {{ form.idRonda === "" ? 'Seleccionar una ronda primero' : '--- Seleccionar charla ---' }}
                                    </option>
                                    <template v-if="form.idRonda">
                                        <!-- Mostrar opciones de charla solo si hay una ronda seleccionada -->
                                        <option v-for="charla in charlasDisponibles" :key="charla.idCharla" :value="charla.idCharla">
                                        {{ charla.titulo }}
                                        </option>
                                    </template>
                                </select>
                            </div>
                        </div>

                        <!-- Botón para votar -->
                        <button type="submit" class="btn btn-primary mt-3 ms-1" @click="submitVote()">Votar</button>
                    </form>
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
                idCharla: "",
                idRonda: ""
            },
            rondasDisponibles: [],
            rondasVotar: [],
            charlasDisponibles: [],
        };
    },
    mounted(){
        serviceChar.getRondas()
        .then(response => {
            const rondas = response;
            
            serviceChar.getVotosAlumno()
            .then(votosAlumno => {
                const fechaActual = new Date();

                // Filtrar rondas abiertas antes de la fecha de cierre
                this.rondasDisponibles = rondas
                .filter(ronda => new Date(ronda.fechaCierre + 'Z') < fechaActual && new Date(ronda.fechaLimiteVotacion + 'Z') >= fechaActual)
                .map(ronda => ({
                    id: ronda.idRonda,
                    descripcion: ronda.descripcionModulo,
                    fechaPresentacion: ronda.fechaPresentacion,
                    tiempo: ronda.duracion
                }));

                // Filtrar rondas activas para votar, asegurándose de que el alumno no haya votado aún
                this.rondasVotar = this.rondasDisponibles.filter(ronda => {
                    // Verificar si el alumno ya votó en esa ronda
                    const votoEnRonda = votosAlumno.some(voto => voto.idRonda === ronda.idRonda);
                    // Solo añadir la ronda a las rondas para votar si el alumno no ha votado aún
                    return !votoEnRonda;
                });
            })
            .catch(error => {
                console.error("Error al obtener los votos del alumno:", error);
            });
        })
        .catch(error => {
            console.error('Error al obtener las rondas de charlas en new charla:', error);
        });
    },
    methods: {
        submitVote() {
            Swal.fire({
                title: '¿Estás seguro?',
                text: "Una vez que votes no podrás modificar tu voto y solo tienes un voto por ronda.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, votar',
                cancelButtonText: 'Cancelar',
            }).then((result) => {
                if (result.isConfirmed) {

                    // Si el usuario confirma, procede a enviar el voto usando el servicio
                    serviceChar.setVoto(this.form.idRonda, this.form.idCharla)
                    .then(response => {
                        response
                        Swal.fire(
                            'Votado!',
                            'Tu opinión ha sido registrada.',
                            'success'
                        );
                        this.clearForm();
                    })
                    .catch(error => {
                        error
                        // Error al votar
                        Swal.fire(
                            'Error al votar',
                            'Hubo un problema. Por favor, inténtalo de nuevo.',
                            'error'
                        );
                    });
                }
            });
        },
        clearForm() {
            this.form = {
                idCharla: "",
                idRonda: ""
            };
        },
        changeRonda(){
            serviceChar.getCharlasRonda(this.form.idRonda)
            .then(data => {
                this.charlasDisponibles = data;
            })
            .catch(error => {
                console.error("Error al obtener las charlas para votar:", error);
            });
        }
    }
}
</script>

<style scoped>
    .modal {
        --bs-modal-border-color: none;
    }

    .modal-header{
        background-color: #578e73;
        color: white;
    }

    label{
        display: block;
        text-align: left;
    }

    input:focus:not([type="range"]), 
    textarea:focus, 
    select:focus {
        outline: none; 
        border-color: #578e73; 
        box-shadow: 0 0 5px rgba(40, 167, 69, 0.5); 
    }
</style>