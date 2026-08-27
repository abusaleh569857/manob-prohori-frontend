import Image from "next/image";
import Link from "next/link";

export function SignupHeader() {
  return (
    <div>
      {/* Brand Logo */}
      <Link href="/" className="inline-block">
        <Image
          src="/images/manob-prohori-logo-v3.png"
          alt="Manob Prohori"
          width={220}
          height={75}
          priority
          className="h-auto w-[185px] sm:w-[205px] object-contain"
        />
      </Link>

      {/* Form Heading & Subtitle */}
      <div className="mt-6">
        <h1 className="text-3xl font-black tracking-tight text-[#10233f] sm:text-[32px]">
          Create your account
        </h1>
        <p className="mt-1.5 text-sm font-medium text-slate-500">
          Join Manob Prohori and be a part of a safer community.
        </p>
      </div>
    </div>
  );
}
