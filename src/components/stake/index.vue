<template>
    <div>
        <section class="text-center" style="margin-top: -5.5rem">
            <PartComp2/>
        </section>

        <section class="text-center">
            <PartComp3/>
        </section>

        <section class="text-center">
            <PartComp4/>
        </section>

        <section class="h-24"></section>
    </div>
</template>

<script>

import PartComp1 from '@/components/partComp1'
import PartComp2 from '@/components/partComp2'
import PartComp3 from '@/components/partComp3'
import PartComp4 from '@/components/partComp4'

export default {
    name: 'Stake',
    components: {
        PartComp4,
        PartComp3,
        PartComp2,
        PartComp1,
    },
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

.bgdd-part1 {
    background-image: url("../../assets/images/rect1.png");
    background-position: top;
    background-size: cover;
}
</style>
