import { Line, mixins } from 'vue-chartjs';

const { reactiveProp } = mixins;
export default {
  extends: Line,
  mixins: [reactiveProp],
  props: ['options'],
  data() {
    return {
      meta: null,
    };
  },
  mounted() {
    this.renderChart(this.chartData, this.options);

    setTimeout(() => {
      // eslint-disable-next-line no-underscore-dangle
      this.$emit('setMeta', this.$data._chart.getDatasetMeta(0));
    }, 500);
  },
};
