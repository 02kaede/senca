import { useState, useEffect } from 'react';
import type { Task, TaskCategory } from './types/task';
import { storageService } from './services/storage';
import { aiService } from './services/aiService';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [text, setText] = useState('');
  const [category, setCategory] = useState<TaskCategory>('essencial');
  const [view, setView] = useState<'home' | 'focus' | 'reflect'>('home');
  const [reflection, setReflection] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setTasks(storageService.getTasks());
  }, []);

  const addTask = () => {
    if (!text.trim()) return;
    const newTask: Task = {
      id: crypto.randomUUID(),
      text,
      category,
      status: 'pendente',
      createdAt: new Date(),
    };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    storageService.saveTasks(updatedTasks);
    setText('');
  };

  const toggleTask = (id: string) => {
    const updatedTasks: Task[] = tasks.map(task => {
      if (task.id !== id) return task;

      const status: Task['status'] = task.status === 'pendente' ? 'concluida' : 'pendente';
      return { ...task, status };
    });
    setTasks(updatedTasks);
    storageService.saveTasks(updatedTasks);
  };

  const clearAllTasks = () => {
    if (window.confirm("Deseja realmente limpar todo o seu caminho?")) {
      setTasks([]);
      storageService.saveTasks([]);
    }
  };

  const handleReflect = async () => {
    if (!reflection.trim()) return;
    setIsLoading(true);
    setAiResponse('');
    const response = await aiService.analyzeReflection(reflection);
    setAiResponse(response);
    setIsLoading(false);
  };

  const getFocusTask = () => {
    const essentialTasks = tasks.filter(t => t.category === 'essencial' && t.status === 'pendente');
    return essentialTasks.length > 0 ? essentialTasks[0] : null;
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8 font-sans selection:bg-zinc-700 transition-all duration-700">
      <div className="max-w-xl mx-auto">
        
        {/* Navigation Menu */}
        <nav className="flex justify-center gap-8 mb-16">
          <button 
            onClick={() => setView('home')} 
            className={`text-[10px] uppercase tracking-widest transition-all ${view === 'home' ? 'text-zinc-100 border-b border-zinc-100' : 'text-zinc-600 hover:text-zinc-400'}`}
          >
            Home
          </button>
          <button 
            onClick={() => setView('reflect')} 
            className={`text-[10px] uppercase tracking-widest transition-all ${view === 'reflect' ? 'text-zinc-100 border-b border-zinc-100' : 'text-zinc-600 hover:text-zinc-400'}`}
          >
            Reflexão
          </button>
        </nav>

        {view === 'focus' ? (
          <div className="h-[80vh] flex flex-col items-center justify-center text-center space-y-12 animate-in fade-in zoom-in duration-1000">
            <div className="space-y-6">
              <p className="text-zinc-600 uppercase tracking-[0.5em] text-[10px] animate-pulse">Santuário de Foco</p>
              {getFocusTask() ? (
                <div className="space-y-8">
                  <h2 className="text-4xl font-extralight tracking-wide text-zinc-100 max-w-lg leading-relaxed">
                    {getFocusTask()?.text}
                  </h2>
                  <div className="flex gap-4 justify-center">
                    <button 
                      onClick={() => toggleTask(getFocusTask()!.id)}
                      className="px-6 py-2 rounded-full border border-zinc-700 text-zinc-400 text-xs uppercase tracking-widest hover:bg-zinc-100 hover:text-zinc-950 transition-all duration-300"
                    >
                      Concluir Agora
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-zinc-500 italic">Nenhuma tarefa essencial pendente.<br/>Sua mente está em paz.</p>
              )}
            </div>
            <button onClick={() => setView('home')} className="absolute bottom-12 text-zinc-600 hover:text-zinc-400 text-[10px] uppercase tracking-widest transition-colors">
              ← Voltar para o Ruído
            </button>
          </div>
        ) : view === 'reflect' ? (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="text-center space-y-2 mb-12">
              <h1 className="text-3xl font-extralight tracking-widest uppercase opacity-90">Reflexão</h1>
              <p className="text-zinc-600 italic text-sm">Desabafe. Encontre a clareza.</p>
            </header>

            <div className="flex flex-col gap-6 bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800/50 backdrop-blur-sm">
              <textarea 
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="Como está sua mente hoje?"
                className="bg-transparent text-xl outline-none border-b border-zinc-800 pb-3 focus:border-zinc-500 transition-all duration-300 placeholder:text-zinc-700 min-h-[150px] resize-none"
              />
              <button 
                onClick={handleReflect}
                disabled={isLoading}
                className="bg-zinc-100 text-zinc-950 py-3 rounded-xl font-medium hover:bg-white active:scale-95 transition-all duration-200 disabled:opacity-50"
              >
                {isLoading ? 'Consultando o Silêncio...' : 'Analisar Vibe'}
              </button>
            </div>

            {aiResponse && (
              <div className="p-8 rounded-3xl bg-zinc-900/30 border border-zinc-800/50 animate-in fade-in slide-in-from-top-4 duration-500">
                <p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-4">Insight do Mentor</p>
                <p className="text-zinc-300 text-lg font-light leading-relaxed italic">"{aiResponse}"</p>
              </div>
            )}
          </div>
        ) : (
          <>
            <header className="mb-16 text-center space-y-2">
              <h1 className="text-5xl font-extralight tracking-[0.2em] uppercase opacity-90">Senca</h1>
              <p className="text-zinc-600 italic text-sm font-light">Foque no essencial. Ignore o ruído.</p>
            </header>

            <div className="flex justify-end mb-8">
              <button 
                onClick={() => setView('focus')}
                className="text-[10px] uppercase tracking-widest text-zinc-500 hover:text-zinc-100 transition-all duration-300 flex items-center gap-2 group"
              >
                Entrar no Santuário 
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>

            <div className="flex flex-col gap-6 mb-16 bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800/50 backdrop-blur-sm">
              <input 
                type="text" 
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="O que é essencial agora?"
                className="bg-transparent text-2xl outline-none border-b border-zinc-800 pb-3 focus:border-zinc-500 transition-all duration-300 placeholder:text-zinc-700"
              />
              <div className="flex gap-4 justify-center">
                {(['essencial', 'necessario', 'ruido'] as TaskCategory[]).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-5 py-1.5 rounded-full text-[10px] uppercase tracking-widest transition-all duration-300 ${
                      category === cat 
                        ? 'bg-zinc-100 text-zinc-950 scale-105 shadow-[0_0_15px_rgba(255,255,255,0.2)]' 
                        : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300 border border-zinc-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <button onClick={addTask} className="mt-4 bg-zinc-100 text-zinc-950 py-3 rounded-xl font-medium hover:bg-white active:scale-95 transition-all duration-200">
                Adicionar ao Caminho
              </button>
            </div>

            <div className="space-y-12">
              {(['essencial', 'necessario', 'ruido'] as TaskCategory[]).map(cat => (
                <div key={cat} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <h2 className="text-[10px] uppercase tracking-[0.3em] text-zinc-600 font-bold">{cat}</h2>
                    <div className="h-[1px] flex-1 bg-zinc-900"></div>
                  </div>
                  <div className="grid gap-3">
                    {tasks.filter(t => t.category === cat).map(task => (
                      <div 
                        key={task.id}
                        onClick={() => toggleTask(task.id)}
                        className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border-l-4 ${
                          task.status === 'concluida' 
                            ? 'bg-zinc-900/30 border-zinc-800 text-zinc-600 line-through opacity-50' 
                            : cat === 'essencial' 
                              ? 'bg-zinc-900 border-zinc-100 hover:bg-zinc-800 shadow-sm' 
                              : 'bg-zinc-900/50 border-zinc-800 hover:bg-zinc-900'
                        }`}
                      >
                        <span className="text-lg font-light">{task.text}</span>
                      </div>
                    ))}
                    {tasks.filter(t => t.category === cat).length === 0 && (
                      <p className="text-zinc-700 text-xs italic pl-1">Nenhum item registrado.</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-20 text-center">
              <button onClick={clearAllTasks} className="text-[10px] uppercase tracking-widest text-zinc-700 hover:text-red-400 transition-colors duration-300 font-light">
                Limpar Caminho
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;