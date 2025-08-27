<script setup>
import { watch, onMounted } from "vue";
import { useData } from "vitepress";
import { getPref, setPref } from "./prefs";

const { frontmatter } = useData();

function apply() {
  const saved = getPref("contentWidth", undefined);
  const mode = saved || frontmatter.value?.contentWidth || "wide"; // normal | wide | full
  document.documentElement.setAttribute("data-doc-width", mode);
  if (saved !== mode) setPref("contentWidth", mode);
}

onMounted(() => {
  apply();
  watch(() => frontmatter.value?.contentWidth, apply);
});
</script>

<template></template>
