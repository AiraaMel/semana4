
class Welcome extends Phaser.Scene {

    // Construtor da cena
    constructor() {
        super({
            key: 'Welcome', // Identificador da cena
            backgroundColor: '#000', // Cor de fundo da cena
        });
    }

    // Função chamada para carregar os recursos
    preload() {
        this.load.html("form", "form/form.html"); // Carregando o formulário HTML
        this.load.image("play", "img/play_bt.png"); // Carregando a imagem do botão "play"
    }

    // Função chamada para criar a cena
    create() {
       
        // Criação de variáveis de entrada do teclado
        this.cursors = this.input.keyboard.createCursorKeys();
        this.returnKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.nameFilled = false;

        // Criação do texto de boas-vindas
        var text = { height: 20, padding: 15, content: "Hello --" }
        this.message = this.add.text(
            this.game.config.width / 2,
            this.game.config.height / 2 - text.padding * 2 - text.height,
            text.content, {
                color: "#FFFFFF",
                fontSize: 40,
                fontStyle: "bold"
            }
        ).setOrigin(0.5);

        // Configuração do formulário de entrada de nome
        var inputSize = { width: 270, height: 42, padding: 15 }; // Tamanho do campo de entrada
        var inputButton = { width: 30, height: 12 }; // Tamanho do botão de confirmação
        var inputCoords = {
            xposition: (this.game.config.width - inputSize.width) / 2 - inputButton.width, // Posição horizontal do campo de entrada
            yposition: (this.game.config.height - inputSize.height - inputSize.padding * 2) / 2, // Posição horizontal do campo de entrada
        };
        
        // Criação do campo de entrada de nome a partir do HTML
        this.inputName = this.add.dom(inputCoords.xposition, inputCoords.yposition).createFromCache('form').setOrigin(0, 0);

        // Criação do botão de confirmação de nome
        const nameOkTextButton = this.add.text(
            inputCoords.xposition + inputSize.width + 13,
            inputCoords.yposition + inputButton.height + 2, ">", {
                backgroundColor: "#8ecbf4",
                fontSize: 18,
                padding: 10
            }
        );
        // Torna o botão interativo
        nameOkTextButton.setInteractive();

        // Configuração de eventos para atualizar o nome
        this.returnKey.on("down", event => {
            this.updateName(this.inputName);
        });

        // Configuração de evento para atualizar o nome ao clicar no botão de confirmação
        nameOkTextButton.on('pointerdown', () => {
            this.updateName(this.inputName);
        });

        // Configuração do botão de "play"
        this.playBt = this.add.image(this.game.config.width / 2 - 50, this.game.config.height / 4 * 3, 'play')
            .setScale(.2).setOrigin(0, 0).setInteractive().setVisible(false);

        // Configuração de evento para iniciar o jogo ao clicar no botão "play"
        this.playBt.on('pointerdown', function () {
            if (this.nameFilled) { // Verifica se o nome foi preenchido
                this.game.highScore = 0; // Reinicia o placar
                this.scene.start('FlappyDragon', this.game); // Inicia q cena do jogo
            }
        }, this);
    }

    // Função para atualizar o nome do jogador
    updateName(inputNameElement) {
        let name = inputNameElement.getChildByName("name");
        if (name.value != "") { // Verifica se nome não está vazio 
            this.message.setText("Hello " + name.value); // Atualiza o texto
            this.playBt.setVisible(true); // // Criação do botão de confirmação de nome
            this.nameFilled = true; // Marca que o nome foi preenchido
            this.game.name = name.value; // Salva o nome do jogador
        }
    }
}
