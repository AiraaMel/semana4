// Definindo a cena principal do jogo
class FlappyDragon extends Phaser.Scene {

    // Construtor da cena
    constructor() {
        super({
            key: 'FlappyDragon',
            // Configurações específicas da cena
            physics: {
               arcade: {
                debug: false,
                gravity: { y: 500 }
               } 
            }
        });
    }

    // Inicialização de variáveis e configurações da cena
    init() {
       // Configurações do fundo do jogo
        this.bg = {
            x_start: 0,
            x: 0,
            y: 200,
            x_end: -800, // define limite de deslocamento da imagem de fundo
            obj: null
        };

        // Configurações das colunas
        this.cols = {
            speed: 60, // velocidade de deslocamento das colunas
            space: 180, // espaço entre as colunas
            x: 500, // posição inicial à direita do canvas
            min_x: 400,
            max_x: 800,
            y: -400, // posição inicial acima do canvas, quanto maior, mais para cima aparece a coluna inferior
            min_y: -500,
            max_y: -200,
            height: 600, // altura das colunas,
            width: 50,
            col1_obj: null,
            col2_obj: null
        };

        // Configurações do jogador
        this.player = {
            width: 170,
            height: 133,
            obj: null
        };

        // Configurações do placar
        this.gameControls = {
            over: false, // controla se o jogo acabou
            current_col_scored: false, // controla pontuação por coluna
            score: 0, // pontuação atual
            restartBt: null // botão de reiniciar
        };
    }

    // Carregamento de recursos
    preload() {
        this.load.image('bg', 'img/fundo.png');
        this.load.spritesheet('dragon', 'img/dragao.png', { frameWidth: this.player.width, frameHeight: this.player.height });
        this.load.image('colBottom', 'img/coluna_bottom.png');
        this.load.image('colUpper', 'img/coluna_upper.png');
        this.load.image('gameOver', 'img/gameover.png');
        this.load.image('restart', 'img/restart_bt.png');
    }

    // Criação de elementos na cena
    create() {
        // Adiciona a imagem de fundo
        this.bg.obj = this.add.image(this.bg.x, this.bg.y, 'bg').setOrigin(0, 0);

        // Adiciona as colunas
        this.cols.col1_obj = this.add.image(this.cols.x, this.cols.y, 'colUpper').setOrigin(0, 0);
        this.cols.col2_obj = this.add.image(this.cols.x, this.cols.y + this.cols.height + this.cols.space, 'colBottom').setOrigin(0, 0);
        this.physics.add.existing(this.cols.col1_obj);
        this.physics.add.existing(this.cols.col2_obj);
        this.cols.col1_obj.body.allowGravity = false;
        this.cols.col2_obj.body.allowGravity = false;
        this.cols.col1_obj.body.setVelocityX(-this.cols.speed);
        this.cols.col2_obj.body.setVelocityX(-this.cols.speed);

        // Adiciona o jogador e configuração
        this.player.obj = this.physics.add.sprite(170, 130, 'dragon').setScale(.8);
        this.player.obj.body.setSize(50, 80, true);
        this.player.obj.setCollideWorldBounds(true);

        // Animação do jogador
        this.anims.create({
            key: 'fly',
            frames: this.anims.generateFrameNumbers('dragon', { start: 0, end: 2 }),
            frameRate: 10,
            repeat: -1
        });
        this.player.obj.anims.play('fly');

        // Adiciona controles do jogo
        this.cursors = this.input.keyboard.createCursorKeys();
        this.pointer = this.input.activePointer;

        // Detecta colições
        this.physics.add.overlap(this.player.obj, this.cols.col1_obj, this.hitCol, null, this);
        this.physics.add.overlap(this.player.obj, this.cols.col2_obj, this.hitCol, null, this);

        // Adiciona placar
        this.scoreText = this.add.text(15, 15, this.game.name + ': 0', { fontSize: '20px', fill: '#000' });
        this.highScoreText = this.add.text(0, 15, 'high score: ' + this.game.highScore, { fontSize: '20px', fill: '#000', align: 'right' });
        this.highScoreText.x = this.game.config.width - this.highScoreText.width - 15;
        this.gameControls.restartBt = this.add.image(this.game.config.width / 2 - 50, this.game.config.height / 4 * 3,
            'restart').setScale(.2).setOrigin(0, 0).setInteractive().setVisible(false);

        // Evento de clique no botão de reiniciar
        this.gameControls.restartBt.on('pointerdown', function () {
            // Controla se o jogo acabou e se a tecla que o botão de reiniciar foi acionado
            if (this.gameControls.over) {
                this.gameControls.over = false;
                this.gameControls.score = 0;
                this.cols.x = -this.cols.width - 1;
                this.scene.restart();
            }
        }, this);
    }

    // Atualização lógica do jogo
    update() {
        // Controla se o jogo acabou e paraliza a cena
        if (this.gameControls.over) {
            return;
        }

        // Atualiza a posição da imagem de fundo
        this.bg.x--;
        if (this.bg.x < this.bg.x_end) {
            this.bg.x = this.bg.x_start;
        }
        this.bg.obj.x = this.bg.x;

        // Atualiza posição das colunas
        this.cols.x = this.cols.col1_obj.x;
        if (this.cols.x < -this.cols.width) {
            this.cols.x = Phaser.Math.FloatBetween(this.cols.min_x, this.cols.max_x); // sorteia o intervalo antes das próximas colunas
            this.cols.col1_obj.x = this.cols.x;
            this.cols.col2_obj.x = this.cols.x;

            this.cols.y = Phaser.Math.FloatBetween(this.cols.min_y, this.cols.max_y); // sorteia a posição vertical
            this.cols.col1_obj.y = this.cols.y;
            this.cols.col2_obj.y = this.cols.y + this.cols.height + this.cols.space;

            this.gameControls.current_col_scored = false;
        }

        // Controle do jogador
        if (this.cursors.left.isDown)
            this.player.obj.setX(this.player.obj.x - 5);
        else if (this.cursors.right.isDown)
            this.player.obj.setX(this.player.obj.x + 5);
        else if (this.cursors.up.isDown || this.cursors.space.isDown || this.pointer.isDown)
            this.player.obj.setY(this.player.obj.y - this.game.config.physics.arcade.gravity.y);
        else if (this.cursors.down.isDown)
            this.player.obj.setY(this.player.obj.y + this.game.config.physics.arcade.gravity.y);

        // Verifica se o jogador passou pelas colunas
        if (!this.gameControls.current_col_scored) {
            if (this.player.obj.x - this.player.width / 2 > this.cols.x + this.cols.width) {
                this.gameControls.score++;
                this.gameControls.current_col_scored = true;
                this.scoreText.setText(this.game.name + ': ' + this.gameControls.score);
            }
        }
    }

    // Função chamada quando o jogador colide com uma coluna
    hitCol(player_obj, col_obj) {
        this.physics.pause();
        this.player.obj.anims.stop('fly');
        this.player.obj.setTint(0xff0000);
        this.gameControls.over = true;
        this.add.image(this.game.config.width / 2, this.game.config.height / 2, 'gameOver').setScale(.5);
        this.gameControls.restartBt.visible = true;
        if (this.gameControls.score > this.game.highScore) {
            this.game.highScore = this.gameControls.score;
            this.highScoreText.setText('high score: ' + this.game.highScore);
        }
    }
}