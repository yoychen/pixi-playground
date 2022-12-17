import { Application, Graphics } from "pixi.js";
import { MoonBunny } from "./MoonBunny";
import "./style.css";

// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container
const app = new Application({
  backgroundAlpha: 0,
  width: window.innerWidth,
  height: window.innerHeight,
});

// The application will create a canvas element for you that you
// can then insert into the DOM
document.body.appendChild(app.view as HTMLCanvasElement);

const moonBunny = new MoonBunny();
await moonBunny.init(app, {
  x: app.renderer.width / 2,
  y: app.renderer.height / 2,
});
moonBunny.addIntoStage(app.stage);

let ground = new Graphics();
ground.beginFill(0xffc107);
ground.drawRect(0, 0, app.renderer.width, 50);
ground.x = 0;
ground.y = app.renderer.height / 2 + 200;
app.stage.addChild(ground);

moonBunny.grounds.push(ground);
