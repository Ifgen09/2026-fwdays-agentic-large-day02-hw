import clsx from "clsx";
import React from "react";

export const StatsRow = ({
  children,
  columns = 1,
  heading,
  style,
  ...rest
}: {
  children: React.ReactNode;
  columns?: number;
  heading?: boolean;
  style?: React.CSSProperties;
} & React.HTMLAttributes<HTMLDivElement>) => (
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

export const StatsRows = ({
  children,
  order,
  style,
  ...rest
}: {
  children: React.ReactNode;
  order?: number;
  style?: React.CSSProperties;
} & React.HTMLAttributes<HTMLDivElement>) => (
  <div className="exc-stats__rows" style={{ order, ...style }} {...rest}>
    {children}
  </div>
);
StatsRows.displayName = "StatsRows";
