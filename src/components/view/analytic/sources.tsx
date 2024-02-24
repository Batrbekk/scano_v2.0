import {MessageSource} from "@/components/sources/message-source";
import {DynamicSource} from "@/components/sources/dynamic-source";
import {ToneSource} from "@/components/sources/tone-source";
import {TypeSource} from "@/components/sources/type-source";
import {SourceTable} from "@/components/sources/source-table";

const Sources = () => {
  return (
    <div className="flex flex-col gap-8 mb-20">
      <div className="flex items-stretch w-full gap-4">
        <div className="w-1/2">
          <MessageSource/>
        </div>
        <div className="w-1/2">
          <DynamicSource/>
        </div>
      </div>
      <div className="flex items-stretch w-full gap-4">
        <div className="w-1/2">
          <TypeSource />
        </div>
        <div className="w-1/2">
          <ToneSource />
        </div>
      </div>
      <SourceTable />
    </div>
  )
}

export {Sources}
