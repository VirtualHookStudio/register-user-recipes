<template>
    <footer class="footer">
        <span>Copyright <strong>VirtualHookStudio</strong> ©2023</span>
    </footer>
</template>

<script>
export default {
    name: 'FooterTemplate'
}
</script>

<style>
    .footer {
        grid-area: footer;
        background-color: #0C0C0C;
        color: white;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding-right: 10px;
    }
</style>