export type BoundingRect = {
  width: number;
  height: number;
  x: number;
  y: number;
};

// ref: https://github.com/kittykatattack/learningPixi#the-hittestrectangle-function
export const hasCollision = (r1: BoundingRect, r2: BoundingRect) => {
  //Define the variables we'll need to calculate
  let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

  //hit will determine whether there's a collision
  hit = false;

  //Find the center points of each sprite
  const r1_centerX = r1.x + r1.width / 2;
  const r1_centerY = r1.y + r1.height / 2;
  const r2_centerX = r2.x + r2.width / 2;
  const r2_centerY = r2.y + r2.height / 2;

  //Find the half-widths and half-heights of each sprite
  const r1_halfWidth = r1.width / 2;
  const r1_halfHeight = r1.height / 2;
  const r2_halfWidth = r2.width / 2;
  const r2_halfHeight = r2.height / 2;

  //Calculate the distance vector between the sprites
  vx = r1_centerX - r2_centerX;
  vy = r1_centerY - r2_centerY;

  //Figure out the combined half-widths and half-heights
  combinedHalfWidths = r1_halfWidth + r2_halfWidth;
  combinedHalfHeights = r1_halfHeight + r2_halfHeight;

  //Check for a collision on the x axis
  if (Math.abs(vx) < combinedHalfWidths) {
    //A collision might be occurring. Check for a collision on the y axis
    if (Math.abs(vy) < combinedHalfHeights) {
      //There's definitely a collision happening
      hit = true;
    } else {
      //There's no collision on the y axis
      hit = false;
    }
  } else {
    //There's no collision on the x axis
    hit = false;
  }

  //`hit` will be either `true` or `false`
  return hit;
};
