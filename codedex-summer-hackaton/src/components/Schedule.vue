<script>
import {CalendarView, CalendarViewHeader} from "vue-simple-calendar"
import "vue-simple-calendar/dist/style.css"
// The next two lines are optional themes

export default {
  data: function () {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const items = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayOfWeek = date.getDay();
      let event = null;

      if (dayOfWeek === 3) { // Wednesday
        event = {
          id: "CMDR-1",
          startDate: `${year}-${month + 1}-${day} 18:00`,
          title: "Commander Night"
        };
      } else if (dayOfWeek === 4) { // Thursday
        event = {
          id: "MOD-1",
          startDate: `${year}-${month + 1}-${day} 19:00`,
          title: "Modern Tournament"
        };
      } else if (dayOfWeek === 6) { // Saturday
        event = {
          id: "DRAFT-1",
          startDate: `${year}-${month + 1}-${day} 10:15`,
          title: "Draft Tournament"
        };
      }

      if (event) {
        items.push(event);
      }
    }

    return {
      showDate: new Date(),
      items: items
    }
  },
  components: {
    CalendarView,
    CalendarViewHeader,
  },
  methods: {
    setShowDate(d) {
      this.showDate = d;
    },
  }
}
</script>

<template>
  <div class="schedule-content">
    <CalendarView
        :show-date="showDate" :enable-date-selection="false" :starting-day-of-week="1"
        :disable-future="true"
        :disable-past="true"
        :items="items"
        class="theme-default holiday-us-traditional holiday-us-official">
      <template>
        <CalendarViewHeader style="line-height: 100px;"
                            @input="setShowDate"/>
      </template>
    </CalendarView>
  </div>
</template>

<style>

.schedule-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
}

.cv-wrapper {
  width: 1080px;
  min-height: unset;
  margin: 100px auto 10px auto;
  background-color: #dee9d3;
  border-radius: 20px;
}

.cv-header-days {
  line-height: 5;
  font-weight: bold;
  text-transform: uppercase;
}

.cv-header-days, .cv-header-day, .cv-weeks, .cv-week, .cv-day, .cv-item {
  border-color: #f0f0f0 !important;
}

.cv-day {
  background-color: #bac9ab;;
}
</style>