import { Application, Assets, AnimatedSprite, Container } from "pixi.js";

const createAnimatedSprite = async (
  path: string,
  { x, y }: { x: number; y: number }
) => {
  const sprite = await Assets.load(path).then((sheet) => {
    return new AnimatedSprite(Object.values(sheet.textures) as any);
  });
  sprite.anchor.x = 0.5;
  sprite.anchor.y = 1;
  sprite.x = x;
  sprite.y = y;
  sprite.animationSpeed = 0.3;

  return sprite;
};

export class MoonBunny {
  _normalSprite!: AnimatedSprite;
  _movingSprite!: AnimatedSprite;

  status: "STAND" | "MOVING" = "STAND";
  direction: "LEFT" | "RIGHT" = "LEFT";

  workingSpeed = 3;

  async init(
    app: Application,
    { x = 0, y = 0 }: { x?: number; y?: number } = {}
  ) {
    this._normalSprite = await createAnimatedSprite(
      "images/bunny_normal.json",
      { x, y }
    );
    this._normalSprite.play();

    this._movingSprite = await createAnimatedSprite(
      "images/bunny_moving.json",
      { x, y }
    );
    this._movingSprite.play();

    this.registerListeners();
    app.ticker.add(this.gameLoop);
  }

  gameLoop = (delta: number) => {
    this.updateSpriteStatus();

    if (this.status === "MOVING") {
      this.x +=
        delta * this.workingSpeed * (this.direction === "RIGHT" ? 1 : -1);
    }
  };

  updateSpriteStatus() {
    if (this.direction === "LEFT") {
      this._normalSprite.scale.x = 1;
      this._movingSprite.scale.x = 1;
    } else {
      this._normalSprite.scale.x = -1;
      this._movingSprite.scale.x = -1;
    }

    if (this.status === "STAND") {
      this._movingSprite.visible = false;
      this._normalSprite.visible = true;
    } else {
      this._movingSprite.visible = true;
      this._normalSprite.visible = false;
    }
  }

  registerListeners() {
    window.addEventListener("keydown", (event) => {
      if (event.code === "ArrowRight" || event.code === "ArrowLeft") {
        this.status = "MOVING";
        this.direction = event.code === "ArrowRight" ? "RIGHT" : "LEFT";
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
    this._movingSprite.x = value;
  }
  get x() {
    return this._normalSprite.x;
  }

  set y(value: number) {
    this._normalSprite.y = value;
    this._movingSprite.y = value;
  }
  get y() {
    return this._normalSprite.y;
  }

  addIntoStage(stage: Container) {
    stage.addChild(this._movingSprite);
    stage.addChild(this._normalSprite);
  }
}
