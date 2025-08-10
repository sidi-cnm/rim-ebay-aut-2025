import { FaUser, FaBullhorn, FaChartBar } from "react-icons/fa"; // Import icons from react-icons
import Link from "next/link";
import Image from "next/image";

export default function SideNavigation() {
  const headerLinks = [
    { link: "/admin/users", name: "User", icon: <FaUser /> },
    { link: "/admin/annonce", name: "Annonce", icon: <FaBullhorn /> },
    { link: "/admin/statistique", name: "Statistique", icon: <FaChartBar /> },
  ];

  return (
    <div className="hidden md:flex w-64 flex-col bg-gradient-to-b from-blue-800 to-purple-800 min-h-screen">
      <div className="flex flex-1 flex-col overflow-y-scroll py-5 navbar">
        <div className="relative z-0 px-2 flex md:px-4">
          <div className="flex-shrink-0 flex items-center justify-center">

            {/* @ts-ignore Headless UI types are not yet compatible with React 19 */}
            <Link href="/" className="cursor-pointer">

              {/* @ts-ignore Headless UI types are not yet compatible with React 19 */}
              <Image
                className="block h-auto w-auto" // Supprimer mt-5 pour aligner en haut
                src="/images/logo.png" // Remplacer par votre logo
                alt="Workflow"
                width={100} // Ajustez la largeur comme nécessaire
                height={100} // Ajustez la hauteur
                style={{
                  filter: "brightness(0) invert(1)", // Applique un effet blanc
                }}
              />
            </Link>
          </div>
        </div>
        <span className="uppercase ml-2 mt-1 mb-4 p-2 font-bold text-white font-display text-xl">
          RIM EBAY
        </span>
        <nav className="flex-1 px-2 space-y-1" aria-label="Sidebar">
          {headerLinks.map(({ link, name, icon }) => (
            <>

              {/* @ts-ignore Headless UI types are not yet compatible with React 19 */}
              <Link
                key={link}
                href={link}
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-emerald-100 hover:bg-white hover:text-black focus:text-black focus:bg-white"
              >
                <span className="mr-3 text-lg group-hover:text-black group-focus:text-black">
                  {icon} {/* Icon avant le texte du lien */}
                </span>
                <span className="group-hover:text-black group-focus:text-black">
                  {name} {/* Texte du lien */}
                </span>
              </Link>
            </>

          ))}
        </nav>
      </div>
    </div>
  );
}
