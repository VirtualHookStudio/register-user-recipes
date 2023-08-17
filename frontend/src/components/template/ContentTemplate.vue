<template>
    <div class="content">
        <RouterView></RouterView>
    </div>
</template>

<script>
export default {
    name: 'ContentTemplate'
}
</script>

<style>
    .content {
        grid-area: content;
        background-color: #232323;
        padding: 20px;
    }
</style>