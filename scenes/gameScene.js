class gameScene extends Phaser.Scene {
    constructor() {
        // Inicializa cena com chave gameScene
        super({ key: 'gameScene' });
    }

    preload() {
        // Carregando imagens
        this.load.image('bgGame', 'assets/bgGame.png');
    
        this.load.image('plataforma1', 'assets/plataforma1.png');
        this.load.image('plataforma2', 'assets/plataforma2.png');
        this.load.image('plataforma3', 'assets/plataforma3.png');
        this.load.image('plataforma4', 'assets/plataforma4.png');
        this.load.image('heart', 'assets/heart.png');
        this.load.image('billBomb', 'assets/billBomb.png');
        this.load.image('back', 'assets/back.png');

        // Carregando srpitesheet 
        this.load.spritesheet('vanellope', 'assets/player.png', {frameWidth: 48, frameHeight: 69});
        this.load.spritesheet('turbo', 'assets/turbo.png', {frameWidth: 50, frameHeight: 40});

    }

    create() {
        
        // Configuração inicial da cena
        this.add.image(400, 300, 'bgGame');

         // Item heart colecionável
         this.heart = this.physics.add.group({
            key: 'heart',
            repeat: 9, // cria corações
            setXY: { x: 12, y: 0, stepX: 50 } // Distribuição coração na tela, inicia no ponto (12.0) e surge um novo a cada 50
        });
    
        // Adiciona movimento de quicar
        this.heart.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.5, 0.9));
    
        });

        // Cria grupo de bombas (billBombs)
        this.billBomb = this.physics.add.group();

        // Cria spritesheet de vanellope
        this.vanellope = this.physics.add.sprite(100, 450, 'vanellope').setScale(1.3);
        this.vanellope.setCollideWorldBounds(true); // colisão com barreiras
        this.vanellope.setBounce(0.13);
        

        // Cria animações de vanellope
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('vanellope', { start: 0, end: 3 }),
            frameRate: 15,
            repeat: -1
        });
    
        this.anims.create({
            key: 'turn',
            frames: [ { key: 'vanellope', frame: 4 } ],
            frameRate: 20
        });
    
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('vanellope', { start: 5, end: 8 }),
            frameRate: 15,
            repeat: -1
        });

        // Adiciona teclado para movimentação com setas
        this.cursors = this.input.keyboard.createCursorKeys();

        //Cria plataformas
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(680, 580, 'plataforma1').setScale(0.9).refreshBody();
        this.platforms.create(130, 400, 'plataforma2').setScale(1.3).refreshBody();
        this.platforms.create(640, 250, 'plataforma3').setScale(1.3).refreshBody();
        this.platforms.create(90, 150, 'plataforma4').setScale(1.2).refreshBody();


        // Cria sprite do turbo
        this.turbo = this.physics.add.sprite(620, 0, 'turbo').setScale(2);
        this.turbo.setCollideWorldBounds(true); // colisão com barreiras
        this.turbo.setBounce(0.5);

        // Cria animação para turbo
        this.anims.create({
        key: 'turboAlert',
        frames: this.anims.generateFrameNumbers('turbo', { start: 0, end: 5 }),
        frameRate: 4,
        repeat: -1
        });
        this.turbo.anims.play('turboAlert', true);

        // Define velocidade inicial e direção
        this.turbo.setVelocityX(100); // Velocidade inicial para a direita
        this.turboDirection = 1; // 1 = direita, -1 = esquerda

        // Placar de pontos
        this.score = 0;
        this.scoreText = this.add.text(600, 2, 'score: 0', { fontSize: '32px', fill: '#000' });

        // Botão para voltar à página inicial
        let backButton = this.add.image(50, 550, 'back').setInteractive().setScale(1);
        // Efeitos visuais no botão
        backButton.on('pointerover', () => backButton.setScale(0.9));
        backButton.on('pointerout', () => backButton.setScale(1));
        backButton.on('pointerup', () => {
            this.scene.start('startScene'); // Volta para a cena inicial
        });

        // Cria colisões
        this.physics.add.collider(this.vanellope, this.platforms);
        this.physics.add.collider(this.turbo, this.platforms);
        this.physics.add.collider(this.heart, this.platforms);

        // Colisão de coletar coração e game over
        this.physics.add.overlap(this.vanellope, this.heart, this.collectHeart, null, this);
        this.physics.add.collider(this.vanellope, this.billBomb, this.hitBomb, null, this);
        this.physics.add.overlap(this.vanellope, this.turbo, this.gameOver, null, this);

    }

    update() {

        // Lógica para controle e vanellope
        if (this.cursors.left.isDown)
            {
                // Movimento para esquerda
                this.vanellope.setVelocityX(-150);
                this.vanellope.anims.play('left', true);
            }
            else if (this.cursors.right.isDown)
            {
                // Movimento para direita
                this.vanellope.setVelocityX(150);
                this.vanellope.anims.play('right', true);
            }
            else
            {
                // Para movimento horizontal
                this.vanellope.setVelocityX(0);
                this.vanellope.anims.play('turn');
            }
        
            // Pulo de vanellope caso esteja no "chão"
            if (this.cursors.up.isDown && this.vanellope.body.blocked.down) {
                this.vanellope.setVelocityY(-330);
            }

            // Movimento do Turbo, muda de direção ao atingir o limite
        if (this.turbo.x >= 720) 
            { // Lado direito da plataforma
            this.turbo.setVelocityX(-100);
            this.turboDirection = -1;
        } else if (this.turbo.x <= 520) 
            { // Lado esquerdo da plataforma
            this.turbo.setVelocityX(100);
            this.turboDirection = 1;
        }
    }


    collectHeart(vanellope, heart)
    {
        // Quando coleta um coração ele desaparece
        heart.disableBody(true, true);
        //  Aumenta pontuação ao coletar coração
        this.score += 5;
        this.scoreText.setText('Score: ' + this.score);
        
        // verifica se todos os corações foram coletados e reposiciona
        if (this.heart.countActive(true) === 0)
        {
            // Reposiciona heart
            this.heart.children.iterate(function (child) {
                child.enableBody(true, child.x, 0, true, true); // reposição
            });
    
            // Cria nova bomba ao recolher todos os corações
            let x = (this.vanellope.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
            let Bomb = this.billBomb.create(x, 16, 'billBomb');
            Bomb.setBounce(1.1); // Faz bomba quicar
            Bomb.setCollideWorldBounds(true); // Impede que saia da tela
            Bomb.setVelocity(Phaser.Math.Between(-200, 200), 20); // Define velocidade
            Bomb.allowGravity = false; // Desativa gravidade
    
        }
    }

    hitBomb(vanellope, bomb) {
        // Pausar a física para que o jogo pare
        this.physics.pause();
    
        // Mudar a cor de Vanellope para verde
        this.vanellope.setTint(0x00ff00);
    
        // Reproduzir a animação "turn" para simular o "game over"
        this.vanellope.anims.play('turn');
    
         // Espera 1 segundos antes de ir para o Game Over
         this.time.delayedCall(1000, () => {
         this.scene.start('gameOverScene');
        });
        
    }

    gameOver(vanellope, turbo) {
        // Pausar a física para que o jogo pare
        this.physics.pause();

        // Mudar a cor de Vanellope para vermelho
        vanellope.setTint(0xff0000); // Cor vermelha
    
        // Reproduzir a animação "turn" para simular o "game over"
        vanellope.anims.play('turn');
    
        // Espera 1 segundos antes de ir para o Game Over
        this.time.delayedCall(1000, () => {
            this.scene.start('gameOverScene');
        });
    }

}
