var Product = require('../models/product');
var mongoose = require('mongoose');

mongoose.connect('mongodb+srv://Cada:asd123@node-rest-shop-zqnku.mongodb.net/shopping-cart?retryWrites=true&w=majority',
  { useNewUrlParser: true });

var products = [
    new Product({
        imagePath: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/5e/Gothiccover.png/220px-Gothiccover.png',
        title: 'Gothic Video Game',
        description: 'Awesome Game!!!!',
        price: 10
    }),
    new Product({
        imagePath: 'https://is4-ssl.mzstatic.com/image/thumb/Purple123/v4/10/29/2f/10292fd0-d87a-6856-7523-f67fa8051df7/AppIcon-0-1x_U007emarketing-0-85-220-9.png/246x0w.jpg',
        title: 'Minecraft Video Game',
        description: 'This is super Awesome!!',
        price: 10
    }),
    new Product({
        imagePath: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlQx4NuUCaLFAliB3gO8fkcBm0IZnMI2PS9NrDV9W3raNCeixKDg',
        title: 'Dark Sour3 Game',
        description: 'I Died',
        price: 10
    }),
    new Product({
        imagePath: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0XVRphaItAVFWhrAlDD0PjZFFTg6xaxoFsFljCuS6S824P3dr',
        title: 'GTA:SA Video Game',
        description: 'the Vehicle is mine!',
        price: 10
    }),
    new Product({
        imagePath: 'https://images.kbench.com/kbench/article/2018_05/k188178p1n1.jpg',
        title: 'League of Legends',
        description: '5vs5 AOS Game',
        price: 10
    }),
    new Product({
        imagePath: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRF_q0UA2gJgJYfAUV7Kdl-uYQ_Hs_Zvv6A3Oz5XqPL0OH24otbxg',
        title: 'Overwatch',
        description: 'POTG is mine!',
        price: 10
    }),
    new Product({
        imagePath: 'https://t1.daumcdn.net/cfile/tistory/99DCB2335991587301',
        title: 'Battleground',
        description: 'chicken chicken winner dinner!',
        price: 10
    }),
    new Product({
        imagePath: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbdVJms9GlqJJ6sI2VHQS4D8zYuRlvq8983ZH23ElcnHqPFiu-XQ',
        title: 'HearthStone',
        description: 'Card Game',
        price: 10
    }),
    new Product({
        imagePath: 'http://thumbnail.egloos.net/750x0/http://pds21.egloos.com/pds/201701/11/10/f0091810_5875a9df037d5.jpg',
        title: 'Heros of the Storm',
        description: 'Sigongzoa',
        price: 10
    })
];

var done = 0;
for(var i=0; i<products.length; i++) {
    products[i].save((err, result) => {
        done ++;
        if(done == products.length) {
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect();
}