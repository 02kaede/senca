export const aiService = {
  async analyzeReflection(text: string): Promise<string> {
    try {
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gemma4:31b-cloud', // Você pode mudar para 'llama3' ou 'gemma2' depois!
          prompt: `Você é o mentor estoico do app Senca. 
          Analise o seguinte desabafo do usuário e retorne uma reflexão curta (máximo 3 frases). 
          Não seja clichê. Não dê conselhos genéricos. 
          Foque em identificar se o usuário está sofrendo por coisas fora do seu controle. 
          Mantenha um tom calmo, minimalista e profundo.
          
          Desabafo: "${text}"`,
          stream: false,
        }),
      });

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error("Erro ao conectar com Ollama:", error);
      return "O silêncio do universo é a única resposta agora. (Erro ao conectar com a IA local).";
    }
  }
};