import React from "react";
interface AnnoceTitleProps {
  title: string;
}

function AnnoceTitle({ title }: AnnoceTitleProps) {
  //const t = useI18n();  {t("nav.Annoce")}
  return (
    <div>
      <p className="font-extrabold mr-10 text-xl  text-blue-600 sm:text-xl mb-2 sm:mb-0">
        {title}
      </p>
    </div>
  );
}

export default AnnoceTitle;
