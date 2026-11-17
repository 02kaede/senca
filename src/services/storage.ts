import type { Task } from '../types/task';

const STORAGE_KEY = '***';

export const storageService = {
  // Salva a lista completa de tarefas no localStorage
  saveTasks(tasks: Task[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  },

  // Recupera as tarefas do localStorage. Se não houver nada, retorna um array vazio.
  getTasks(): Task[] {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    
    try {
      // Transformamos as strings de data de volta em objetos Date reais
      const parsedTasks: any[] = JSON.parse(data);
      return parsedTasks.map(task => ({
        ...task,
        createdAt: new Date(task.createdAt),
        completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
      }));
    } catch (error) {
      console.error("Erro ao recuperar tarefas do storage:", error);
      return [];
    }
  },

  // Função auxiliar para adicionar uma única tarefa sem precisar carregar tudo manualmente no componente
  addTask(task: Task): void {
    const tasks = this.getTasks();
    tasks.push(task);
    this.saveTasks(tasks);
  }
};