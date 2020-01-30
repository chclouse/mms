let mix = require("webpack-mix");

mix.sass('resources/sass/app.scss', 'public/css')
   .copy('resources/svg/*', 'public/svg')
   .ts('resources/ts/app.ts', 'public/js');
