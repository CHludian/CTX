<template>
    <main class="container mx-auto bg-black max-w-[450px] overflow-x-hidden ">
        <PartComp1/>
    </main>
</template>

<script>

import PartComp1 from '@/components/partComp1'
import PartComp2 from '@/components/partComp2'
import PartComp3 from '@/components/partComp3'
import PartComp4 from '@/components/partComp4'
import {useBlockChain} from '@/stores/blockChainStore'

export default {
    name: 'App',
    components: {
        PartComp4,
        PartComp3,
        PartComp2,
        PartComp1,
    },

    setup() {
        const blockChain = useBlockChain()
        return {
            blockChain
        }
    },

    mounted() {
        this.blockChain.init_blockChain()
        // 自动登录
        if (localStorage.getItem('isLogin')) {
            this.blockChain.connectWallet()
        }

        const blockChain = this.blockChain
        if (window.ethereum) {
            window.ethereum.on("accountsChanged", async function (accounts) {
                await blockChain.connectWallet()
            })
            //当所连接网络ID变化时触发
            window.ethereum.on("chainChanged", (networkIDstring) => {
                console.log('链切换', networkIDstring)
                window.location.reload();
            })
        }

    }
}
</script>

<style lang="scss">
/*#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}*/
html, body{
    height: 100%;
}
.container{
    height: 100%;
    overflow-y: auto;
}
.bgdd-part1 {
    background-image: url("./assets/images/rect1.png");
    background-position: top;
    background-size: cover;
}
</style>
