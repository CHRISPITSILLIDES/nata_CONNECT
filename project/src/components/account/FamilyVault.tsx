import { useState } from 'react';
import { Lock, Plus, Users } from 'lucide-react';
import { Button } from '../ui/Button';
import { GlassCard } from '../ui/GlassCard';
import type { FamilyMember } from '../../stores/appStore';

interface Props {
  members: FamilyMember[];
  selectedLockedMemberId: string | null;
  onEnterMember: (id: string) => void;
  onUnlockMember: (id: string, pin: string) => Promise<boolean>;
  onAddMember: (member: FamilyMember) => void;
}

export function FamilyVault({ members, selectedLockedMemberId, onEnterMember, onUnlockMember, onAddMember }: Props) {
  const [pin, setPin] = useState('');
  const [message, setMessage] = useState('');

  const choose = async (member: FamilyMember) => {
    if (!member.pin && selectedLockedMemberId !== member.id) return onEnterMember(member.id);
    const success = await onUnlockMember(member.id, pin);
    setMessage(success ? '' : 'Incorrect PIN. Demo profiles without a PIN open directly.');
  };

  const addMember = () => {
    const number = members.length + 1;
    const member: FamilyMember = {
      id: `member-${Date.now()}`, name: `Member ${number}`, role: 'member', pin: '', lastLogin: 'New profile',
      phoneLocked: false, healthScore: 75, netWorth: 0, avatar: String(number), color: '#8b5cf6', badge: 'Member',
    };
    onAddMember(member);
    localStorage.setItem('nataconnect_members', JSON.stringify([...members, member]));
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 rounded-3xl border border-slate-700 bg-slate-950/95 p-6 shadow-2xl shadow-black/60 animate-fade-in sm:p-8">
      <div className="text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900/90"><Users /></div>
        <h1 className="text-3xl font-bold text-white">Choose your profile</h1>
        <p className="mt-2 text-slate-400">Local demo mode works immediately. No server or API key is required.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {members.map(member => (
          <GlassCard key={member.id} className="p-5" hover>
            <button className="w-full text-left" onClick={() => choose(member)}>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-bold text-white" style={{ backgroundColor: member.color }}>{member.avatar}</div>
                <div><div className="font-semibold text-white">{member.name}</div><div className="text-xs text-slate-400">{member.badge} · Score {member.healthScore}</div></div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-400"><Lock size={13} /> {member.pin ? 'PIN protected' : 'Open demo profile'}</div>
            </button>
          </GlassCard>
        ))}
      </div>
      {members.some(member => member.pin) && <input value={pin} onChange={event => setPin(event.target.value)} placeholder="PIN for protected profile" className="mx-auto block w-full max-w-xs rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white" />}
      {message && <p className="text-center text-sm text-amber-300">{message}</p>}
      <div className="flex justify-center"><Button variant="secondary" size="md" onClick={addMember}><Plus size={16} /> Add demo member</Button></div>
    </div>
  );
}
