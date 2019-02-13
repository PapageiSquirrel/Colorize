class Sc_blanc extends GameScene 
{
    constructor ()
    {
        super({ key: 'sc_blanc' });

        this.saved_obj = {
            encres: [
                {id:'i5R400440', x:400, y:440, f:1, nb:5}, {id:'i5B600420', x:600, y:420, f:2, nb:5}, {id:'i5J300440', x:300, y:440, f:3, nb:5}
            ],
            ennemies: [
                {id:'eSpider500350', x:500, y:350, sprite: 'spider'}
            ]
        };
    }

    preload () 
    {
        super.preload();

        // background
        this.load.image('mapTiles_blanc', 'assets/tilesets/pf_and_bg.png');
        this.load.tilemapTiledJSON('ecran_A1', 'assets/maps/ecran_A1.json');

        // hero
        this.load.spritesheet('shadow', 'assets/sprites/chat.png',
            { frameWidth: 40, frameHeight: 30 }
        );
    }

    create(data) 
    {
        super.create(data);
        /*
        this.ecran_A1 = this.make.tilemap({ key: 'ecran_A1' });
        const ts_blanc = this.ecran_A1.addTilesetImage('ts_blanc', 'mapTiles_blanc');

        this.bgLayer = this.ecran_A1.createDynamicLayer('BG', ts_blanc, 0, 0);
        this.decoLayer = this.ecran_A1.createDynamicLayer('DECOS', ts_blanc, 0, 0);
        this.pfsLayer = this.ecran_A1.createDynamicLayer('PFS', ts_blanc, 0, 0);

        this.ecran_A1.setCollisionByProperty({ Collision: true });
        */
        
        this.createMap('ecran_A1', 'blanc');
        var i;
        // encres
        for(i=0;i<this.saved_obj.encres.length;i++) {
            var encre = this.saved_obj.encres[i];
            this.encres.create(encre.x, encre.y, 'encre', encre.f)
                .setName(encre.id);
        }
        // ennemies
        for(i=0;i<this.saved_obj.ennemies.length;i++) {
            var ennemy = this.saved_obj.ennemies.length[i];
            this.
        }
        
        let ourGame = this;
        let objs = this.saved_obj.encres;
        //  Listen for events from it
        ourGame.events.on('collectInk', function (data) {
            removeFromArray('id', data.id, objs);
            /*
            var i;
            var index = -1;
            for (i=0;i<objs.length;i++) {
                if (objs[i].id == data.id) {
                    index = i;
                }
            }
            if (index > -1) {
                objs.splice(index, 1);
            }
            */
        }, this);
    }

    update() 
    {
        super.update();
    }
}

class Sc_rouge extends GameScene 
{
    constructor ()
    {
        super({ key: 'sc_rouge' });
    }

    preload () 
    {
        // background
        this.load.image('mapTiles_rouge', 'assets/tilesets/pf_and_bg_rouge.png');
        this.load.tilemapTiledJSON('ecran_A1_R', 'assets/maps/ecran_A1_R.json');
    }

    create(data) 
    {
        this.instantiate(data);

        this.createMap('ecran_A1_R', 'rouge');
    }

    update() 
    {
        super.update();
    }
}

class Sc_bleu extends GameScene 
{
    constructor ()
    {
        super({ key: 'sc_bleu' });
    }

    preload () 
    {
        // background
        this.load.image('mapTiles_bleu', 'assets/tilesets/pf_and_bg_bleu.png');
        this.load.tilemapTiledJSON('ecran_A1_B', 'assets/maps/ecran_A1_B.json');
    }

    create(data) 
    {
        this.instantiate(data);

        this.createMap('ecran_A1_B', 'bleu');
    }

    update() 
    {
        super.update();
    }
}

class Sc_jaune extends GameScene 
{
    constructor ()
    {
        super({ key: 'sc_jaune' });
    }

    preload () 
    {
        // background
        this.load.image('mapTiles_jaune', 'assets/tilesets/pf_and_bg_jaune.png');
        this.load.tilemapTiledJSON('ecran_A1_J', 'assets/maps/ecran_A1_J.json');
    }

    create(data) 
    {
        this.instantiate(data);

        this.createMap('ecran_A1_J', 'jaune');
    }

    update() 
    {
        super.update();
    }
}