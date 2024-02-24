"use client"

import {Download} from "lucide-react";
import {useEffect, useRef} from "react";
import {Button} from "@/components/ui/button";
import Highcharts from "highcharts/highstock";
import LineChart from "highcharts-react-official";
import exporting from "highcharts/modules/exporting";
import HighchartsReact from "highcharts-react-official";
import {useTranslations} from "use-intl";

if (typeof Highcharts === 'object') {
  exporting(Highcharts);
}

const DynamicSource = () => {
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
    title: {
      text: '',
    },
    navigation: {
      buttonOptions: {
        enabled: false,
      },
    },
    plotOptions: {
      series: {
        label: {
          connectorAllowed: false
        },
        pointStart: 2010
      }
    },
    series: [
      {
        name: 'telegram.org',
        data: [43934, 48656, 65165, 81827, 112143, 142383,
          171533, 165174, 155157, 161454, 154610]
      },
      {
        name: 'twitter.com',
        data: [24916, 37941, 29742, 29851, 32490, 30282,
          38121, 36885, 33726, 34243, 31050]
      },
      {
        name: 'facebook.com',
        data: [11744, 30000, 16005, 19771, 20185, 24377,
          32147, 30912, 29243, 29213, 25663]
      },
      {
        name: 'qaz365.kz',
        data: [21908, 5548, 8105, 11248, 8989, 11816, 18274,
          17300, 13053, 11906, 10073]
      }
    ],
  }

  return (
    <div className="border rounded p-4 w-full flex flex-col gap-y-4">
      <div className="flex items-center justify-between gap-x-4">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">{t('chartSourceDynamic')}</h4>
        <Button variant="outline" size="sm" onClick={downloadChart}>
          <Download size={18}/>
        </Button>
      </div>
      <LineChart highcharts={Highcharts} ref={chartComponentRef} options={options}/>
    </div>
  )
}

export {DynamicSource}
