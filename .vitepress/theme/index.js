import DefaultTheme from "vitepress/theme";
import { h } from "vue";
import DocWidthController from "./DocWidthController.vue";
import SettingsPanel from "./SettingsPanel.vue";
import "./style.css";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

export default {
  ...DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      "nav-bar-content-after": () => h(SettingsPanel),
      "layout-bottom": () => h(DocWidthController),
    });
  },
  enhanceApp({ app }) {
    app.use(ElementPlus);
  },
};
