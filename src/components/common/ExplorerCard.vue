<template>
  <div :class="['card', cardClass]">
    <div v-if="!noHeader" class="card-header row m-b-0 p-b-0">
      <div class="col-md-6 card-title">
        <slot name="title">
          <component v-if="titleTag" :is="titleTag">{{ title }}</component>
          <span v-else>{{ title }}</span>
        </slot>
      </div>

      <div class="col-md-6 text-right">
        <slot name="icon">
          <h3 v-if="iconClass">
            <i :class="[iconClass, 'card-title', 'text-orange']" />
          </h3>
        </slot>
      </div>
    </div>

    <div :class="['card-body', bodyClass]">
      <slot />
    </div>

    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script>
export default {
  name: "ExplorerCard",
  props: {
    title: { type: String, default: "" },
    titleTag: { type: String, default: "" }, // e.g. "h3", "h4", "h5"
    iconClass: { type: String, default: "" }, // e.g. "fa fa-cubes" or "fas fa-users"
    noHeader: { type: Boolean, default: false },
    cardClass: { type: String, default: "" },
    bodyClass: { type: String, default: "" }
  }
};
</script>