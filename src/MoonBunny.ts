import { Application, Assets, AnimatedSprite, Container } from "pixi.js";

const createAnimatedSprite = async (
  path: string,
  { animationSpeed, loop }: { animationSpeed: number; loop: boolean }
) => {
  const sprite = await Assets.load(path).then((sheet) => {
    return new AnimatedSprite(Object.values(sheet.textures) as any);
  });
  sprite.anchor.x = 0.5;
  sprite.anchor.y = 1;
  sprite.animationSpeed = animationSpeed;
  sprite.loop = loop;

  return sprite;
};

type Status = "STAND" | "WALKING" | "JUMPING";

export class MoonBunny {
  status: Status = "STAND";
  statusSpriteMap!: {
    [key in Status]: AnimatedSprite;
  };
  direction: "LEFT" | "RIGHT" = "LEFT";
  _x: number = 0;
  _y: number = 0;

  workingSpeed = 3;
  gravity = 1;
  jumpPower = 20;

  async init(
    app: Application,
    { x = 0, y = 0 }: { x?: number; y?: number } = {}
  ) {
    this.statusSpriteMap = {
      STAND: await createAnimatedSprite("images/bunny_normal.json", {
        animationSpeed: 0.3,
        loop: true,
      }),
      WALKING: await createAnimatedSprite("images/bunny_moving.json", {
        animationSpeed: 0.3,
        loop: true,
      }),
      JUMPING: await createAnimatedSprite("images/bunny_moving.json", {
        animationSpeed: 0.25,
        loop: false,
      }),
    };
    this.x = x;
    this.y = y;
    this.statusSpriteMap.STAND.play();
    this.statusSpriteMap.WALKING.play();

    this.registerListeners();
    app.ticker.add(this.gameLoop);
  }

  cumulatedTime = 0;
  jumpAt = 0;

  gameLoop = (delta: number) => {
    this.updateSpriteStatus();

    if (this.status === "WALKING") {
      this.x +=
        delta * this.workingSpeed * (this.direction === "RIGHT" ? 1 : -1);
    }

    if (this.status === "JUMPING") {
      const jumpHeight =
        (-this.gravity / 2) * Math.pow(this.cumulatedTime, 2) +
        this.jumpPower * this.cumulatedTime;
      this.y = this.jumpAt + -1 * jumpHeight;

      this.cumulatedTime += delta;
      if (this.y > this.jumpAt) {
        this.status = "STAND";
        this.y = this.jumpAt;
      }
    }
  };

  updateSpriteStatus() {
    if (this.direction === "LEFT") {
      Object.values(this.statusSpriteMap).forEach(
        (sprite) => (sprite.scale.x = 1)
      );
    } else {
      Object.values(this.statusSpriteMap).forEach(
        (sprite) => (sprite.scale.x = -1)
      );
    }

    Object.values(this.statusSpriteMap).forEach(
      (sprite) => (sprite.visible = false)
    );
    this.statusSpriteMap[this.status].visible = true;
  }

  registerListeners() {
    window.addEventListener("keydown", (event) => {
      if (event.code === "ArrowRight" || event.code === "ArrowLeft") {
        this.status = "WALKING";
        this.direction = event.code === "ArrowRight" ? "RIGHT" : "LEFT";
      }

      if (event.code === "ArrowUp") {
        this.status = "JUMPING";
        this.statusSpriteMap.JUMPING.gotoAndPlay(0);
        this.cumulatedTime = 0;
        this.jumpAt = this.y;
      }
    });

    window.addEventListener("keyup", (event) => {
      if (
        (this.direction === "RIGHT" && event.code === "ArrowRight") ||
        (this.direction === "LEFT" && event.code === "ArrowLeft")
      ) {
        this.status = "STAND";
      }
    });
  }

  set x(value: number) {
    this._x = value;
    Object.values(this.statusSpriteMap).forEach((sprite) => (sprite.x = value));
  }
  get x() {
    return this._x;
  }

  set y(value: number) {
    this._y = value;
    Object.values(this.statusSpriteMap).forEach((sprite) => (sprite.y = value));
  }
  get y() {
    return this._y;
  }

  addIntoStage(stage: Container) {
    Object.values(this.statusSpriteMap).forEach((sprite) =>
      stage.addChild(sprite)
    );
  }
}
