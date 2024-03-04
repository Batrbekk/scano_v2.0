// Import necessary modules and types
import Highcharts from "highcharts/highmaps";
import { useEffect, useRef, useState } from "react";
import exporting from "highcharts/modules/exporting";
import HighchartsReact from "highcharts-react-official";
import worldMap from "@highcharts/map-collection/custom/world.geo.json";
import { env } from "@/env.mjs";
import { CommunityData } from "@/types";
import {CountryMap} from "@/components/kuryltai-component/country-map";
import {Dialog, DialogContent} from "@/components/ui/dialog";
import {setCookie} from "cookies-next";

if (typeof Highcharts === 'object') {
    exporting(Highcharts);
}

const token = 'd78a68cf8c36fe44446001a4c03c8605c5a011620db7b6991ce1f2d776d76c61fa1c6c3d75f69da18ce7cf9c704f27e238ab876930a5a67a3c2fb4880e780a87f34d6a56fe191ef147394f98adffc73398829fac432186c05b4825a7f7112fd56bcb6971b3ef9385f6161669da6eeab3c1acb391891ec0755371742d9d1bb545';

const Map = () => {
    const [pending, setPending] = useState<boolean>(false);
    const chartComponentRef = useRef<HighchartsReact.RefObject>(null);
    const [data, setData] = useState<any>([]);
    const [mapOption, setMapOption] = useState<Array<[string, number]>>([]);
    const [countryCounts, setCountryCounts] = useState<any>({});

    const [currentCountry, setCurrentCountry] = useState<any>(null);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [currentCountryData, setCurrentCountryData] = useState<CommunityData[]>([]);

    const mapOptions = {
        title: {
            text: ''
        },
        chart: {
            map: worldMap,
            height: 600
        },
        navigation: {
            buttonOptions: {
                enabled: false,
            },
        },
        tooltip: {},
        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'top'
            }
        },
        series: [{
            name: "Enable countries",
            states: {
                hover: {
                    color: "#BADA55"
                }
            },
            dataLabels: {
                enabled: true,
                format: "{point.name}"
            },
            point: {
                events: {
                    click: function (event: any) {
                        const clickedCountry = event.point.options['hc-key'];
                        console.log('Country Data:', clickedCountry);

                        // Фильтрация данных для текущей страны
                        const countryDataForCurrentCountry = data.filter((item: CommunityData) => {
                            const country = item.attributes.country.split('-')[0].toLowerCase();
                            return country === clickedCountry;
                        });

                        console.log('Country Data for', clickedCountry, ':', countryDataForCurrentCountry);

                        // Обновление состояния с данными для текущей страны
                        setCurrentCountryData(countryDataForCurrentCountry);

                        setIsOpen(true);
                        setCurrentCountry(clickedCountry);
                    }
                }
            },
            data: mapOption
        }]
    }

    async function getData() {
        try {
            const res = await fetch(`${env.NEXT_PUBLIC_STRAPI_URL}/communities?populate=*`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (res.ok) {
                const fetchedData: { data: CommunityData[] } = await res.json();

                // Update state with fetched data
                setData(fetchedData.data);
                setCookie('mapData', fetchedData.data);

                // Calculate country counts
                const counts: { [key: string]: number } = {};
                fetchedData.data.forEach((item) => {
                    const country = item.attributes.country.split('-')[0].toLowerCase(); // Extracting country code
                    counts[country] = (counts[country] || 0) + 1;
                });

                // Update state with country counts
                setCountryCounts(counts);

                // Transform counts to the desired array format
                const dataArray: [string, number][] = Object.entries(counts).map(([country, count]) => [country, count]);
                setMapOption(dataArray);
            }
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        getData();
    }, []);

    return (
        <div className="p-4 w-full h-screen">
            <HighchartsReact
                highcharts={Highcharts}
                constructorType={'mapChart'}
                options={mapOptions}
                ref={chartComponentRef}
            />
            <Dialog open={isOpen} onOpenChange={() => {
                setIsOpen(!isOpen);
            }}>
                <DialogContent
                    className="max-w-4xl"
                    onInteractOutside={(e) => {
                        setIsOpen(false);
                    }}
                >
                    <CountryMap country={currentCountry} objects={currentCountryData} />
                </DialogContent>
            </Dialog>
        </div>
    )
}

export { Map }