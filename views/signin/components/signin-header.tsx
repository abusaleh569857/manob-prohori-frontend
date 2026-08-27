import Image from "next/image";
import Link from "next/link";

export function SigninHeader() {
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
          className="h-auto w-[185px] sm:w-[210px] object-contain"
        />
      </Link>

      {/* Heading & Subtitle */}
      <div className="mt-8">
        <h1 className="text-3xl font-black tracking-tight text-[#10233f] sm:text-[34px]">
          Welcome <span className="text-red-600">Back</span>
        </h1>
        <p className="mt-1.5 text-sm font-medium text-slate-500">
          Sign in to continue to your account
        </p>
      </div>
    </div>
  );
}
