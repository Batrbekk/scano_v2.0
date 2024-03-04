import React, { useEffect, useRef, useState } from "react";
import Highcharts from "highcharts/highmaps";
import HighchartsReact from "highcharts-react-official";
import { Skeleton } from "@/components/ui/skeleton";
import { CommunityData } from "@/types";
import {Button} from "@/components/ui/button";
import {ChevronLeft, Facebook, Instagram} from "lucide-react";
import Telegram from "@/public/icons/telegram.svg";
import X from "@/public/icons/x.svg";
import Image from "next/image";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {ScrollArea} from "@/components/ui/scroll-area";
import {env} from "@/env.mjs";

interface Props {
    country: string;
    objects: CommunityData[];
}

const CountryMap: React.FC<Props> = ({ country, objects }) => {
    const chartComponentRef = useRef<HighchartsReact.RefObject>(null);
    const [map, setMap] = useState<any>(null);
    const [mapData, setMapData] = useState<any>(null);
    const [currentPoint, setCurrentPoint] = useState<any>(null);

    // @ts-ignore
    const mapOptions = {
        title: {
            text: "",
        },
        chart: {
            map: map,
            height: 600,
        },
        navigation: {
            buttonOptions: {
                enabled: false,
            },
        },
        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: "top",
            },
        },
        tooltip: {
            formatter: function(this: Highcharts.TooltipFormatterContextObject) {
                // @ts-ignore
                return '<b>' + this.key + '</b><br>Lat: ' + this.point.lat.toFixed(2) + ', Lon: ' + this.point.lon.toFixed(2);
            }
        },
        plotOptions: {
            mappoint: {
                cluster: {
                    enabled: true,
                    allowOverlap: false,
                    animation: {
                        duration: 450,
                    },
                    layoutAlgorithm: {
                        type: "grid",
                        gridSize: 70,
                    },
                    zones: [
                        {
                            from: 1,
                            to: 4,
                            marker: {
                                radius: 13,
                            },
                        },
                        {
                            from: 5,
                            to: 9,
                            marker: {
                                radius: 15,
                            },
                        },
                        {
                            from: 10,
                            to: 15,
                            marker: {
                                radius: 17,
                            },
                        },
                        {
                            from: 16,
                            to: 20,
                            marker: {
                                radius: 19,
                            },
                        },
                        {
                            from: 21,
                            to: 100,
                            marker: {
                                radius: 21,
                            },
                        },
                    ],
                },
            },
        },
        series: [
            {
                name: 'Basemap',
                borderColor: '#A0A0A0',
                nullColor: 'rgba(200, 200, 200, 0.3)',
                showInLegend: false
            },
            {
                type: 'mappoint',
                enableMouseTracking: true,
                colorKey: 'clusterPointsAmount',
                name: 'Cities',
                states: {
                    hover: {
                        color: "#BADA55",
                    },
                },
                point: {
                    events: {
                        click: function (event: any) {
                            const clickedObject = objects[event.point.index];
                            console.log('Clicked Object:', clickedObject);
                            setCurrentPoint(clickedObject);
                        },
                    },
                },
                data: mapData,
            },
        ],
    };

    async function getMap() {
        const res = await fetch(
            `https://code.highcharts.com/mapdata/countries/${country}/${country}-all.topo.json`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (res.ok) {
            const data = await res.json();
            setMap(data);
        }
    }

    async function getCommunity(id: number) {
        setCurrentPoint(null);
        console.log(id);
        const res = await fetch(`${env.NEXT_PUBLIC_STRAPI_URL}/communities/${id}?populate=*`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${env.NEXT_PUBLIC_TOKEN}`
            },
        });
        if (res.ok) {
            const fetchedData: { data: CommunityData } = await res.json();
            console.log(fetchedData.data);
            setCurrentPoint(fetchedData.data);
        }
    }

    useEffect(() => {
        const data = objects.map((item) => ({
            name: item.attributes.city,
            lon: parseFloat(item.attributes.lon),
            lat: parseFloat(item.attributes.lat),
            country: country.toUpperCase(),
        }));
        console.log(data);
        setMapData(data);
    }, [objects, country]);

    useEffect(() => {
        setMap(null);
        getMap();
    }, []);

    return (
        <div>
            {map ? (
                    currentPoint? (
                        <div className="flex flex-col gap-y-8">
                            <Button className="w-fit px-4 flex items-center gap-x-2" variant="outline" onClick={() => {
                                setCurrentPoint(null)
                            }}>
                                <ChevronLeft size={16} /> Назад
                            </Button>
                            {currentPoint ? (
                                <div className="flex items-start gap-x-8">
                                    <div className="flex flex-col gap-y-4 w-2/3">
                                        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">{currentPoint.attributes.name}</h2>
                                        {currentPoint.attributes.representatives.data.length > 0 && (
                                            <div className="flex flex-col gap-y-4">
                                                <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">Ұйым
                                                    өкілдері</h4>
                                                <div className="flex flex-wrap gap-4">
                                                    {currentPoint.attributes.representatives.data.map((item: any) => (
                                                        <div key={item.id}
                                                             className="flex items-start gap-x-2 rounded border p-4">
                                                            {item.attributes.avatar && (
                                                                <img src={item.attributes.avatar} alt="avatar"
                                                                     className="w-20"/>
                                                            )}
                                                            <div className="flex flex-col items-start">
                                                                <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">{item.attributes.name}</h4>
                                                                <p>{item.attributes.dateOfBirth}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        <div className="">
                                            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">Ұйым
                                                Қызметі: </h4>
                                            <p>{currentPoint.attributes.about}</p>
                                        </div>
                                        <div className="flex items-start border rounded">
                                            <div className="border-r flex flex-col w-1/2">
                                                <h4 className="scroll-m-20 border-b text-xl font-semibold tracking-tight text-center text-green-500">
                                                    Бейбіт ұйымдар
                                                </h4>
                                                <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
                                                    {currentPoint.attributes.friendly.data
                                                        .map((item: any) => (
                                                            <li key={item.id} className="cursor-pointer hover:underline"
                                                                onClick={() => {
                                                                    getCommunity(item.id)
                                                                }}>
                                                                {item.attributes.name}
                                                            </li>
                                                        ))}
                                                </ul>
                                            </div>
                                            <div className="flex flex-col w-1/2">
                                                <h4 className="scroll-m-20 border-b text-xl font-semibold tracking-tight text-center text-red-500">
                                                    Тату емес ұйымдар
                                                </h4>
                                                <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
                                                    {currentPoint.attributes.unfriendlies.data
                                                        .map((item: any) => (
                                                            <li key={item.id} className="cursor-pointer hover:underline"
                                                                onClick={() => {
                                                                    getCommunity(item.id)
                                                                }}>
                                                                {item.attributes.name}
                                                            </li>
                                                        ))}
                                                </ul>
                                            </div>
                                        </div>
                                        {currentPoint.attributes.social_network.data !== null && (
                                            <div className="flex items-center gap-x-2">
                                                <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">Әлеуметтік
                                                    желілері:</h4>
                                                <div className="flex items-center gap-x-2">
                                                    {currentPoint.attributes.social_network.data.attributes.instagram && (
                                                        <a href={currentPoint.attributes.social_network.data.attributes.instagram}
                                                           target="_blank">
                                                            <Instagram size={24}/>
                                                        </a>
                                                    )}
                                                    {currentPoint.attributes.social_network.data.attributes.telegram && (
                                                        <a href={currentPoint.attributes.social_network.data.attributes.telegram}
                                                           target="_blank">
                                                            <Image priority={true} src={Telegram} alt="Logo"
                                                                   width={24}/>
                                                        </a>
                                                    )}
                                                    {currentPoint.attributes.social_network.data.attributes.twitter && (
                                                        <a href={currentPoint.attributes.social_network.data.attributes.twitter}
                                                           target="_blank">
                                                            <Image priority={true} src={X} alt="Logo" width={24}/>
                                                        </a>
                                                    )}
                                                    {currentPoint.attributes.social_network.data.attributes.facebook && (
                                                        <a href={currentPoint.attributes.social_network.data.attributes.facebook}
                                                           target="_blank">
                                                            <Facebook size={24}/>
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <ScrollArea className="w-1/3 h-[400px]">
                                        <div className="flex flex-col gap-y-4 w-full rounded border p-2">
                                            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">Іс-шаралар:</h4>
                                            <Tabs defaultValue="all">
                                                <TabsList className="grid w-full grid-cols-2 mb-4">
                                                    <TabsTrigger value="all">Барлығы</TabsTrigger>
                                                    <TabsTrigger value="oq">ОҚ-мен бірге</TabsTrigger>
                                                </TabsList>
                                                <TabsContent value="all" className="flex flex-col gap-y-4 mt-0">
                                                    {currentPoint.attributes.events.data.map((item: any) => (
                                                        <div key={item.id}
                                                             className="rounded border p-1 flex flex-col gap-y-2">
                                                            <h4 className="font-semibold">{item.attributes.title}</h4>
                                                            <p className="font-semibold">Өткізілетін
                                                                күні: {item.attributes.date}</p>
                                                        </div>
                                                    ))}
                                                    {currentPoint.attributes.events.data.length < 1 && (
                                                        <h4 className="text-center text-xl mt-0 font-semibold tracking-tight">Нет
                                                            данных</h4>
                                                    )}
                                                </TabsContent>
                                                <TabsContent value="oq" className="flex flex-col gap-y-4 mt-0">
                                                    {currentPoint.attributes.events.data
                                                        .filter((item: any) => item.attributes.with_oq)
                                                        .map((item: any) => (
                                                            <div key={item.id}
                                                                 className="rounded border p-1 flex flex-col gap-y-2">
                                                                <h4 className="font-semibold">{item.attributes.title}</h4>
                                                                <p>Өткізілетін күні: {item.attributes.date}</p>
                                                            </div>
                                                        ))}
                                                    {currentPoint.attributes.events.data.filter((item: any) => item.attributes.with_oq).length < 1 && (
                                                        <h4 className="text-center text-xl mt-0 font-semibold tracking-tight">Нет
                                                            данных</h4>
                                                    )}
                                                </TabsContent>
                                            </Tabs>
                                        </div>
                                    </ScrollArea>
                                </div>
                            ) : (
                                <div className="flex items-start gap-x-4">
                                    <div className="w-2/3 flex flex-col gap-y-4">
                                        <Skeleton className="h-20 w-full" />
                                        <Skeleton className="h-20 w-full" />
                                        <Skeleton className="h-20 w-full" />
                                    </div>
                                    <div className="w-1/3 flex flex-col gap-y-4">
                                        <Skeleton className="h-20 w-full" />
                                        <Skeleton className="h-20 w-full" />
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <HighchartsReact
                            highcharts={Highcharts}
                            constructorType={"mapChart"}
                            options={mapOptions}
                            ref={chartComponentRef}
                        />
                    )
            ) : (
                <Skeleton className="w-full h-[500px]"/>
            )}
        </div>
    );
};

export {CountryMap};
