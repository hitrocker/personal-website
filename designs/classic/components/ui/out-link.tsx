import { isHttpUrl } from "@/lib/site";
import type { ReactNode } from "react";

type OutLinkProps = {
  href?: string;
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
};

export function OutLink({ href, className, children, ariaLabel }: OutLinkProps) {
  if (!isHttpUrl(href)) {
    return (
      <span
        className={`${className ?? ""} btn-disabled`}
        aria-disabled="true"
        title="Add this URL in lib/content.ts - it was not on the CV"
      >
        {children}
        <span className="sr-only">Link not provided on the CV yet</span>
      </span>
    );
  }

  return (
    <a
      href={href}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
}
