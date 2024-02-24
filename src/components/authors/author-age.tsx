"use client"

import {Button} from "@/components/ui/button";
import {Download} from "lucide-react";
import {useEffect, useRef, useState} from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import exporting from "highcharts/modules/exporting";
import {useTranslations} from "use-intl";
import {usePathname} from "@/navigation";
import {getCookie} from "cookies-next";
import {Skeleton} from "@/components/ui/skeleton";
import BarChart from "highcharts-react-official";

if (typeof Highcharts === 'object') {
  exporting(Highcharts);
}

interface socialChart {
  y: number,
  name: string
}

const AuthorAge = () => {
  const t = useTranslations();
  const path = usePathname();
  const token = getCookie('scano_acess_token');
  const [pending, setPending] = useState<boolean>(false);
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);
  const [ages, setAges] = useState<ReadonlyArray<socialChart>>([]);
  const [agesName, setAgesName] = useState<ReadonlyArray<string>>([]);
  const [agesData, setAgesData] = useState<ReadonlyArray<number>>([]);

  const options = {
    chart: {
      type: 'bar',
    },
    navigation: {
      buttonOptions: {
        enabled: false,
      },
    },
    title: {
      text: '',
    },
    xAxis: {
      categories: agesName,
      title: {
        text: null,
      },
      gridLineWidth: 1,
      lineWidth: 0,
    },
    yAxis: {
      title: ''
    },
    series: [
      {
        data: agesData,
        colorByPoint: true, // Each bar will have a different color
      },
    ],
    colors: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'], // Set custom colors for each category
    legend: {
      enabled: false, // Disable legend
    },
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

  const getChart = async (id: string) => {
    try {
      setPending(true);
      const res = await fetch(
        `https://scano-0df0b7c835bf.herokuapp.com/api/v1/themes/${id}/analytics/authors_age`,
        {
          method: 'GET', // Assuming you are sending a POST request
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setAges(data);
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
    if (ages.length > 0) {
      setAgesName(ages.map((item) => item.name));
      setAgesData(ages.map((item) => item.y));
    }
  }, [ages]);

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
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">{t('chartAuthorAge')}</h4>
        <Button variant="outline" size="sm" onClick={downloadChart}>
          <Download size={18}/>
        </Button>
      </div>
      {ages.length > 0 ? (
        <BarChart highcharts={Highcharts} ref={chartComponentRef} options={options} />
      ) : (
        <div className="w-full h-[300px] flex items-center justify-center">
          {pending ? (
            <Skeleton className="h-full w-full" />
          ) : (
            <div>
              <p>
                {t('noData')}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export {AuthorAge}
