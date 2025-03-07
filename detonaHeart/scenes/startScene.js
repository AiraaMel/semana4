class startScene extends Phaser.Scene {

    // Construtor de cena startScene
    constructor() {
        super({
            key: 'startScene'
        });
    }

    preload() {

        // carregando fundo
        this.load.image('bg', 'assets/bg.png');

        // carregando botões
        this.load.image('button1', 'assets/button1.png');
        this.load.image('button2', 'assets/button2.png');

        // carregando spritesheet
        this.load.spritesheet('start', 'assets/start.png', { frameWidth: 240, frameHeight: 150 });
        this.load.spritesheet('shadow', 'assets/shadow.png', { frameWidth: 240, frameHeight: 150 })
    }

    create() {

        // Imagem de fundo
        this.add.image(400, 300, 'bg').setScale(1);

        // Sprite de sombra
        var shadow = this.add.sprite(600, 500, 'shadow').setScale(1.3);
        this.anims.create({
            key: 'shadow',
            frames: this.anims.generateFrameNumbers('shadow', { start: 0, end: 1 }),
            frameRate: 4,
            repeat: -1
        });
        shadow.anims.play('shadow', true);

        // Botão de start
        let button = this.add.image(600, 500, 'start').setInteractive().setScale(0.7);

        // Eventos do botão
        button.on('pointerover', () => button.setScale(0.6)); // Passa o mouse (hover)
        button.on('pointerout', () => button.setScale(0.7));  // Sai do hover
        button.on('pointerdown', () => button.setScale(0.7)); // Pressiona o botão
        button.on('pointerup', () => {
            this.scene.start('gameScene'); // Inicia o jogo
        });

        // Botões de instrução e overview
        let button1 = this.add.image(600, 100, 'button1').setInteractive().setScale(0.7);
        button1.on('pointerup', () => {
            this.scene.start('overviewScene');
        });

        let button2 = this.add.image(600, 180, 'button2').setInteractive().setScale(0.7);
        button2.on('pointerup', () => {
            this.scene.start('instructionScene');
        });
    }

}




