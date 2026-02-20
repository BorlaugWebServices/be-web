<template>
  <span class="badge rounded-pill bg-success font-weight-bold" v-if="success">
    <i class="fa fa-check-circle"/> SUCCESS
  </span>
  <span class="badge rounded-pill bg-danger font-weight-bold" v-else>
    <i class="fas fa-exclamation-circle"></i> FAILED
  </span>
</template>

<script>
export default {
  name: "StatusBadge",
  props: {
    success: {
      type: Boolean,
      required: true
    }
  }
}
</script>
