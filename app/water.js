import {
    Container
} from 'pixi.js';

class Water extends Container {
    constructor(width, height) {
        super();

        let world = new PIXI.Container();
        this.addChild(world);

        let texture = PIXI.Texture.fromImage('http://i.imgur.com/NSHvIJH.png');
        let bottom = new PIXI.Sprite(texture);

        bottom.width = width + 50;
        bottom.height = height + 50;
        bottom.x = -25;
        bottom.y = -25;

        this.displacementSprite = PIXI.Sprite.fromImage("http://i.imgur.com/2yYayZk.png");
        let displacementFilter = new PIXI.filters.DisplacementFilter(this.displacementSprite);
        displacementFilter.scale.set(25);
        displacementFilter.autoFit = true;
        this.displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
        this.displacementSprite.scale.y = 0.5;
        this.displacementSprite.scale.x = 0.5;

        world.addChild(this.displacementSprite);
        world.addChild(bottom);

        world.filters = [displacementFilter];
    }

    update() {
        this.displacementSprite.x += 1;
        this.displacementSprite.y += 1;
    }
}


export default Water;
