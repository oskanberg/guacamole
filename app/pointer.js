import {
    Graphics
} from 'pixi.js';

class Pointer extends Graphics {

    constructor(source, target) {
        super();
        this.visible = true;
        this.source = source;
        this.target = target;
        this._redraw();
    }

    updateTarget(target) {
        this.target = target;
        this._redraw();
    }

    updateSource(source) {
        this.source = source;
        this._redraw();
    }

    redraw() {
        this._redraw();
    }

    _redraw() {
        this.clear();
        if (this.visible) {
            this.moveTo(this.source.x, this.source.y);
            this.lineStyle(10, 0xff0000, 0.5);
            this.lineTo(this.target.x, this.target.y);
        }
    }
}

export default Pointer;
