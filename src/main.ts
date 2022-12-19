import { Application, TilingSprite } from "pixi.js";
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

const tileSize = {
  width: 128,
  height: 93,
};
const ground = TilingSprite.from("images/tiles/ground2.png", tileSize);
ground.x = 0;
ground.y = app.renderer.height / 2 + 150;
ground.width = app.renderer.width;
app.stage.addChild(ground);

const ground2Head = TilingSprite.from("images/tiles/ground1.png", tileSize);
ground2Head.x = app.renderer.width / 2;
ground2Head.y = app.renderer.height / 2 + 15;
app.stage.addChild(ground2Head);
const ground2Body = TilingSprite.from("images/tiles/ground2.png", tileSize);
ground2Body.x = app.renderer.width / 2 + 128;
ground2Body.y = app.renderer.height / 2 + 15;
ground2Body.width = app.renderer.width / 2;
app.stage.addChild(ground2Body);

moonBunny.grounds.push(ground);
moonBunny.grounds.push(ground2Head);
moonBunny.grounds.push(ground2Body);
moonBunny.addIntoStage(app.stage);
