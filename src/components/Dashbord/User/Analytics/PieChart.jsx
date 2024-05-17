import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { apiConnector } from '../../../../services/apiConnector';
import { analyticsEndpoints } from '../../../../services/apis';
import { useSelector } from 'react-redux';
import Spinner from '../../../common/Spinner';

const { GET_TOTAL_ANALYTICES_USER_API } = analyticsEndpoints;

const PieChart = () => {
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [totalClicks, setTotalClicks] = useState(0);
  const [chartOptions, setChartOptions] = useState(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await apiConnector('GET', GET_TOTAL_ANALYTICES_USER_API, null, {
        Authorization: `Bearer ${token}`,
      });
      setAnalytics(res.data.data);
      setTotalClicks(res.data.totalClicks);
    } catch (error) {
      console.error('Error fetching URLs:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const getTotalClicks = () => {
    const clicks = totalClicks;
    return `<div style="display: flex; flex-direction: column; align-items: center; justify-content: center;"><span style="font-size: 20px;">${clicks}</span><span style="font-size: 10px;">CLICKS + SCAN</span></div>`;
  };

  useEffect(() => {
    if (analytics) {
      const filteredAnalytics = Object.fromEntries(
        Object.entries(analytics).filter(([key, value]) => key !== 'id' && key !== 'userId')
      );
      const chartData = Object.entries(filteredAnalytics).map(([key, value]) => ({
        name: key,
        y: value,
      }));

      const options = {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie',
          marginTop: 30,
        },
        title: {
          text: `<tspan class="total"><tspan class="title"></tspan><br/><tspan class="subtitle">CLICKS + SCANS</tspan></tspan>`,
          useHTML: true,
          align: 'center',
          verticalAlign: 'middle',
          y: -150,
          style: {
            fontFamily: '"Proxima Nova"',
            fontSize: '18px',
            color: '#333333',
          },
        },
        subtitle: {
          useHTML: true,
          text: getTotalClicks(),
          floating: true,
          align: 'center',
          verticalAlign: 'middle',
          y: 15,
          x: -60,
          style: {
            fontSize: '14px',
          },
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: false,
            },
            showInLegend: true,
            size: '90%',
            innerSize: '75%',
            events: {
              legendItemClick: () => false,
            },
            point: {
              events: {
                mouseOver() {
                  setChartOptions(prevOptions => ({
                    ...prevOptions,
                    subtitle: {
                      useHTML: true,
                      text: getLegend(this),
                      floating: true,
                      align: 'center',
                      verticalAlign: 'middle',
                      y: 15,
                      x: -60,
                      style: {
                        fontSize: '14px',
                      },
                    },
                  }));
                },
                mouseOut() {
                  setChartOptions(prevOptions => ({
                    ...prevOptions,
                    subtitle: {
                      useHTML: true,
                      text: getTotalClicks(),
                      floating: true,
                      align: 'center',
                      verticalAlign: 'middle',
                      y: 15,
                      x: -60,
                      style: {
                        fontSize: '14px',
                      },
                    },
                  }));
                },
              },
            },
          },
        },
        series: [
          {
            type: 'pie',
            name: 'Clicks',
            colorByPoint: true,
            data: chartData,
          },
        ],
        credits: {
          enabled: false,
        },
        legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'middle',
          symbolHeight: 12,
          symbolWidth: 12,
          itemMarginBottom: 10,
          itemHoverStyle: {
            color: 'red',
          },
          labelFormatter() {
            return `<span style="font-size: 14px;">${this.name}: ${this.y}</span>`;
          },
          events: {
            legendItemHover: function () {
              setChartOptions(prevOptions => ({
                ...prevOptions,
                subtitle: {
                  useHTML: true,
                  text: getLegend(this), // Passing 'this' to getLegend function
                  floating: true,
                  align: 'center',
                  verticalAlign: 'middle',
                  y: 15,
                  x: -60,
                  style: {
                    fontSize: '14px',
                  },
                },
              }));
            },
            legendItemMouseOut: function () {
              setChartOptions(prevOptions => ({
                ...prevOptions,
                subtitle: {
                  useHTML: true,
                  text: getTotalClicks(),
                  floating: true,
                  align: 'center',
                  verticalAlign: 'middle',
                  y: 15,
                  x: -60,
                  style: {
                    fontSize: '14px',
                  },
                },
              }));
            },
          },
        },
      };

      setChartOptions(options);
    }
  }, [analytics, totalClicks]);

  const getLegend = (point) => {
    if (point) {
      return `<div style="display: flex; flex-direction: column; align-items: center;">
                <b style="font-size: 16px;">${point.y}</b>
                <div>${point.name}</div>
              </div>`;
    }
    return '';
  };

  return (
    <>
      {loading ? (
         <div className='flex items-center justify-center'><Spinner /></div>
      ) : (
        <>
          {chartOptions && <HighchartsReact highcharts={Highcharts} options={chartOptions} />}
        </>
      )}
    </>
  );
};

export default PieChart;