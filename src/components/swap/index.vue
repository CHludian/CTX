<template>
    <div>
        <section class="text-center" style="margin-top: -5.5rem">
            <SwapRule />
        </section>

        <section>
            <div class="flex justify-center mt-6 pingFangRegular">
                <div class="content block w-full px-6 rounded-lg border-2 border-gray-600 shadow shadow-purple-700 bg-black mx-4 pb-6">
                    <div class="address">地址: {{ $hash(blockChain.account) }}</div>
                    <div class="title text-white text-left text-xl">{{ state.price }} USDT/CTX</div>
                    <div class="lib">
                        <div class="token">
                            <img :src="state.from.icon" alt="" />
                            {{ state.from.token }}
                        </div>
                        <div class="cont">
                            <input type="text" v-model.trim="state.from.amount" @input="$filterNumber" @keyup="amountChange('from',state.from.token)" class="text-[13px] appearance-none text-gray-700 placeholder-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" placeholder="请输入兑换数量" />
                            <div class="right">
                                <p class="balance">{{ state.from.balance }}</p>
                                <div class="btn" @click="setMax('from')">max</div>
                            </div>
                        </div>
                    </div>
                    <img class="change" src="../../assets/images/change.png" alt="" @click="changeFrom()" />
                    <div class="lib">
                        <div class="token">
                            <img :src="state.to.icon" alt="" />
                            {{ state.to.token }}
                        </div>
                        <div class="cont">
                            <input type="text" v-model.trim="state.to.amount" @input="$filterNumber" @keyup="amountChange('to',state.to.token)" class="text-[13px] appearance-none text-gray-700 placeholder-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" placeholder="请输入兑换数量" />
                            <div class="right">
                                <p class="balance">{{ state.to.balance }}</p>
                                <div class="btn" @click="setMax('to')">max</div>
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-between text-white mt-9">
                        <el-button style="margin-right: 20px; padding: 0 1rem; width: 45%;" class="text-lg blue-btn" data-mdb-ripple="true" data-mdb-ripple-color="light" @click="approve()" :loading="state.approve_loding">批准</el-button>
                        <el-button style="padding: 0 1rem; width: 45%;" :class='[state.isClickApprove ? "text-lg blue-btn" : "text-lg bg-gray-600/[0.7] text-white opacity-50"]' data-mdb-ripple="true" data-mdb-ripple-color="light" :loading="state.swap_loding" @click="state.isClickApprove && swap()">兑换</el-button>
                    </div>
                    <p class="text-red-600 text-center text-[12px] mt-6 pb-3" >提示: 请先批准, 再开始质押</p>
                </div>
            </div>
        </section>

        <section class="text-center">
            <PartComp4/>
        </section>
    </div>
</template>

<script>
import SwapRule from './swapRule';
import { useBlockChain } from '@/stores/blockChainStore';
import { ElMessage, ElButton } from 'element-plus';
import USDT from '../../assets/images/usdt.png';
import CTX from '../../assets/images/ctx.png';
import { $toFixed, $shiftedBy, $shiftedByToBig } from '@/utils';
import { watch, reactive } from 'vue';
import PartComp4 from '@/components/partComp4'

// 代币CTX合约地址：0x2dc8C24e82bE23A83d25a4f86b87847690BFe425
// 兑换合约地址：0xd31fBEf33901788ee4249f28F73bD9e46912ab74
// 质押合约地址：0x05f6d40CE0711A03d1311d6f0DFE56697EC13453
// 测试USDT地址：0x593f55EF95be8C327F5B3193Bce8086Da3518140
export default {
    name: 'Swap',
    components: {
        SwapRule,
        ElButton,
        PartComp4
    },
    setup() {
        let state = reactive({
            price: 0.33,
            isClickApprove: false,
            approve_loding: false,
            swap_loding: false,
            config: {
                56: {
                    swap: '0x08b185De6a0D2304Fd036C170443279663619e56',
                    USDT: '0x55d398326f99059fF775485246999027B3197955',
                    CTX: '0x9048FEcDcd3dfe05a47F715758864c68A5738eBB',
                },
                97: {
                    swap: '0xd31fBEf33901788ee4249f28F73bD9e46912ab74',
                    USDT: '0x593f55EF95be8C327F5B3193Bce8086Da3518140',
                    CTX: '0x2dc8C24e82bE23A83d25a4f86b87847690BFe425',
                },
            },
            from: {
                icon: USDT,
                amount: '',
                balance: 0.0,
                address: '',
                token: 'USDT',
                allowance: 0,
            },
            to: {
                icon: CTX,
                amount: '',
                balance: 0.0,
                token: 'CTX',
                address: '',
                allowance: 0,
            },
        });
        const blockChain = useBlockChain();
        watch(
            () => blockChain.account,
            () => {
                state.from.address = state.config[blockChain.chainId].USDT;
                state.to.address = state.config[blockChain.chainId].CTX;
                getTokenBalance();
            }
        );

        const getTokenBalance = async () => {
            console.log('USDT', state.from.address);
            console.log('CTX', state.to.address);
            const from_balance = await blockChain.getBalance(state.from.address);
            const to_balance = await blockChain.getBalance(state.to.address);
            state.from.balance = $shiftedBy(from_balance, -18, 4);
            state.to.balance = $shiftedBy(to_balance, -18, 4);

            // const decimals = await blockChain.getTokenDecimals(state.from.address);

            const price = await blockChain.getPrice(state.config[blockChain.chainId].swap);
            state.price = $shiftedBy(price, -18, 4);
        };

        const $hash = (txHash, length = 4, lastLength = 6) => {
            if (!txHash) {
                return '--';
            }
            if (!lastLength) lastLength = length;
            return txHash.substring(0, length) + '...' + txHash.substring(txHash.length - lastLength, txHash.length);
        };
        const changeFrom = () => {
            const _from = JSON.parse(JSON.stringify(state.from));
            state.from = state.to;
            state.to = _from;
            state.isClickApprove = false
        };

        const approve = async () => {
            try {
                const _amount_ary = state.from.amount.toString().split('.');
                if (isNaN(state.from.amount) || Number(state.from.amount) <= 0 || (state.from.amount.toString().indexOf('.') !== -1 && !_amount_ary[1])) {
                    ElMessage({
                        showClose: true,
                        message: '请填写正确的数量',
                        type: 'error',
                        duration: 2500,
                    });
                    return;
                }
            } catch (e) {
                ElMessage({
                    showClose: true,
                    message: '请填写正确的数量',
                    type: 'error',
                    duration: 2500,
                });
                return;
            }
            state.approve_loding = true;
            blockChain.approve(state.config[blockChain.chainId].swap, state.from.address, $shiftedByToBig(state.from.amount, 18)).finally(() => {
            // blockChain.approve(state.config[blockChain.chainId].swap, state.from.address,state.from.amount).finally(() => {
                state.approve_loding = false;
                state.isClickApprove = true;
            });
        };

        const amountChange = (type, token) => {
            console.log(state.from.amount);
            setTimeout(() => {
                if (type === 'from') {
                    if(token === 'USDT'){
                        state.to.amount = $toFixed(state.from.amount / state.price, 6);
                    }else{
                        state.to.amount = $toFixed(state.from.amount * state.price, 6);
                    }
                } else {
                    if(token === 'USDT'){
                        state.from.amount = $toFixed(state.to.amount / state.price, 6);
                    }else{
                        state.from.amount = $toFixed(state.to.amount * state.price, 6);
                    }
                }
            }, 1000);
        };
        const setMax = type => {
            if (type === 'from') {
                state.from.amount = $toFixed(state.from.balance, 6);
                state.to.amount = $toFixed(state.from.balance * state.price, 6);
            } else {
                state.to.amount = $toFixed(state.to.balance, 6);
                state.from.amount = $toFixed(state.to.balance / state.price, 6);
            }
        };
        const swap = async () => {
            try {
                state.swap_loding = true;
                const allowance = await blockChain.getAllowance(state.from.address, state.config[blockChain.chainId].swap);
                console.log('allowance========', allowance);
                if (allowance < Number(state.from.amount)) {
                    ElMessage({
                        showClose: true,
                        message: '批准余额不足',
                        type: 'error',
                        duration: 2500,
                    });
                    state.swap_loding = false;
                    return;
                } else {
                    blockChain
                        .swap(state.config[blockChain.chainId].swap, $shiftedByToBig(state.from.amount, 18), state.from.token)
                        .then(res => {
                            state.from.amount = '';
                            state.to.amount = '';
                            state.isClickApprove = false;
                            getTokenBalance();
                        })
                        .finally(() => {
                            state.swap_loding = false;
                        });
                }
            } catch (e) {
                state.swap_loding = false;
            }
        };
        return {
            state,
            blockChain,
            $hash,
            changeFrom,
            approve,
            amountChange,
            setMax,
            swap,
        };
    },

};
</script>

<style lang="scss">
.el-button {
    border: none;
    border-radius: var(--rounded-btn, 0.5rem);
    height: 3rem;
    
    padding-left: 3.2rem;
    padding-right: 3.2rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    line-height: 1em;
    min-height: 3rem;
    font-weight: 600;
    .is-loading {
        font-size: 22px;
        position: relative;
        top: 4px;
        margin-right: 10px;
    }
    &:focus-visible,
    &:hover,
    &:active,
    &:focus,
    &:focus-visible,
    &:visited {
        outline: none !important;
        outline-offset: 0 !important;
    }
}
.dai-btn-disabled,
.dai-btn[disabled] {
}
</style>
<style lang="scss" scoped>
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
.content {
    position: relative;
    padding-top: 59px;
    .address {
        position: absolute;
        right: 0;
        top: 0;
        display: inline-block;
        height: 28px;
        line-height: 28px;
        padding: 0 20px;
        border-radius: 0 8px 0 8px;
        background: rgb(57, 71, 143);
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #ffffff;
    }
    .title {
        margin-bottom: 29px;
    }
    .lib {
        width: 100%;
    }
    .token {
        height: 31px;
        line-height: 31px;
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #ffffff;
        margin-bottom: 14px;
        img {
            height: 100%;
            margin-right: 7px;
            position: relative;
            top: -1px;
            display: inline-block;
        }
    }
    .cont {
        position: relative;
        width: 100%;
        height: 64px;
        padding: 0 90px 0 12px;
        background: #ededed;
        border-radius: 7px;
        input {
            width: 100%;
            height: 100%;
            font-size: 20px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 500;
            color: #000;
            background: rgba(255, 255, 255, 0);
            border: none;
        }
    }

    .right {
        position: absolute;
        top: 10px;
        right: 17px;
    }
    .balance {
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #000000;
        height: 19px;
        line-height: 19px;
        /* margin-bottom: 7px; */
        text-align: right;
        padding-right: 4px;
    }
    .btn {
        background: #d8d8d8;
        border-radius: 9px;
        border: 1px solid #979797;
        height: 18px;
        line-height: 16px;
        padding: 0 10px;
        display: inline-block;
        font-size: 11px;
        font-family: PingFangSC-Regular, PingFang SC;
        color: #000000;
    }
    .change {
        height: 43px;
        margin: 29px auto 26px;
        cursor: pointer;
    }
}
</style>
