<template>
<div>
    <i class="arrow-icon fa fa-arrow-left ml-10 mt-10"></i>
        <h1
            class="text-3xl font-extrabold text-center ">
            Ronda <span class="font-extrabold">{{ idRonda }}</span>
        </h1>
        <p class="text-center mb-0">Curso {{idCurso}} </p>
    <br>
    <br>
      <div class="row mt-lg-4 mt-2 pt-3">
        <!-- Columna izquierda: Presentaciones -->
        <div class="col-12 col-lg-6 mb-4 mb-lg-0 pe-lg-4">
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-semibold">Charlas Propuestas {{charlasPropuestas.length}}</h2>
                <div class="flex items-center space-x-2 bg-blue-200 text-blue-800 px-4 py-2 rounded-full">
                    <span class="font-bold">Votos Totales</span>
                    <span class="font-semibold text-xl">{{ votosPropuestos }} / {{ totalVotos }}</span>
                </div>
            </div>
            <div class="list-group scrollable-content">
                <div @dragover="onDragOver($event)"
                  @drop="onDrop($event, 'propuestas')"
                  class="list-group-item d-flex align-items-center draggable-item flex items-center p-4 bg-gray-100 shadow-md rounded-lg mb-4" draggable="true"
                  v-for="charla in charlasPropuestas" 
                  :key="charla.idCharla"
                  @click="onDragStart($event, charla)">
                      <img src=":charla.imagenCharla"  
                      onerror="this.src='https://cdn-icons-png.freepik.com/512/3415/3415488.png'" alt="Imagen Charla" class="w-16 h-16 object-cover rounded-full mr-4" />
                      <div class="flex justify-between w-full">
                          <div>
                              <h3 class="text-lg font-bold">{{ charla.titulo }}</h3>
                              <div class="flex items-center space-x-2">
                                  <div class="flex items-center space-x-2">
                                    <span v-if="charla.idEstadoCharla == 1"
                                    class="px-2 py-1 text-xs font-medium rounded-full bg-gray-200 text-gray-800">
                                          {{ charla.idEstadoCharla === 1 ? 'Propuesta' : charla.idEstadoCharla === 2 ?
                                          'Aceptada' : '' }}
                                    </span>
                                    <span v-if="charla.idEstadoCharla == 2"
                                    class="px-2 py-1 text-xs font-medium rounded-full bg-green-200 text-green-800">
                                          {{ charla.idEstadoCharla === 1 ? 'Propuesta' : charla.idEstadoCharla === 2 ?
                                          'Aceptada' : '' }}
                                    </span>                                  
                                  </div>
                                  <div class="flex items-center space-x-2">
                                      <span class="px-2 py-1 text-xs font-medium rounded-full bg-blue-200 text-blue-800">
                                          Votos: {{charla.votos}}
                                      </span>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
            </div>
        </div>        
        <!-- Columna derecha: Charlas aceptadas -->
        <div class="col-12 col-lg-6 mb-4 mb-lg-0 pe-lg-4">
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-semibold">Charlas Aceptadas {{charlasAceptadas.length}}</h2>
                <div class="flex items-center space-x-2 bg-blue-200 text-blue-800 px-4 py-2 rounded-full">
                    <span class="font-bold">Votos Totales</span>
                    <span class="font-semibold text-xl">{{ votosPropuestos }} / {{ totalVotos }}</span>
                </div>
            </div>
            <div class="list-group scrollable-content">
                  <div @dragover="onDragOver($event)"
                  @drop="onDrop($event, 'aceptadas')"
                  @click="onDragStart($event, charla)"
                  class="draggable-item flex items-center p-6 bg-gray-50 shadow-md rounded-lg mb-6 text-center cursor-pointer border-dashed border-2 border-blue-300">
                        <i class="fas fa-plus text-4xl text-gray-500"></i>
                        <p class="text-gray-600 ml-4">Arrastra aquí una charla para poder aceptarla</p>
                    </div>   
                <div @dragover="onDragOver($event)"
                  @drop="onDrop($event, 'aceptadas')"
                  class="list-group-item d-flex align-items-center draggable-item flex items-center p-4 bg-gray-100 shadow-md rounded-lg mb-4" 
                  draggable="true"
                  v-for="charla in charlasAceptadas" 
                  :key="charla.idCharla"
                  @click="onDragStart($event, charla)">
                      <img :src="charla.imagenCharla"  
                      onerror="this.src='https://cdn-icons-png.freepik.com/512/3415/3415488.png'" alt="Imagen Charla" class="w-16 h-16 object-cover rounded-full mr-4" />
                      <div class="flex justify-between w-full">
                          <div>
                              <h3 class="text-lg font-bold">{{ charla.titulo }}</h3>
                              <div class="flex items-center space-x-2">
                                  <div class="flex items-center space-x-2">
                                    <span v-if="charla.idEstadoCharla == 1"
                                    class="px-2 py-1 text-xs font-medium rounded-full bg-gray-200 text-gray-800">
                                          {{ charla.idEstadoCharla === 1 ? 'Propuesta' : charla.idEstadoCharla === 2 ?
                                          'Aceptada' : '' }}
                                    </span>
                                    <span v-if="charla.idEstadoCharla == 2"
                                    class="px-2 py-1 text-xs font-medium rounded-full bg-green-200 text-green-800">
                                          {{ charla.idEstadoCharla === 1 ? 'Propuesta' : charla.idEstadoCharla === 2 ?
                                          'Aceptada' : '' }}
                                    </span>                                  
                                  </div>
                                  <div class="flex items-center space-x-2">
                                      <span class="px-2 py-1 text-xs font-medium rounded-full bg-blue-200 text-blue-800">
                                          Votos: {{charla.votos}}
                                      </span>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
            </div>
        </div>
</div>
    <!-- Botones para guardar y cancelar -->
    <div class="grid grid-cols-2 gap-4 mt-4">
        <!-- Cancelar cambios -->
        <button mat-raised-button color="warn" @click="abrirConfirmacionCancelar()"
            class=" button-cancel p-4 shadow-md border-gray-200">
            Cancelar cambios
        </button>

        <!-- Guardar cambios -->
        <button mat-raised-button color="primary" @click="abrirConfirmacionGuardar()"
            class="p-4 shadow-md border-gray-200">
            Guardar cambios
        </button>
    </div>

    <!-- Popup de confirmación -->
    <div v-if="mostrarPopup" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 class="text-xl font-semibold mb-4">{{ mensajePopup }}</h3>
            <div class="flex justify-between">
                <button @click="confirmarAccion()"
                    class="bg-blue-500 text-white px-4 py-2 rounded-md">Confirmar</button>
                <button @click="cerrarPopup()" class="bg-red-500 text-white px-4 py-2 rounded-md">Cancelar</button>
            </div>
        </div>
    </div>
</div>
</template>
<script>
import PerfilService from "@/services/PerfilService";
import CharlasService from "@/services/CharlasService";
//import Swal from "sweetalert2";

export default {
  name: "SeleccionRondasProfesor",
  data() {
    return {
      usuario: null,
      idRonda: 1,
      idCurso: 3213,
      charlasPropuestas: [],
      charlasAceptadas: [],
      draggedCharla: null,
      // Variables para el popup
      mostrarPopup: false,
      mensajePopup: '',
      votosPropuestos: 0, // Total de votos de las charlas propuestas
      totalVotos: 0, // Total de votos posibles
      perfilService: new PerfilService(),
      charlasService: new CharlasService(),
      cargando: false,
    };
  },
  methods: {
  async cargarAlumnos() {
    const alumnosPorCurso = await this.perfilService.getAlumnosActivoProfesor();
    //this.idCurso = this.charlasPropuestas[0].idCurso
    // Buscamos el curso que coincide con el idCurso de la ruta
    console.log(alumnosPorCurso);
    this.totalVotos = alumnosPorCurso.length;
    // const curso = alumnosPorCurso.find(curso => curso.curso.idCurso === this.idCurso);
    // console.log(curso);
    // //this.idCurso = this.charlasPropuestas[0].idCurso

    // // Si encontramos el curso, asignamos el número de alumnos
    // if (curso) {
    //     this.totalVotos = curso.numeroAlumnos;  // Correctamente asignamos el número de alumnos
    // } else {
    //   this.totalVotos = 0;
    // }
  },
  async cargarCharlas() {
    try {
      this.cargando = true;
      // const charlas = await this.perfilService.getCharlasRonda(this.idRonda);
        const charlas = await this.charlasService.getCharlasRonda(this.idRonda);
        console.log(charlas);
        this.charlasPropuestas = charlas.filter((charla) => charla.idEstadoCharla === 1);
        this.charlasAceptadas = charlas.filter((charla) => charla.idEstadoCharla === 2);
        // console.log(this.charlasPropuestas);
        // // Procesar votos para charlas propuestas
        for (const charla of this.charlasPropuestas) {
          const charlaConVotos = await this.charlasService.getVotosCharla(charla.idCharla);
          charla.votos = charlaConVotos.votos ?? 0;
          this.votosPropuestos += charla.votos; 
        }
        
        this.charlasPropuestas.sort((a, b) => b.votos - a.votos);

        // // Procesar votos para charlas aceptadas
        for (const charla of this.charlasAceptadas) {
          const charlaConVotos = await this.charlasService.getVotosCharla(charla.idCharla);
          charla.votos = charlaConVotos.votos ?? 0;
          this.votosPropuestos += charla.votos; 
        }
        this.charlasAceptadas.sort((a, b) => b.votos - a.votos);
      } catch (error) {
        console.error("Error al cargar los cursos:", error);
        alert("No se pudieron cargar los cursos.");
      } finally {
        this.cargando = false; // Desactiva el spinner
      }
  },  
  abrirConfirmacionGuardar(){
    this.mostrarPopup = true;
    this.mensajePopup = '¿Está seguro de que desea guardar los cambios?';
  },
    abrirConfirmacionCancelar() {
    this.mostrarPopup = true;
    this.mensajePopup = '¿Está seguro de que desea cancelar los cambios?';
  },  
  confirmarAccion()
   {
    if (this.mensajePopup === '¿Está seguro de que desea guardar los cambios?') {
      this.guardarCambios();
      //this._router.navigate(["/courses"])
    } else if (this.mensajePopup === '¿Está seguro de que desea cancelar los cambios?') {
      this.cancelarCambios();
    }
    this.cerrarPopup();
  },

  cerrarPopup() {
    this.mostrarPopup = false;
  },
    // Guardar cambios
  guardarCambios(){
    let updatedCharlas = 
    this.charlasAceptadas.map(charla => {
      return {
        idCharla: charla.idCharla,
        titulo: charla.titulo,
        descripcion: charla.descripcion,
        tiempo: charla.tiempo,
        fechaPropuesta: charla.fechaPropuesta,
        idUsuario: charla.idUsuario,
        idEstadoCharla: charla.idEstadoCharla,
        idRonda: charla.idRonda,
        imagenCharla: charla.imagenCharla
      };
    });

    updatedCharlas.forEach(charla => {
      this.perfilService.updateCharla(charla).then(response => {
        console.log("Updating charlas" + response);
      })
    });
  },

  // Cancelar cambios
  cancelarCambios(){
    console.log("Cancelando cambios");
    //this._router.navigate(["/courses"])
  },

  onDragStart(event, charla) {
    this.draggedCharla = charla;
  },

  onDragOver(event) {
    event.preventDefault();
  },

  onDrop(event, targetList) {
    if (this.draggedCharla) {
      if (targetList === 'propuestas') {
        const charlaExistente = this.charlasPropuestas.some(c => c.idCharla === this.draggedCharla?.idCharla);
        if (!charlaExistente) {
          this.charlasAceptadas = this.charlasAceptadas.filter(c => c.idCharla !== this.draggedCharla?.idCharla);
          this.charlasPropuestas.push(this.draggedCharla);
          this.draggedCharla.idEstadoCharla = 1;
          this.charlasPropuestas.sort((a, b) => b.votos - a.votos);
        }
      } else {
        const charlaExistente = this.charlasAceptadas.some(c => c.idCharla === this.draggedCharla?.idCharla);
        if (!charlaExistente) {
          this.charlasPropuestas = this.charlasPropuestas.filter(c => c.idCharla !== this.draggedCharla?.idCharla);
          this.charlasAceptadas.push(this.draggedCharla);
          this.draggedCharla.idEstadoCharla = 2;
        }
      }
      this.draggedCharla = null;
    }
  }
  },
  created() {
    this.cargarCharlas();
    this.cargarAlumnos();
    
  },
  }
</script>

<style scoped>
body {
    height: auto;
    margin: 10px;
    padding: 20px;
    background-color: #f5d39d;
    border-radius: 3%;
    padding-bottom: 3%;

}

.scrollable-content {
    /* Puedes ajustar este valor según tus necesidades */
    overflow-y: auto;
    height: 60vh;
}

.draggable-item {
    margin-bottom: 16px;
    /* Ajusta el valor a tu preferencia */
}
.button-cancel{
    background-color: #F9CD87;
}
</style>