<template>
  <div class="tx-chart">
    <line-chart
      :chart-data="datacollection"
      :options="chartOptions"
    />
  </div>
</template>

<script>
import LineChart from './line-chart';

export default {
  components: {
    LineChart,
  },
  props: {
    specialChartData: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false,
        },
        tooltips: {
          mode: 'index',
          intersect: false,
          callbacks: {
            title: () => '',
            label: (tooltipItem) => `${tooltipItem.value} $`,
          },
          displayColors: false,
          titleFontSize: 16,
          bodyFontFamily: "'Roboto', sans-serif",
          bodyFontSize: 16,
          backgroundColor: 'rgba(12, 12, 20, 0.8)',
          cornerRadius: 6,
          xPadding: 14,
          yPadding: 13,
          caretSize: 6,
        },
        hover: {
          mode: 'nearest',
        },
        scales: {
          xAxes: [
            {
              // type: 'time',
              // time: {
              //   unit: 'day',
              //   displayFormats: {
              //     quarter: 'DD.MM',
              //   },
              // },
              gridLines: {
                // color: 'rgba(128, 128, 128, 0.5)',
                zeroLineColor: 'rgba(0, 0, 0, 0)',
              },
              ticks: {
                // fontColor: 'rgba(128, 128, 128, 0.5)',
                fontSize: 10,
              },
            },
          ],
          yAxes: [
            {
              gridLines: {
                // color: 'rgba(128, 128, 128, 0.5)',
                zeroLineColor: 'rgba(0, 0, 0, 0)',
              },
              ticks: {
                // fontColor: 'rgba(128, 128, 128, 0.5)',
                fontSize: 10,
                // beginAtZero: true,
              },
            },
          ],
        },
      },
    };
  },
  computed: {
    datacollection() {
      this.$moment.locale(this.$i18n.locale);
      const labels = [];
      const data = [];
      this.specialChartData.forEach((item) => {
        data.push(Math.round(item.reserveUSD));
        labels.push(this.$moment(item.date).utc(false).format('MMM DD').toString());
      });
      return {
        labels,
        datasets: [
          {
            label: 'all',
            borderColor: '#00BBFF',
            borderWidth: 2,
            data,
            fill: true,
            backgroundColor: 'rgba(0, 187, 255, 0.05)',
            pointBackgroundColor: '#F9F8FB',
            pointBorderWidth: 1,
            pointRadius: 2,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: '#F9F8FB',
          },
        ],
      };
    },
  },
};
</script>

<style lang="scss">
.tx-chart {
  padding: 25px 15px;
  &__label {
    @include widget-label;
    margin-bottom: 22px;
  }

  canvas {
    max-width: 100%;
  }
}
</style>
