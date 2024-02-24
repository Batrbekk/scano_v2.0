import {ToneSource} from "@/components/sources/tone-source";
import {AuthorsTable} from "@/components/authors/authors-table";
import {AuthorType} from "@/components/authors/author-type";
import {AuthorDynamic} from "@/components/authors/author-dynamic";
import {AuthorGender} from "@/components/authors/author-gender";
import {AuthorAge} from "@/components/authors/author-age";

const Authors = () => {
  return (
    <div className="flex flex-col gap-8 mb-20">
      <div className="flex items-stretch w-full gap-4">
        <div className="w-1/2">
          <AuthorType />
        </div>
        <div className="w-1/2">
          <AuthorDynamic />
        </div>
      </div>
      <div className="flex items-stretch w-full gap-4">
        <div className="w-1/2">
          <AuthorGender />
        </div>
        <div className="w-1/2">
          <AuthorAge />
        </div>
      </div>
      <AuthorsTable />
    </div>
  )
}

export {Authors}
