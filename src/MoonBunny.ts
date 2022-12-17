import { Application, Assets, AnimatedSprite, Container } from "pixi.js";

const createAnimatedSprite = async (
  path: string,
  { x, y, animationSpeed }: { x: number; y: number; animationSpeed: number }
) => {
  const sprite = await Assets.load(path).then((sheet) => {
    return new AnimatedSprite(Object.values(sheet.textures) as any);
  });
  sprite.anchor.x = 0.5;
  sprite.anchor.y = 1;
  sprite.x = x;
  sprite.y = y;
  sprite.animationSpeed = animationSpeed;

  return sprite;
};

export class MoonBunny {
  _normalSprite!: AnimatedSprite;
  _walkingSprite!: AnimatedSprite;
  _jumpingSprite!: AnimatedSprite;

  status: "STAND" | "WALKING" | "JUMPING" = "STAND";
  direction: "LEFT" | "RIGHT" = "LEFT";

  workingSpeed = 3;
  gravity = 1;
  jumpPower = 20;

  async init(
    app: Application,
    { x = 0, y = 0 }: { x?: number; y?: number } = {}
  ) {
    this._normalSprite = await createAnimatedSprite(
      "images/bunny_normal.json",
      { x, y, animationSpeed: 0.3 }
    );
    this._normalSprite.play();

    this._walkingSprite = await createAnimatedSprite(
      "images/bunny_moving.json",
      { x, y, animationSpeed: 0.3 }
    );
    this._walkingSprite.play();

    this._jumpingSprite = await createAnimatedSprite(
      "images/bunny_moving.json",
      { x, y, animationSpeed: 0.25 }
    );
    this._jumpingSprite.loop = false;

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
      this._normalSprite.scale.x = 1;
      this._walkingSprite.scale.x = 1;
      this._jumpingSprite.scale.x = 1;
    } else {
      this._normalSprite.scale.x = -1;
      this._walkingSprite.scale.x = -1;
      this._jumpingSprite.scale.x = -1;
    }

    if (this.status === "STAND") {
      this._walkingSprite.visible = false;
      this._jumpingSprite.visible = false;
      this._normalSprite.visible = true;
    } else if (this.status === "WALKING") {
      this._walkingSprite.visible = true;
      this._jumpingSprite.visible = false;
      this._normalSprite.visible = false;
    } else {
      this._walkingSprite.visible = false;
      this._jumpingSprite.visible = true;
      this._normalSprite.visible = false;
    }
  }

  registerListeners() {
    window.addEventListener("keydown", (event) => {
      if (event.code === "ArrowRight" || event.code === "ArrowLeft") {
        this.status = "WALKING";
        this.direction = event.code === "ArrowRight" ? "RIGHT" : "LEFT";
      }

      if (event.code === "ArrowUp") {
        this.status = "JUMPING";
        this._jumpingSprite.gotoAndPlay(0);
        this.cumulatedTime = 0;
        this.jumpAt = this._jumpingSprite.y;
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
    this._normalSprite.x = value;
    this._walkingSprite.x = value;
    this._jumpingSprite.x = value;
  }
  get x() {
    return this._normalSprite.x;
  }

  set y(value: number) {
    this._normalSprite.y = value;
    this._walkingSprite.y = value;
    this._jumpingSprite.y = value;
  }
  get y() {
    return this._normalSprite.y;
  }

  addIntoStage(stage: Container) {
    stage.addChild(this._walkingSprite);
    stage.addChild(this._jumpingSprite);
    stage.addChild(this._normalSprite);
  }
}
