class instructionScene extends Phaser.Scene {
    constructor() {
        // Construtor da cena com chave instruction
        super({ key: 'instructionScene' });
    }

    preload() {
        // Carregando imagens
        this.load.image('instruction', 'assets/instruction.png');
        this.load.image('back', 'assets/back.png');
    }

    create() {
        this.add.image(400, 300, 'instruction');

          // Botão para voltar à página inicial
          let backButton = this.add.image(100, 80, 'back').setInteractive().setScale(1.3);

          // Efeitos visuais no botão
          backButton.on('pointerover', () => backButton.setScale(1.2));
          backButton.on('pointerout', () => backButton.setScale(1.3));
          backButton.on('pointerup', () => {
              this.scene.start('startScene');
          });
    }
}
