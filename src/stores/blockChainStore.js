import { defineStore } from 'pinia';
import { ethers } from 'ethers';
import { ElMessage } from 'element-plus';
import 'element-plus/es/components/message/style/css';


import abi_ctxStake from '@/stores/abi_ctxStake';
import abi_ctxToken from './abi_ctxToken';
import abi_swap from './abi_swap';
/*
* rinkeby测试网
质押合约地址：0x7340E7C8FeA2F20Fa9da46deC549Bd7492a465b6
ctx代币地址： 0x3C3E56c354712543d77A4C849CDe25b5e90AB963
* */

const ctx_tokenAddress = '0x9048FEcDcd3dfe05a47F715758864c68A5738eBB';
const ctx_stakeAddress = '0x6AeDD7Ccd01565a51328571683b11388D7F7295A';

const infra_key = 'https://bsc-dataseed3.ninicoin.io';
const networkId = 56; // rinkeby 测试网络

const sleep = (time = 5000) => {
    return new Promise(resolve => setTimeout(resolve, time));
};

const getProvider = () => {
    if (!window.ethereum) {
        return new ethers.providers.JsonRpcProvider(infra_key);
    } else {
        return new ethers.providers.Web3Provider(window.ethereum, 'any');
    }
};

export const useBlockChain = defineStore('block-chain-store', {
    state() {
        // 锁，自动登录时不显示两次错误
        let firstLock = true;
        if (localStorage.getItem('isLogin')) {
            firstLock = false;
        }

        return {
            // 其它变量
            shareId: '',
            firstLock,

            // web3变量
            provider: undefined,
            account: '请先连接BSC钱包', // 当前钱包地址
            chainId: 56, // 当前钱包地址
            signer: undefined, //签名者,
            ctxToken: undefined, //ctx 代币合约
            ctxStake: undefined, // ctx 质押合约

            //  ctx 质押合约变量
            userInfo: {}, // 用户信息
            totalStakedOf: 0, //已质押数量
            claimedAmount: 0, //已提取量
            stakeEpoch: 0, //质押周期
            availableRewards: 0, //可提取量
            isApproveCtx: false, //是否质押过Ctx, 只要有余额就判定为true
            canRedeem: false, //是否可以赎回本金
        };
    },

    actions: {
        async init_blockChain() {
            let provider = getProvider();
            this.provider = provider;

            this.ctxStake = new ethers.Contract(ctx_stakeAddress, abi_ctxStake, provider);

            if (!window.ethereum) {
                ElMessage({
                    showClose: true,
                    message: 'Metamask未安装',
                    type: 'error',
                    duration: 2000,
                });
                return;
            }

            if (Number((await provider.getNetwork()).chainId) !== networkId) {
                // ElMessage({
                //     showClose: true,
                //     message: '请选择正确的网络',
                //     type: 'error',
                //     duration: 2500,
                // });
            }
        },

        async connectWallet() {
            if (Number((await this.provider.getNetwork()).chainId) !== networkId && this.firstLock) {
                // ElMessage({
                //     showClose: true,
                //     message: '请连接正确的网络',
                //     type: 'error',
                //     duration: 2500,
                // });
            } else {
                this.firstLock = true;
            }
            //判定当前是否为第一次登录
            let isLogin = localStorage.getItem('isLogin');
            if (!isLogin) {
                //设置isLogin，下次刷新自动登录
                localStorage.setItem('isLogin', true);
            }

            // --------- 连接后刷新web3 及 合约数据
            this.chainId = Number((await this.provider.getNetwork()).chainId);
            let accounts = await this.provider.send('eth_requestAccounts', []);
            this.account = accounts[0];
            this.signer = this.provider.getSigner();
            this.ctxStake = new ethers.Contract(ctx_stakeAddress, abi_ctxStake, this.signer);
            this.ctxToken = new ethers.Contract(ctx_tokenAddress, abi_ctxToken, this.signer);

            // ---------- 获取 ctx 质押合约中的数据
            const flushData = async () => {
                // console.log('flash')
                this.userInfo = await this.ctxStake.userInfo(this.account);
                this.stakeEpoch = Number(ethers.utils.formatUnits(this.userInfo['stakeEpoch'], 'wei'));
                this.claimedAmount = Number(ethers.utils.formatUnits(this.userInfo['claimedAmount'], 'ether'));
                this.totalStakedOf = Number(ethers.utils.formatUnits(this.userInfo['totalStakedOf'], 'ether'));
                this.availableRewards = Number(ethers.utils.formatUnits(await this.ctxStake.availableRewards(), 'ether'));
                this.canRedeem = await this.ctxStake.canRedeem();
                await this.judgeApproveAllowance();
            };

            await flushData();
            setInterval(async () => {
                // console.log('interval')
                await flushData();
            }, 3000); // 3秒刷新一个块

            // setTimeout(()=>{
            //     this.totalStakedOf = 4345
            // },5000)

            // console.log('canRedeem', this.canRedeem, typeof this.canRedeem)
            // console.log('availableRewards', this.availableRewards, typeof this.availableRewards)
            // console.log('userInfo', this.userInfo)
            // console.log('claimedAmount', this.claimedAmount, typeof this.claimedAmount)  // 已提取量
            // console.log('stakeEpoch', this.stakeEpoch, typeof this.stakeEpoch)  // 质押周期
            // console.log('totalStakedOf', this.totalStakedOf, typeof this.totalStakedOf)  //已质押数量
            // console.log('isApproveCtx',this.isApproveCtx)
        },

        async claimRewards() {
            // 提取收益
            try {
                await this.ctxStake.claimRewards({
                    gasLimit: 300000,
                    gasPrice: await this.provider.getGasPrice(),
                });
            } catch (e) {
                ElMessage({
                    showClose: true,
                    message: '交易失败',
                    type: 'error',
                    duration: 2500,
                });
            }
        },

        async approveCtx(amount) {
            // 批准CTX

            let amount1 = amount.toString();

            try {
                console.log('how much approve ctx', amount1, ethers.utils.parseEther(amount1));
                await this.ctxToken.approve(ctx_stakeAddress, ethers.utils.parseEther(amount1));
                this.isApproveCtx = true;
            } catch (e) {
                ElMessage({
                    showClose: true,
                    message: '批准失败',
                    type: 'error',
                    duration: 2500,
                });
            }
        },

        async judgeApproveAllowance() {
            // 判断是否有批准余额
            let allowance = Number(ethers.utils.formatEther(await this.ctxToken.allowance(this.account, ctx_stakeAddress)));
            // console.log('allowance', allowance, typeof allowance)
            this.isApproveCtx = allowance > 0;
        },

        async stakeCtx(period, amount) {
            // 质押 Ctx

            let allowance = Number(ethers.utils.formatEther(await this.ctxToken.allowance(this.account, ctx_stakeAddress)));

            if (allowance < amount) {
                ElMessage({
                    showClose: true,
                    message: '批准余额不足',
                    type: 'error',
                    duration: 2500,
                });
                return;
            }

            try {
                // console.log('stake success')
                await this.ctxStake.stake(String(period), ethers.utils.parseEther(String(amount)), {
                    gasLimit: 300000,
                    gasPrice: await this.provider.getGasPrice(),
                });
            } catch (e) {
                ElMessage({
                    showClose: true,
                    message: '质押失败',
                    type: 'error',
                    duration: 2500,
                });
            }
        },

        async redeem() {
            if (this.canRedeem) {
                try {
                    await this.ctxStake.redeem({
                        gasLimit: 300000,
                        gasPrice: await this.provider.getGasPrice(),
                    });
                } catch (e) {
                    ElMessage({
                        showClose: true,
                        message: '赎回失败',
                        type: 'error',
                        duration: 2500,
                    });
                }
            } else {
                ElMessage({
                    showClose: true,
                    message: '质押尚未结束',
                    type: 'error',
                    duration: 2500,
                });
            }
        },

        async getAllowance(token_address, contract_address) {
            const token = new ethers.Contract(token_address, abi_ctxToken, this.signer)
            const allowance = await token.allowance(this.account, contract_address);
            console.log('allowance', allowance)
            return Number(ethers.utils.formatEther(allowance));
        },
        async getBalance(token_address) {
            const token = new ethers.Contract(token_address, abi_ctxToken, this.signer)
            const balance = await token.balanceOf(this.account)
            return balance.toString()
        },

        async getPrice(contract_address) {
            const token = new ethers.Contract(contract_address, abi_swap, this.signer)
            console.log('getPrice----', token)
            const price = await token.price();
            console.log('price----', price)
            return price.toString()
        },

        async getTokenDecimals(token_address) {
            const token = new ethers.Contract(token_address, abi_ctxToken, this.signer)
            console.log(await token.decimals())
            return await token.decimals();
            // return Number(ethers.utils.formatEther(await this.ctxToken.decimals(address)));
        },

        async approve(contract_address, token_address, amount) {
            try {
                let amount1 = amount;
                // let amount1 = ethers.utils.parseEther(amount);
                const token = new ethers.Contract(token_address, abi_ctxToken, this.signer)
                const result = await token.approve(contract_address, amount1);
                await sleep(10000);
                const res = await this.provider.getTransactionReceipt(result.hash)
                if(res.status){
                    ElMessage({
                        showClose: true,
                        message: '批准成功',
                        type: 'success',
                        duration: 2500,
                    });
                    return res.status
                }else{
                    throw('approve fail')
                }
            } catch (e) {
                ElMessage({
                    showClose: true,
                    message: '批准失败',
                    type: 'error',
                    duration: 2500,
                });
                throw(e)
            }
        },

        async swap(contract_address, amount, tokenName) {
            try {
                const token = new ethers.Contract(contract_address, abi_swap, this.signer)
                console.log('swap', contract_address, tokenName, token, amount)

                let result;
                if(tokenName === 'USDT'){
                    result = await token.buy(amount);
                }else{
                    result = await token.sell(amount);
                }
                
                await sleep(10000);
                const res = await this.provider.getTransactionReceipt(result.hash)
                if(res.status){
                    ElMessage({
                        showClose: true,
                        message: '兑换成功',
                        type: 'success',
                        duration: 2500,
                    });
                    return res.status
                }else{
                    throw('swap fail')
                }
            } catch (e) {
                ElMessage({
                    showClose: true,
                    message: '兑换失败',
                    type: 'error',
                    duration: 2500,
                });
            }
        },
    },
});
