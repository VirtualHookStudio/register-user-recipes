<template>
    <div class="card-recipe col-lg-3">
        <div class="card">
            <img :src="previewImage" class="card-img-top" alt="">
            <div class="card-body">
                <h4 class="card-title text-center">{{ this.recipeCard.name }}</h4>
                <p class="card-text">{{ this.recipeCard.description }}</p>
                <div class="card-body-buttons">
                    <a href="#" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#dialogRecipe" @click="$emit('showRecipe', this.recipeCard)"><i class="fa fa-eye" aria-hidden="true"></i></a>
                    <a href="#" class="btn btn-outline-warning" @click="$emit('editRecipe', this.recipeCard)" v-show="isButtonsVisible"><i class="fa fa-pencil"></i></a>
                    <a href="#" class="btn btn-outline-danger" @click="$emit('deleteRecipe', this.recipeCard)" v-show="isButtonsVisible"><i class="fa fa-trash" aria-hidden="true"></i></a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: 'CardRecipeTemplate',
    computed: mapState(['isButtonsVisible']),
    data: function() {
        return {
            previewImage: "data:image/png;base64," + this.recipeCard.img_location,
        }
    },
    props: {
        recipeCard: {}
    }
}
</script>

<style>
    .card-img-top {
        border-radius: 50px;
        padding: 10px;
        height: 250px;
        width: 100%;
        object-fit: cover;
    }

    .card {
        width: 18rem;
        border-radius: 10px;
        box-shadow: rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset;
    }

    .card-body {
        padding: 25px;
        margin-top: -25px;
    }

    .card-body-buttons {
        text-align: center;
    }

    .card-body .btn {
        margin: 2px;
        padding: 10px;
        width: 30%;
    }

    .card-text {
        height: 6rem;
        display: -webkit-box;
        -webkit-line-clamp: 4;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
</style>