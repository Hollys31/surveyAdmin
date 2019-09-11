<template>
    <vue-scroll class="scroll" :ops="scrollOptions">
        <slot></slot>
    </vue-scroll>
</template>

<script>
/**
 */
export default {
    name: 'Scroll',
    data () {
        return {
            scrollOptions: {
                scrollPanel: {
                    right: -10,
                    scrollingX: false,
                },
                vuescroll: {
                    mode: 'native',
                    zooming: false,
                },
                bar: {
                    keepShow: true,
                    size: '4px',
                    background: '#00BBDC'
                }
            },
        }
    }
}
</script>