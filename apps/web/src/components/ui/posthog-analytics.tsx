import { usePostHog } from "posthog-js/react";
import * as React from "react";

type AnalyticsEventSuffix = "-click" | "-action" | "-submit" | "-download" | "-toggle" | "-select" | "-open" | "-close";

type Analytics = {
  name: `${string}${AnalyticsEventSuffix}`;
  group?: string;
};

interface PostHogAnalyticsProps extends React.HTMLAttributes<HTMLDivElement> {
  analytics?: Analytics;
  as?: React.ElementType;
}

function PostHogAnalytics({ className, analytics, onClick, as: Component = "div", ...props }: PostHogAnalyticsProps) {
  const posthog = usePostHog();

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      // Track analytics event if analytics name is provided
      if (analytics?.name && posthog) {
        posthog.capture(analytics.name, {
          elementGroup: analytics.group,
        });
      }

      // Call the original onClick handler if provided
      onClick?.(event);
    },
    [analytics, onClick, posthog],
  );

  return <Component className={className} onClick={handleClick} {...props} />;
}

export { PostHogAnalytics };
