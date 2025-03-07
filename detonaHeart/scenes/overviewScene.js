class overviewScene extends Phaser.Scene {
    constructor() {
        // Construtor da cena
        super({ key: 'overviewScene' });
    }

    preload() {
        // Carregando imagem de visão geral e botão de voltar
        this.load.image('visaoGeral', 'assets/visaoGeral.png');
        this.load.image('back', 'assets/back.png');
    }

    create() {

        // Configuração inicial da cena
        this.add.image(400, 300, 'visaoGeral');

          // Botão para voltar à página inicial
          let backButton = this.add.image(100, 80, 'back').setInteractive().setScale(1.3);

          // Efeitos visuais no botão
          backButton.on('pointerover', () => backButton.setScale(1.2));
          backButton.on('pointerout', () => backButton.setScale(1.3));
          backButton.on('pointerup', () => {
              this.scene.start('startScene'); // Volta para a cena inicial
          });
    }
}
