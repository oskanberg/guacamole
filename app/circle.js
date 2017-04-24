import {
    // Graphics,
    Sprite
} from 'pixi.js';

import {
    Bodies,
    Body
} from 'matter-js';

// import {
//     randomRGB
// } from './util';

import {
    CIRCLE_PHYSICS_OPTIONS,
    FORCE_MULTIPLIER,
    CIRCLE_MASS
} from './config';

// const c = new Graphics();
// c.beginFill(0xffffff);
// c.lineStyle(0);
// c.drawCircle(100, 100, 100);
// c.endFill();
// const circleTexture = c.generateCanvasTexture();
const doughnutTexture = PIXI.Texture.fromImage('img/lowres/doughnut.png');
const tomatoTexture = PIXI.Texture.fromImage('img/lowres/tomato.png');
const eggTexture = PIXI.Texture.fromImage('img/lowres/egg.png');
const earthTexture = PIXI.Texture.fromImage('img/lowres/earth.png');
const hedgehogTexture = PIXI.Texture.fromImage('img/lowres/hedgehog.png');


const textures = [doughnutTexture, tomatoTexture, eggTexture, earthTexture, hedgehogTexture];

let texturePointer = Math.floor(Math.random() * textures.length);
class Circle {

    constructor(radius, x, y) {
        this.active = true;
        this.display = this._createSprite(radius);
        // this.body =;
        this.display.interactive = false;
        this.body = this._createBody(radius, x, y);
    }

    registerForceFrom(point) {
        let force = {
            x: (this.body.position.x - point.x) * FORCE_MULTIPLIER,
            y: (this.body.position.y - point.y) * FORCE_MULTIPLIER
        };

        this._registeredForce = force;
    }

    applyRegisteredForce() {
        Body.applyForce(
            this.body, {
                x: 0,
                y: 0
            },
            this._registeredForce
        );
    }

    destroy() {
        this.active = false;
        this.display.visible = false;
    }

    undestroy() {
        this.active = true;
        this.display.visible = true;
    }

    _createBody(radius, x, y) {
        let body = Bodies.circle(
            x,
            y,
            radius,
            CIRCLE_PHYSICS_OPTIONS
        );
        Body.setMass(body, CIRCLE_MASS);
        body._reference = this;
        return body;
    }

    _createSprite(r) {
        let texture = textures[texturePointer];
        texturePointer = (texturePointer + 1) % textures.length;
        let sprite = new Sprite(texture);
        sprite.width = r * 2;
        sprite.height = r * 2;
        sprite.anchor.set(0.5);
        // sprite.tint = randomRGB();
        // sprite.blendMode = PIXI.BLEND_MODES.ADD;
        return sprite;
    }

}

export default Circle;
