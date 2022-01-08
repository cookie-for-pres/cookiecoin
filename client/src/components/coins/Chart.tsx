import React from 'react';
import { Line } from 'react-chartjs-2';
import moment from 'moment';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const Chart = ({ data }) => {
  const format = (amount: any) => {
    return (amount).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    }); 
  }
  
  let labels = [];
  let dataset = [];

  data.forEach((log) => {
    labels.push(moment(log.date).format('MMM D, HH:mm A'));
    dataset.push(log.price);
  });

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Price',
        data: dataset,
        borderColor: 'rgb(130, 78, 248)',
        tension: 0.2
      }
    ]
  }

  const chartOption = {
    pointRadius: 4,
    scales: {
      x: {
        ticks: {
          color: 'white'
        }
      },
      y: {
        
        ticks: {
          color: 'white',
          callback: function(value, index, values) {
            return format(value);
          }
        }
      }
    }
  }

  return (
    <>
      <Line style={{ color: 'var(--light)' }} data={chartData} options={chartOption} />
    </>
  )
};

export default Chart;