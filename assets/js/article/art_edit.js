$(function() {
    var form = layui.form
    var layer = layui.layer
        // 通过 URLSearchParams 对象，获取 URL 传递过来的参数
        // location.search 获取url查询参数部分 ？xxxxx
    var params = new URLSearchParams(location.search)
    var artId = params.get('id') //artId即 传过来的id值

    // 定义文章发布状态
    var pubState = ""

    initCate()

    // 发起请求 获取文章类别
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章类别失败！')
                }
                // console.log(res);
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
                articleDetails(artId)
            }
        });
    }

    // // 发起请求 根据 Id 获取文章详情 并渲染页面
    function articleDetails(artId) {
        $.ajax({
            method: 'GET',
            url: '/my/article/' + artId,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章失败！')
                }
                // console.log(res);
                // 获取成功 赋值
                var art = res.data
                form.val('form_edit', {
                    Id: art.Id,
                    title: art.title,
                    cate_id: art.cate_id,
                    content: art.content,
                });
                // 初始化富文本编辑器
                initEditor();
                // 1. 初始化图片裁剪器
                var $image = $('#image')
                $image.attr('src', 'http://ajax.frontend.itheima.net' + res.data.cover_img);
                // 2. 裁剪选项
                var options = {
                    aspectRatio: 400 / 280,
                    preview: '.img-preview'
                };
                // 3. 初始化裁剪区域
                $image.cropper(options)
            }
        })
    }

    // 点击选择封面
    $('#btnChooseImage').on('click', function(e) {
        e.preventDefault();
        $('#coverFile').click()
    });

    // coverFile change事件
    $('#coverFile').on('change', function(e) {
        var fileList = e.target.files
        if (fileList.length === 0) {
            return
        };
        // 拿到用户选择的文件 fileList[0]
        // 根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(fileList[0]);
        // console.log(newImgURL);
        // 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
        $('#image')
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper({
                aspectRatio: 400 / 280,
                preview: '.img-preview'
            }) // 重新初始化裁剪区域
    })

    // 设置文章的发布状态
    $('#btnPublish').on('click', function() {
        pubState = '已发布'
    })
    $('#btnSave').on('click', function() {
        pubState = '草稿'
    })

    // 为表单绑定 提交 事件
    $('#form_edit').on('submit', function(e) {
        e.preventDefault();

        // 将裁剪后的图片，输出为文件
        $('#image')
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 基于form表单，创建formdata对象
                var fd = new FormData($('#form_edit')[0]);
                fd.append('cover_img', blob);
                fd.append('state', pubState);
                // 调用函数 发起请求
                publishArticle(fd)
            })
    })

    // 发布文章 ajax请求
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/edit',
            data: fd,
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('修改文章失败！')
                }
                layer.msg('修改文章成功！');
                // console.log(res);

                // 跳转到 文章列表页
                location.href = '/article/art_list.html'
            }
        })
    }
})