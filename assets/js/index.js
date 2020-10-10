$(function() {
    // 调用用户基本信息
    getUserInfo();

    // 退出
    $('#logOut').on('click', function() {
        // console.log('ok');
        layui.layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {
            //清空taken
            localStorage.removeItem('token');
            // 跳转至登录页
            location.href = 'login.html';

            // 关闭询问框
            layer.close(index);
        });
    })
})

// 获取用户基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers 请求头配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg(res.message)
            }
            // console.log(res);
            renderAvatar(res.data);
        },
        // 请求完成或者失败都会执行complete
        // complete: function(res) {
        //     // console.log('执行了 complete 回调函数');
        //     // console.log(res);
        //     // 如果身份验证失败，清除token，跳转至login页
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         localStorage.removeItem('token');
        //         location.href = '/login.html';
        //     }
        // }
    })
}

// 更改头像
function renderAvatar(user) {
    var name = user.nickname || user.username
    $('.welcome').html('欢迎&nbsp;&nbsp;' + name)
    if (user.user_pic !== null) {
        // 显示图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text_avatar').hide()
    } else {
        // 显示文字头像
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text_avatar').html(first).show()
    }
}