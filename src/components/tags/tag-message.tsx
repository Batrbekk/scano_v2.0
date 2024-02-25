"use client"

import {useTranslations} from "use-intl";
import {usePathname} from "@/navigation";
import {getCookie} from "cookies-next";
import {useEffect, useRef, useState} from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import exporting from "highcharts/modules/exporting";
import {env} from "@/env.mjs";
import {Button} from "@/components/ui/button";
import {Download} from "lucide-react";
import PieChart from "highcharts-react-official";

if (typeof Highcharts === 'object') {
  exporting(Highcharts);
}

interface socialChart {
  y: number,
  name: string
}

const TagMessage = () => {
  const t = useTranslations();
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

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
            name: 'Начальство',
            y: 100
          },
          {
            name: 'Подчиненные',
            y: 123
          }
        ]
      }
    ]
  };

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

  useEffect(() => {
    if (chartComponentRef.current) {
      chartComponentRef.current.chart.update({
        exporting: {
          enabled: true,
        },
      });
    }
  }, [chartComponentRef]);

  return (
    <div className="rounded border p-4 w-full flex flex-col gap-y-4">
      <div className="flex items-stretch justify-between gap-x-4 ">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">{t('chartTagMessage')}</h4>
        <Button variant="outline" size="sm" onClick={downloadChart}>
          <Download size={18}/>
        </Button>
      </div>
      <PieChart highcharts={Highcharts} ref={chartComponentRef} options={options} />
    </div>
  )
}

export {TagMessage}
