$.ajaxPrefilter(function(options) {
    options.url = 'http://ajax.frontend.itheima.net' + options.url

    // 统一为有权限的接口设置hraders
    options.headers = {
        Authorization: localStorage.getItem('token') || ''
    };
    // 全局统一挂载 complete 回调函数(请求完成或者失败都会执行complete)
    options.complete = function(res) {
        // console.log('执行了 complete 回调函数');
        // console.log(res);
        // 如果身份验证失败，清除token，跳转至login页
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            localStorage.removeItem('token');
            location.href = '/login.html';
        }
    }
})