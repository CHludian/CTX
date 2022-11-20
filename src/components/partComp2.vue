<template>
    <div >
        <div class="flex justify-center pingFangRegular">
            <div class="block px-6 rounded-lg border-2 border-gray-600 shadow shadow-purple-700 bg-black mx-4 pb-6">
                <h5 class="text-white text-xl leading-tight rounded-b-lg bg-[#415198] inline-block px-4 py-2">质押规则说明</h5>
                <ul class="space-y-4 mt-6">
                    <li class="text-white text-[13px] text-left list-decimal leading-6 opacity-70">三种质押周期可供选择，分别为180天，365天，730天对应的固定收益率分别为20%，50%，260%</li>
                    <li class="text-white text-[13px] text-left list-decimal leading-6 opacity-70">质押收益每两年减半，质押收益每日可提取，质押本金在质押周期结束后可一次性提取</li>
                </ul>
            </div>
        </div>
        <div class="flex justify-center mt-6 pingFangRegular">
            <div class="block w-full px-6 rounded-lg border-2 border-gray-600 shadow shadow-purple-700 bg-black mx-4 pb-6">
                <div class="text-white text-left text-xl mt-8">质押CTX</div>
                <div class="block mt-6 relative">
                    <select v-model="period" class="block w-full py-2 pl-4 text-[13px] appearance-none text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" aria-label=".form-select-sm example">
                        <option selected>请选择质押周期</option>
                        <option value="0">180天</option>
                        <option value="1">365天</option>
                        <option value="2">730天</option>
                    </select>
                    <img class="w-4 h-4 absolute top-3 right-4 pointer-events-none opacity-70" src="../assets/images/triangle.png" alt="" />
                </div>
                <div class="block mt-6 relative">
                    <input type="number" v-model.number="stakeAmount" class="block w-full py-2 pl-4 text-[13px] appearance-none text-gray-700 placeholder-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" placeholder="请输入质押/批准数量" />
                </div>

                <div class="flex justify-between text-white mt-9">
                    <button class="dai-btn px-14 text-lg blue-btn" data-mdb-ripple="true" data-mdb-ripple-color="light" @click="approveCTX()">批准</button>
                    <button @click="stakeCTX()" :class="['dai-btn px-14 text-lg blue-btn', blockChain.isApproveCtx ? '' : 'hidden']" data-mdb-ripple="true" data-mdb-ripple-color="light">质押</button>
                    <button :class="['dai-btn px-14 text-lg bg-gray-600/[0.7]' + ' text-white pointer-events-none opacity-50', !blockChain.isApproveCtx ? '' : 'hidden']" data-mdb-ripple="true" data-mdb-ripple-color="light">质押</button>
                </div>
                <p class="text-red-600 text-[12px] mt-6 pb-3">提示: 请先批准, 再开始质押</p>
            </div>
        </div>
    </div>
</template>

<script>
import { useBlockChain } from '@/stores/blockChainStore';
import { ElMessage } from 'element-plus';

export default {
    name: 'partComp2',
    setup() {
        const blockChain = useBlockChain();
        return {
            blockChain,
        };
    },

    data() {
        return {
            stakeAmount: '',
            period: '请选择质押周期',
        };
    },

    /*    watch: {
            stakeAmount: function (newV) {
                console.log('stakeAmount', newV, typeof newV)
                console.log('type = number', typeof newV === 'number')
                console.log('type = string',typeof newV === 'string')
            },
        },*/

    methods: {
        async approveCTX() {
            if (typeof this.stakeAmount !== 'number') {
                ElMessage({
                    showClose: true,
                    message: '请填写正确的数量',
                    type: 'error',
                    duration: 2500,
                });
                return;
            }

            await this.blockChain.approveCtx(this.stakeAmount);
        },

        async stakeCTX() {
            if (this.period.length > 4 || typeof this.stakeAmount !== 'number') {
                ElMessage({
                    showClose: true,
                    message: '请填写正确的参数',
                    type: 'error',
                    duration: 2500,
                });
                return;
            }

            await this.blockChain.stakeCtx(this.period, this.stakeAmount);
        },
    },
};
</script>

<style scoped>
/* 谷歌 */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    appearance: none;
    margin: 0;
}

/* 火狐 */
input {
    -moz-appearance: textfield;
}
</style>
