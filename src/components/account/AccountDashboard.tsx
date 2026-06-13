import { useState } from 'react';
import { Bell, ChevronRight, CreditCard, Download, Globe, HelpCircle, Lock, Mail, Moon, Phone, RotateCcw, Shield, Target, Trophy, User } from 'lucide-react';
import { clearAppData, exportAppData, usePersistentState } from '../../lib/storage';
import { mockCards } from '../../stores/appStore';
import type { Card } from '../../stores/appStore';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { GlassCard } from '../ui/GlassCard';
import { Modal } from '../ui/Modal';

type Setting = 'notifications' | 'privacy' | 'appearance' | 'language' | 'cards' | 'support' | 'profile' | null;

interface Profile {
  name: string;
  email: string;
  phone: string;
}

interface Preferences {
  notifications: boolean;
  privacyLock: boolean;
  appearance: 'Dark' | 'System';
  language: 'English' | 'Greek' | 'Romanian';
}

function SettingRow({ icon, label, value, onClick }: { icon: React.ReactNode; label: string; value?: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-900/90 transition-all group text-left">
      <div className="p-2 rounded-lg bg-slate-950/90 text-slate-400 group-hover:text-white transition-colors">{icon}</div>
      <div className="flex-1 text-sm text-white">{label}</div>
      {value && <span className="text-xs text-slate-400">{value}</span>}
      <ChevronRight size={14} className="text-slate-500 group-hover:text-slate-300" />
    </button>
  );
}

export function AccountDashboard() {
  const [profile, setProfile] = usePersistentState<Profile>('profile', { name: 'Alex Mueller', email: 'alex.mueller@email.com', phone: '+49 123 456 7890' });
  const [preferences, setPreferences] = usePersistentState<Preferences>('preferences', { notifications: true, privacyLock: true, appearance: 'Dark', language: 'English' });
  const [cards, setCards] = usePersistentState<Card[]>('cards', mockCards);
  const [activeSetting, setActiveSetting] = useState<Setting>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const totalBalance = cards.reduce((sum, card) => sum + card.balance, 0);

  const downloadData = () => {
    const blob = new Blob([exportAppData()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `nata-connect-data-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const resetData = () => {
    clearAppData();
    window.location.reload();
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Account</h1>
          <p className="text-sm text-slate-400 mt-0.5">Manage your local profile and preferences</p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => setActiveSetting('profile')}>Edit profile</Button>
      </div>

      <GlassCard className="p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-slate-900/90 border border-slate-700 flex items-center justify-center"><User size={28} className="text-slate-200" /></div>
            <div>
              <h2 className="text-lg font-semibold text-white">{profile.name}</h2>
              <div className="flex items-center gap-2 text-xs text-slate-400"><Mail size={10} /> {profile.email}</div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5"><Phone size={10} /> {profile.phone}</div>
            </div>
          </div>
          <div className="lg:text-right"><div className="text-xs text-slate-400">Demo Balance</div><div className="text-xl font-bold text-white">EUR {totalBalance.toLocaleString('de-DE', { minimumFractionDigits: 2 })}</div></div>
        </div>
      </GlassCard>

      <div>
        <h2 className="text-sm font-medium text-slate-400 mb-3">Your Demo Cards</h2>
        <div className="space-y-2">
          {cards.map(card => (
            <button key={card.id} onClick={() => setCards(previous => previous.map(item => item.id === card.id ? { ...item, isActive: !item.isActive } : item))} className="w-full flex items-center gap-4 p-4 rounded-xl card-gradient-blue text-left hover:shadow-lg transition-all">
              <CreditCard size={18} style={{ color: card.color }} />
              <div className="flex-1"><div className="text-sm font-medium text-white">{card.name}</div><div className="text-xs text-slate-300">{card.brand} ending {card.lastFour}</div></div>
              <div className="text-right"><div className="text-sm font-semibold text-white">EUR {card.balance.toLocaleString('de-DE', { minimumFractionDigits: 2 })}</div><Badge variant={card.isActive ? 'success' : 'neutral'}>{card.isActive ? 'Active' : 'Paused'}</Badge></div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <GlassCard className="p-4" gradient><Shield size={16} className="text-blue-300 mb-2" /><div className="text-lg font-bold text-white">Shield</div><div className="text-xs text-slate-400">Rules and decisions save locally</div></GlassCard>
        <GlassCard className="p-4" gradient><Trophy size={16} className="text-amber-300 mb-2" /><div className="text-lg font-bold text-white">Practice</div><div className="text-xs text-slate-400">Virtual trades persist</div></GlassCard>
        <GlassCard className="p-4" gradient><Target size={16} className="text-emerald-300 mb-2" /><div className="text-lg font-bold text-white">Goals</div><div className="text-xs text-slate-400">Contributions persist</div></GlassCard>
        <GlassCard className="p-4" gradient><Lock size={16} className="text-pink-300 mb-2" /><div className="text-lg font-bold text-white">Private</div><div className="text-xs text-slate-400">Stored in this browser</div></GlassCard>
      </div>

      <div>
        <h2 className="text-sm font-medium text-slate-400 mb-3">Settings</h2>
        <GlassCard className="p-2">
          <SettingRow icon={<Bell size={16} />} label="Notifications" value={preferences.notifications ? 'On' : 'Off'} onClick={() => setActiveSetting('notifications')} />
          <SettingRow icon={<Lock size={16} />} label="Privacy & Security" value={preferences.privacyLock ? 'Locked' : 'Standard'} onClick={() => setActiveSetting('privacy')} />
          <SettingRow icon={<Moon size={16} />} label="Appearance" value={preferences.appearance} onClick={() => setActiveSetting('appearance')} />
          <SettingRow icon={<Globe size={16} />} label="Language" value={preferences.language} onClick={() => setActiveSetting('language')} />
          <SettingRow icon={<CreditCard size={16} />} label="Payment Methods" value={`${cards.filter(card => card.isActive).length} active`} onClick={() => setActiveSetting('cards')} />
          <SettingRow icon={<HelpCircle size={16} />} label="Help & Support" onClick={() => setActiveSetting('support')} />
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button variant="secondary" size="md" className="w-full" onClick={downloadData}><Download size={16} /> Export my data</Button>
        <Button variant="danger" size="md" className="w-full" onClick={() => setConfirmReset(true)}><RotateCcw size={16} /> Reset local demo</Button>
      </div>

      <Modal isOpen={activeSetting !== null} onClose={() => setActiveSetting(null)} title="Account setting">
        <div className="space-y-4">
          {activeSetting === 'profile' && <>
            <input value={profile.name} onChange={event => setProfile({ ...profile, name: event.target.value })} className="w-full glass-input rounded-xl px-4 py-3" placeholder="Name" />
            <input value={profile.email} onChange={event => setProfile({ ...profile, email: event.target.value })} className="w-full glass-input rounded-xl px-4 py-3" placeholder="Email" type="email" />
            <input value={profile.phone} onChange={event => setProfile({ ...profile, phone: event.target.value })} className="w-full glass-input rounded-xl px-4 py-3" placeholder="Phone" />
          </>}
          {activeSetting === 'notifications' && <Button variant="secondary" className="w-full" onClick={() => setPreferences({ ...preferences, notifications: !preferences.notifications })}>Turn notifications {preferences.notifications ? 'off' : 'on'}</Button>}
          {activeSetting === 'privacy' && <Button variant="secondary" className="w-full" onClick={() => setPreferences({ ...preferences, privacyLock: !preferences.privacyLock })}>{preferences.privacyLock ? 'Use standard local privacy' : 'Enable local privacy lock'}</Button>}
          {activeSetting === 'appearance' && <Button variant="secondary" className="w-full" onClick={() => setPreferences({ ...preferences, appearance: preferences.appearance === 'Dark' ? 'System' : 'Dark' })}>Switch to {preferences.appearance === 'Dark' ? 'system' : 'dark'} theme preference</Button>}
          {activeSetting === 'language' && <select value={preferences.language} onChange={event => setPreferences({ ...preferences, language: event.target.value as Preferences['language'] })} className="w-full glass-input rounded-xl px-4 py-3 bg-transparent"><option>English</option><option>Greek</option><option>Romanian</option></select>}
          {activeSetting === 'cards' && <p className="text-sm text-slate-300">Click any demo card in the account screen to pause or reactivate it.</p>}
          {activeSetting === 'support' && <p className="text-sm text-slate-300">Use NataGuide for product guidance. For suspected fraud, contact your bank through the official number on your card and preserve all evidence.</p>}
          <Button variant="primary" className="w-full" onClick={() => setActiveSetting(null)}>Done</Button>
        </div>
      </Modal>

      <Modal isOpen={confirmReset} onClose={() => setConfirmReset(false)} title="Reset local demo data?">
        <p className="text-sm text-slate-300 mb-4">This removes saved rules, goals, practice trades, preferences, and chats from this browser. It cannot be undone unless you exported the data first.</p>
        <div className="flex justify-end gap-3"><Button variant="ghost" onClick={() => setConfirmReset(false)}>Cancel</Button><Button variant="danger" onClick={resetData}>Reset everything</Button></div>
      </Modal>
    </div>
  );
}
