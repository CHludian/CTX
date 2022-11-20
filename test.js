function fn() {
    console.log('立即。执行');
    return fn    // 函数中返回自身
}
setInterval(fn(), 1000)    // 定时器中，函数先执行一次
