let mix = require("webpack-mix");

mix.sass('resources/sass/app.scss', 'public/css')
   .js('resources/js/app.js', 'public/js')
   .copy('resources/svg/*', 'public/svg');
