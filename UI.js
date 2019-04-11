class Sc_UI extends Phaser.Scene {
    constructor ()
    {
        super({ key: 'sc_ui', active: true });

        this.palette = {};
        this.pouvoir = {};
        this.config = { 
            col: ['blanc', 'rouge', 'bleu', 'jaune'], 
            pal: [0,0,0], col_nb: [0,0,0], pal_active: 0, pal_nb: 3, 
            pow: ['porte', 'fenetre', 'coffre'], pow_use: [5,9,9], pow_active: 0, pow_nb: 3 
        };

        this.press_z = {};
        this.press_e = {};
        this.still_down = {e: false, z: false};
    }

    preload()
    {
        // - Nombres
        this.load.spritesheet('nombre', 'assets/sprites/ui/nombre.png',
            { frameWidth: 24, frameHeight: 24 }
        );

        //  - pouvoir
        this.load.spritesheet('pouvoir_ui', 'assets/sprites/ui/pouvoir_ui.png',
            { frameWidth: 25, frameHeight: 25 }
        );
        //  - palette
        /*
        this.load.spritesheet('encre_ui', 'assets/sprites/encre_ui.png',
            { frameWidth: 25, frameHeight: 25 }
        );
        */
        this.load.spritesheet('encre_ui', 'assets/sprites/ui/encre_ui_bis.png',
            { frameWidth: 32, frameHeight: 32 }
        );
        this.load.spritesheet('color_ui', 'assets/sprites/inks/encre_color.png',
            { frameWidth: 32, frameHeight: 32 }
        );
    }

    create() 
    {
        this.palette = { 
            contours: this.physics.add.staticGroup(), 
            couleurs: this.physics.add.staticGroup(), 
            nombres: this.physics.add.staticGroup() 
        };
        // EXTERIEUR DE LA PALETTE
        this.palette.contours.create(25, 25, 'encre_ui', 1);
        this.palette.contours.create(25, 62, 'encre_ui');
        this.palette.contours.create(62, 25, 'encre_ui');
        // INTERIEUR DE LA PALETTE
        this.palette.couleurs.create(25, 25, 'color_ui');
        this.palette.couleurs.create(25, 62, 'color_ui');
        this.palette.couleurs.create(62, 25, 'color_ui');
        // NOMBRE DE PIGMENTS
        this.palette.nombres.create(25, 25, 'nombre');
        this.palette.nombres.create(25, 62, 'nombre');
        this.palette.nombres.create(62, 25, 'nombre');

        this.pouvoir = this.physics.add.staticGroup();
        this.pouvoir.create(775, 25, 'pouvoir_ui', 3);
        this.pouvoir.create(745, 25, 'pouvoir_ui', 1);
        this.pouvoir.create(775, 55, 'pouvoir_ui', 2);

        // UI BUTTONS
        this.press_z = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        this.press_e = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        //  Grab a reference to the Game Scene
        var i;
        for (i=0;i<this.config.col.length;i++) {
            var sc = 'sc_' + this.config.col[i];

            let ourGame = this.scene.get(sc); // Get the ACTIVE SCENE, not this one
            //  Listen for events from it
            ourGame.events.on('collectInk', function (data) {
                var end = false;
                var i=0;
                while (i<this.config.pal_nb && !end) {
                    if (this.config.pal[i] == 0) {
                        // Couleur
                        this.config.pal[i] = data.color
                        var ui_encre_modif = this.palette.couleurs.children.entries[i];
                        ui_encre_modif.setFrame(data.color);

                        // Nombre pigments
                        this.config.col_nb[i] = data.nb
                        var ui_encre_nombre = this.palette.nombres.children.entries[i];
                        ui_encre_nombre.setFrame(data.nb);
                        end = true;
                    }
                    i++;
                }
            }, this);
            ourGame.events.on('consumeInk', function () {
                var use = this.config.pow_use[this.config.pow_active];
                if (use == this.config.col_nb[this.config.pal_active]) {
                    // On met la couleur à 0 (blanc)
                    this.config.pal[this.config.pal_active] = 0;
                    var ui_encre_modif = this.palette.couleurs.children.entries[this.config.pal_active];
                    ui_encre_modif.setFrame(0);
                }
                if (use <= this.config.col_nb[this.config.pal_active]) {
                    var nb = this.config.col_nb[this.config.pal_active] - use;
                    this.config.col_nb[this.config.pal_active] = nb;
                    var ui_nombre = this.palette.nombres.children.entries[this.config.pal_active];
                    ui_nombre.setFrame(nb);
                }
            }, this);
        }
    }

    update()
    {
        // CHANGEMENT D'ENCRE
        if (this.press_z.isDown && !this.still_down.z) {
            var ui_encre_inactive = this.palette.contours.children.entries[this.config.pal_active];
            ui_encre_inactive.setFrame(ui_encre_inactive.frame.name - 1);
            if (this.config.pal_active == this.config.pal_nb-1) {
                this.config.pal_active = 0;
            } else {
                this.config.pal_active++;
            }
            var ui_encre_active = this.palette.contours.children.entries[this.config.pal_active];
            ui_encre_active.setFrame(ui_encre_active.frame.name + 1);
            this.still_down.z = true;
        }
        if (this.press_z.isUp) {
            this.still_down.z = false;
        }

        // CHANGEMENT DE POUVOIR
        if (this.press_e.isDown && !this.still_down.e) {
            var ui_pouvoir_inactive = this.pouvoir.children.entries[this.config.pow_active];
            ui_pouvoir_inactive.setFrame(ui_pouvoir_inactive.frame.name - 3);
            if (this.config.pow_active == this.config.pow_nb-1) {
                this.config.pow_active = 0;
            } else {
                this.config.pow_active++;
            }
            var ui_pouvoir_active = this.pouvoir.children.entries[this.config.pow_active];
            ui_pouvoir_active.setFrame(ui_pouvoir_active.frame.name + 3);
            this.still_down.e = true;
        }
        if (this.press_e.isUp) {
            this.still_down.e = false;
        } 
    }
}