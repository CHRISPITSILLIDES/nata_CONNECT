import { ArrowLeft, Target, Users, WalletCards } from 'lucide-react';
import { Button } from '../ui/Button';
import { GlassCard } from '../ui/GlassCard';
import type { FamilyActivity, FamilyGoal, FamilyMember } from '../../stores/appStore';

export function FamilyOverview({ members, familyGoals, activities, onClose }: { members: FamilyMember[]; familyGoals: FamilyGoal[]; activities: FamilyActivity[]; onClose: () => void }) {
  const netWorth = members.reduce((sum, member) => sum + member.netWorth, 0);
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold text-white">Family overview</h1><p className="text-sm text-slate-400">A shared local summary for this demo.</p></div><Button variant="secondary" size="sm" onClick={onClose}><ArrowLeft size={14} /> Back</Button></div>
      <div className="grid gap-3 sm:grid-cols-3">
        <GlassCard className="p-4"><Users className="mb-2 text-blue-300" /><div className="text-2xl font-bold text-white">{members.length}</div><div className="text-xs text-slate-400">Family profiles</div></GlassCard>
        <GlassCard className="p-4"><Target className="mb-2 text-pink-300" /><div className="text-2xl font-bold text-white">{familyGoals.length}</div><div className="text-xs text-slate-400">Shared goals</div></GlassCard>
        <GlassCard className="p-4"><WalletCards className="mb-2 text-emerald-300" /><div className="text-2xl font-bold text-white">€{netWorth.toLocaleString()}</div><div className="text-xs text-slate-400">Recorded net worth</div></GlassCard>
      </div>
      <GlassCard className="p-5"><h2 className="font-semibold text-white">Recent family activity</h2><div className="mt-4 space-y-3">{activities.length ? activities.map(item => <div key={item.id} className="rounded-xl border border-slate-700 p-3 text-sm text-slate-300">{item.text}</div>) : <p className="text-sm text-slate-400">No activity yet. Actions taken in the prototype will appear here in a future backend-connected version.</p>}</div></GlassCard>
    </div>
  );
}
