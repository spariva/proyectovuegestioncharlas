<template>
    <div class="container text-center d-flex justify-content-center align-items-center my-sm-5">
        <div class="row align-items-center justify-content-center">
            <!-- Imagen en la parte superior para móviles -->
            <div class="col-12 col-md-6 mb-4 mb-md-0">
                <img
                    :src="notFoundImage"
                    alt="Página no encontrada"
                    class="img-fluid"
                    style="max-height: 350px;"
                />
            </div>

            <!-- Mensaje y botón -->
            <div class="col-12 col-md-6 text-md-start">
                <h1 class="fw-bold text-dark mb-3">¡Página no encontrada!</h1>
                <p class="lead text-muted">
                    Lo sentimos, la página que buscas no está disponible. Es posible que haya sido eliminada,
                    movida o que la URL sea incorrecta.
                </p>
                <router-link to="/" class="btn btn-outline-secondary btn-lg mt-3">
                    Volver a Inicio
                </router-link>
            </div>
        </div>
    </div>
</template>
  
<script>
import NotFound from '@/assets/notFound.png';

export default {
    name: 'NotFoundComponent',
    data() {
        return {
            notFoundImage: NotFound
        };
    }
};
</script>
  
<style scoped>
html{
    height: 100vh;
}
    .container {
        background-color: #f8f8f8;
        border-radius: 12px;
        box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.139);
        padding: 3rem 1rem;
    }

    h1 {
        color: #dc3545;
    }
</style>
