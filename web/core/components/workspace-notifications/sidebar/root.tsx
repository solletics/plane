"use client";

import { FC } from "react";
import { observer } from "mobx-react";
import { useParams } from "next/navigation";
// components
import { CustomHeader, CustomRow, EHeaderVariant } from "@plane/ui";
import { CountChip } from "@/components/common";
import {
  NotificationsLoader,
  NotificationEmptyState,
  NotificationSidebarHeader,
  AppliedFilters,
  NotificationCardListRoot,
} from "@/components/workspace-notifications";
// constants
import { NOTIFICATION_TABS } from "@/constants/notification";
// helpers
import { cn } from "@/helpers/common.helper";
import { getNumberCount } from "@/helpers/string.helper";
// hooks
import { useWorkspace, useWorkspaceNotifications } from "@/hooks/store";

export const NotificationsSidebar: FC = observer(() => {
  const { workspaceSlug } = useParams();
  // hooks
  const { getWorkspaceBySlug } = useWorkspace();
  const {
    currentSelectedNotificationId,
    unreadNotificationsCount,
    loader,
    notificationIdsByWorkspaceId,
    currentNotificationTab,
    setCurrentNotificationTab,
  } = useWorkspaceNotifications();
  // derived values
  const workspace = workspaceSlug ? getWorkspaceBySlug(workspaceSlug.toString()) : undefined;
  const notificationIds = workspace ? notificationIdsByWorkspaceId(workspace.id) : undefined;

  if (!workspaceSlug || !workspace) return <></>;

  return (
    <div
      className={cn(
        "relative border-0 md:border-r border-custom-border-200 z-[10] flex-shrink-0 bg-custom-background-100 h-full transition-all overflow-hidden",
        currentSelectedNotificationId ? "w-0 md:w-2/6" : "w-full md:w-2/6"
      )}
    >
      <div className="relative w-full h-full overflow-hidden flex flex-col">
        <CustomRow className="h-[3.75rem] border-b border-custom-border-200 flex">
          <NotificationSidebarHeader workspaceSlug={workspaceSlug.toString()} />
        </CustomRow>

        <CustomHeader variant={EHeaderVariant.SECONDARY} className="flex">
          {NOTIFICATION_TABS.map((tab) => (
            <div
              key={tab.value}
              className="h-full px-3 relative cursor-pointer"
              onClick={() => currentNotificationTab != tab.value && setCurrentNotificationTab(tab.value)}
            >
              <div
                className={cn(
                  `relative h-full flex justify-center items-center gap-1 text-sm transition-all`,
                  currentNotificationTab === tab.value
                    ? "text-custom-primary-100"
                    : "text-custom-text-100 hover:text-custom-text-200"
                )}
              >
                <div className="font-medium">{tab.label}</div>
                {tab.count(unreadNotificationsCount) > 0 && (
                  <CountChip count={getNumberCount(tab.count(unreadNotificationsCount))} />
                )}
              </div>
              {currentNotificationTab === tab.value && (
                <div className="border absolute bottom-0 right-0 left-0 rounded-t-md border-custom-primary-100" />
              )}
            </div>
          ))}
        </CustomHeader>

        {/* applied filters */}
        <AppliedFilters workspaceSlug={workspaceSlug.toString()} />

        {/* rendering notifications */}
        {loader === "init-loader" ? (
          <div className="relative w-full h-full overflow-hidden">
            <NotificationsLoader />
          </div>
        ) : (
          <>
            {notificationIds && notificationIds.length > 0 ? (
              <div className="relative w-full h-full overflow-hidden overflow-y-auto">
                <NotificationCardListRoot workspaceSlug={workspaceSlug.toString()} workspaceId={workspace?.id} />
              </div>
            ) : (
              <div className="relative w-full h-full flex justify-center items-center">
                <NotificationEmptyState />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
});
