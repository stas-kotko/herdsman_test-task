import Phaser from "phaser";
import GameScene from "./scenes/GameScene";
import StartScene from "./scenes/StartScene";
import SettingsScene from "./scenes/SettingsScene";
import GameOver from "./scenes/GameOver";

const config: Phaser.Types.Core.GameConfig = {
    parent: "app",
    type: Phaser.AUTO,
    width: 1920,
    height: 1600,
    input: {
        keyboard: true
    },
    scale: {
        mode: Phaser.Scale.ScaleModes.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: [
        StartScene,
        GameScene,
        SettingsScene,
        GameOver,
    ]
};

export default new Phaser.Game(config);