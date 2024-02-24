import {GeoMap} from "@/components/geography/geo-map";
import {Countries} from "@/components/geography/countries";
import {CountryTable} from "@/components/geography/country-table";
import {Cities} from "@/components/geography/cities";
import {CitiesTable} from "@/components/geography/cities-table";

const Geography = () => {
  return (
    <div className="flex flex-col gap-8 mb-20">
      <GeoMap />
      <div className="flex items-stretch w-full gap-4">
        <div className="w-1/3">
          <Countries />
        </div>
        <div className="w-2/3">
          <CountryTable />
        </div>
      </div>
      <div className="flex items-stretch w-full gap-4">
        <div className="w-1/3">
          <Cities />
        </div>
        <div className="w-2/3">
          <CitiesTable />
        </div>
      </div>
    </div>
  )
}

export {Geography}
