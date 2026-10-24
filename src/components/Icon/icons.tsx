import { forwardRef, type ReactNode } from 'react';
import { Icon, type IconProps } from './Icon';

function createIcon(displayName: string, shapes: ReactNode) {
  const Component = forwardRef<SVGSVGElement, IconProps>(function BuiltInIcon(props, ref) {
    return (
      <Icon ref={ref} {...props}>
        {shapes}
      </Icon>
    );
  });
  Component.displayName = displayName;
  return Component;
}

export const CheckIcon = createIcon('CheckIcon', <path d="M20 6 9 17l-5-5" />);
export const MinusIcon = createIcon('MinusIcon', <path d="M5 12h14" />);
export const CloseIcon = createIcon('CloseIcon', <path d="M18 6 6 18M6 6l12 12" />);
export const ChevronDownIcon = createIcon('ChevronDownIcon', <path d="m6 9 6 6 6-6" />);
export const ChevronUpIcon = createIcon('ChevronUpIcon', <path d="m18 15-6-6-6 6" />);
export const ChevronLeftIcon = createIcon('ChevronLeftIcon', <path d="m15 18-6-6 6-6" />);
export const ChevronRightIcon = createIcon('ChevronRightIcon', <path d="m9 18 6-6-6-6" />);
export const ArrowUpIcon = createIcon('ArrowUpIcon', <path d="M12 19V5M5 12l7-7 7 7" />);
export const ArrowDownIcon = createIcon('ArrowDownIcon', <path d="M12 5v14M19 12l-7 7-7-7" />);
export const ArrowUpDownIcon = createIcon(
  'ArrowUpDownIcon',
  <path d="m21 16-4 4-4-4M17 20V4M3 8l4-4 4 4M7 4v16" />,
);
export const ExternalLinkIcon = createIcon(
  'ExternalLinkIcon',
  <path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />,
);
export const MoreHorizontalIcon = createIcon(
  'MoreHorizontalIcon',
  <>
    <circle cx="5" cy="12" r="1" />
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
  </>,
);
export const InfoIcon = createIcon(
  'InfoIcon',
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4M12 8h.01" />
  </>,
);
export const SuccessIcon = createIcon(
  'SuccessIcon',
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" />
  </>,
);
export const WarningIcon = createIcon(
  'WarningIcon',
  <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" />,
);
export const ErrorIcon = createIcon(
  'ErrorIcon',
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v4M12 16h.01" />
  </>,
);
