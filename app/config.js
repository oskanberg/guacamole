export const RENDERER_OPTIONS = {
    backgroundColor: 0x00213C,
    autoResize: true,
    resolution: window.devicePixelRatio
};

export const PHYSICS_OPTIONS = {
    // constraintIterations: 5,
    // positionIterations: 5,
    // velocityIterations: 5,
    enableSleeping: true,

    // timing: {
    //     timeScale: 1
    // }
};

export const CIRCLE_PHYSICS_OPTIONS = {
    frictionAir: 0.05,
    friction: 0.1,
    restitution: 0,
    sleepThreshold: 2
};

export const NUM_BALLS = 5;

export const GAME_WIDTH = 1440;
// export const GAME_WIDTH = window.innerWidth;
export const GAME_HEIGHT = 1000;
// export const GAME_HEIGHT = window.innerHeight;

export const PLATFORM_RADIUS = GAME_HEIGHT / 3.6;
export const CIRCLE_RADIUS = PLATFORM_RADIUS / 6;

export const CIRCLE_MASS = 10;

export const FORCE_MULTIPLIER = 0.0014;
export const AI_FORCE_MULTIPLIER = 1.4;
