import Image from 'next/image';
import { cn } from '@/lib/utils';

type AdobeLogoProps = {
  className?: string;
  /** Show the Adobe wordmark beside the icon mark. */
  showWordmark?: boolean;
  /** Icon size in pixels (square). Defaults to 20. */
  iconSize?: number;
};

export function AdobeLogo({ className, showWordmark = true, iconSize = 20 }: AdobeLogoProps) {
  return (
    <span
      className={cn('inline-flex items-center gap-2', className)}
      aria-label="Adobe"
      role="img"
    >
      <Image
        src="/adobe/adobe-icon-red.png"
        alt=""
        width={iconSize}
        height={iconSize}
        className="size-5 shrink-0"
        unoptimized
      />
      {showWordmark ? (
        <>
          <Image
            src="/adobe/adobe-wordmark-red.png"
            alt=""
            width={86}
            height={18}
            className="h-5 w-auto shrink-0 dark:hidden"
            unoptimized
          />
          <Image
            src="/adobe/adobe-wordmark-white.png"
            alt=""
            width={86}
            height={18}
            className="hidden h-5 w-auto shrink-0 mix-blend-lighten dark:block"
            unoptimized
          />
        </>
      ) : null}
    </span>
  );
}
