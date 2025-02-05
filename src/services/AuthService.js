import axios from "axios";
import { Global } from "@/Global";

export default class AuthService {
    getToken(userName, password) {
        return new Promise((resolve, reject) => {
            const endpoint = 'api/auth/login';
            const json = JSON.stringify({
                userName: userName+'@tajamar365.com',
                password
            });
            axios.post(
                Global.urlBase + endpoint,
                json,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            )
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error("Error al obtener el token:", error.response ? error.response.data : error);
                reject(error);
            });
        });
    }

    setAlumno(form){
        return new Promise((resolve, reject) => {
            const endpoint = 'api/usuarios/newalumno/'+form.idCurso;
            const json = JSON.stringify({
                idUsuario: form.idUsuario,
                nombre: form.nombre,
                apellidos: form.apellidos,
                email: form.email+'@tajamar365.com',
                estadoUsuario: form.estadoUsuario,
                imagen: form.imagen,
                password: form.password,
                idRole: form.idRole
            });
            axios.post(
                Global.urlBase + endpoint,
                json,
                {
                    headers: {
                        'Content-Type': 'application/json',
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

    setProfesor(form, key){
        return new Promise((resolve, reject) => {
            const endpoint = 'api/profesor/newprofesor/'+key;
            const json = JSON.stringify({
                idUsuario: form.idUsuario,
                nombre: form.nombre,
                apellidos: form.apellidos,
                email: form.email+'@tajamar365.com',
                estadoUsuario: form.estadoUsuario,
                imagen: form.imagen,
                password: form.password,
                idRole: form.idRole
            });
            axios.post(
                Global.urlBase + endpoint,
                json,
                {
                    headers: {
                        'Content-Type': 'application/json',
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
    
}