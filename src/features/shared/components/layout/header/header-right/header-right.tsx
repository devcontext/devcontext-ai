import { FeedbackButton } from "./feedback-button";
import { NotificationsMenu } from "./notifications-menu";
import { UserMenu } from "./user-menu";

export function HeaderRight() {
  return (
    <div className="flex items-center gap-1 md:gap-2">
      <div className="hidden sm:flex items-center gap-1 md:gap-2">
        <FeedbackButton />
        <NotificationsMenu />
      </div>
      <UserMenu />
    </div>
  );
}
