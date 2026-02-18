<template>
  <ExplorerCard title="Triggered Events" title-tag="h5" icon-class="fas fa-calendar-check" body-class="p-t-0 p-b-0 m-t-0">
    <div class="table-responsive blocks p-0 m-b-0" v-if="events && events.length > 0">
      <table class="table v-middle">
        <thead>
        <tr class="border-0">
          <th class="border-0"></th>
          <th class="border-0 font-weight-bold">Event ID</th>
          <th class="border-0 font-weight-bold">Event</th>
          <th class="border-0"></th>
        </tr>
        </thead>
        <tbody>
        <tr class="p-t-0 p-b-0" v-bind:key="index" v-for="(ev, index) in events">
          <td>
            <i class="fas fa-file-alt"></i>
          </td>
          <td class="block">
            <div class="d-flex no-block align-items-center">
              <router-link :to="{ name: 'event', params: {eventid: ev.id}}" class="hash">{{ ev.id }}</router-link>
            </div>
          </td>
          <td>
            {{ev.meta.name}}
          </td>
          <td class="text-right">
            <router-link :to="{ name: 'event', params: {eventid: ev.id}}" class="btn btn-sm btn-orange text-white">
              Details
            </router-link>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <h4 class="text-center text-muted p-25">No Events</h4>
    </div>
  </ExplorerCard>
</template>

<script>
import ExplorerCard from "./ExplorerCard.vue";

export default {
  name: "EventsTable",
  components: { ExplorerCard },
  props: {
    events: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>
.block {
  width: 200px;
  min-width: 200px;
}
</style>