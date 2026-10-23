import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '../../lib/api';
import { adminApi } from '../api/adminClient';
import { ROLE_LABELS, type StaffMember, type StaffRole } from '../api/types';
import { useAdminSession } from '../auth/AdminSession';
import Avatar, { timeAgo } from '../components/Avatar';
import { Icon } from '../components/icons';
import Sheet from '../components/Sheet';
import { Notice } from '../components/ui';

type Draft = { name: string; email: string; role: StaffRole };
/** What the sheet shows: a new account, one person's settings, or a temporary password to pass on */
type Open = { kind: 'add' } | { kind: 'member'; member: StaffMember } | { kind: 'password'; member: { name: string; email: string }; password: string };

/** The state of an account, in a word */
function stateOf(member: StaffMember): { label: string; style: string } {
  if (!member.active) return { label: 'Switched off', style: 'bg-[#13261A]/8 text-[#1E3A29]/55' };
  if (member.mustChangePassword) return { label: 'Not signed in yet', style: 'bg-[#E8B23A]/20 text-[#7A5A10]' };
  return { label: 'Active', style: 'bg-[#3F7D20]/12 text-[#346A1A]' };
}

/** Owners: everyone who can sign in to the staff area, and adding or changing accounts. */
export default function StaffView() {
  const { token, user } = useAdminSession();
  const [members, setMembers] = useState<StaffMember[] | null>(null);
  const [error, setError] = useState('');
  const [open, setOpen] = useState<Open | null>(null);
  const [busy, setBusy] = useState(false);
  const [sheetError, setSheetError] = useState('');
  const [draft, setDraft] = useState<Draft>({ name: '', email: '', role: 'staff' });

  const load = useCallback(async () => {
    try {
      setMembers((await adminApi.staff(token)).items);
      setError('');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not load the staff accounts');
    }
  }, [token]);
  useEffect(() => void load(), [load]);

  const close = () => {
    setOpen(null);
    setSheetError('');
  };

  /** Runs one change from the sheet, showing what went wrong inside it */
  const run = async (work: () => Promise<void>) => {
    setBusy(true);
    setSheetError('');
    try {
      await work();
      await load();
    } catch (err) {
      setSheetError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    void run(async () => {
      const result = await adminApi.addStaff(token, draft);
      setOpen({ kind: 'password', member: result.member, password: result.temporaryPassword });
      setDraft({ name: '', email: '', role: 'staff' });
    });
  };

  const owners = members?.filter((m) => m.role === 'owner' && m.active).length ?? 0;

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="admin-card flex flex-col sm:flex-row sm:items-center gap-4">
        <span className="grid place-items-center w-12 h-12 rounded-2xl bg-[#3F7D20]/10 text-[#3F7D20] flex-shrink-0">
          <Icon name="team" />
        </span>
        <p className="flex-1 text-sm text-[#1E3A29]/70 leading-relaxed">
          Each person signs in with their own email and password. <strong className="text-[#1E3A29]">Owners</strong> can also add and change accounts here; <strong className="text-[#1E3A29]">staff</strong> can do everything else.
        </p>
        <button type="button" onClick={() => setOpen({ kind: 'add' })} className="admin-btn inline-flex items-center justify-center gap-2 flex-shrink-0">
          <Icon name="plus" className="w-4 h-4" />
          Add staff
        </button>
      </div>

      {error && <Notice kind="error">{error}</Notice>}
      {!members && !error && <Notice>Loading the staff accounts…</Notice>}

      {members && (
        <ul className="admin-card !p-0 divide-y divide-[#1E3A29]/8 overflow-hidden">
          {members.map((member) => {
            const state = stateOf(member);
            const me = member.id === user?.id;
            return (
              <li key={member.id}>
                <button
                  type="button"
                  onClick={() => (me ? undefined : setOpen({ kind: 'member', member }))}
                  disabled={me}
                  className="w-full flex items-center gap-3.5 px-4 sm:px-5 py-4 text-left transition-colors enabled:hover:bg-[#F4EFE4]/70 enabled:active:bg-[#F4EFE4]"
                >
                  <span className={member.active ? '' : 'opacity-45'}>
                    <Avatar name={member.name} email={member.email} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-[#1E3A29] truncate">{member.name || member.email.split('@')[0]}</span>
                      {me && <span className="text-[11px] font-bold text-[#1E3A29]/45">(you)</span>}
                      {member.role === 'owner' && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#1E3A29] text-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
                          <Icon name="shield" className="w-3 h-3" />
                          Owner
                        </span>
                      )}
                    </span>
                    <span className="block text-[13px] text-[#1E3A29]/55 truncate">{member.email}</span>
                    <span className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${state.style}`}>{state.label}</span>
                      <span className="text-[11px] text-[#1E3A29]/45">Last signed in {timeAgo(member.lastLoginAt)}</span>
                    </span>
                  </span>
                  {!me && <Icon name="chevronRight" className="w-5 h-5 text-[#1E3A29]/30 flex-shrink-0" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
      <p className="text-[12px] text-[#1E3A29]/50 px-1">To change your own name or password, open My account.</p>

      {/* a new account */}
      <Sheet open={open?.kind === 'add'} onClose={close} title="Add a member of staff">
        <form onSubmit={add} className="space-y-4 pb-2">
          <label className="block">
            <span className="block text-[#1E3A29]/60 text-[12px] font-bold mb-1.5">Name</span>
            <input required maxLength={80} value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="e.g. Almaz Tesfaye" className="admin-field" />
          </label>
          <label className="block">
            <span className="block text-[#1E3A29]/60 text-[12px] font-bold mb-1.5">Email (they sign in with it)</span>
            <input required type="email" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} placeholder="name@example.com" className="admin-field" />
          </label>
          <RolePicker value={draft.role} onChange={(role) => setDraft({ ...draft, role })} />
          {sheetError && <Notice kind="error">{sheetError}</Notice>}
          <button type="submit" disabled={busy} className="admin-btn w-full">
            {busy ? 'Adding…' : 'Add and make a temporary password'}
          </button>
        </form>
      </Sheet>

      {/* one person */}
      {open?.kind === 'member' && (
        <MemberSheet
          member={open.member}
          busy={busy}
          error={sheetError}
          lastOwner={open.member.role === 'owner' && open.member.active && owners <= 1}
          onClose={close}
          onSave={(values) => run(async () => { await adminApi.updateStaff(token, open.member.id, values); close(); })}
          onReset={() =>
            run(async () => {
              const { temporaryPassword } = await adminApi.resetStaffPassword(token, open.member.id);
              setOpen({ kind: 'password', member: open.member, password: temporaryPassword });
            })
          }
          onRemove={() => {
            if (!confirm(`Remove the account of ${open.member.name || open.member.email}? They will no longer be able to sign in.`)) return;
            void run(async () => { await adminApi.removeStaff(token, open.member.id); close(); });
          }}
        />
      )}

      {/* the temporary password, shown once */}
      <Sheet open={open?.kind === 'password'} onClose={close} title="Temporary password">
        {open?.kind === 'password' && <TemporaryPassword name={open.member.name} email={open.member.email} password={open.password} onDone={close} />}
      </Sheet>
    </div>
  );
}

/** Owner or staff, as two large choices */
function RolePicker({ value, onChange, disabled = false }: { value: StaffRole; onChange: (role: StaffRole) => void; disabled?: boolean }) {
  const choices: { role: StaffRole; text: string }[] = [
    { role: 'staff', text: 'Requests, bookings, events, photos and text' },
    { role: 'owner', text: 'All of that, and managing staff accounts' },
  ];
  return (
    <fieldset disabled={disabled}>
      <legend className="block text-[#1E3A29]/60 text-[12px] font-bold mb-1.5">Role</legend>
      <div className="grid grid-cols-2 gap-2.5">
        {choices.map(({ role, text }) => (
          <label
            key={role}
            className={`cursor-pointer rounded-2xl border-2 p-3.5 transition-colors ${value === role ? 'border-[#3F7D20] bg-[#3F7D20]/6' : 'border-[#1E3A29]/10 bg-white'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <input type="radio" name="role" className="sr-only" checked={value === role} onChange={() => onChange(role)} />
            <span className="flex items-center gap-1.5 font-bold text-[#1E3A29] text-sm">
              <Icon name={role === 'owner' ? 'shield' : 'user'} className="w-4 h-4 text-[#3F7D20]" />
              {ROLE_LABELS[role]}
            </span>
            <span className="block text-[12px] text-[#1E3A29]/55 mt-1 leading-snug">{text}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** Name, role, on or off, a new password, or removing the account */
function MemberSheet({
  member,
  busy,
  error,
  lastOwner,
  onClose,
  onSave,
  onReset,
  onRemove,
}: {
  member: StaffMember;
  busy: boolean;
  error: string;
  /** the only owner left: cannot stop being one */
  lastOwner: boolean;
  onClose: () => void;
  onSave: (values: { name: string; role: StaffRole; active: boolean }) => void;
  onReset: () => void;
  onRemove: () => void;
}) {
  const [name, setName] = useState(member.name);
  const [role, setRole] = useState(member.role);
  const [active, setActive] = useState(member.active);
  return (
    <Sheet open onClose={onClose} title={member.name || member.email}>
      <div className="space-y-5 pb-2">
        <div className="flex items-center gap-3 rounded-2xl bg-white p-3.5 border border-[#1E3A29]/8">
          <Avatar name={member.name} email={member.email} />
          <div className="min-w-0">
            <div className="text-sm text-[#1E3A29] truncate">{member.email}</div>
            <div className="text-[12px] text-[#1E3A29]/50">Added {timeAgo(member.createdAt)} · last signed in {timeAgo(member.lastLoginAt)}</div>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave({ name, role, active });
          }}
          className="space-y-4"
        >
          <label className="block">
            <span className="block text-[#1E3A29]/60 text-[12px] font-bold mb-1.5">Name</span>
            <input required maxLength={80} value={name} onChange={(e) => setName(e.target.value)} className="admin-field" />
          </label>
          <RolePicker value={role} onChange={setRole} disabled={lastOwner} />
          {lastOwner && <p className="text-[12px] text-[#1E3A29]/55 -mt-2">The only owner stays an owner, so someone can always manage the accounts.</p>}

          {/* on or off */}
          <label className={`flex items-center justify-between gap-4 rounded-2xl bg-white border border-[#1E3A29]/8 p-4 ${lastOwner ? 'opacity-50' : 'cursor-pointer'}`}>
            <span>
              <span className="block font-bold text-sm text-[#1E3A29]">Can sign in</span>
              <span className="block text-[12px] text-[#1E3A29]/55">Switch off when someone leaves; their account is kept.</span>
            </span>
            <input type="checkbox" role="switch" checked={active} disabled={lastOwner} onChange={(e) => setActive(e.target.checked)} className="admin-switch" />
          </label>

          {error && <Notice kind="error">{error}</Notice>}
          <button type="submit" disabled={busy} className="admin-btn w-full">
            {busy ? 'Saving…' : 'Save changes'}
          </button>
        </form>

        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button type="button" disabled={busy} onClick={onReset} className="admin-tile">
            <Icon name="key" className="w-5 h-5 text-[#3F7D20]" />
            New password
          </button>
          <button type="button" disabled={busy || lastOwner} onClick={onRemove} className="admin-tile text-[#C62828]">
            <Icon name="trash" className="w-5 h-5" />
            Remove
          </button>
        </div>
      </div>
    </Sheet>
  );
}

/**
 * The temporary password, with a message ready to pass on. Shared with the
 * phone's own share menu (WhatsApp, Telegram, SMS…) or copied, never placed
 * in a link.
 */
function TemporaryPassword({ name, email, password, onDone }: { name: string; email: string; password: string; onDone: () => void }) {
  const [copied, setCopied] = useState<'password' | 'message' | ''>('');
  const first = name.trim().split(/\s+/)[0] || '';
  const address = `${window.location.origin}/admin`;
  const message = `Hello${first ? ` ${first}` : ''}, this is your account for the Bushaashe Garuwa staff area.\n\nOpen: ${address}\nEmail: ${email}\nTemporary password: ${password}\n\nYou will be asked to choose your own password when you first sign in.`;

  const copy = async (what: 'password' | 'message') => {
    try {
      await navigator.clipboard.writeText(what === 'password' ? password : message);
      setCopied(what);
      setTimeout(() => setCopied(''), 2000);
    } catch {
      /* the browser refused: the password is on screen to write down */
    }
  };
  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ text: message });
      } catch {
        /* closed without sharing */
      }
    } else void copy('message');
  };

  return (
    <div className="space-y-4 pb-2">
      <p className="text-sm text-[#1E3A29]/70 leading-relaxed">
        Give this password to <strong className="text-[#1E3A29]">{name || email}</strong>. It is shown only now. They will choose their own password the first time they sign in.
      </p>
      <button type="button" onClick={() => copy('password')} className="w-full rounded-2xl bg-[#13261A] text-white px-5 py-5 text-center group">
        <span className="block font-mono text-2xl sm:text-[28px] font-bold tracking-[0.08em] select-all">{password}</span>
        <span className="flex items-center justify-center gap-1.5 text-[12px] text-white/60 mt-2 group-hover:text-white/90">
          <Icon name={copied === 'password' ? 'check' : 'copy'} className="w-3.5 h-3.5" />
          {copied === 'password' ? 'Copied' : 'Tap to copy'}
        </span>
      </button>
      <div className="grid grid-cols-2 gap-2.5">
        <button type="button" onClick={share} className="admin-tile">
          <Icon name="chat" className="w-5 h-5 text-[#3F7D20]" />
          Send to them
        </button>
        <button type="button" onClick={() => copy('message')} className="admin-tile">
          <Icon name={copied === 'message' ? 'check' : 'copy'} className="w-5 h-5 text-[#3F7D20]" />
          {copied === 'message' ? 'Copied' : 'Copy message'}
        </button>
      </div>
      <button type="button" onClick={onDone} className="admin-btn w-full">
        Done
      </button>
    </div>
  );
}
