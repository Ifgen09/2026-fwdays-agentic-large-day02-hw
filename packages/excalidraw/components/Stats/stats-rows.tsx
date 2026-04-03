import clsx from "clsx";
import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

type StatsRowProps = {
  children: ReactNode;
  columns?: number;
  heading?: boolean;
  style?: CSSProperties;
} & HTMLAttributes<HTMLDivElement>;

export const StatsRow = ({
  children,
  columns = 1,
  heading,
  style,
  ...rest
}: StatsRowProps) => (
  <div
    className={clsx("exc-stats__row", { "exc-stats__row--heading": heading })}
    style={{
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      ...style,
    }}
    {...rest}
  >
    {children}
  </div>
);
StatsRow.displayName = "StatsRow";

type StatsRowsProps = {
  children: ReactNode;
  order?: number;
  style?: CSSProperties;
} & HTMLAttributes<HTMLDivElement>;

export const StatsRows = ({
  children,
  order,
  style,
  ...rest
}: StatsRowsProps) => (
  <div className="exc-stats__rows" style={{ order, ...style }} {...rest}>
    {children}
  </div>
);
StatsRows.displayName = "StatsRows";
