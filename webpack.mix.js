let mix = require("webpack-mix");

mix.sass('src/sass/app.scss', 'public/css')
   .js('src/js/app.js', 'public/js');
