var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 640,
    render: {
        pixelArt: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: true
        }
    },
    scene: [Sc_MenuPrincipal, Sc_blanc, Sc_rouge, Sc_bleu, Sc_jaune, Sc_UI, Sc_GameOver]
    /*
    scene: {
        preload: preload,
        create: create,
        update: update
    }
    */
}

var game = new Phaser.Game(config);