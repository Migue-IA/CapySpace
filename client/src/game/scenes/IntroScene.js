export default class IntroScene extends Phaser.Scene {
  constructor() {
    super('IntroScene');
  }


  create() {
    const textLines = [
      'Hace muchos ciclos solares,',
      'en una galaxia olvidada por los mapas...',
      '',
      'Un antiguo bosque flotante albergaba',
      'a los Capibara Guardianes, criaturas sabias',
      'que mantenían el equilibrio entre',
      'el Amor, la Naturaleza y la Tecnología.',
      '',
      'Pero tras una Gran Tormenta de Datos,',
      'muchos capibaras fueron desconectados...',
      'Y ahora, solo uno queda.',
      '',
      'Uno que aún no sabe lo importante que es.'
    ];

    this.cameras.main.setBackgroundColor('#000000');
    this.introText = this.add.text(this.game.config.width / 2, this.game.config.height, textLines.join('\n'), {
      font: '20px monospace',
      fill: '#FFD700',
      align: 'center',
      wordWrap: { width: this.game.config.width - 100 }
    }).setOrigin(0.5);

    this.scrollSpeed = 0.5;

    this.time.delayedCall(10000, () => {
      this.scene.start('MainMenu');
    });
  }

  update() {
    this.introText.y -= this.scrollSpeed;
  }
}
