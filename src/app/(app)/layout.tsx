import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/top-bar";
import { ReminderPoller } from "@/components/notifications/reminder-poller";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { id: userId, name, role } = session.user as {
    id: string;
    name?: string | null;
    role: string;
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar role={role} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar userId={userId} name={name ?? ""} role={role} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
      <ReminderPoller />
    </div>
  );
}
