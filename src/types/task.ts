export type TaskCategory = 'essencial' | 'necessario' | 'ruido';
export type TaskStatus = 'pendente' | 'concluida';

export interface Task {
  id: string;            // Um ID único (vamos usar crypto.randomUUID())
  text: string;          // O que precisa ser feito
  category: TaskCategory; // A lógica estoica: Essencial, Necessário ou Ruído
  status: TaskStatus;    // Se já foi feita ou não
  createdAt: Date;       // Para podermos ordenar as tarefas por data
  completedAt?: Date;    // Opcional: para saber quando foi concluída
}