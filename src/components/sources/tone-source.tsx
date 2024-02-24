"use client"

import {Download} from "lucide-react";
import {useEffect, useRef, useState} from "react";
import {useTranslations} from "use-intl";
import {Button} from "@/components/ui/button";
import Highcharts from "highcharts/highstock";
import PieChart from "highcharts-react-official";
import exporting from "highcharts/modules/exporting";
import HighchartsReact from "highcharts-react-official";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

if (typeof Highcharts === 'object') {
  exporting(Highcharts);
}

const ToneSource = () => {
  const t = useTranslations();

  const optionsSelect = [
    {
      label: 'Telegram.org"',
      key: {
        data: [
          {
            name: t('negativeNotation'),
            y: 12,
            color: '#cf6662'
          },
          {
            name: t('positiveNotation'),
            y: 33,
            color: '#8fc145'
          },
          {
            name: t('neutralNotation'),
            y: 41,
            color: '#b5b9c4'
          }
        ]
      }
    },
    {
      label: 'Qaz365.kz',
      key: {
        data: [
          {
            name: t('negativeNotation'),
            y: 18,
            color: '#cf6662'
          },
          {
            name: t('positiveNotation'),
            y: 87,
            color: '#8fc145'
          },
          {
            name: t('neutralNotation'),
            y: 14,
            color: '#b5b9c4'
          }
        ]
      }
    },
    {
      label: 'instagram.com',
      key: {
        data: [
          {
            name: t('negativeNotation'),
            y: 22,
            color: '#cf6662'
          },
          {
            name: t('positiveNotation'),
            y: 63,
            color: '#8fc145'
          },
          {
            name: t('neutralNotation'),
            y: 14,
            color: '#b5b9c4'
          }
        ]
      }
    },
    {
      label: 'facebook.com',
      key: {
        data: [
          {
            name: t('negativeNotation'),
            y: 12,
            color: '#cf6662'
          },
          {
            name: t('positiveNotation'),
            y: 51,
            color: '#8fc145'
          },
          {
            name: t('neutralNotation'),
            y: 8,
            color: '#b5b9c4'
          }
        ]
      }
    },
    {
      label: 'twitter.com',
      key: {
        data: [
          {
            name: t('negativeNotation'),
            y: 82,
            color: '#cf6662'
          },
          {
            name: t('positiveNotation'),
            y: 43,
            color: '#8fc145'
          },
          {
            name: t('neutralNotation'),
            y: 91,
            color: '#b5b9c4'
          }
        ]
      }
    }
  ];

  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);
  const [chartSrc, setChartSrc] = useState<string>(optionsSelect[0].label);

  const options = {
    chart: {
      type: "pie"
    },
    title: {
      text: chartSrc,
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
    series: [optionsSelect.find((option) => option.label === chartSrc)?.key]
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

  return (
    <div className="rounded border p-4 w-full flex flex-col gap-y-4">
      <div className="flex items-center justify-between gap-x-4 ">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">{t('chartSourceTone')}</h4>
        <div className="flex items-center gap-x-4">
          <Select value={chartSrc} onValueChange={setChartSrc}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a fruit"/>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {optionsSelect.map((item) => (
                  <SelectItem key={item.label} value={item.label}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={downloadChart}>
            <Download size={18}/>
          </Button>
        </div>
      </div>
      <PieChart highcharts={Highcharts} ref={chartComponentRef} options={options}/>
    </div>
  )
}

export {ToneSource}
