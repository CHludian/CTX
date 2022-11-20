<template>
    <div class="mt-6 pingFangRegular">
        <div class="block px-6 rounded-lg border-2 border-gray-600 shadow shadow-purple-700 bg-black mx-4">
            <button @click="blockChain.connectWallet()"
                class="text-white text-xl leading-tight rounded-b-lg
                 bg-[#415198] inline-block px-4 py-2"
            >
                {{ connect }}
            </button>
            <p class="text-white text-start my-5 opacity-70">
                {{ account }}
            </p>
        </div>
    </div>
</template>

<script>
import {useBlockChain} from '@/stores/blockChainStore'

export default {
    name: "partComp4",
    setup() {
        const blockChain = useBlockChain()
        return {
            blockChain
        }
    },

    computed: {
        account: function () {
            let account = this.blockChain.account
            if (account.length < 32) {
                return account
            } else {
                return account.slice(0, 6) + '...' + account.slice(-6)
            }
        },

        connect: function () {
            let account = this.blockChain.account
            if (account.length < 32) {
                return "点击连接钱包"
            } else {
                return "我的账户"
            }
        },
    },

}
</script>

<style scoped>

</style>