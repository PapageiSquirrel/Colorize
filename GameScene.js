class GameScene extends Phaser.Scene {
    constructor(config) {
        super(config);

        this.encres = {};
        this.doors = {};
        this.ennemies = {};
        this.platforms = {};
        this.player = {};
        this.cursors = {};

        this.gravity = 200;

        this.press_s = {};
        this.press_d = {};
        this.press_f = {};
        this.still_down = {d: false, s: false, f:false};

        this.counters = { 'cd_door': false, 'cd_door_op': 60, 'cd_door_cl': 60, 'cd_door_cpt': 0 };
        this.saved_position = { x: 150, y: 497 };

        this.instantiate = function(data) 
        {
            if (data.x && data.y) {
                this.saved_position.x = data.x;
                this.saved_position.y = data.y;
            }

            this.doors = this.physics.add.group();
            this.openings = this.physics.add.group();
            this.encres = this.physics.add.group();
            this.ennemies = this.physics.add.group();

            this.player = {};
            this.player.visual = this.physics.add.sprite(this.saved_position.x, this.saved_position.y, 'shadow');
            this.player.visual.body.setGravityY(this.gravity); 
            this.player.visual.body.setSize(30, 20, 5, 20);
            this.player.visual.body.setMaxVelocity(160, 330);
            this.player.visual.body.setDrag(600, 0);
            this.player.visual.setBounce(0);
            this.player.visual.setCollideWorldBounds(true);
            this.player.visual.setDepth(1);
            this.player.power = this.physics.add.sprite(0, 0, 'feather').setGravityY(-300).setDepth(1).setVisible(false);
            this.player.power.on('animationcomplete', animComplete, this);

            this.cursors = this.input.keyboard.createCursorKeys();

            this.press_d = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
            this.press_s = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
            this.press_f = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        }

        this.createMap = function(key, ts_key)
        {
            var ecran = this.make.tilemap({ key: key })
            const ts = ecran.addTilesetImage('ts_' + ts_key, 'mapTiles_' + ts_key);

            // layers
            this.bgLayer = ecran.createDynamicLayer('BG', ts, 0, 0);
            this.decoLayer = ecran.createDynamicLayer('DECOS', ts, 0, 0);
            this.pfsLayer = ecran.createDynamicLayer('PFS', ts, 0, 0);

            // colliders
            this.physics.add.collider(this.player.visual, this.pfsLayer);
            this.physics.add.collider(this.doors, this.pfsLayer);
            this.physics.add.collider(this.encres, this.pfsLayer);
            this.physics.add.collider(this.ennemies, this.pfsLayer);
            this.physics.add.collider(this.openings, this.pfsLayer);
            this.physics.add.overlap(this.player.visual, this.encres, this.collectEncre, null, this);
            this.physics.add.overlap(this.player.visual, this.player.power, this.collectFeather, null, this);
            this.physics.add.collider(this.player.visual, this.ennemies, this.takeDamage, null, this);

            ecran.setCollisionByProperty({ Collision: true });
        }

        this.generateDoor = function () 
        {
            var ui = this.scene.get('sc_ui');
            // TODO : CLOSING DOORS
            /*
            if (!counters.cd_door && doors.children.size > 0) {
                doors.children.iterate(function (child) {
                    child.disableBody(true,true);
                });
                counters.cd_door = true;
            }
            */

            // opening doors
            if (!this.counters.cd_door) { // doors.children.size == 0
                if (ui.config.pal[ui.config.pal_active] != 0  && ui.config.col_nb[ui.config.pal_active] >= ui.config.pow_use[ui.config.pow_active]
                    || !this.scene.get('sc_blanc').sys.settings.active) {

                    var o = this.openings.create(this.player.visual.x, this.player.visual.y - 22.5, 'opening', ui.config.pal[ui.config.pal_active]);
                    var d = this.doors.create(this.player.visual.x, this.player.visual.y - 22.5, 'door');

                    d.anims.play('createDoor');
                    this.events.emit('consumeInk');
                    this.counters.cd_door = true;
                }
            }
        }

        this.collectEncre = function(visual, encre)
        {
            this.events.emit('collectInk', {id: encre.name, color: encre.frame.name, nb: 5}); // NB ?? HOW YO PUT IN INK CREATION

            encre.disableBody(true, true);
            /*
            encres.children.iterate(function (child) {
                child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
            });
            */
        }

        this.throwFeather = function()
        {
            var feather = this.player.power;
            feather.setPosition(this.player.visual.x +50, this.player.visual.y)
                .setVisible(true);
        }

        this.collectFeather = function(visual, feather) {
            feather.setAcceleration(0);
            feather.setVelocity(0);
            feather.setVisible(false);
        }

        this.takeDamage = function(visual, ennemy) {
            // TAKE DAMAGE OR DIE
            // FOR NOW JUST GAME OVER
            this.scene.start('sc_go');
        }
    }

    preload () 
    {
        //  - doors
        this.load.spritesheet('door', 'assets/sprites/powers/door.png', 
            { frameWidth: 27, frameHeight: 75 }
        );

        //  - encres
        this.load.spritesheet('encre', 'assets/sprites/inks/pot_encre.png',
            { frameWidth: 32, frameHeight: 32 }
        );

        //  - openings
        this.load.spritesheet('opening', 'assets/sprites/powers/opening.png', 
            { frameWidth: 27, frameHeight: 75 }
        );

        // - pouvoir
        this.load.spritesheet('feather', 'assets/sprites/powers/feathers.png', 
            { frameWidth: 32, frameHeight: 32 }
        );

        // - ENNEMIES
        this.load.spritesheet('spider', 'assets/sprites/ennemies/Spider.png', 
            { frameWidth: 32, frameHeight: 32 }
        );

        // - BOSSES
        this.load.spritesheet('absorption', 'assets/sprites/bosses/absorption.png', 
            { frameWidth: 64, frameHeight: 32 }
        );
    }

    create (data) 
    {
        this.instantiate(data);

        // Char anims
        if (this.anims.anims.size == 0) {
            this.anims.create({
                key: 'generate',
                repeat: 0
            });
            this.anims.create({
                key: 'idle_left',
                frames: this.anims.generateFrameNumbers('shadow', { frames: [0,0,1,2,2,3] }),
                frameRate: 1,
                repeat: 0
            });
            this.anims.create({
                key: 'idle_right',
                frames: this.anims.generateFrameNumbers('shadow', { frames: [19,19,18,17,17,16] }),
                frameRate: 1,
                repeat: 0
            });
            this.anims.create({
                key: 'walk_left',
                frames: this.anims.generateFrameNumbers('shadow', { frames: [5,6,5,7,5,8,5,7] }), // remplacer 5
                frameRate: 10,
                repeat: -1
            });
            this.anims.create({
                key: 'walk_right',
                frames: this.anims.generateFrameNumbers('shadow', { frames: [24,23,24,22,24,21,24,22] }), // remplacer 24
                frameRate: 10,
                repeat: -1
            });
            this.anims.create({
                key: 'run_left',
                frames: this.anims.generateFrameNumbers('shadow', { start: 9, end: 14 }),
                frameRate: 10,
                repeat: -1
            });
            this.anims.create({
                key: 'run_right',
                frames: this.anims.generateFrameNumbers('shadow', { frames: [20,29,28,27,26,25] }),
                frameRate: 10,
                repeat: -1
            });
            this.anims.create({
                key: 'jump_left',
                frames: this.anims.generateFrameNumbers('shadow', { frames: [10] }),
                frameRate: 5,
                repeat: -1
            });
            this.anims.create({
                key: 'jump_right',
                frames: this.anims.generateFrameNumbers('shadow', { frames: [29] }),
                frameRate: 5,
                repeat: -1
            });

            // POUVOIR ANIMS
            /*
            this.anims.create({
                key: 'shoot',
                frames: this.anims.generateFrameNumbers('feather', { frames: [0] }),
                frameRate: 20,
                repeat: 0
            });
            */

            this.anims.create({
                key: 'boss_absorb',
                frames: this.anims.generateFrameNumbers('absorption', { frames: [0,2,4,5,5,5,5,5,7,8,8,8,9,10,11] }),
                frameRate: 20,
                repeat: 0
            });

            // OBJECT ANIMS
            this.anims.create({
                key: 'createDoor',
                frames: this.anims.generateFrameNumbers('door', { start: 0, end: 6 }),
                frameRate: 10,
                repeat: 0
            });

            // ENNEMIES ANIMS :
            // - SPIDER
            this.anims.create({
                key: 'idle_spider',
                frames: this.anims.generateFrameNumbers('spider', { start: 0, end: 4 }),
                frameRate: 5,
                repeat: -1
            });
            this.anims.create({
                key: 'walk_spider',
                frames: this.anims.generateFrameNumbers('spider', { frames: [9,10,11,12,13,14] }),
                frameRate: 5,
                repeat: -1
            });
        }
    }

    update () 
    {
        // ENNEMY MANAGER HERE (FOR NOW)
        if (this.ennemies.children.entries.length > 0) {
            this.ennemies.children.iterate(function (child) {
                var sprite = child.texture.key;
                child.anims.play('walk_' + sprite, true);
                console.log()
            });
        }

        // PLAYER MANAGER HERE (FOR NOW)
        if (this.player.visual.y == 630) {
            // ANIMATION DE MORT
            this.scene.start('sc_go');
        }

        var anim_playing;

        if (this.cursors.left.shiftKey || this.cursors.right.shiftKey) anim_playing = 'walk';
        else anim_playing = 'run';

        if (this.cursors.left.isDown) {
            this.player.visual.setAccelerationX(-300);
            if (this.player.visual.body.blocked.down) this.player.visual.anims.play('run_left', true);
            else this.player.visual.anims.play('jump_left', true);
        } else if (this.cursors.right.isDown) {
            this.player.visual.setAccelerationX(300);
            if (this.player.visual.body.blocked.down) this.player.visual.anims.play('run_right', true);
            else this.player.visual.anims.play('jump_right', true);
        } else {
            this.player.visual.setAccelerationX(0);
            //console.log(this.player.visual.y);
            if (this.player.visual.body.blocked.down) {
                if (this.player.visual.anims.currentAnim == null) {
                    this.player.visual.anims.play('idle_left', true);
                } else if (this.player.visual.anims.currentAnim.key == 'run_right' || this.player.visual.anims.currentAnim.key == 'jump_right') {
                    this.player.visual.anims.play('idle_right', true);
                } else if (this.player.visual.anims.currentAnim.key == 'run_left' || this.player.visual.anims.currentAnim.key == 'jump_left') {
                    this.player.visual.anims.play('idle_left', true);
                }
            }
        }

        // GO INTO THE DOOR
        if (this.cursors.up.isDown && this.player.visual.body.blocked.down) {
            var ol = false;
            var op;
            var p = this.player.visual;
            this.openings.children.iterate(function (child) {
                // TODO : OVERLAP DO NOT WORK !!!
                ol = checkOverlap(p, child);
                if (ol) op = child;
            });

            if (ol) {
                var ui = this.scene.get('sc_ui');
                var sc = 'sc_' + ui.config.col[op.frame.name];
                this.scene.start(sc, { x: this.player.visual.x, y: this.player.visual.y });
            }
        }

        // -<S>- SAUT
        if (this.press_s.isDown && !this.still_down.s && this.player.visual.body.blocked.down) {
            this.player.visual.setVelocityY(-330);
            if (this.player.visual.anims.currentAnim.key == 'idle_right' || this.player.visual.anims.currentAnim.key == 'run_right') {
                this.player.visual.anims.play('jump_right', true);
            } else if (this.player.visual.anims.currentAnim.key == 'idle_left' || this.player.visual.anims.currentAnim.key == 'run_left') {
                this.player.visual.anims.play('jump_left', true);
            }
            this.still_down.s = true;
        }
        if (this.press_s.isUp) {
            this.still_down.s = false;
        }

        // -<D>- UTILISATION DE POUVOIR
        if (this.press_d.isDown && !this.still_down.d && this.player.visual.body.blocked.down) {
            this.generateDoor();
            this.still_down.d = true;
        }
        if (this.press_d.isUp) {
            this.still_down.d = false;
        }

        // -<F>- THROW FEATHER & ABSORB
        if (this.press_f.isDown && !this.still_down.f && this.player.visual.body.blocked.down) {
            this.throwFeather();
            this.still_down.f = true;
        }
        if (this.press_f.isUp) {
            this.still_down.f = false;
        }
        if (this.player.power.visible) {
            var feather = this.player.power;
            // LANCER
            if (feather.body.velocity.x == 0) {
                feather.setVelocityX(200);
                feather.setAccelerationX(-200);
            }
            // RETOUR
            if (feather.body.velocity.x < 0 || feather.body.acceleration != -200) {
                var delta_x = this.player.visual.x - feather.x;
                var delta_y = this.player.visual.y - feather.y;
                feather.setAcceleration(delta_x*2, delta_y);
                //console.log(feather.body.acceleration);
            }
            // ROTATION
            feather.angle += 10;
        }

        // COUNTERS ==> TODO : (game.time.now)
        if (this.counters.cd_door) {
            if (this.counters.cd_door_cpt >= this.counters.cd_door_op) {
                this.counters.cd_door_cpt = 0;
                this.counters.cd_door = false;
            } else {
                this.counters.cd_door_cpt++;
            }
        }
    }

    render() {
        game.debug.body(this.player.visual);
    }
}