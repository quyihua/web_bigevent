$(function() {

    $('.login_box').on('click', 'a', function() {
        $('.login_box').hide()
        $('.reg_box').show()
    })

    $('.reg_box').on('click', 'a', function() {
        $('.login_box').show()
        $('.reg_box').hide()
    })

    // 从 layui 获取对象
    var form = layui.form
    var layer = layui.layer

    // 表单验证
    form.verify({
        // 密码
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 确认密码,value 当前密码确认框的值
        repwd: function(value) {
            var pwd = $('.reg_box [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一致！';
            }
        }
    })

    // 发起注册请求
    $('#form_reg').on('submit', function(e) {
        e.preventDefault()
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        }
        $.post('/api/reguser', data, function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            layer.msg('注册成功，请登录！');
            $('#form_reg a').click()
        })
    })

    // 发起登录请求
    $('#form_login').submit(function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('登录失败！');

                }
                layer.msg('登录成功！');
                // 将身份认证得到的token，存到localStorage里
                localStorage.setItem('token', res.token);
                // 页面跳转至后台主页
                location.href = '/index.html'
            }
        })
    })
})