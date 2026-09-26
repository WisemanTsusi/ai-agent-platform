import { createApp } from "./api/app";
import { config } from "./config";

createApp().listen(config.port, () => {
  console.log(`AI Agent Platform listening on http://localhost:${config.port}`);
});
