"use client"

import {Button} from "@/components/ui/button";
import {Download} from "lucide-react";
import {useEffect, useRef} from "react";
import HighchartsReact from "highcharts-react-official";
import {useTranslations} from "use-intl";
import LineChart from "highcharts-react-official";
import Highcharts from "highcharts/highstock";

const AuthorDynamic = () => {
  const t = useTranslations();
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

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
    series: [{
      name: 'Количество авторов',
      data: [43934, 48656, 65165, 81827, 112143, 142383,
        171533, 165174, 155157, 161454, 154610]
    }],
  }

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
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">{t('chartAuthorDynamic')}</h4>
        <Button variant="outline" size="sm" onClick={downloadChart}>
          <Download size={18}/>
        </Button>
      </div>
      <LineChart
        highcharts={Highcharts} ref={chartComponentRef} options={options}
      />
    </div>
  )
}

export {AuthorDynamic}
