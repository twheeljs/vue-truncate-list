<script setup lang="ts">
import { ref, h, nextTick } from 'vue'
import TruncateList from './components/TruncateList'

const expanded = ref(false)
const handleExpand = () => { expanded.value = true }
const handleCollapse = () => { expanded.value = false }
</script>

<template>
  <div>
    <header style="margin-bottom: 24px;">
      <h1>Vue-truncate-list</h1>
      <p>
        <a href="https://github.com/twheeljs/vue-truncate-list" target="_blank" rel="noopener"
          style="color:#1890ff;text-decoration:none;">
          GitHub Repository
        </a>
        &nbsp;|&nbsp;
        <span>Author: <a href="https://github.com/niexia" target="_blank" rel="noopener">@niexia</a></span>
      </p>
      <p style="color: #888; font-size: 14px;">
        A flexible Vue 3 component for truncating lists with custom truncator rendering.Designed for both mobile and desktop platforms.
      </p>
    </header>

    <h2>Use-case</h2>
    <p>
      This component is designed to be compatible with both mobile devices and desktop platforms.<br>
      Easily truncate overflowing list items and provide a custom truncator UI.
    </p>
    <div class="demo">
      <section class="card mobile">
        <h3>Skills (Mobile)</h3>
        <TruncateList :class="['list']"
          :renderTruncator="({ hiddenItemsCount }) => h('div', { class: 'listItem' }, `+${hiddenItemsCount}`)">
          <div class="listItem">UX</div>
          <div class="listItem">JavaScript</div>
          <div class="listItem">TypeScript</div>
          <div class="listItem">React</div>
          <div class="listItem">Redux</div>
          <div class="listItem">GraphQL</div>
          <div class="listItem">Webpack</div>
          <div class="listItem">Node.js</div>
          <div class="listItem">Express</div>
          <div class="listItem">Firebase</div>
          <div class="listItem">Git</div>
        </TruncateList>
      </section>

      <br />

      <section class="card desktop">
        <h3>Skills (Desktop)</h3>
        <TruncateList :class="['list']" :renderTruncator="({ hiddenItemsCount }) => (
          h('div', { class: 'listItem' }, `+${hiddenItemsCount}`)
        )">
          <div class="listItem">UX</div>
          <div class="listItem">JavaScript</div>
          <div class="listItem">TypeScript</div>
          <div class="listItem">React</div>
          <div class="listItem">Redux</div>
          <div class="listItem">GraphQL</div>
          <div class="listItem">Webpack</div>
          <div class="listItem">Node.js</div>
          <div class="listItem">Express</div>
          <div class="listItem">Firebase</div>
          <div class="listItem">Git</div>
        </TruncateList>
      </section>
    </div>

    <h2>Playground</h2>
    <p>
      Resize the container below to see the list adapt dynamically.<br>
      Try adding or removing items to test truncation.
    </p>
    <div class="demo">
      <TruncateList class="list resizable" :renderTruncator="({ hiddenItemsCount }) => (`+${hiddenItemsCount}`)">
        <div class="listItem">foo</div>
        <div class="listItem">bar</div>
        <div class="listItem">baz</div>
        <div class="listItem">qux</div>
        <div class="listItem">quux</div>
        <div class="listItem">corge</div>
        <div class="listItem">grault</div>
        <div class="listItem">waldo</div>
        <div class="listItem">fred</div>
        <div class="listItem">plugh</div>
        <div class="listItem">xyzzy</div>
        <div class="listItem">thud</div>
      </TruncateList>
    </div>

    <h2>Expandable List</h2>
    <p>
      The truncator can have advanced behavior, such as expanding to show all items.<br>
      Click the truncator button to expand or collapse the list.
    </p>
    <div class="demo">
      <TruncateList :class="['list', 'expandable', expanded ? 'expanded' : '']" alwaysShowTruncator :renderTruncator="({ hiddenItemsCount, truncate }) => {
        if (hiddenItemsCount > 0) {
          return h(
            'button',
            {
              class: 'expandButton',
              onClick: () => {
                handleExpand();
                // Setting the 'expanded' class sets max-height to none, but the container's height does not update immediately.
                // This means ResizeObserver will not trigger, since the DOM size change is not synchronous.
                // Therefore, we need to manually call `truncate()` in nextTick to ensure the layout is recalculated.
                nextTick(() => {
                  truncate();
                })
              }
            },
            `${hiddenItemsCount} more...`
          );
        } else {
          return h(
            'button',
            {
              class: 'expandButton',
              onClick: handleCollapse
            },
            'hide'
          );
        }
      }">
        <div class="listItem">foo</div>
        <div class="listItem">bar</div>
        <div class="listItem">baz</div>
        <div class="listItem">qux</div>
        <div class="listItem">quux</div>
        <div class="listItem">corge</div>
        <div class="listItem">grault</div>
        <div class="listItem">waldo</div>
        <div class="listItem">fred</div>
        <div class="listItem">plugh</div>
        <div class="listItem">xyzzy</div>
        <div class="listItem">thud</div>
      </TruncateList>
    </div>
  </div>
</template>

<style>
.demo {
  background-color: #f0f0f0;
  padding: 16px;
}

.card {
  padding: 8px;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.07);
}

.card.mobile {
  max-width: 350px;
}

.card.desktop {
  width: fit-content;
}

.card h3 {
  margin: 8px 4px;
}

.list {
  display: flex;
  flex-wrap: wrap;
  max-height: 74px;
  align-content: flex-start;
  align-items: center;
}

.list>* {
  margin: 4px;
}

.list.resizable {
  width: 300px;
  resize: both;
  background-color: #fff;
  height: 74px;
  max-height: none;
}

.list.expandable {
  width: 300px;
  background-color: #fff;
}

.list.expandable.expanded {
  max-height: none;
}

.listItem {
  display: flex;
  align-items: center;
  height: 28px;
  padding: 0 12px;
  font-size: 14px;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  color: rgba(0, 0, 0, 0.65);
  background-color: #fafafa;
}

.expandButton {
  height: 28px;
  font-size: 14px;
  border: none;
  padding: 0 4px;
  color: #1890ff;
  background-color: transparent;
  cursor: pointer;
}
</style>