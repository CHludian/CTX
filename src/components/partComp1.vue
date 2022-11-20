<template>
    <div>
        <div class="text-center img-bg">
            <img class="mx-auto px-6 pt-12" src="../assets/images/textCtx.png" alt="" />
            <div class="nav mx-4">
                <div v-for="(item, index) in ['兑换', '质押']" :key="index" :class="active === index && 'active'" @click="active = index">{{ item }}</div>
            </div>
        </div>
        <Stake v-if="active === 1" />
        <Swap v-else />
    </div>
</template>

<script>
import Stake from '@/components/stake'
import Swap from '@/components/swap'
export default {
    name: 'partComp1',
    components: {
        Stake,
        Swap,
    },
    data(){
        return{
            active: 0
        }
    }
};
</script>

<style scoped lang="scss">
.img-bg {
    background-image: url('../assets/images/rect1.png');
    background-position: top;
    background-size: cover;
    padding-bottom: 7rem;
    img {
        margin-bottom: 30px;
    }
    .nav {
        height: 44px;
        display: flex;
        background-image: url('../assets/images/nav_bg.png');
        background-size: 100% 100%;
        div {
            text-align: center;
            flex: 1;
            height: 44px;
            line-height: 44px;
            color: #FFFFFF;
            opacity: .7;
            &.active {
                background-image: url('../assets/images/nav_active.png');
                background-size: 100% 100%;
                opacity: 1;
            }
        }
    }
}
</style>
