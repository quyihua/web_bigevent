$(function() {
    var form = layui.form
    var layer = layui.layer

    // 表单验证
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称长度必须在 1~6 个字符之间！'
            }
        }
    })

    // 调用
    initUserInfo()

    // 初始化用户基本信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.mag('获取用户信息失败！')
                }
                // 获取成功 将数据给 form_user表单
                // 表单赋值 调用 form.val()方法，给哪个表单赋值(lay-filter属性的值)，数据是
                form.val('form_user', res.data)
            }
        })
    }

    // 监听重置按钮 点击事件   重置表单数据
    $('#btnReset').on('click', function(e) {
        e.preventDefault()
        initUserInfo()
    })

    //监听表单提交事件  
    $('.layui-form').on('submit', function(e) {
        e.preventDefault()

        // 更新用户信息
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败！')
                }
                layer.msg('更新用户信息成功！')

                // 子调用父 index.js 的方法  
                // window.parent.方法()
                window.parent.getUserInfo()
            }
        })

    })
})