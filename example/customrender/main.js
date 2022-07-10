import { renderer } from "./renderer.js";
import App from "./App.js";

const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
});
document.body.appendChild(app.view);

// Create a new instance of a PIXI renderer.
renderer.createApp(App).mount(app.stage);
