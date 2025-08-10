import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Image from "next/image";
import { Annonce } from "../../../../../../packages/mytypes/types";
//"@repo/mytypes/types";
const fallbackImageUrl = "/noimage.jpg";

export default function AnnonceDetailUI({
  annonceId,
  annonce,
}: {
  annonceId: number;
  annonce: Annonce;
}) {
  const hostServerForImages = "https://picsum.photos";
  const getImageUrl = (imagePath: string) =>
    `${hostServerForImages}/${imagePath}`;

  const getImage = (imagePath: string, imageDescription: string = "") => {
    const imgUrl = getImageUrl(imagePath);
    return (
      <div className="relative h-40 sm:h-60 w-full">
        <Image
          src={imgUrl}
          alt={imageDescription}
          fill
          unoptimized
          style={{ objectFit: "cover" }}
          className="rounded-lg"
        />
      </div>
    );
  };

  const NoImage = () => (
    <div className="relative h-40 sm:h-60 w-full">
      <Image
        src={fallbackImageUrl}
        alt="no image uploaded by user"
        fill
        unoptimized
        style={{ objectFit: "cover" }}
        className="rounded-lg"
      />
    </div>
  );

  const createdAt = new Date(annonce.createdAt);
  const formattedDate = `${createdAt.getDate()}-${createdAt.getMonth() + 1}-${createdAt.getFullYear()}`;
  const formattedTime = `${createdAt.getHours()}h : ${createdAt.getMinutes()} min`;

  return (
    <article className="flex flex-col gap-4 bg-white shadow-lg  rounded-xl p-4 max-w-lg mx-auto my-6 sm:max-w-2xl sm:p-6 md:my-8">
      <h2 className="text-2xl font-bold mb-4 text-blue-600 text-center">
        Details de l`annoce
      </h2>
      <div className="space-y-2 h-40 sm:h-60 w-full">
        {annonce.haveImage ? (
          <Carousel
            className="rounded-xl"
            infiniteLoop
            autoPlay
            showThumbs={false}
          >
            {annonce?.images?.map((item, index) => (
              <div className="h-40 sm:h-60" key={index}>
                {getImage(item.imagePath)}
              </div>
            ))}
          </Carousel>
        ) : (
          <NoImage />
        )}
      </div>

      <div className="p-2">
        <span className="inline-block bg-green-800 rounded-md px-2 py-1 text-xs sm:text-sm font-semibold text-white">
          {annonce.typeAnnonceNameAr} / {annonce.categorieNameAr}
        </span>

        <h1 className="text-xl sm:text-2xl font-bold my-2">{annonce.title}</h1>

        <p className="text-gray-600 text-sm sm:text-base mb-4">
          {annonce.description}
        </p>

        <div className="hover:bg-gray-100 rounded-md p-0">
          <div className="border-t border-green-800 my-2"></div>
          <div className="flex justify-between items-center">
            <span className="text-sm sm:text-base font-bold">PRIX</span>
            <p className="text-base sm:text-lg text-green-800 font-bold">
              {annonce.price} UMR / jour
            </p>
          </div>
          <div className="border-t border-green-800 my-2"></div>
        </div>

        <div className="hover:bg-gray-100 rounded-md p-0 mt-2">
          <div className="border-t border-green-800 my-2"></div>
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800 mb-1">Contact</h2>
            <p className="text-md font-semibold text-blue-600">22 33 44 55</p>
          </div>
          <div className="border-t border-green-800 my-2"></div>
        </div>

        <div className="mt-4">
          <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-xs font-semibold text-gray-700">
            {formattedDate} | {formattedTime}
          </span>
        </div>

        <div className="mt-6 p-4 font-bold bg-gray-100 rounded-lg">
          <p className="text-xs sm:text-xl text-gray-600">
            Notre plateforme n'est pas responsable de ce produit ou service.
            Toutes les informations sont fournies par l'annonceur, et nous ne
            garantissons pas leur exactitude ou leur qualité. Veuillez effectuer
            vos propres vérifications avant de procéder à tout achat ou
            réservation.
          </p>
        </div>
      </div>
    </article>
  );
}
