import { Application, Assets, AnimatedSprite, Container } from "pixi.js";

export class MoonBunny {
  normalSprite!: AnimatedSprite;
  movingSprite!: AnimatedSprite;

  status: "STAND" | "MOVING" = "STAND";
  direction: "LEFT" | "RIGHT" = "LEFT";

  async init(
    app: Application,
    { x = 0, y = 0 }: { x?: number; y?: number } = {}
  ) {
    this.normalSprite = await Assets.load("images/bunny_normal.json").then(
      (sheet) => {
        return (this.normalSprite = new AnimatedSprite(
          Object.values(sheet.textures) as any
        ));
      }
    );
    this.normalSprite.anchor.x = 0.5;
    this.normalSprite.anchor.y = 1;
    this.normalSprite.x = x;
    this.normalSprite.y = y;
    this.normalSprite.animationSpeed = 0.3;

    this.normalSprite.play();

    this.movingSprite = await Assets.load("images/bunny_moving.json").then(
      (sheet) => {
        return new AnimatedSprite(Object.values(sheet.textures) as any);
      }
    );
    this.movingSprite.anchor.x = 0.5;
    this.movingSprite.anchor.y = 1;
    this.movingSprite.x = x;
    this.movingSprite.y = y;
    this.movingSprite.animationSpeed = 0.3;

    this.movingSprite.play();

    this.registerListeners();
    app.ticker.add((delta) => {
      if (this.direction === "LEFT") {
        this.normalSprite.scale.x = 1;
        this.movingSprite.scale.x = 1;
      } else {
        this.normalSprite.scale.x = -1;
        this.movingSprite.scale.x = -1;
      }

      if (this.status === "STAND") {
        this.movingSprite.visible = false;
        this.normalSprite.visible = true;
      } else {
        this.movingSprite.visible = true;
        this.normalSprite.visible = false;
      }

      if (this.status === "MOVING") {
        this.x += delta * 3 * (this.direction === "RIGHT" ? 1 : -1);
      }
    });
  }

  registerListeners() {
    window.addEventListener("keydown", (event) => {
      if (event.code === "ArrowRight" || event.code === "ArrowLeft") {
        this.status = "MOVING";
        this.direction = event.code === "ArrowRight" ? "RIGHT" : "LEFT";
      }
    });

    window.addEventListener("keyup", (event) => {
      if (event.code === "ArrowRight" || event.code === "ArrowLeft") {
        this.status = "STAND";
      }
    });
  }

  set x(value: number) {
    this.normalSprite.x = value;
    this.movingSprite.x = value;
  }
  get x() {
    return this.normalSprite.x;
  }

  set y(value: number) {
    this.normalSprite.y = value;
    this.movingSprite.y = value;
  }
  get y() {
    return this.normalSprite.y;
  }

  addIntoStage(stage: Container) {
    stage.addChild(this.movingSprite);
    stage.addChild(this.normalSprite);
  }
}
