export const RENDERER_OPTIONS = {
    backgroundColor: 0x00213C,
    autoResize: true,
    resolution: window.devicePixelRatio
};

export const PHYSICS_OPTIONS = {
    // constraintIterations: 1,
    // positionIterations: 1,
    // velocityIterations: 1,
    enableSleeping: true,

    // timing: {
    //     timeScale: 1
    // }
};

export const CIRCLE_PHYSICS_OPTIONS = {
    frictionAir: 0.06,
    friction: 0.1,
    restitution: 0.2,
    density: 4,
    sleepThreshold: 2
};

export const NUM_BALLS = 5;

// export const GAME_WIDTH = 500;
export const GAME_WIDTH = window.innerWidth;
// export const GAME_HEIGHT = 500;
export const GAME_HEIGHT = window.innerHeight;

export const PLATFORM_RADIUS = GAME_HEIGHT / 3.6;
export const CIRCLE_RADIUS = 50;

export const FORCE_MULTIPLIER = 10;
export const AI_FORCE_MULTIPLIER = 0.6;
