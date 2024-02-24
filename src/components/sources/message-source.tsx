"use client"

import {useEffect, useRef} from "react";
import Highcharts from "highcharts/highstock";
import PieChart from "highcharts-react-official";
import exporting from "highcharts/modules/exporting";
import HighchartsReact from "highcharts-react-official";
import {Button} from "@/components/ui/button";
import {Download} from "lucide-react";
import {useTranslations} from "use-intl";


if (typeof Highcharts === 'object') {
  exporting(Highcharts);
}

const MessageSource = () => {
  const t = useTranslations();
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

  useEffect(() => {
    if (chartComponentRef.current) {
      chartComponentRef.current.chart.update({
        exporting: {
          enabled: true,
        },
      });
    }
  }, []);

  const downloadChart = () => {
    const chart = chartComponentRef.current?.chart;
    if (chart) {
      chart.exportChart({
        type: 'image/png',
        filename: 'chart',
      }, {
        chart: {
          backgroundColor: '#ffffff',
        },
      });
    }
  };

  const options = {
    chart: {
      type: "pie"
    },
    title: {
      text: '',
    },
    navigation: {
      buttonOptions: {
        enabled: false,
      },
    },
    plotOptions: {
      pie: {
        innerSize: 150
      },
      series: {
        cursor: 'pointer',
        showInLegend: true,
        dataLabels: [{
          enabled: false,
          distance: 20
        }, {
          enabled: true,
          distance: -40,
          format: '{point.percentage:.1f}%',
          style: {
            color: '#fff',
            fontSize: '16px',
            textOutline: 'none',
            opacity: 1
          },
          filter: {
            operator: '>',
            property: 'percentage',
            value: 10
          }
        }]
      }
    },
    series: [
      {
        data: [
          {
            name: 'telegram.org',
            y: 32,
          },
          {
            name: 'twitter.com',
            y: 53,
          },
          {
            name: 'facebook.com',
            y: 21,
          },
          {
            name: 'qaz365.kz',
            y: 64
          },
          {
            name: 'instagram.com',
            y: 89
          }
        ]
      }
    ]
  };

  return (
    <div className="rounded border p-4 w-full flex flex-col gap-y-4">
      <div className="flex items-center justify-between gap-x-4 ">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">{t('chartSourceMessage')}</h4>
        <Button variant="outline" size="sm" onClick={downloadChart}>
          <Download size={18}/>
        </Button>
      </div>
      <PieChart highcharts={Highcharts} ref={chartComponentRef} options={options}/>
    </div>
  )
}

export {MessageSource}
