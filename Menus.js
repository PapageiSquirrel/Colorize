class Sc_GameOver extends Phaser.Scene 
{
    constructor ()
    {
        super({ key: 'sc_go' });
    }

    preload () 
    {

    }

    create() 
    {
        this.startButton = this.add.text(100, 100, 'Restart !', { fill: '#0f0' })
            .setInteractive()
            .on('pointerdown', () => this.click())
            .on('pointerover', () => this.enterButtonHoverState())
            .on('pointerout', () => this.enterButtonRestState() 
        );
    }

    update() 
    {

    }

    click() {
        // SCENE START
        this.scene.start('sc_blanc');
    }

    enterButtonHoverState() {
        this.startButton.setStyle({ fill: '#ff0'});
    }

    enterButtonRestState() {
        this.startButton.setStyle({ fill: '#0f0' });
    }
}

class Sc_MenuPrincipal extends Phaser.Scene 
{
    constructor ()
    {
        super({ key: 'sc_mp' });
    }

    preload () 
    {
        
    }

    create() 
    {
        this.startButton = this.add.text(100, 100, 'Start a new game !', { fill: '#0f0' })
            .setInteractive()
            .on('pointerdown', () => this.click() )
            .on('pointerover', () => this.enterButtonHoverState() )
            .on('pointerout', () => this.enterButtonRestState() 
        );
    }

    update() 
    {
        
    }

    click() {
        // SCENE START
        this.scene.start('sc_blanc');
    }

    enterButtonHoverState() {
        this.startButton.setStyle({ fill: '#ff0'});
    }

    enterButtonRestState() {
        this.startButton.setStyle({ fill: '#0f0' });
    }
}