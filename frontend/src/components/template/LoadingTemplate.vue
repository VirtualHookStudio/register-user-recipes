<template>
    <div class="loading">
        <img src="@/assets/loading.gif" alt="Loading">
    </div>
</template>

<script>
export default {
    name: 'LoadingTemplate'
}
</script>

<style>
    .loading {
        grid-area: content;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .loading img {
        margin-left: auto;
        margin-right: auto;
        width: 300px;
        height: 300px;
    }
</style>