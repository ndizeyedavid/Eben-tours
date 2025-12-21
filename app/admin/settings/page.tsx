"use client";

import { useCallback, useState } from "react";

export default function AdminSettingsPage() {
  const [toast, setToast] = useState<null | string>(null);

  const [name, setName] = useState("Fab");
  const [role, setRole] = useState("Manager");
  const [email, setEmail] = useState("admin@ebentours.com");
  const [orgName, setOrgName] = useState("Eben Tours");
  const [orgPhone, setOrgPhone] = useState("+250 788 000 000");

  const [notifyBookings, setNotifyBookings] = useState(true);
  const [notifyMessages, setNotifyMessages] = useState(true);
  const [notifyMarketing, setNotifyMarketing] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const save = useCallback(() => {
    setToast("Settings saved (mock)");
    window.setTimeout(() => setToast(null), 1800);
  }, []);

  const changePassword = useCallback(() => {
    if (!currentPassword || !newPassword || !confirmPassword) return;
    if (newPassword !== confirmPassword) return;
    setToast("Password updated (mock)");
    window.setTimeout(() => setToast(null), 1800);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }, [confirmPassword, currentPassword, newPassword]);

  const passwordMismatch =
    newPassword && confirmPassword && newPassword !== confirmPassword;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--color-secondary)]">
            Settings
          </h1>
          <p className="mt-1 text-sm font-semibold text-[var(--muted)]">
            Manage profile, company info, notifications, and security.
          </p>
        </div>

        <button
          type="button"
          onClick={save}
          className="rounded-xl bg-[var(--color-secondary)] px-4 py-2 text-xs font-extrabold text-white hover:opacity-90"
        >
          Save changes
        </button>
      </div>

      <div className="grid gap-3 lg:grid-cols-2!">
        <div className="space-y-3">
          <div className="rounded-2xl border border-emerald-900/10 bg-white p-4 shadow-sm">
            <div className="text-sm font-extrabold text-[var(--color-secondary)]">
              Profile
            </div>
            <div className="mt-1 text-sm font-semibold text-[var(--muted)]">
              How you appear in the admin dashboard.
            </div>

            <div className="mt-4 grid grid-cols-1! gap-3!">
              <label className="grid grid-cols-1! gap-3!">
                <span className="text-xs font-extrabold text-[var(--muted)]">
                  Name
                </span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-emerald-900/10 bg-white px-3 py-2 text-sm font-semibold text-[var(--color-secondary)]"
                />
              </label>
              <label className="grid grid-cols-1! gap-3!">
                <span className="text-xs font-extrabold text-[var(--muted)]">
                  Role
                </span>
                <input
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-xl border border-emerald-900/10 bg-white px-3 py-2 text-sm font-semibold text-[var(--color-secondary)]"
                />
              </label>
              <label className="grid grid-cols-1! gap-3!">
                <span className="text-xs font-extrabold text-[var(--muted)]">
                  Email
                </span>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-emerald-900/10 bg-white px-3 py-2 text-sm font-semibold text-[var(--color-secondary)]"
                />
              </label>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-900/10 bg-white p-4 shadow-sm">
            <div className="text-sm font-extrabold text-[var(--color-secondary)]">
              Company
            </div>
            <div className="mt-1 text-sm font-semibold text-[var(--muted)]">
              Used for invoices, contact, and site content.
            </div>

            <div className="mt-4 grid grid-cols-2! gap-3!">
              <label className="grid grid-cols-1! gap-3!">
                <span className="text-xs font-extrabold text-[var(--muted)]">
                  Company name
                </span>
                <input
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full rounded-xl border border-emerald-900/10 bg-white px-3 py-2 text-sm font-semibold text-[var(--color-secondary)]"
                />
              </label>
              <label className="grid grid-cols-1! gap-3!">
                <span className="text-xs font-extrabold text-[var(--muted)]">
                  Support phone
                </span>
                <input
                  value={orgPhone}
                  onChange={(e) => setOrgPhone(e.target.value)}
                  className="w-full rounded-xl border border-emerald-900/10 bg-white px-3 py-2 text-sm font-semibold text-[var(--color-secondary)]"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-2xl border border-emerald-900/10 bg-white p-4 shadow-sm">
            <div className="text-sm font-extrabold text-[var(--color-secondary)]">
              Notifications
            </div>
            <div className="mt-1 text-sm font-semibold text-[var(--muted)]">
              Choose which alerts you receive.
            </div>

            <div className="mt-4 grid gap-2">
              {[
                {
                  label: "New booking requests",
                  value: notifyBookings,
                  setValue: setNotifyBookings,
                },
                {
                  label: "New messages",
                  value: notifyMessages,
                  setValue: setNotifyMessages,
                },
                {
                  label: "Marketing updates",
                  value: notifyMarketing,
                  setValue: setNotifyMarketing,
                },
              ].map((item) => (
                <label
                  key={item.label}
                  className="flex items-center justify-between gap-3 rounded-xl border border-emerald-900/10 bg-[#f6f8f7] px-3 py-2"
                >
                  <span className="text-sm font-extrabold text-[var(--color-secondary)]">
                    {item.label}
                  </span>
                  <input
                    type="checkbox"
                    checked={item.value}
                    onChange={(e) => item.setValue(e.target.checked)}
                    className="h-4 w-4"
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-900/10 bg-white p-4 shadow-sm">
            <div className="text-sm font-extrabold text-[var(--color-secondary)]">
              Security
            </div>
            <div className="mt-1 text-sm font-semibold text-[var(--muted)]">
              Update your password.
            </div>

            <div className="mt-4 grid grid-cols-1! gap-3!">
              <label className="grid grid-cols-1! gap-3!">
                <span className="text-xs font-extrabold text-[var(--muted)]">
                  Current password
                </span>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full rounded-xl border border-emerald-900/10 bg-white px-3 py-2 text-sm font-semibold text-[var(--color-secondary)]"
                />
              </label>
              <label className="grid grid-cols-1! gap-3!">
                <span className="text-xs font-extrabold text-[var(--muted)]">
                  New password
                </span>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-xl border border-emerald-900/10 bg-white px-3 py-2 text-sm font-semibold text-[var(--color-secondary)]"
                />
              </label>
              <label className="grid grid-cols-1! gap-3!">
                <span className="text-xs font-extrabold text-[var(--muted)]">
                  Confirm new password
                </span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-emerald-900/10 bg-white px-3 py-2 text-sm font-semibold text-[var(--color-secondary)]"
                />
              </label>

              {passwordMismatch ? (
                <div className="rounded-2xl border border-red-900/10 bg-red-50 p-3 text-xs font-extrabold text-red-700">
                  Passwords do not match.
                </div>
              ) : null}

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={changePassword}
                  className="rounded-xl bg-emerald-700 px-4 py-2 text-xs font-extrabold text-white hover:bg-emerald-800"
                >
                  Change password
                </button>
              </div>

              <div className="text-xs font-semibold text-[var(--muted)]">
                Mock only. Next step: connect to authentication provider.
              </div>
            </div>
          </div>
        </div>
      </div>

      {toast ? (
        <div className="rounded-2xl border border-emerald-900/10 bg-emerald-50 p-3 text-sm font-extrabold text-emerald-700">
          {toast}
        </div>
      ) : null}
    </div>
  );
}
