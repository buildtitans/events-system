import { renderToStaticMarkup } from "react-dom/server";
import RenderNotificationListItem from "./renderNotificationListItem";
import NotificationListItem from "./notificationListItem";
import { makeNewNotification, makeSeenNotification } from "@/src/test/fixtures/notifications";

 describe("notification rendering", () => {
  it.each([
    [makeNewNotification(), "New notification", "NotificationsActiveIcon"],
    [makeSeenNotification(), "Seen notification", "NotificationsNoneIcon"],
  ])("renders the %s branch with group context", (notification, label, icon) => {
    const html = renderToStaticMarkup(
      <RenderNotificationListItem notification={notification} handleClick={jest.fn()} />,
    );
    expect(html).toContain(label);
    expect(html).toContain(icon);
    expect(html).toContain(notification.meta.group_name);
    expect(html).toContain(notification.data.subject);
    expect(html).toContain(notification.data.message);
  });

  it("navigates using the supplied group slug without a loaded group lookup", () => {
    const handleClick = jest.fn();
    const notification = makeNewNotification();
    const item = NotificationListItem({ notification, handleClick, icon: null });
    const props = item.props as { onClick: () => void };
    props.onClick();
    expect(handleClick).toHaveBeenCalledWith(notification.meta.group_slug);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
