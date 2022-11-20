
import BigNumber from 'bignumber.js';

const $number = (val = 1) => {
    return new BigNumber(val);
};

const $shiftedBy = (data, decimals, acc = 0) => {
    if(!data) return 0
    decimals = Number(decimals)
    return Number($number(data).shiftedBy(decimals).toFixed(acc, 1));
};
const $shiftedByToBig = (data, decimals) => {
    if(!data) return 0
    decimals = Number(decimals)
    return $number(data).shiftedBy(decimals).toFixed();
};

const $toFixed = (data, acc) => {
    if((!data && data != 0) || String(data).indexOf('--') != -1) return '--'
    return Number($number(data).toFixed(acc, 1));
};

// input val filter
const $filterNumber = (e) => {
    function clearNoNum(val) {
        // 先把非数字的都替换掉，除了数字和.
        val = val.replace(/[^\d.]/g, '');

        // 保证只有出现一个.而没有多个.
        val = val.replace(/\.{2,}/g, '.');

        // 必须保证第一个为数字而不是.
        val = val.replace(/^\./g, '');

        // 保证.只出现一次，而不能出现两次以上
        val = val.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');

        return val
    }
    e.target.value = clearNoNum(e.target.value);
}

export {
    $shiftedBy,
    $shiftedByToBig,
    $toFixed,
    $filterNumber
};
