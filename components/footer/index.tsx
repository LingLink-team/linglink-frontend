import Image from "next/image";
import Link from "next/link";
import logo from "@/app/assets/images/linglink.png";
import facebook from "@/app/assets/images/icons/facebook.png";
import zalo from "@/app/assets/images/icons/zalo.webp";

export default function Footer() {
  return (
    <div className="w-full bg-white h-full mt-8 py-4">
      <div className="container">
        <div className="flex flex-row gap-2 mb-8 justify-between">
          <div className="flex gap-2 items-center">
            <div>
              <Link href="/">
                <Image className="h-[50px] w-[50px]" src={logo} alt="logo" />
              </Link>
            </div>
            <div className="text-3xl font-semibold text-primary">
              <Link href="/">Ling Link</Link>
            </div>
          </div>
          <div className="ml-8 flex gap-6">
            <div className="space-y-2">
              <div className="font-semibold mb-4">Thông tin liên hệ</div>
              <div className="">Hotline: 123-456-7890</div>
              <div className="">
                Địa chỉ: Quận 10, Ho Chi Minh city, Vietnam
              </div>
            </div>
            <div className="space-y-2">
              <div className="font-semibold mb-4">Mạng xã hội</div>
              <div className="flex gap-4 items-center">
                <Link href="/">
                  <Image
                    className="w-8 h-8 object-contain"
                    height={0}
                    width={0}
                    src={facebook}
                    alt="Facebook"
                  />
                </Link>
                <Link href="/">
                  <Image
                    className="w-8 h-8 object-contain"
                    height={0}
                    width={0}
                    src={zalo}
                    alt="Zalo"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full text-slate-500 items-center text-center text-sm">
          © 2024 LingLink | All Rights Reserved
        </div>
      </div>
    </div>
  );
}
