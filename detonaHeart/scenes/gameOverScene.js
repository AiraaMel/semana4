class gameOverScene extends Phaser.Scene {
    constructor() {
        // Construtor da cena gameOverScene
        super({ key: 'gameOverScene' });
    }

    preload() {
        // Carrega imagem de fundo
        this.load.image('bgOver', 'assets/bgOver.png');
    }

    create() {
        // Configuração inicial da cena
        this.add.image(400, 300, 'bgOver');

        // Texto de game over
        this.add.text(400, 200, 'GAME OVER', { fontSize: '48px', fill: '#fff' }).setOrigin(0.5);
        this.add.text(400, 300, 'Pressione ENTER', { fontSize: '36px', fill: '#fff' }).setOrigin(0.5);
        this.add.text(400, 320, 'para reiniciar', { fontSize: '36px', fill: '#fff' }).setOrigin(0.5);
        this.cameras.main.setBackgroundColor('#ff0000'); // Define fundo vermelho

        // Reinicia o jogo quando ENTER é pressionado
        this.input.keyboard.on('keydown-ENTER', () => {
            this.scene.start('gameScene'); // Reinicia o jogo
        });
    }
}
