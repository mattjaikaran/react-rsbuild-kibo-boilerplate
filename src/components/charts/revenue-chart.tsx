import { areaY, defineChart, lineY } from '@tanstack/charts'
import { Chart } from '@tanstack/charts/react'
import { scaleLinear } from '@tanstack/charts/scales/linear'
import { scalePoint } from '@tanstack/charts/scales/point'
import { tooltip } from '@tanstack/charts/tooltip'
import { chartTheme } from './chart-theme'

interface RevenueRow {
  month: string
  revenue: number
}

const revenueRows: readonly RevenueRow[] = [
  { month: 'Jan', revenue: 36_000 },
  { month: 'Feb', revenue: 48_000 },
  { month: 'Mar', revenue: 45_000 },
  { month: 'Apr', revenue: 62_000 },
  { month: 'May', revenue: 76_000 },
  { month: 'Jun', revenue: 71_000 },
]

const formatCurrency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 0,
})

const revenueChart = defineChart({
  marks: [
    areaY(revenueRows, {
      x: 'month',
      y: 'revenue',
      fill: 'hsl(var(--chart-1))',
      fillOpacity: 0.16,
    }),
    lineY(revenueRows, {
      x: 'month',
      y: 'revenue',
      stroke: 'hsl(var(--chart-1))',
      strokeWidth: 2,
      points: true,
    }),
  ],
  scales: {
    x: { scale: () => scalePoint<string>().padding(0.3) },
    y: {
      scale: scaleLinear,
      nice: true,
      grid: true,
      axis: {
        label: 'Revenue (USD)',
        ticks: { format: (value) => formatCurrency.format(value) },
      },
    },
  },
  theme: chartTheme,
  svgAnimation: true,
  tooltip,
})

export function RevenueChart() {
  return (
    <Chart
      definition={revenueChart}
      height={280}
      ariaLabel="Monthly revenue from January to June"
      className="chart-surface"
    />
  )
}
