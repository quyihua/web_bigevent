$(function() {
    var layer = layui.layer
    var form = layui.form

    initArtCateList()

    // 获取文章分类列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败！')
                }
                // console.log(res);
                var artHtml = template('tpl_article', res)
                $('tbody').html(artHtml)
            }
        })
    }

    var indexAdd = null
        // 添加类别
    $('#artAdd').on('click', function() {
        // console.log('ok');
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#tpl_artAdd').html()
        });
    })

    // 代理  监听添加文章分类提交事件 form_artAdd
    $('body').on('submit', '#form_artAdd', function(e) {
        e.preventDefault()

        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('新增文章分类失败！')
                }
                // console.log(res);
                initArtCateList()
                layer.msg('新增文章分类成功！')

                // 关闭弹出层
                layer.close(indexAdd)
            }
        })
    })

    // 给编辑绑定点击事件
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function() {
        // 修改文章分类 弹出层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#tpl_artEdit').html()
        });

        // 获取当前点击id
        var id = $(this).attr('data-id')

        // 发起请求获取对应分类的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类数据失败！')
                }
                // console.log(res);
                form.val('form_artEdit', res.data)
            }
        })
    })

    // 代理  给form_artEdit 表单添加提交事件
    $('body').on('submit', '#form_artEdit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类信息失败！')
                }
                initArtCateList()
                layer.close(indexEdit)
            }
        })
    })

    // 给删除绑定点击事件
    $('tbody').on('click', '.btn-del', function() {
        var id = $(this).attr('data-id')
        console.log(id);
        // 弹出删除框
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            //do something   确认执行事件
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章分类失败！')
                    }
                    layer.msg('删除文章分类成功！')
                    layer.close(index);
                    initArtCateList()
                }
            })
        });
    })
})