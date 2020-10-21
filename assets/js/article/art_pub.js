$(function() {
    var layer = layui.layer
    var form = layui.form

    initCate()

    // 初始化富文本编辑器
    initEditor()

    // 获取文章类别
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章类别失败！')
                }
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)

                // 表单动态插入，渲染失效  form.render()
                form.render()
            }
        })
    }

    // 封面裁剪
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 点击选择封面
    $('#btnChooseImage').on('click', function() {
        $('#coverFile').click()
    })

    // coverFile change事件
    $('#coverFile').on('change', function(e) {
        var fileList = e.target.files
        if (fileList.length === 0) {
            return
        }

        // 拿到用户选择的文件 fileList[0]
        // 根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(fileList[0])

        // 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 定义文章状态
    var art_tate = '已发布'

    // 存为草稿绑定点击事件
    $('.btnSave2').on('click', function() {
        art_tate = '草稿'
    })



    // 为表单绑定 提交 事件
    $('#form_pub').on('submit', function(e) {
        // e.preventDefault()
        e.preventDefault()

        // 基于form表单，创建formdata对象
        var fd = new FormData($(this)[0])
        fd.append('state', art_tate)


        // fd.forEach(function(v, k) {
        //         console.log(k, v);
        //     })
        // 将裁剪后的图片，输出为文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)

                // 调用函数 发起请求
                publishArticle(fd)
            })
    })

    // 发布文章 ajax请求
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // FormData格式数据 一定要带的2个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')

                // 跳转到 文章列表页
                location.href = '/article/art_list.html'
            }

        })
    }


})