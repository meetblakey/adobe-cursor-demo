import { pageGutterClassName, pageShellClassName, pageTopClassName } from '@/lib/page-layout';
import { cn } from '@/lib/utils';

export function PageContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        pageShellClassName,
        pageGutterClassName,
        pageTopClassName,
        'pb-[max(1rem,env(safe-area-inset-bottom))] sm:pb-8',
        className,
      )}
    >
      {children}
    </div>
  );
}
