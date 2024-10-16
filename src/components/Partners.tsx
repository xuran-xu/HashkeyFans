import { useTranslation } from "react-i18next";
import Image from 'next/image';
import Link from 'next/link';

interface Partner {
  name: string;
  image: string;
  link: string;
  width: number;
  height: number;
}

const partners: Partner[] = [
  {
    name: "Antaplha Lab",
    image: "/img/antalphalab.png",
    link: "https://partner1.com",
    width: 80,
    height: 80
  },
  {
    name: "Rebase",
    image: "/img/rebase.png",
    link: "https://partner3.com",
    width: 180,
    height: 80
  },
  {
    name: "BuidlerDAO",
    image: "/img/buidlerdao.jpg",
    link: "https://partner2.com",
    width: 80,
    height: 80
  },
  {
    name: "Deng Lian",
    image: "/img/denglian.webp",
    link: "https://partner2.com",
    width: 80,
    height: 80
  }
];

export default function Partners() {
  const { t } = useTranslation();

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl text-center font-bold mb-12 font-mono text-white drop-shadow-[0_5px_5px_rgba(0,0,0,0.7)] tracking-wide">{t("Our Partners")}</h2>
        <div className="flex flex-wrap justify-center items-center gap-8">
          {partners.map((partner, index) => (
            <Link key={index} href={partner.link} target="_blank" rel="noopener noreferrer"
                  className="bg-white p-4 rounded shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center justify-center">
              <Image 
                src={partner.image} 
                alt={partner.name} 
                width={partner.width} 
                height={partner.height}
                className="object-contain"
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
