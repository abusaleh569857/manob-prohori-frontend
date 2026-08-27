import Image from "next/image";

export function SigninHero() {
  return (
    <div className="relative hidden min-h-[700px] overflow-hidden lg:block">
      <Image
        src="/images/signup-bg-image.png"
        alt="Manob Prohori Rescue Team"
        fill
        priority
        className="pointer-events-none object-cover object-center"
      />
    </div>
  );
}
