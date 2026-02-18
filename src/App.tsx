import React, { useState } from 'react';
import { Plus, Trash2, Activity, Calendar, Clock, ChevronRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { useGlucoseStore, GlucoseReading } from './hooks/useGlucoseStore';

const App: React.FC = () => {
  const { readings, addReading, deleteReading } = useGlucoseStore();
  const [value, setValue] = useState('');
  const [type, setType] = useState<GlucoseReading['type']>('fasting');
  const [note, setNote] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value) return;
    addReading(Number(value), type, note);
    setValue('');
    setNote('');
    setShowForm(false);
  };

  const getStatusColor = (val: number) => {
    if (val < 70) return 'text-amber-400';
    if (val > 140) return 'text-danger';
    return 'text-primary';
  };

  const chartData = [...readings].reverse().map(r => ({
    time: format(new Date(r.timestamp), 'dd/MM HH:mm'),
    value: r.value
  }));

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Glicemia</h1>
          <p className="text-slate-400">Controle Diário</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30 active:scale-90 transition-transform"
        >
          <Plus className="text-white w-7 h-7" />
        </button>
      </header>

      {/* Stats Card */}
      {readings.length > 0 && (
        <section className="glass-card mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="text-primary w-5 h-5" />
            <h2 className="font-semibold text-lg">Última Leitura</h2>
          </div>
          <div className="flex items-end gap-2">
            <span className={`text-5xl font-black ${getStatusColor(readings[0].value)}`}>
              {readings[0].value}
            </span>
            <span className="text-slate-400 mb-2 font-medium">mg/dL</span>
          </div>
          <div className="mt-4 h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="time" hide />
                <YAxis hide domain={['dataMin - 20', 'dataMax + 20']} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f1f5f9' }}
                  itemStyle={{ color: '#10b981' }}
                />
                <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      {/* Form Overlay */}
      {showForm && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="glass-card w-full max-w-sm animate-in slide-in-from-bottom duration-300">
            <h2 className="text-xl font-bold mb-6">Nova Medição</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm text-slate-400 mb-2 font-medium">Valor (mg/dL)</label>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="glass-input w-full text-2xl font-bold"
                  placeholder="000"
                  autoFocus
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2 font-medium">Momento</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="glass-input w-full appearance-none"
                >
                  <option value="fasting">Em Jejum</option>
                  <option value="before_meal">Pré-Refeição</option>
                  <option value="after_meal">Pós-Refeição</option>
                  <option value="bedtime">Antes de Deitar</option>
                  <option value="other">Outro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2 font-medium">Notas (Opcional)</label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="glass-input w-full"
                  placeholder="Ex: Almoço pesado"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-3 rounded-xl border border-white/10 font-semibold active:scale-95 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* History */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2 px-2">
          <Calendar className="w-5 h-5 text-secondary" />
          Histórico
        </h2>
        {readings.length === 0 ? (
          <div className="glass-card text-center py-12">
            <Activity className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500">Nenhuma leitura registrada ainda.</p>
          </div>
        ) : (
          readings.map((reading) => (
            <div key={reading.id} className="glass-card flex items-center justify-between p-4 group">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center font-bold text-lg ${getStatusColor(reading.value)}`}>
                  {reading.value}
                </div>
                <div>
                  <div className="font-semibold capitalize">{reading.type.replace('_', ' ')}</div>
                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {format(new Date(reading.timestamp), 'HH:mm')} • {format(new Date(reading.timestamp), 'dd/MM/yy')}
                  </div>
                </div>
              </div>
              <button
                onClick={() => deleteReading(reading.id)}
                className="opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-danger transition-all"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default App;
