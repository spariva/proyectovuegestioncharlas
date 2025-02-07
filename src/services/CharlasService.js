import axios from "axios";
import { Global } from "@/Global";
import Cookies from 'cookies-js';

export default class CharlasService {
    getRondas() {
        return new Promise((resolve, reject) => {
            const endpoint = 'api/rondas/rondascurso';
            const token = Cookies.get('bearer_token');
            axios.get(
                Global.urlBase + endpoint,
                {
                    headers: {
                        Authorization: token, 
                    }
                }
            )
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error("Error al obtener las rondas de charlas: ", error.response ? error.response.data : error);
                reject(error);
            });
        });
    }

    getVotosRonda(idRonda) {
        return new Promise((resolve, reject) => {
            const endpoint = `api/votos/votosronda/${idRonda}`;
            const token = Cookies.get('bearer_token');
            axios.get(Global.urlBase + endpoint, {
                headers: {
                    Authorization: token,
                },
            })
            .then(response => resolve(response.data))
            .catch(error => {
                console.error("Error al obtener los votos de la ronda:", error.response ? error.response.data : error);
                reject(error);
            });
        });
    }

    getVotosCharla(idCharla) {
        return new Promise((resolve, reject) => {
            const endpoint = `api/votos/votoscharla/${idCharla}`;
            const token = Cookies.get('bearer_token');
            axios.get(Global.urlBase + endpoint, {
                headers: {
                    Authorization: token,
                },
            })
            .then(response => resolve(response.data))
            .catch(error => {
                console.error("Error al obtener los votos de la ronda:", error.response ? error.response.data : error);
                reject(error);
            });
        });
    }

    getCharlasAlumno(){
        return new Promise((resolve, reject) => {
            const endpoint = 'api/charlas/charlasalumno';
            const token = Cookies.get('bearer_token');
            axios.get(
                Global.urlBase + endpoint,
                {
                    headers: {
                        Authorization: token, 
                    }
                }
            )
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error("Error al obtener la charla de una ronda: ", error.response ? error.response.data : error);
                reject(error);
            });
        });
    }

    getVotosAlumno(){
        return new Promise((resolve, reject) => {
            const endpoint = 'api/votos/votosalumno';
            const token = Cookies.get('bearer_token');
            axios.get(
                Global.urlBase + endpoint,
                {
                    headers: {
                        Authorization: token, 
                    }
                }
            )
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error("Error al obtener la charla de una ronda: ", error.response ? error.response.data : error);
                reject(error);
            });
        });
    }

    getCharlas() {
        return new Promise((resolve, reject) => {
            const endpoint = 'api/charlas/charlascurso';
            const token = Cookies.get('bearer_token');
            axios.get(
                Global.urlBase + endpoint,
                {
                    headers: {
                        Authorization: token, 
                    }
                }
            )
            .then(response => {
                // console.log("Esta es la respuesta del Api");
                // console.log(response.data);
                resolve(response.data);
            })
            .catch(error => {
                console.error("Error al obtener las charlas: ", error.response ? error.response.data : error);
                reject(error);
            });
        });
    }

    getCharlasRonda(idRonda) {
        return new Promise((resolve, reject) => {
            const endpoint = 'api/charlas/charlasronda/'+idRonda;
            const token = Cookies.get('bearer_token');
            axios.get(
                Global.urlBase + endpoint,
                {
                    headers: {
                        Authorization: token, 
                    }
                }
            )
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error("Error al obtener las charlas de una ronda: ", error.response ? error.response.data : error);
                reject(error);
            });
        });
    }

    updateEstadoCharla(idCharla, idEstadoCharla) {
        return new Promise((resolve, reject) => {
            const endpoint = `api/Profesor/UpdateEstadoCharla/${idCharla}/${idEstadoCharla}`;
            const token = Cookies.get('bearer_token');
            axios.put(Global.urlBase + endpoint, {}, {
                headers: {
                    Authorization: token,
                },
            })
            .then(response => resolve(response.data))
            .catch(error => {
                console.error("Error al actualizar el estado de la charla:", error.response ? error.response.data : error);
                reject(error);
            });
        });
    }

    setCharla(form){
        return new Promise((resolve, reject) => {
            const endpoint = 'api/charlas';
            const token = Cookies.get('bearer_token');
            const json = JSON.stringify({
                idCharla: 0,
                titulo: form.titulo,
                descripcion: form.descripcion,
                tiempo: form.tiempo,
                fechaPropuesta: form.fechaPropuesta+'T00:00:00',
                idUsuario: 0,
                idEstadoCharla: 1,
                idRonda: form.idRonda,
                imagenCharla: "https://static.vecteezy.com/system/resources/previews/022/555/586/non_2x/3d-abstract-red-and-black-background-by-ai-generated-can-be-use-as-facebook-cover-free-photo.jpg"
            });
            axios.post(
                Global.urlBase + endpoint,
                json,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: token, 
                    }
                }
            )
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error("Error al crear el usuario:", error.response ? error.response.data : error);
                reject(error);
            });
        });
    }

    setRecurso(form) {
        return new Promise((resolve, reject) => {
            const endpoint = 'api/recursos';
            const token = Cookies.get('bearer_token');
            const json = JSON.stringify({
                idRecurso: 0,
                idCharla: form.idCharla,  // Se asigna después de crear la charla
                url: form.url,
                nombre: form.nombre,
                descripcion: form.descripcion
            });

            axios.post(
                Global.urlBase + endpoint,
                json,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: token,
                    }
                }
            )
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error("Error al crear el recurso:", error.response ? error.response.data : error);
                reject(error);
            });
        });
    }

    setRonda(form){
        return new Promise((resolve, reject) => {
            const token = Cookies.get('bearer_token');
            const endpoint1 = 'api/profesor/cursosprofesor';
            const endpoint2 = 'api/profesor/createronda';

            axios.get(
                Global.urlBase + endpoint1,
                {
                    headers: {
                        Authorization: token, 
                    }
                }
            )
            .then(response => {
                const json = JSON.stringify({
                    idRonda: 0, // Generado automáticamente en la API
                    idCursoUsuario: response.data[0],
                    fechaPresentacion: form.fechaPresentacion,
                    fechaCierre: form.fechaCierre,
                    duracion: form.duracion,
                    descripcionModulo: form.descripcionModulo,
                    fechaLimiteVotacion: form.fechaLimiteVotacion
                });

                axios.post(
                    Global.urlBase + endpoint2,
                    json,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: token, 
                        }
                    }
                )
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error("Error al crear ronda profesor:", error.response ? error.response.data : error);
                    reject(error);
                });
            })
            .catch(error => {
                console.error("Error al obtener el curso del profesor en la creacion de ronda: ", error.response ? error.response.data : error);
                reject(error);
            });
        });
    }

    setVoto(idRonda, idCharla){
        return new Promise((resolve, reject) => {
            const endpoint = 'api/votos';
            const token = Cookies.get('bearer_token');
            const iduser = Cookies.get('user_id');
            const json = JSON.stringify({
                idVoto: 0,
                idCharla: idCharla,
                idUsuario: iduser,
                idRonda: idRonda
            });
            
            axios.post(
                Global.urlBase + endpoint,
                json,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: token, 
                    }
                }
            )
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error("Error al crear el voto:", error.response ? error.response.data : error);
                reject(error);
            });
        });
    }

    getDetallesCharla(idCharla){
        return new Promise((resolve, reject) => {
            const endpoint = 'api/charlas/'+ idCharla;
            const token = Cookies.get('bearer_token');
            axios.get(
                Global.urlBase + endpoint,
                {
                    headers: {
                        Authorization: token, 
                    }
                }
            )
            .then(response => {
                console.log(response.data);
                resolve(response.data);
            })
            .catch(error => {
                console.error("Error al obtener los detalles de la charla: ", error.response ? error.response.data : error);
                reject(error);
            });
        });
    }

    getCharlasComentarios(idCharla) {
        return new Promise((resolve, reject) => {
            const endpoint = `api/charlas/${idCharla}`;
            const token = Cookies.get('bearer_token');
            axios.get(
                Global.urlBase + endpoint,
                {
                    headers: {
                        Authorization: token, 
                    }
                }
            )
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error("Error al obtener las charlas: ", error.response ? error.response.data : error);
                reject(error);
            });
        });
    }

    deleteComentario(idComentario) {
        return new Promise((resolve, reject) => {
            const endpoint = `api/comentarios/${idComentario}`;
            const token = Cookies.get('bearer_token');

            if (!token) {
                reject("Token de autenticación no encontrado.");
                return;
            }
            axios.delete(
                Global.urlBase + endpoint,
                {
                    headers: {
                        Authorization: token,
                    }
                }
            )
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error("Error al eliminar el comentario:", error.response ? error.response.data : error);
                reject(error.response ? error.response.data : error);
            });
        });
    }

    getComentarioUsuario(){
        return new Promise((resolve, reject) => {
            const endpoint = `api/comentarios/comentariosusuario`;
            const token = Cookies.get('bearer_token');
            axios.get(
                Global.urlBase + endpoint,
                {
                    headers: {
                        Authorization: token, 
                    }
                }
            )
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error("Error al obtener las charlas: ", error.response ? error.response.data : error);
                reject(error);
            });
        });
    }

    setComentario(form) {
        return new Promise((resolve, reject) => {
            const endpoint = 'api/comentarios';
            const token = Cookies.get('bearer_token');
            
            // Crear un nuevo objeto para el comentario con la fecha y hora actual en formato español
            const fechaActual = new Date();
            // Esto dará una fecha como "23/01/2025 12:30:00"
    
            const json = JSON.stringify({
                idComentario: 0,  // Aquí el id se asignará automáticamente en la base de datos
                idCharla: form.idCharla,
                idUsuario: form.idUsuario,
                contenido: form.contenido,
                fecha: fechaActual,  // Fecha formateada en formato español con hora
            });
            console.log(json)
        
            // Realizar la solicitud POST para crear el comentario
            axios.post(
                Global.urlBase + endpoint,
                json,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: token, 
                    }
                }
            )
            .then(response => {
                resolve(response.data); // Respuesta con el comentario creado
            })
            .catch(error => {
                console.error("Error al crear el comentario:", error.response ? error.response.data : error);
                reject(error); // Si hubo un error, lo rechazamos
            });
        });
    }

    updateComentario(comentario){
		const request = "api/comentarios";
		const url = Global.urlBase + request;
        const token = Cookies.get('bearer_token');
        console.log(token);

		return axios.put(url, comentario, {
			headers: {
				'Authorization': token
			}
		})
	}

    editarCharla(charlaActualizada) {
        return new Promise((resolve, reject) => {
            const endpoint = `api/Charlas`;
            const token = Cookies.get('bearer_token');
            axios.put(Global.urlBase + endpoint, charlaActualizada, {
                headers: {
                    Authorization: token,
                },
            })
            .then(response => resolve(response.data))
            .catch(error => {
                console.error("Error al editar charla en el perfil alumno:", error.response ? error.response.data : error);
                reject(error);
            });
        });
    }

    editarRecurso(recursoActualizado){
        return new Promise((resolve, reject) => {
            const endpoint = `api/Recursos`;
            const token = Cookies.get('bearer_token');
            axios.put(Global.urlBase + endpoint, recursoActualizado, {
                headers: {
                    Authorization: token,
                },
            })
            .then(response => resolve(response.data))
            .catch(error => {
                console.error("Error al editar recurso en el perfil alumno:", error.response ? error.response.data : error);
                reject(error);
            });
        });
    }

    getRecursosCharlas(idCharla) {
        return new Promise((resolve, reject) => {
            const endpoint = `api/charlas/${idCharla}`;
            const token = Cookies.get('bearer_token');
            axios.get(
                Global.urlBase + endpoint,
                {
                    headers: {
                        Authorization: token,
                    }
                }
            )
            .then(response => {
                console.log("Respuesta de la API para recursos:", response.data);
                resolve(response.data);
            })
            .catch(error => {
                console.error("Error al obtener los recursos: ", error.response ? error.response.data : error);
                reject(error);
            });
        });
    }

    //NUEVO
    getVotosCurso(idCurso) {
        return new Promise((resolve, reject) => {
            const endpoint = `api/votos/votoscurso/${idCurso}`;
            console.log("Get votos curso: " + idCurso);
            const token = Cookies.get('bearer_token');
            axios.get(Global.urlBase + endpoint, {
                headers: {
                    Authorization: token,
                },
            })
            .then(response => resolve(response.data))
            .catch(error => {
                console.error("Error al obtener los votos de la ronda:", error.response ? error.response.data : error);
                reject(error);
            });
        });
    }

    getVotoAlumnoRonda(idRonda){
        return new Promise((resolve, reject) => {
            const endpoint = 'api/votos/votoalumnoronda/' + idRonda;
            const token = Cookies.get('bearer_token');
            axios.get(
                Global.urlBase + endpoint,
                {
                    headers: {
                        Authorization: token, 
                    }
                }
            )
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error("Error al obtener los votos alumno de una ronda: ", error.response ? error.response.data : error);
                reject(error);
            });
        });
    }    
}
