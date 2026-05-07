import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/top-bar";
import { ReminderPoller } from "@/components/notifications/reminder-poller";
import { requireAuth } from "@/lib/permissions";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessionUser = await requireAuth();

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar role={sessionUser.role} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar
          userId={sessionUser.id}
          userName={sessionUser.name}
          role={sessionUser.role}
        />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
      <ReminderPoller />
    </div>
  );
}
