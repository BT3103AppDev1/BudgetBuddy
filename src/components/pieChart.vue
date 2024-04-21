<template>
  <div>
    <canvas ref="pieChart"></canvas>
  </div>
</template>

<script>
import { Chart, registerables } from "chart.js";

export default {
  name: "PieChart",
  props: {
    transactions: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      pieChart: null,
      loadingChart: false,
    };
  },
  mounted() {
    Chart.register(...registerables);
    this.initChart();
  },
  beforeUnmount() {
    this.destroyChart();
  },
  methods: {
    initChart() {
      if (this.pieChart) {
        this.destroyChart();
      }
      this.createChart();
    },

    destroyChart() {
    if (this.pieChart) {
      this.pieChart.destroy();
      this.pieChart = null;
    }
    this.loadingChart = false;
  },

    createChart() {
      this.loadingChart = true;
      this.destroyChart();
      const chartData = this.processTransactions(this.transactions);
      this.pieChart = new Chart(this.$refs.pieChart, {
        type: "pie",
        data: chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          tooltips: {
            callbacks: {
              label: function(tooltipItem, data) {
                let label = data.labels[tooltipItem.index] || '';
                if (label) {
                  label += ': ';
                }
                label += data.datasets[0].data[tooltipItem.index];
                return label;
              }
            }
          }
        },
      });
      this.loadingChart = false;
    },
    processTransactions(transactions) {
      const categoryTotals = transactions.reduce(
        (totals, { category, amount }) => {
          if (!totals[category]) {
            totals[category] = 0;
          }
          totals[category] += amount;
          return totals;
        },
        {}
      );

      const totalAmount = Object.values(categoryTotals).reduce((sum, current) => sum + current, 0);
      const labels = Object.keys(categoryTotals).map(
        category => `${category} (${((categoryTotals[category] / totalAmount) * 100).toFixed(2)}%)`
      );
      const data = Object.values(categoryTotals);

      return {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: this.generateColorArray(labels.length),
            hoverBackgroundColor: this.generateColorArray(labels.length, true),
          },
        ],
      };
    },
    generateColorArray(length, hover = false) {
      const colors = [
        "#FF6384",
        "#36A2EB",
        "#FFCE56",
        "#4BC0C0",
        "#F7464A",
        "#8A2BE2",
      ];
      const hoverColors = colors.map((color) => `${color}B3`);
      return Array.from({ length }, (_, i) =>
        hover ? hoverColors[i % colors.length] : colors[i % colors.length]
      );
    },
  },
  beforeUnmount() {
    if (this.pieChart) {
      this.pieChart.destroy();
    }
  },
  watch: {
    transactions: {
      deep: true,
      immediate: true,
      handler(newVal) {
        if (this.loadingChart) {
          this.destroyChart();
        }
        this.createChart();
      },
    },
  },
};
</script>
