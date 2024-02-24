"use client"

import {useEffect, useRef, useState} from "react";
import {Download} from "lucide-react";
import * as Highcharts from 'highcharts';
import {Button} from "@/components/ui/button";
import exporting from 'highcharts/modules/exporting';
import HighchartsReact from "highcharts-react-official";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {useTranslations} from "use-intl";

if (typeof Highcharts === 'object') {
  exporting(Highcharts);
}

const Review = (props: HighchartsReact.Props) => {
  const t = useTranslations();

  const chartPeriod = [
    {
      value: 'month',
      label: t('inMonth')
    },
    {
      value: 'week',
      label: t('inWeek')
    },
    {
      value: 'day',
      label: t('inDay')
    }
  ];

  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);
  const [chartPeriodValue, setChartPeriodValue] = useState<string>(chartPeriod[0].value);

  const options: Highcharts.Options = {
    title: {
      text: '',
    },
    navigation: {
      buttonOptions: {
        enabled: false,
      },
    },
    yAxis: {
      min: 0,
    },
    xAxis: {
      type: 'datetime',
      max: 30 * 24 * 3600 * 1000,
      tickInterval: 24 * 3600 * 1000,
      dateTimeLabelFormats: {
        day: "%e %b",
      },
    },
    series: [
      {
        name: 'Позитив',
        type: 'line',
        data: [
          [1450023000, 10],
          [1470123000, 4],
          [1490223000, 6],
          [1510323000, 2],
          [1530423000, 1],
          [1550523000, 3],
          [1570623000, 9]
        ],
        color: '#60CA23',
        connectNulls: true,
        connectEnds: true
      },
      {
        name: 'Негатив',
        type: 'line',
        data: [
          [1450023000, 11],
          [1470123000, 5],
          [1490223000, 7],
          [1510323000, 3],
          [1530423000, 2],
        ],
        color: '#B00000',
        connectNulls: true,
        connectEnds: true
      },
      {
        name: 'Нейтральный',
        type: 'line',
        data: [
          [1450023000, 9],
          [1470123000, 6],
          [1490223000, 8],
          [1510323000, 2],
          [1530423000, 1],
          [1550523000, 5],
          [1570623000, 10]
        ],
        color: '#FFCF48',
        connectNulls: true,
        connectEnds: true
      },
      {
        name: 'Количество упоминаний',
        type: 'line',
        data: [
          [1450023000, 8],
          [1470123000, 5],
          [1490223000, 7],
          [1510323000, 3],
          [1530423000, 2],
          [1550523000, 6],
          [1570623000, 9],
        ],
        color: '#7851A9',
        connectEnds: true
      },
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
  }, []);

  return (
    <div className="p-4 rounded border flex flex-col gap-y-8">
      <div className="flex items-stretch justify-end gap-x-4 ">
        <Select value={chartPeriodValue} onValueChange={setChartPeriodValue}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {chartPeriod.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" onClick={downloadChart}>
          <Download size={18} />
        </Button>
      </div>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        ref={chartComponentRef}
        {...props}
      />
    </div>
  )
}

export {Review}
