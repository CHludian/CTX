<template>
    <div class="mt-6 pingFangRegular">
        <div class="block px-6 rounded-lg border-2 border-gray-600 shadow shadow-purple-700 bg-black mx-4 pb-6">
            <h5 class="text-white text-xl leading-tight rounded-b-lg bg-[#415198] inline-block px-4 py-2">我的数据</h5>
            <div class="text-white mt-8 space-y-4">
                <div class="grid grid-cols-3">
                    <div class="border-r-2 border-dashed border-gray-300/50">
                        <span class="text-sm opacity-70">已质押</span>
                        <p class="gold-text">{{ blockChain.totalStakedOf }}</p>
                    </div>
                    <div class="border-r-2 border-dashed border-gray-300/50">
                        <span class="text-sm opacity-70">质押周期</span>
                        <p class="gold-text">{{ stakeEpoch }}</p>
                    </div>
                    <div>
                        <span class="text-sm opacity-70">收益率</span>
                        <p class="gold-text">{{ earningRate }}{{ blockChain.totalStakedOf > 0 ? '%' : '' }}</p>
                    </div>
                </div>

                <div class="grid grid-cols-3">
                    <div class="border-r-2 border-dashed border-gray-300/50">
                        <span class="opacity-70 text-sm">每日产量</span>
                        <p class="gold-text">{{ dailyProduction }}</p>
                    </div>
                    <div class="border-r-2 border-dashed border-gray-300/50">
                        <span class="text-sm opacity-70">已提取量</span>
                        <p class="gold-text">{{ blockChain.claimedAmount.toFixed(4) }}</p>
                    </div>
                    <div>
                        <span class="text-sm opacity-70">可提取量</span>
                        <p class="gold-text">{{ blockChain.availableRewards.toFixed(4) }}</p>
                    </div>
                </div>
            </div>

            <button class="mt-12 mb-4 dai-btn w-full text-xl rounded-full blue-btn hover:transition-all hover:text-2xl hover-gold-text duration-700" data-mdb-ripple="true" data-mdb-ripple-color="light" @click="blockChain.claimRewards()">提取收益</button>

            <button id="redeemBtn" :class="['mt-2 mb-4 dai-btn w-full text-xl rounded-full ' + ' ', redeemBtn]" data-mdb-ripple="true" data-mdb-ripple-color="light" @click="blockChain.redeem()">赎回本金</button>
        </div>
    </div>
</template>

<script>
import { useBlockChain } from '@/stores/blockChainStore';

export default {
    name: 'partComp3',
    setup() {
        const blockChain = useBlockChain();
        return {
            blockChain,
        };
    },

    data() {
        return {
            period: '',
            periodDefault: '----',
        };
    },

    watch: {
        'blockChain.canRedeem': function () {},
    },

    computed: {
        stakeEpoch: function () {
            let period = this.blockChain.stakeEpoch;

            if (this.blockChain.totalStakedOf === 0) {
                this.period = this.periodDefault;
                return this.period;
            } else {
                this.period = period;
            }

            if (period === 0) {
                return 180;
            } else if (period === 1) {
                return 365;
            } else {
                return 730;
            }
        },

        earningRate: function () {
            let period = this.blockChain.stakeEpoch;

            if (this.period === this.periodDefault) {
                return this.period;
            }

            if (period === 0) {
                return 20;
            } else if (period === 1) {
                return 50;
            } else {
                return 260;
            }
        },

        dailyProduction: function () {
            if (this.period === this.periodDefault) {
                return 0;
            }
            return ((this.blockChain.totalStakedOf * this.earningRate) / 100 / this.stakeEpoch).toFixed(4);
        },

        redeemBtn() {
            // let el = document.querySelector('#redeemBtn')
            // if (!el) {
            //     el = {
            //         textContent: ''
            //     }
            // }
            if (!this.blockChain.canRedeem) {
                return ' pointer-events-none opacity-70 bg-gray-500 ';
            } else {
                return ' blue-btn hover:transition-all hover:text-2xl hover-gold-text duration-700';
            }
        },
    },
};
</script>

<style>
.gold-text {
    background-image: linear-gradient(#ffe9c4, #be9655);
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent; /*需要文字透明*/
}

.hover-gold-text:hover {
    background-image: linear-gradient(#ffe9c4, #be9655);
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent; /*需要文字透明*/
}

.blue-btn {
    background-image: linear-gradient(180deg, rgba(79, 130, 184, 1) 0, rgba(60, 66, 144, 1) 100%);
}
</style>
