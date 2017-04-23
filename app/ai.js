import {
    Common
} from 'matter-js';

import {
    AI_FORCE_MULTIPLIER
} from './config';

export const naiveMove = (balls, index) => {
    let options = balls.filter((ball, i) => {
        // if (i === 0) return false;
        if (i === index) return false;
        if (ball.active === false) return false;
        return true;
    });

    const targetIndex = Math.round(Common.random(0, options.length - 1));
    const target = options[targetIndex].body.position;
    const current = balls[index].body.position;

    let difference = {
        x: (target.x - current.x) * AI_FORCE_MULTIPLIER,
        y: (target.y - current.y) * AI_FORCE_MULTIPLIER
    };

    let point = {
        x: current.x - difference.x,
        y: current.y - difference.y
    };

    return point;
};
