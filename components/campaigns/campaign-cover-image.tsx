import Image from 'next/image';
import { cn } from '@/lib/utils';

type CampaignCoverImageProps = {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  sizes?: string;
};

export function CampaignCoverImage({
  src,
  alt,
  priority = false,
  className,
  sizes = '160px',
}: CampaignCoverImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={640}
      height={320}
      sizes={sizes}
      priority={priority}
      className={cn('bg-muted object-cover', className)}
    />
  );
}
