$(function() {
    var layer = layui.layer
    var form = layui.form

    // 定义美化事件过滤器
    template.defaults.imports.dataFormat = function(date) {
        var dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 定义获取文章列表参数数据
    var q = {
        pagenum: 1, //页码值
        pagesize: 2, //每页显示多少条数据
        cate_id: '', //文章分类的 Id
        state: '' //文章的发布状态
    }

    initTable()
    initCate()

    // 获取文章列表数据
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // console.log(res);
                // 使用模板引擎渲染列表数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)

                // 调用分页函数
                renderPage(res.total)
            }
        })
    }

    // 初始化文章分类
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败！')
                }
                // 调用模板渲染数据
                var htmlStr = template('tpl-cate', res)
                    // console.log(htmlStr);
                $('[name=cate_id]').html(htmlStr)

                // 动态表单插入需 form.render()
                form.render()
            }
        })
    }

    // 为筛选表单绑定 submit 事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault()
            // e.preventDefault()

        // 拿到表单选项中的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()

        // 为查询参数对象 q 对应的属性赋值
        q.cate_id = cate_id
        q.state = state

        // 重新渲染表格
        initTable()
    })

    // 渲染分页
    function renderPage(total) {
        // console.log(total);
        layui.use('laypage', function() {
            var laypage = layui.laypage;
            //执行一个laypage实例
            laypage.render({
                elem: 'pageBox', //分页盒子 ID，不用加 # 号
                count: total, //数据总数，从服务端得到
                limit: q.pagesize, //每页显示条数
                limits: [2, 3, 5, 10], //每页条数的选择项
                curr: q.pagenum, //页码值
                // layout自定义排版
                layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
                // 分页切换触发， 调jump回调
                // obj（ 当前分页的所有选项值）、 first（ 是否首次， 一般用于初始加载的判断）
                jump: function(obj, first) {
                    // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                    // console.log(obj.limit); //得到每页显示的条数

                    // 将当前页值给 q
                    q.pagenum = obj.curr;
                    // 将每页条数选项值给 q
                    q.pagesize = obj.limit;

                    // 重新渲染表格
                    // initTable();
                    //首次不执行
                    if (!first) {
                        //do something
                        initTable();
                    }
                }
            });
        });
    }

    // 鉴听删除点击事件
    $('tbody').on('click', '.btn-del', function() {
        // 获取页面删除按钮个数
        var len = $('.btn-del').length

        // 获取点击删除项的id
        var id = $(this).attr('data-id');

        layer.confirm('是否删除?', { icon: 3, title: '提示' }, function(index) {

            // 发起 ajax 请求 根据 Id 删除文章数据
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！');
                    // 判断删除按钮个数 =1，删除成功后当前页就没数据了，需将页码值-1
                    if (len === 1) {
                        q.pagenum = q.pagenum = 1 ? 1 : q.pagenum - 1
                    }
                    // 重新渲染表格
                    initTable();
                }
            })
            layer.close(index);
        });
    });


    //  监听编辑按钮的点击事件
    $('tbody').on('click', '.btn-edit', function() {

        location.href = '/article/art_edit.html?id=' + $(this).attr('data-id')
    });
})