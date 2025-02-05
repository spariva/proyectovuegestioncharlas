import axios from "axios";
import { Global } from "@/Global";
import Cookies from "cookies-js";

export default class AdminService {
  getProfesores() {
    const token = Cookies.get("bearer_token");
    return axios
      .get(`${Global.urlBase}/api/Admin/Profesores`, {
        headers: { Authorization: token },
      })
      .then((res) => res.data)
      .catch((err) => {
        console.error("Error al obtener profesores:", err);
        throw err;
      });
  }

  getUsuarios() {
    const token = Cookies.get("bearer_token");
    return axios
      .get(`${Global.urlBase}/api/Usuarios`, {
        headers: { Authorization: token },
      })
      .then((res) => res.data)
      .catch((err) => {
        console.error("Error al obtener profesores:", err);
        throw err;
      });
  }

  getUsuariosActivos() {
    const token = Cookies.get("bearer_token");
    return axios
      .get(`${Global.urlBase}/api/Admin/UsuariosActivos`, {
        headers: { Authorization: token },
      })
      .then((res) => res.data)
      .catch((err) => {
        console.error("Error al obtener usuarios activos:", err);
        throw err;
      });
  }

  updateEstadoProfesor(idUsuario, estado) {
    const token = Cookies.get("bearer_token");
    return axios
      .put(
        `${Global.urlBase}/api/Admin/UpdateEstadoProfesor/${idUsuario}/${estado}`,
        {},
        { headers: { Authorization: token } }
      )
      .then((res) => res.data)
      .catch((err) => {
        console.error("Error al actualizar estado del profesor:", err);
        throw err;
      });
  }

  updateEstadoUsuario(idUsuario, estado) {
    const token = Cookies.get("bearer_token");
    return axios
      .put(
        `${Global.urlBase}/api/Usuarios/UpdateEstadoUsuario/${idUsuario}/${estado}`,
        {},
        { headers: { Authorization: token } }
      )
      .then((res) => res.data)
      .catch((err) => {
        console.error("Error al actualizar estado del usuario:", err);
        throw err;
      });
  }

  updateCursoUsuario(idUsuario, idCurso) {
    const token = Cookies.get("bearer_token");
    return axios
      .put(
        `${Global.urlBase}/api/Admin/UpdateCursoUsuario/${idUsuario}/${idCurso}`,
        {},
        { headers: { Authorization: token } }
      )
      .then((res) => res.data)
      .catch((err) => {
        console.error("Error al actualizar curso del usuario:", err);
        throw err;
      });
  }

  updateRolUsuario(idUsuario, idRol) {
    const token = Cookies.get("bearer_token");
    return axios
      .put(
        `${Global.urlBase}/api/Admin/UpdateRoleUsuario/${idUsuario}/${idRol}`,
        {},
        { headers: { Authorization: token } }
      )
      .then((res) => res.data)
      .catch((err) => {
        console.error("Error al actualizar rol del usuario:", err);
        throw err;
      });
  }

  getRoles() {
    const token = Cookies.get("bearer_token");
    return axios
      .get(`${Global.urlBase}/api/Roles`, {
        headers: { Authorization: token },
      })
      .then((res) => res.data)
      .catch((err) => {
        console.error("Error al obtener roles:", err);
        throw err;
      });
  }

  getCursos() {
    const token = Cookies.get("bearer_token");
    return axios
      .get(`${Global.urlBase}/api/Cursos`, {
        headers: { Authorization: token },
      })
      .then((res) => res.data)
      .catch((err) => {
        console.error("Error al obtener cursos:", err);
        throw err;
      });
  }

  getCursosUsuarios() {
    const token = Cookies.get("bearer_token");
    return axios
      .get(`${Global.urlBase}/api/CursosUsuarios`, {
        headers: { Authorization: token },
      })
      .then((res) => res.data)
      .catch((err) => {
        console.error("Error al obtener cursos/usuarios:", err);
        throw err;
      });
  }



}
