<template>
    <div class="home-page">
        <br>
        <PageTitle icon="fa fa-home" main="Dashboard" sub=""></PageTitle>
        <div class="col-12 page-carousel-recipe">
            <div id="carouselRecipes" class="carousel slide" data-bs-ride="carousel">
                <br>
                <div class="carousel-indicators">
                    <button type="button" data-bs-target="#carouselRecipes" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                    <button type="button" data-bs-target="#carouselRecipes" data-bs-slide-to="1" aria-label="Slide 2"></button>
                    <button type="button" data-bs-target="#carouselRecipes" data-bs-slide-to="2" aria-label="Slide 3"></button>
                </div>
                <div class="carousel-inner">
                    <div class="carousel-item" v-for="(recipes, r) in recipes" :key="r" :value="recipes.id" :class="{ active: r === 0 }">
                        <img :src="previewImage[r]" class="img-fluid d-block d-flex w-100">
                        <div class="carousel-caption d-none d-md-block">
                            <br>
                            <h2>{{ this.recipes[r].name }}</h2>
                        </div>
                    </div>
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carouselRecipes" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carouselRecipes" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div>
            <br>
        </div>
        <hr>
        <div class="home-text col-12">
            <div class="col-lg-12 ms-12">
                <p>Seja você um amante da gastronomia experiente ou um entusiasta em ascensão na arte da cozinha, o Nosso Cantinho Culinário é o seu destino definitivo para explorar um mundo delicioso de receitas de comida. Estamos dedicados a celebrar a alegria de cozinhar, compartilhar e experimentar pratos incríveis que aquecem o coração e aguçam o paladar.</p>
                <p>O Nosso Cantinho Culinário é o ponto de encontro perfeito para todos aqueles que compartilham a paixão pela culinária e desejam fazer parte de uma comunidade que valoriza a tradição, a inovação e, acima de tudo, o prazer de compartilhar uma boa refeição. Explore, crie, inspire-se e, é claro, desfrute de momentos deliciosos enquanto fazemos juntos uma jornada emocionante pelo mundo da comida. Bom apetite e boas aventuras culinárias!</p>
            </div>
            <br>
            <h5>O que nos torna especiais:</h5>
            <br>
            <div class="col-lg-6 ms-12">
                <p>1 - Um Tesouro de Receitas: Navegue por nossa coleção diversificada de receitas cuidadosamente selecionadas, que abrangem desde clássicos reconfortantes até criações contemporâneas. De pratos principais a sobremesas irresistíveis, estamos aqui para inspirar sua próxima aventura culinária.</p>
                <p>2 - Compartilhando Histórias: Acreditamos que cada prato tem uma história para contar. Acompanhe nossos autores apaixonados enquanto eles compartilham não apenas as receitas, mas também as memórias e experiências que as tornam especiais. Envolva-se em narrativas cativantes que se entrelaçam com os aromas e sabores de cada prato.</p>
                <p>3 - Comunidade Vibrante: O Nosso Cantinho Culinário é mais do que um site de receitas; é uma comunidade acolhedora e colaborativa. Conecte-se com outros entusiastas culinários, compartilhe suas próprias criações e troque dicas, truques e conselhos para aprimorar suas habilidades na cozinha.</p>
            </div>
            <div class="col-lg-6 ms-12">
                <p>4 - Explorando Culturas: Viaje pelo mundo sem sair da sua cozinha! Explore uma variedade de culinárias globais e mergulhe nas tradições culinárias de diferentes países. Aprenda a preparar pratos autênticos que celebram a riqueza da diversidade culinária.</p>
                <p>5 - O Nosso Cantinho Culinário é o ponto de encontro perfeito para todos aqueles que compartilham a paixão pela culinária e desejam fazer parte de uma comunidade que valoriza a tradição, a inovação e, acima de tudo, o prazer de compartilhar uma boa refeição. Explore, crie, inspire-se e, é claro, desfrute de momentos deliciosos enquanto fazemos juntos uma jornada emocionante pelo mundo da comida.</p>
                <p>6 - Junte-se a nós na jornada culinária: Compartilhar. Cozinhar. Saborear.</p>
            </div>
            <br>
            <h5 style="justify-content: right;">Bom apetite e boas aventuras culinárias!</h5>
        </div>
        <br>
    </div>
</template>

<script>
import PageTitle from '@/components/template/PageTitle.vue'

import axios from 'axios';
import { baseApiUrl } from '@/global';

export default {
    name: 'HomePage',
    components: {PageTitle},
    data: function() {
        return {
            previewImage: [],
            typeCategory: 'all',
            recipes: []
        }
    },
    methods: {
        loadRecipes() {
            const url = `${baseApiUrl}/recipes`
            axios.get(url).then(res => {
                this.recipes = res.data
                for(var i = 0; i < 3; i++){
                    if(this.recipes[i]){
                        this.previewImage[i] = "data:image/png;base64," + this.recipes[i].img_location
                    }else{
                        this.previewImage[i] = require('@/assets/img_default.png')
                    }
                }
            })
        },
        reset() {
            this.mode = 'all',
            this.recipes = [],
            this.loadTypes()
        },
    },
    beforeMount(){
        this.loadRecipes()
    },
    mounted() {
        this.loadRecipes()
    }
}
</script>

<style>
    .home-page {
        border-radius: 10px;
        background: rgba(0,0,0,0.45);
        padding-left: 5%;
        padding-right: 5%;
    }
    .carousel-caption {
        background: rgba(0,0,0,0.45);
        right: 0;
        top: 0;
        left: 0;
        bottom: auto;
    }
    
    .home-text {
        padding: 3%;
        border-radius: 10px;
        background: url('../../assets/background-homepage.png');
        background-repeat: no-repeat;
        background-size: cover;
    }

    .home-text h5 {
        font-weight: bold;
        display: flex;
        justify-content: left;
        margin-left: 5%;
    }

    h2 {
        font-weight: bold;
        display: flex;
        justify-content: left;
        margin-left: 5%;
    }

    .carousel-item img{ 
        margin:auto; 
    }

    p {
        color: #000;
        font-weight: bold;
        hyphens: auto;
        word-wrap: break-word;
        text-align: justify
    }
</style>