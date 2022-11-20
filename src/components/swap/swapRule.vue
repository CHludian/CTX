<template>
    <div class="flex justify-center pingFangRegular">
        <div class="block px-6 rounded-lg border-2 border-gray-600 shadow shadow-purple-700 bg-black mx-4 pb-6">
            <h5 class="text-white text-xl leading-tight rounded-b-lg bg-[#415198] inline-block px-4 py-2">兑换规则</h5>
            <ul class="space-y-4 mt-6">
                <li class="text-white text-[13px] text-left list-decimal leading-6 opacity-70">买入卖出均统一使用USDT进行结算，兑换比例按照当时汇率为准</li>
                <li class="text-white text-[13px] text-left list-decimal leading-6 opacity-70">买入无划点，1:1实时兑换到账</li>
                <li class="text-white text-[13px] text-left list-decimal leading-6 opacity-70">卖出时扣除％20划点到账，扣除部分自动销毁</li>
            </ul>
        </div>
    </div>
</template>

<script>

export default {
    name: 'SwapRule',
};
</script>

