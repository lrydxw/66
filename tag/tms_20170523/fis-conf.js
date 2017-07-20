fis.set('project.ignore', [
    'dist/**',
    'node_modules/**',
    '.git/**',
    '.svn/**',
    'fis-conf.js'
]);
/*********************不使用绝对路径****************************/
fis.hook('relative');
fis.match('**', { relative: true })
/*********************不使用绝对路径****************************/
/*********************获取页面目录****************************/
fis.match('*.html', {
    useMap: true
})
fis.match('view/*.html', {
    //发布到对应目录，用于做页面索引
    release : '$0'
});
/*********************获取页面目录****************************/

/*********************文件指纹****************************/
fis.match('*.{js,css}', {
    useHash: true // 开启 md5 戳
});
fis.match('laydate/*.{js,css,png}', {
  useHash: false,
  useSprite: false,
  optimizer: null
})
fis.match('laydate/*/*.{js,css,png}', {
  useHash: false,
  useSprite: false,
  optimizer: null
})
fis.match('laydate/*/*/*.{js,css,png}', {
  useHash: false,
  useSprite: false,
  optimizer: null
})
/*********************文件指纹****************************/

/*********************自动雪碧图****************************/
//启用 fis-spriter-csssprites 插件
fis.match('::package', {
  spriter: fis.plugin('csssprites')
})

// 对 CSS 进行图片合并
fis.match('*.css', {
  // 给匹配到的文件分配属性 `useSprite`
  useSprite: true
});
/*********************自动雪碧图****************************/

/*********************文件压缩****************************/
fis.match('*.js', {
  // fis-optimizer-uglify-js 插件进行压缩，已内置
  optimizer: fis.plugin('uglify-js')
});

fis.match('*.css', {
  // fis-optimizer-clean-css 插件进行压缩，已内置
  optimizer: fis.plugin('clean-css')
});

fis.match('*.png?__sprite', {
  // fis-optimizer-png-compressor 插件进行压缩，已内置
  optimizer: fis.plugin('png-compressor')
});
/*********************文件压缩****************************/

/*********************文件合并****************************/
fis.match('::package', {
  postpackager: fis.plugin('loader')
});
fis.match('{common.css,reset-min.css,tf-pop-sp-pc.css}', {
  packTo: '/static/aio.css'
});

fis.match('{jquery-1.11.3.min.js,getJson.js,base.js,template.js,ieMode.js,tf-popup-sp-pc.js}', {
  packTo: '/static/aio.js'
});

//合并打包
//fis.match('::package', {
//postpackager: fis.plugin('loader', {
//  allInOne: true
//})
//});