import { Application, Assets, AnimatedSprite, Container } from "pixi.js";

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
    this._normalSprite = await Assets.load("images/bunny_normal.json").then(
      (sheet) => {
        return (this._normalSprite = new AnimatedSprite(
          Object.values(sheet.textures) as any
        ));
      }
    );
    this._normalSprite.anchor.x = 0.5;
    this._normalSprite.anchor.y = 1;
    this._normalSprite.x = x;
    this._normalSprite.y = y;
    this._normalSprite.animationSpeed = 0.3;

    this._normalSprite.play();

    this._movingSprite = await Assets.load("images/bunny_moving.json").then(
      (sheet) => {
        return new AnimatedSprite(Object.values(sheet.textures) as any);
      }
    );
    this._movingSprite.anchor.x = 0.5;
    this._movingSprite.anchor.y = 1;
    this._movingSprite.x = x;
    this._movingSprite.y = y;
    this._movingSprite.animationSpeed = 0.3;

    this._movingSprite.play();

    this.registerListeners();
    app.ticker.add(this.gameLoop);
  }

  gameLoop(delta: number) {
    this.updateSpriteStatus();

    if (this.status === "MOVING") {
      this.x +=
        delta * this.workingSpeed * (this.direction === "RIGHT" ? 1 : -1);
    }
  }

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
