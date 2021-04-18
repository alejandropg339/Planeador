//esto manda a llamar un modulo es un import pero usando node js
const path =  require('path');


// Esta es la forma en la que se exporta usando node.js
module.exports = {
    entry:'./src/app.js',
    output: {
        //resolve une varios strings para formar una ubicacion y dirname es una constante que nos dice la ubicacion de nuestro proyecto
        path: path.resolve(__dirname,'public', 'js'),
        filename: 'bundle.js'
    },
    //Seu saran loaders esto en este caso permite ejecutar bable a la vez que hace el empaquetado para eso es necesario tener babel instalado ver archivo package.json 
    mode:'production',
    module:{
        rules:[
            {
                //expresion regular que este caso busca los archivos que cumplen con la extension js
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use:{
                    loader:'babel-loader',
                    options:{
                        presets:['@babel/preset-env'],
                        plugins:['@babel/plugin-proposal-object-rest-spread']
                    }
                }
            }
        ]
    }
};