import {TagMessage} from "@/components/tags/tag-message";
import {TagMessageTable} from "@/components/tags/tag-message-table";
import {TagTone} from "@/components/tags/tag-tone";
import {TagDynamic} from "@/components/tags/tag-dynamic";
import {TagTable} from "@/components/tags/tag-table";

const Tags = () => {
  return (
    <div className="flex flex-col gap-8 mb-20 w-full">
      <div className="flex items-stretch w-full gap-4">
        <div className="w-1/2">
          <TagMessage />
        </div>
        <div className="w-1/2">
          <TagMessageTable />
        </div>
      </div>
      <div className="flex items-stretch w-full gap-4">
        <div className="w-1/2">
          <TagTone />
        </div>
        <div className="w-1/2">
          <TagDynamic />
        </div>
      </div>
      <div className="w-full">
        <TagTable />
      </div>
    </div>
  )
}

export {Tags}
