"use client";

import { useEffect } from "react";

const POLL_INTERVAL_MS = 5 * 60 * 1_000;
const LEADER_KEY = "reminder-poller-leader";
const LEADER_HEARTBEAT_MS = 10_000;

/**
 * ReminderPoller — mounts in the app layout and triggers server-side
 * due-date reminder checks at a regular interval.
 *
 * Uses BroadcastChannel leader election so only ONE tab per browser
 * acts as the poller, preventing N×tabs duplicate requests.
 */
export function ReminderPoller() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const channel = new BroadcastChannel("reminder-poller");
    let isLeader = false;
    let pollInterval: ReturnType<typeof setInterval> | null = null;
    let heartbeatInterval: ReturnType<typeof setInterval> | null = null;

    function becomeLeader() {
      if (isLeader) return;
      isLeader = true;
      localStorage.setItem(LEADER_KEY, Date.now().toString());

      heartbeatInterval = setInterval(() => {
        localStorage.setItem(LEADER_KEY, Date.now().toString());
      }, LEADER_HEARTBEAT_MS);

      run();
      pollInterval = setInterval(run, POLL_INTERVAL_MS);
    }

    function resignLeader() {
      isLeader = false;
      if (heartbeatInterval) clearInterval(heartbeatInterval);
      if (pollInterval) clearInterval(pollInterval);
      localStorage.removeItem(LEADER_KEY);
    }

    async function run() {
      if (!isLeader) return;
      try {
        await fetch("/api/reminders");
      } catch {
        // Network errors are non-fatal
      }
    }

    function tryElect() {
      const last = localStorage.getItem(LEADER_KEY);
      const age = last ? Date.now() - Number(last) : Infinity;
      if (age > LEADER_HEARTBEAT_MS * 3) {
        becomeLeader();
        channel.postMessage("elected");
      }
    }

    const electionTimer = setTimeout(tryElect, 500 + Math.random() * 500);

    channel.addEventListener("message", () => {
      // Another tab may have become leader
    });

    function handleVisibility() {
      if (document.visibilityState === "hidden" && isLeader) {
        resignLeader();
        setTimeout(tryElect, 1_500 + Math.random() * 500);
      } else if (document.visibilityState === "visible" && !isLeader) {
        tryElect();
      }
    }

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearTimeout(electionTimer);
      resignLeader();
      channel.close();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return null;
}
