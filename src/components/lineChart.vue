<template>
  <div class="line-chart">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
import { Chart, registerables } from "chart.js";
import { ref, onMounted, watch } from "vue";

Chart.register(...registerables);

export default {
  props: {
    chartData: {
      type: Object,
      required: true,
    },
    options: {
      type: Object,
      default: () => {},
    },
  },
  setup(props) {
    const canvas = ref(null);
    let chartInstance = null;

    onMounted(() => {
      chartInstance = new Chart(canvas.value.getContext("2d"), {
        type: "line",
        data: props.chartData,
        options: props.options,
      });
    });

    watch(
      () => props.chartData,
      (newChartData) => {
        if (chartInstance) {
          chartInstance.data = newChartData;
          chartInstance.update();
        }
      }
    );

    watch(
      () => props.chartData,
      (newVal, oldVal) => {
        if (chartInstance) {
          chartInstance.destroy();
        }
      },
      { immediate: true, deep: true }
    );

    return {
      canvas,
    };
  },
};
</script>

<style>
.line-chart {
  height: 400px;
  width: 100%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  margin: 20px auto;
  background-color: #fff;
  padding: 15px;
  border: 1px solid #eaeaea;
  resize: both;
  overflow: auto;
}
</style>
