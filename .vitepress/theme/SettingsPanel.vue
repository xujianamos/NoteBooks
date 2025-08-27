<template>
  <div>
    <el-button
      class="vp-settings-trigger"
      type="default"
      circle
      size="small"
      @click="open = true"
      :title="'页面设置'"
    >
      <el-icon><setting /></el-icon>
    </el-button>

    <el-drawer v-model="open" :with-header="false" size="320px">
      <div class="panel">
        <div class="header">
          <span>页面选项</span>
          <el-button link type="primary" @click="open = false">关闭</el-button>
        </div>
        <el-divider />
        <div class="section">
          <div class="label">内容区域宽度</div>
          <el-radio-group v-model="width">
            <el-radio-button label="normal">正常</el-radio-button>
            <el-radio-button label="wide">加宽</el-radio-button>
            <el-radio-button label="full">通栏</el-radio-button>
          </el-radio-group>
        </div>
        <el-divider />
        <div class="section">
          <div class="label">自适应页面</div>
          <el-switch
            v-model="adaptive"
            active-text="开启"
            inactive-text="关闭"
          />
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { getPref, setPref } from "./prefs";
import { Setting } from "@element-plus/icons-vue";

const open = ref(false);
const width = ref("wide");
const adaptive = ref(false);

onMounted(() => {
  const saved = getPref("contentWidth", "wide");
  width.value = saved;
  applyWidth(saved);
  adaptive.value = !!getPref("adaptiveLayout", false);
  applyAdaptive(adaptive.value);
});

watch(width, (val) => {
  setPref("contentWidth", val);
  applyWidth(val);
});

watch(adaptive, (val) => {
  setPref("adaptiveLayout", val);
  applyAdaptive(val);
});

function applyWidth(val) {
  document.documentElement.setAttribute("data-doc-width", val);
}

function applyAdaptive(val) {
  document.documentElement.setAttribute("data-adaptive", val ? "on" : "off");
}
</script>

<style scoped>
.vp-settings-trigger {
  position: relative;
  top: 0;
  right: 0;
  z-index: 1;
  margin-left: 12px;
}
.panel {
  padding: 8px 4px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}
.section {
  margin-top: 12px;
}
.label {
  font-size: 14px;
  color: var(--vp-c-text-2);
  margin-bottom: 8px;
}
</style>
