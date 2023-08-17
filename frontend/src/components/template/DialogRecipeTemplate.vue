<template>
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title" id="exampleModalLabel">{{ this.recipeDialog.name }}</h2>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="$emit('hideModal')"></button>
        </div>
        <div class="modal-body">
            <div class="row">
                <div class="col-lg-6 ms-12 d-flex justify-content-center">
                    <h3>Tipo de receita: {{ this.recipeDialog.type_id }}</h3>
                </div>
                <div class="col-lg-6 ms-12 d-flex justify-content-center">
                    <h3>Nome do criador: {{ this.recipeDialog.user_id }}</h3>
                </div>
            </div>
            <div class="row justify-content-center">
                <div class="col-lg-10 ms-12 col-dialog">
                    <br>
                    <img class="img-fluid rounded" v-if="this.recipeDialog.img_location" :src="'data:image/png;base64,' + this.recipeDialog.img_location">
                    <br>
                </div>
            </div>
            <div class="row">
                <div class="col-12 col-dialog p-description">
                    <br>
                    <label for="validationServer04"><h4>Modo de preparo:</h4></label>
                    <br><br>
                    <p>{{ this.recipeDialog.description }}</p>
                </div>
            </div>
        </div>
        <div class="modal-footer justify-content-center">
           <h6>{{ this.recipeDialog.created_at }}</h6>
        </div>
      </div>
    </div>
</template>

<script>

export default {
    name: 'DialogRecipeTemplate',
    props: {
        recipeDialog: {}
    }
}
</script>

<style>
    .col-dialog img {
        width: 100%;
        box-shadow: rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset;
    }

    .p-description {
        background: rgba(0,0,0,0.15);
        box-shadow: rgba(0, 0, 0, 0.562) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset;
    }
</style>