import {
    Engine,
    World,
    Common,
    Events
} from 'matter-js';

import {
    PHYSICS_OPTIONS,
    GAME_WIDTH,
    GAME_HEIGHT,
    PLATFORM_RADIUS,
    CIRCLE_RADIUS,
    NUM_BALLS
} from './config';

import {
    GAME_EVENTS
} from './events';

import Platform from './platform';

import {
    Application,
    Container
} from 'pixi.js';

import Circle from './circle';
import Pointer from './Pointer';
import {
    naiveMove
} from './ai';

import {
    emit
} from './util';

import Water from './water';

const d = (1000 / 30);

class GameWorld {

    constructor() {
        // create engine
        this.engine = Engine.create(PHYSICS_OPTIONS);
        this.engine.world.gravity.y = 0;
        this.engine.world.gravity.x = 0;
        // this.engine.timing.timeScale = 1;

        // create PIXI
        this.pixiApp = new Application(GAME_WIDTH, GAME_HEIGHT, {
            backgroundColor: 0x689ece,
            // antialias: true,
            // resolution: window.devicePixelRatio
        });
        this.pixiApp.ticker.speed = 0.5;

        document.getElementById('game').appendChild(this.pixiApp.view);

        this.pixiApp.stage = new Container();
        this.pixiApp.stage.interactive = true;
        this.pixiApp.stage.hitArea = new PIXI.Rectangle(
            0,
            0,
            this.pixiApp.renderer.width / this.pixiApp.renderer.resolution,
            this.pixiApp.renderer.height / this.pixiApp.renderer.resolution
        );

        this.water = new Water(GAME_WIDTH, GAME_HEIGHT);
        this.pixiApp.stage.addChild(this.water);

        this.balls = this._createBalls(NUM_BALLS);
        this.pointer = this._createPointer();
        this.platform = this._createPlatform();
        World.add(this.engine.world, this.platform.body);

        this.pixiApp.stage.addChild(this.platform.display);
        // this.pixiApp.stage.addChild(this.platform.guide);

        this.pixiApp.stage.addChild(this.pointer);

        this.isSimulating = false;
        this.isGameOver = false;
        this.numRemaining = NUM_BALLS;

        this.pixiApp.stage
            .on('pointermove', this._onPointerMove.bind(this))
            .on('pointerdown', this._onPointerDown.bind(this));

        Events.on(this.engine, 'collisionEnd', this._onCollisionEnd.bind(this));

        this.balls.forEach(ball => {
            World.add(this.engine.world, ball.body);
            this.pixiApp.stage.addChild(ball.display);
        });

        this.pixiApp.ticker.add(this._onTickerUpdate.bind(this));
    }

    _onTickerUpdate(delta) {
        this.water.update();
        if (this.isGameOver) return;
        Engine.update(this.engine, delta * d);
        this.balls
            .filter(ball => ball.active && !ball.body.isSleeping)
            .forEach(ball => this._trackChanges(ball));
        this._updatePointerSource();
    }

    _onPointerDown(evt) {
        // don't do anything if turn is active
        if (this.isSimulating) return;
        // don't do anything if game is over
        if (this.isGameOver) return;

        let position = evt.data.getLocalPosition(this.pixiApp.stage);
        this.balls[0].registerForceFrom(position);

        for (let i = 1; i < this.balls.length; i++) {
            if (this.balls[i].active === false) continue;
            let force = naiveMove(this.balls, i);
            this.balls[i].registerForceFrom(force);
        }

        this.pointer.visible = false;
        this.isSimulating = true;

        for (let ball of this.balls) {
            ball.applyRegisteredForce();
        }
    }

    _onPointerMove(evt) {
        let position = evt.data.getLocalPosition(this.pixiApp.stage);
        this.pointer.updateTarget(position);
    }

    _checkForTurnEnd() {
        let allDone = this.balls.every(ball => {
            return !ball.active || ball.body.isSleeping;
        });

        if (allDone) {
            this.isSimulating = false;
            if (this.balls[0].active) {
                this.pointer.visible = true;
                this.pointer.redraw();
            }
        }
    }

    _onCollisionEnd(event) {
        event.pairs
            .filter(pair => pair.bodyA === this.platform.body || pair.bodyB === this.platform.body)
            .map(pair => {
                let ball = pair.bodyA === this.platform.body ? pair.bodyB._reference : pair.bodyA._reference;
                // may have stopped colliding because it is sleeping
                // don't destroy it in this case
                // check if all are sleeping (time to end turn!)
                if (ball.body.isSleeping) {
                    this._checkForTurnEnd();
                } else {
                    // may have ended because it was removed from the world
                    if (this.balls.indexOf(ball) === -1) return;

                    // if the user's ball, or that was the last ball
                    if (ball === this.balls[0] || this.numRemaining === 2) {

                        // only decrement if we won
                        if (this.numRemaining === 2 && ball !== this.balls[0]) --this.numRemaining;

                        emit(GAME_EVENTS.GAME_OVER, {
                            position: this.numRemaining
                        });
                        this.isGameOver = true;
                    }

                    --this.numRemaining;
                    ball.destroy();
                    this.pixiApp.stage.removeChild(ball.display);
                    World.remove(this.engine.world, ball.body);
                }
            });
    }

    _createPlatform() {
        return new Platform(PLATFORM_RADIUS, GAME_WIDTH / 2, GAME_HEIGHT / 2);
    }

    _newBallPosition() {
        return {
            x: Common.random(
                GAME_WIDTH / 2 - (PLATFORM_RADIUS / 1.5),
                GAME_WIDTH / 2 + (PLATFORM_RADIUS / 1.5)
            ),
            y: Common.random(
                GAME_HEIGHT / 2 - (PLATFORM_RADIUS / 1.5),
                GAME_HEIGHT / 2 + (PLATFORM_RADIUS / 1.5)
            )
        };
    }

    _createBalls(number) {
        return new Array(number)
            .fill({})
            .map(() => {
                let position = this._newBallPosition();
                return new Circle(
                    CIRCLE_RADIUS,
                    position.x,
                    position.y
                );
            });
    }

    _createPointer() {
        return new Pointer(this.balls[0].body.position, {
            x: 0,
            y: 0
        });
    }

    _updatePointerSource() {
        this.pointer.updateSource(this.balls[0].body.position);
    }

    _trackChanges(ball) {
        ball.display.position.set(ball.body.position.x, ball.body.position.y);
    }

    resetWorld() {
        this.balls.forEach(ball => {
            if (ball.active) {
                ball.destroy();
                this.pixiApp.stage.removeChild(ball.display);
                World.remove(this.engine.world, ball.body);
            }
        });

        this.balls = this._createBalls(NUM_BALLS);

        this.balls.forEach(ball => {
            World.add(this.engine.world, ball.body);
            this.pixiApp.stage.addChild(ball.display);
        });

        this._updatePointerSource();

        this.isSimulating = false;
        this.isGameOver = false;
        this.pointer.visible = true;
        this.numRemaining = NUM_BALLS;

    }
}

export default GameWorld;
