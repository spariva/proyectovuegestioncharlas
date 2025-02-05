<template>
  <!-- Botón con un spinner mientras se actualizan los estados -->
  <button class="btn btn-mover mt-2" @click.prevent="actualizarEstados" :disabled="cargando">
    <span v-if="cargando" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    <span v-else>Actualizar estados</span>
  </button>
</template>

<script>
import CharlasService from "@/services/CharlasService";
import PerfilService from "@/services/PerfilService";
import Swal from 'sweetalert2';

export default {
    data() {
        return {
            serviceChar: new CharlasService(),
            servicePerf: new PerfilService(),
            cargando: false,
        };
    },
    methods: {
        async actualizarEstados() {
            try {
                this.cargando = true;

                // Paso 1: Obtener rondas activas
                const rondas = await this.serviceChar.getRondas();

                const fechaActual = new Date();
                const rondasActivas = rondas.filter((ronda) => {
                    const fechaPresentacion = new Date(ronda.fechaPresentacion);
                    const fechaLimiteVotacion = new Date(ronda.fechaLimiteVotacion);
                    return fechaActual < fechaPresentacion && fechaActual > fechaLimiteVotacion;
                });

                // Verificar si no hay rondas activas
                if (rondasActivas.length === 0) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'No hay rondas activas',
                        text: 'No hay rondas disponibles para actualizar los estados.',
                        confirmButtonText: 'Aceptar'
                    });
                    return; 
                }

                // Paso 2: Obtener los alumnos que no han tenido charlas aceptadas
                const alumnos = await this.servicePerf.getAlumnosActivoProfesor();

                // Filtramos a los alumnos que no tienen charlas aceptadas
                const alumnosSinCharlasAceptadas = alumnos.filter(alumno => alumno.charlasAceptadas === 0)
                                                            .map(alumno => ({
                                                                idUsuario: alumno.alumno.idUsuario,
                                                                nombre: alumno.alumno.usuario,
                                                                email: alumno.alumno.email,
                                                                charlasTotales: alumno.charlasTotales
                                                            }));

                // Paso 3: Procesar cada ronda activa
                for (const ronda of rondasActivas) {
                    const idRonda = ronda.idRonda;
                    let duracionDisponible = ronda.duracion;

                    // Obtener votos por ronda
                    const votosData  = await this.serviceChar.getVotosRonda(idRonda);
                    const votos = votosData.votos; 

                    // Obtener las charlas más votadas
                    const charlasMasVotadas = votos.sort((a, b) => b.votos - a.votos) // Ordenar de mayor a menor por cantidad
                                                   .slice(0, 5); // Tomar las 5 más votadas

                    // Ordenar por prioridad: dar primero a las charlas de alumnos sin charlas aceptadas
                    charlasMasVotadas.sort((a, b) => {
                        if (b.votos === a.votos) {
                            // Si los votos son iguales, damos prioridad a los alumnos sin charlas aceptadas
                            const esAAlumnoSinCharlas = alumnosSinCharlasAceptadas.includes(a.idUsuario) ? 1 : 0;
                            const esBAlumnoSinCharlas = alumnosSinCharlasAceptadas.includes(b.idUsuario) ? 1 : 0;

                            return esBAlumnoSinCharlas - esAAlumnoSinCharlas;
                        } else {
                            // Si no hay empate en votos, no se hace nada y se mantiene el orden por votos
                            return b.votos - a.votos;
                        } 
                    });

                    // Paso 4: Obtener charlas de la ronda
                    const charlas = await this.serviceChar.getCharlasRonda(idRonda);

                    // Seleccionar charlas más votadas que entren en el tiempo disponible
                    const charlasSeleccionadas = [];

                    for (const charlaData  of charlasMasVotadas) {
                        const charla = charlas.find((c) => c.idCharla === charlaData.idCharla);

                        // Si la charla existe y su duración no excede la duración disponible
                        if (charla) {
                            if (charla.tiempo <= duracionDisponible) {
                                charlasSeleccionadas.push({
                                    idCharla: charla.idCharla,
                                    idEstadoCharla: 2, // Estado "Aceptada"
                                });
                                duracionDisponible -= charla.tiempo; // Reducir la duración disponible
                            } 
                        } 
                    }

                    // Verificar si no hay charlas seleccionadas
                    if (charlasSeleccionadas.length === 0) {
                        Swal.fire({
                            icon: 'warning',
                            title: 'No se actualizaron charlas',
                            text: 'No hay charlas que cumplan con la duración disponible para ser actualizadas.',
                            confirmButtonText: 'Aceptar'
                        });
                        return; 
                    }

                    // Paso 5: Actualizar estado de las charlas seleccionadas
                    for (const charla of charlasSeleccionadas) {
                        await this.serviceChar.updateEstadoCharla(charla.idCharla, charla.idEstadoCharla);
                    }
                }

                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Estados actualizados",
                    showConfirmButton: false,
                    timer: 2000
                });
            } catch (error) {
                console.error("Error al actualizar estados:", error);

                Swal.fire({
                    icon: 'error',
                    title: 'Ocurrió un error al actualizar los estados',
                    text: 'Revisa la consola para más detalles.',
                    confirmButtonText: 'Aceptar'
                });
            }
            finally {
                // Desactivar el spinner al finalizar
                this.cargando = false;
            }
        },
    },
};
</script>

<style>
/* Estilo opcional */
.btn {
  margin-top: 20px;
}
</style>
