import {
    Graphics,
    Sprite
} from 'pixi.js';

import {
    Bodies
} from 'matter-js';

import {
    randomRGB
} from './util';

import {
    CIRCLE_RADIUS,
    GAME_HEIGHT
} from './config';

const otterTexture = PIXI.Texture.fromImage('/img/otter.png');

class Platform {
    constructor(radius, x, y) {
        this.active = true;
        this.display = this._createSprite(radius);
        this.display.x = x - 40;
        this.display.y = y;
        this.body = this._createBody(radius, x, y);
    }

    _createBody(radius, x, y) {
        let body = Bodies.circle(
            x, y, radius - CIRCLE_RADIUS, {
                isSensor: true,
                isStatic: true,
            });
        return body;
    }

    _createSprite() {
        let sprite = new Sprite(otterTexture);
        sprite.width = 1.44 * GAME_HEIGHT;
        sprite.height = GAME_HEIGHT;
        sprite.anchor.set(0.5);
        // sprite.tint = randomRGB();
        // sprite.blendMode = PIXI.BLEND_MODES.ADD;
        return sprite;
    }
}

export default Platform;
