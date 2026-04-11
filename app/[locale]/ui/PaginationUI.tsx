"use client";

import { useRouter } from "next/navigation";
import { useI18n } from "../../../locales/client";

export default function PaginationUI(props: {
  totalPages: number;
  currentPage: number;
}) {
  const router = useRouter();
  const t = useI18n();

  const handleClickToNextPage = () => {
    const nextPage = props.currentPage + 1;
    router.push(`?page=${nextPage}`);
  };

  const handleClickPrevPage = () => {
    const nextPage = props.currentPage - 1;
    router.push(`?page=${nextPage}`);
  };

  return (
    <div className="mt-8 flex flex-wrap gap-2 justify-center">
      <button
        onClick={handleClickPrevPage}
        disabled={props.currentPage === 1}
        className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded disabled:opacity-50"
      >
        {t("pagination.prev")}
      </button>
      <button
        onClick={handleClickToNextPage}
        disabled={props.currentPage === props.totalPages}
        className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded disabled:opacity-50"
      >
        {t("pagination.next")}
      </button>
      <div className="flex items-center bg-gray-100 ml-3 p-2 rounded-lg shadow-md">
        <span className="text-gray-700 font-semibold">
          {t("pagination.currentPage")}{" "}
          <span className="font-bold text-blue-600">{props.currentPage}</span>{" "}
          {t("pagination.of")}{" "}
          <span className="font-bold text-blue-600">{props.totalPages}</span>
        </span>
      </div>
    </div>
  );
}
