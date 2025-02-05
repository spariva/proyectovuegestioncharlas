import axios from "axios";
import { Global } from "@/Global";
import Cookies from 'cookies-js';

export default class PerfilService {

    getUsuarioPerfil() {
        return new Promise((resolve, reject) => {
            const endpoint = "api/usuarios/perfil";
            const token = Cookies.get('bearer_token');

            axios.get(Global.urlBase + endpoint, {
                headers: {
                    Authorization: token, // Incluye el token recuperado
                },
            })
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error("Error al obtener el perfil:", error.response ? error.response.data : error);
                    reject(error);
                });
        });
    }
    // Método para obtener las charlas del usuario
    getCharlasUsuario() {
        return new Promise((resolve, reject) => {
            const endpoint = "api/Charlas/CharlasAlumno";
            const token = Cookies.get('bearer_token'); // Obtenemos el token

            axios.get(Global.urlBase + endpoint, {
                headers: {
                    Authorization: token, // Incluye el token en el header
                },
            })
                .then(response => {
                    resolve(response.data); // Retorna las charlas
                })
                .catch(error => {
                    console.error("Error al obtener las charlas:", error.response ? error.response.data : error);
                    reject(error);
                });
        });
    }


    uploadUserImage(userId, fileName, fileContent) {
        return new Promise((resolve, reject) => {
            const endpoint = `api/Files/UploadImagenUsuario/${userId}`;
            const token = Cookies.get('bearer_token');

            axios.post(Global.urlBase + endpoint, {
                fileName,
                fileContent,
            }, {
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                },
            })
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error("Error al subir la imagen:", error.response ? error.response.data : error);
                    reject(error);
                });
        });
    }

    editarPerfil(usuario) {
        return new Promise((resolve, reject) => {
            const endpoint = "api/Usuarios";
            const token = Cookies.get('bearer_token');

            const payload = {
                idUsuario: usuario.idUsuario,
                nombre: usuario.nombre,
                apellidos: usuario.apellidos,
                email: usuario.email,
                estadoUsuario: usuario.estadoUsuario,
                imagen: usuario.imagen,
                password: usuario.password,
                idRole: usuario.idRole,
            };

            axios.put(Global.urlBase + endpoint, payload, {
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                },
            })
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error("Error al editar el perfil:", error.response ? error.response.data : error);
                    reject(error);
                });
        });
    }
    
    getRondasProfesor() {
        return axios.get(Global.urlBase + "api/Profesor/RondasProfesor", {
            headers: { Authorization: Cookies.get("bearer_token") },
        }).then(response => response.data);
    }

    
    updateRonda(ronda) {
        return axios.put(`${Global.urlBase}api/Profesor/UpdateRonda`, ronda, {
            headers: { Authorization: Cookies.get("bearer_token") },
        });
    }

    deleteRonda(idRonda) {
        return new Promise((resolve, reject) => {
            const endpoint = `api/Profesor/DeleteRonda/${idRonda}`;
            const token = Cookies.get('bearer_token');
        
            axios.delete(Global.urlBase + endpoint, {
                headers: {
                Authorization: token,
                },
            })
            .then(response => {
                resolve(response.data); // Resolución con los datos de la respuesta
            })
            .catch(error => {
                reject(error); // Rechazo con el error para que el bloque `catch` lo maneje
            });
        });
    }

    // Este devuelve todos los cursos y sus alumnos
    getAlumnosCursoProfesor() {
        return new Promise((resolve, reject) => {
            const endpoint = "api/Profesor/AlumnosCursoProfesor";
            const token = Cookies.get('bearer_token');

            axios.get(Global.urlBase + endpoint, {
                headers: {
                    Authorization: token,
                },
            })
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error("Error al obtener los alumnos de un profesor:", error.response ? error.response.data : error);
                    reject(error);
                });
        });
    }

    getAlumnosCursoProfesorEnAlumnos(idCurso) {
        return new Promise((resolve, reject) => {
            const endpoint = "api/Profesor/AlumnosCursoProfesor";
            const token = Cookies.get('bearer_token');
            console.log("Id del curso: " + idCurso);

            axios.get(Global.urlBase + endpoint, {
                headers: {
                    Authorization: token,
                },
            })
                .then(response => {
                    // Imprimir la respuesta para asegurarse de que la estructura sea correcta
                    console.log("Respuesta completa del endpoint: ", response.data);

                    // Filtrar el curso específico y devolver solo sus datos
                    const cursoFiltrado = response.data.find(curso => {
                        return curso.curso && curso.curso.idCurso === Number(idCurso);
                    });

                    console.log("Curso filtrado: ", cursoFiltrado);

                    if (cursoFiltrado) {
                        resolve(cursoFiltrado); // Devuelve el curso con sus alumnos
                    } else {
                        resolve(null); // Si no se encuentra el curso
                    }
                })
                .catch(error => {
                    console.error("Error al obtener los alumnos de un profesor:", error.response ? error.response.data : error);
                    reject(error);
                });
        });
    }

    getAlumnosCursoHistorialProfesor(idCurso){
        return new Promise((resolve, reject) => {
            const endpoint = "api/Profesor/AlumnosCursoHistorialProfesor";
            const token = Cookies.get('bearer_token');
            console.log("Id del curso: " + idCurso);

            axios.get(Global.urlBase + endpoint, {
                headers: {
                    Authorization: token,
                },
            })
                .then(response => {
                    // Imprimir la respuesta para asegurarse de que la estructura sea correcta
                    console.log("Respuesta completa del endpoint antiguo: ", response.data);

                    // Filtrar el curso específico y devolver solo sus datos
                    const cursoFiltrado = response.data.find(curso => {
                        return curso.curso && curso.curso.idCurso === Number(idCurso);
                    });

                    console.log("Curso filtrado antiguo: ", cursoFiltrado);

                    if (cursoFiltrado) {
                        resolve(cursoFiltrado); // Devuelve el curso con sus alumnos
                    } else {
                        resolve(null); // Si no se encuentra el curso
                    }
                })
                .catch(error => {
                    console.error("Error al obtener los alumnos de un profesor antiguo:", error.response ? error.response.data : error);
                    reject(error);
                });
        });
    }

    // Solo el curso activo y sus alumnos
    getAlumnosCursoActivoProfesor(idCurso) {
        return new Promise((resolve, reject) => {
            const endpoint = "api/Profesor/AlumnosCursoActivoProfesor";
            const token = Cookies.get('bearer_token');
            console.log("Id del curso: " + idCurso);
            axios.get(Global.urlBase + endpoint, {
                headers: {
                    Authorization: token,
                },
            })
            .then(response => {
                // Filtrar el curso específico y devolver solo sus datos
                const cursoFiltrado = response.data.find(curso => curso.curso.idCurso === idCurso);
                console.log("Curso filtrado: ", cursoFiltrado);
                if (cursoFiltrado) {
                    resolve(cursoFiltrado); // Devuelve el curso con sus alumnos
                } else {
                    resolve(null); // Si no se encuentra el curso
                }
            })
            .catch(error => {
                console.error("Error al obtener los alumnos de un profesor:", error.response ? error.response.data : error);
                reject(error);
            });
        });
    }

    getAlumnosActivoProfesor(idCurso) {
        return new Promise((resolve, reject) => {
            const endpoint = "api/Profesor/AlumnosCursoActivoProfesor";
            const token = Cookies.get('bearer_token');
            console.log("Id del curso: " + idCurso);
            axios.get(Global.urlBase + endpoint, {
                headers: {
                    Authorization: token,
                },
            })
            .then(response => {
                resolve(response.data[0].alumnos);
            })
            .catch(error => {
                console.error("Error al obtener los alumnos de un profesor:", error.response ? error.response.data : error);
                reject(error);
            });
        });
    }

    updateEstadoUsuario(idUsuario, estado) {
        return new Promise((resolve, reject) => {
            const endpoint = `/api/profesor/updateestadoalumno/${idUsuario}/${estado}`;
            const token = Cookies.get('bearer_token');

            axios.put(Global.urlBase + endpoint, {}, {
                headers: {
                    Authorization: token,
                },
            })
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error("Error al actualizar el estado del usuario:", error);
                    reject(error);
                });
        });
    }
    updateContrasenia(nuevacontrasenia) {
        return new Promise((resolve, reject) => {
            const endpoint = `/api/usuarios/updatepasswordusuario`;
            const token = Cookies.get('bearer_token');

            const passwordnew = {
                newPassword: nuevacontrasenia
            };
            axios.put(Global.urlBase + endpoint, passwordnew, {
                headers: {
                    Authorization: token,
                },
            })
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error("Error al actualizar el estado del usuario:", error);
                    reject(error);
                });
        });
    }

    crearCurso(data) {
        return new Promise((resolve, reject) => {
            const endpoint = 'api/Profesor/CreateCurso';
            const token = Cookies.get('bearer_token');
            const json = JSON.stringify({
                idCurso: data.idCurso,
                nombre: data.nombre,
                fechaInicio: data.fechaInicio, // Si es necesario, ajusta el formato de fecha
                fechaFin: data.fechaFin, // Lo mismo aquí
                activo: data.activo
            });

            console.log("JSON: " + json);

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
                    console.error("Error al crear el curso:", error.response ? error.response.data : error);
                    reject(error);
                });
        });
    }

    eliminarCurso(idCurso) {
        return new Promise((resolve, reject) => {
            const endpoint = `api/Cursos/${idCurso}`;
            const token = Cookies.get('bearer_token');

            return axios.delete(Global.urlBase + endpoint, {
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                },
            })
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error("Error al actualizar el estado del usuario:", error);
                    reject(error);
                });
        });
    }

    updateEstadoCurso(idCurso, estado){
        return new Promise((resolve, reject) => {
            const endpoint = `/api/Cursos/UpdateEstadoCurso/${idCurso}/${estado}`;
            const token = Cookies.get('bearer_token');

            axios.put(Global.urlBase + endpoint, {}, {
                headers: {
                    Authorization: token,
                },
            })
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error("Error al actualizar el estado del usuario:", error);
                    reject(error);
                });
        });
    }

    //NUEVO
    getAlumnosSinVotoRonda(idRonda) {
        return new Promise((resolve, reject) => {
            const endpoint = "api/profesor/alumnossinvotoronda/" + idRonda;
            const token = Cookies.get('bearer_token');
            console.log("Id de ronda: " + idRonda);
            axios.get(Global.urlBase + endpoint, {
                headers: {
                    Authorization: token,
                },
            })
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                console.error("Error al obtener los alumnos sin Voto en Ronda:", error.response ? error.response.data : error);
                reject(error);
            });
        });
    }

    getAlumnosConVotoRonda(idRonda) {
        return new Promise((resolve, reject) => {
            const endpoint = "api/profesor/alumnosconvotoronda/" + idRonda;
            const token = Cookies.get('bearer_token');
            console.log("Id de ronda: " + idRonda);
            axios.get(Global.urlBase + endpoint, {
                headers: {
                    Authorization: token,
                },
            })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error("Error al obtener los alumnos sin Voto en Ronda:", error.response ? error.response.data : error);
                reject(error);
            });
        });
    }    
}
