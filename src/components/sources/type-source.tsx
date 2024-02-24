"use client"

import {Download} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useEffect, useRef, useState} from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import exporting from "highcharts/modules/exporting";
import {getCookie} from "cookies-next";
import {usePathname} from "@/navigation";
import {env} from "@/env.mjs";
import PieChart from "highcharts-react-official";
import {Skeleton} from "@/components/ui/skeleton";
import {useTranslations} from "use-intl";

if (typeof Highcharts === 'object') {
  exporting(Highcharts);
}

interface socialChart {
  y: number,
  name: string
}

const TypeSource = () => {
  const t = useTranslations();
  const path = usePathname();
  const token = getCookie('scano_acess_token');
  const [pending, setPending] = useState<boolean>(false);
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);
  const [social, setSocial] = useState<ReadonlyArray<socialChart>>([]);

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
        data: social
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

  const getChart = async (id: string) => {
    try {
      setPending(true);
      const res = await fetch(
        `${env.NEXT_PUBLIC_SCANO_API}/api/v1/themes/${id}/analytics/source_types`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setSocial(data);
        setPending(false);
      } else {
        setPending(false);
      }
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    getChart(path.split('/')[1]);
  }, [path]);

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
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">{t('chartSourceType')}</h4>
        <Button variant="outline" size="sm" onClick={downloadChart}>
          <Download size={18}/>
        </Button>
      </div>
      {social.length > 0 ? (
        <PieChart highcharts={Highcharts} ref={chartComponentRef} options={options} />
      ) : (
        <div className="w-full h-[300px] flex items-center justify-center">
          {pending ? (
            <Skeleton className="h-full w-full" />
          ) : (
            <p>
              {t('noData')}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export {TypeSource}
