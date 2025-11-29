# Unificado Front-End

Este é o front-end do projeto Unificado, um sistema completo de gestão acadêmica desenvolvido com React, TypeScript e Vite. O sistema oferece dashboards diferenciados para administradores, professores e alunos, com funcionalidades avançadas de visualização de grafos de dependências de disciplinas, recomendações personalizadas, análise de ciclos e métricas de importância. Integra-se com uma API backend desenvolvida em FastAPI para fornecer uma experiência completa de gerenciamento educacional.

## Pré-requisitos

Antes de começar, certifique-se de que você tenha os seguintes softwares instalados em sua máquina:

- **Node.js** (versão 18 ou superior): Você pode baixar e instalar a partir do site oficial [nodejs.org](https://nodejs.org/).
- **npm** (geralmente vem com o Node.js): Verifique a instalação executando `npm --version` no terminal.
- **Git**: Para clonar repositórios. Baixe em [git-scm.com](https://git-scm.com/).

## Dependências do Projeto

O projeto utiliza as seguintes dependências principais, listadas no arquivo `package.json`:

### Dependências de Produção
- `@radix-ui/react-accordion`: ^1.2.12 - Componente de acordeão para UI.
- `@radix-ui/react-checkbox`: ^1.3.3 - Componente de checkbox.
- `@radix-ui/react-dialog`: ^1.1.15 - Componente de diálogo modal.
- `@radix-ui/react-popover`: ^1.1.15 - Componente de popover.
- `@radix-ui/react-select`: ^2.2.6 - Componente de seleção.
- `@radix-ui/react-separator`: ^1.1.7 - Componente separador.
- `@radix-ui/react-slot`: ^1.2.3 - Utilitário para slots em componentes.
- `@radix-ui/react-tabs`: ^1.1.13 - Componente de abas.
- `@radix-ui/react-tooltip`: ^1.2.8 - Componente de tooltip.
- `@tailwindcss/vite`: ^4.1.13 - Plugin Vite para Tailwind CSS.
- `class-variance-authority`: ^0.7.1 - Utilitário para variantes de classes CSS.
- `clsx`: ^2.1.1 - Utilitário para combinar classes CSS condicionalmente.
- `lucide-react`: ^0.544.0 - Ícones React baseados em Lucide.
- `react`: ^19.1.1 - Biblioteca React.
- `react-dom`: ^19.1.1 - Renderização DOM para React.
- `react-router-dom`: ^7.9.2 - Roteamento para aplicações React.
- `tailwind-merge`: ^3.3.1 - Utilitário para mesclar classes Tailwind.
- `tailwindcss`: ^4.1.13 - Framework CSS utilitário.

### Dependências de Desenvolvimento
- `@eslint/js`: ^9.36.0 - Configuração ESLint.
- `@types/node`: ^24.5.2 - Tipos TypeScript para Node.js.
- `@types/react`: ^19.1.13 - Tipos TypeScript para React.
- `@types/react-dom`: ^19.1.9 - Tipos TypeScript para React DOM.
- `@vitejs/plugin-react`: ^5.0.3 - Plugin Vite para React.
- `eslint`: ^9.36.0 - Linter JavaScript/TypeScript.
- `eslint-plugin-react-hooks`: ^5.2.0 - Regras ESLint para hooks React.
- `eslint-plugin-react-refresh`: ^0.4.20 - Plugin para React Fast Refresh.
- `globals`: ^16.4.0 - Definições globais para ESLint.
- `tw-animate-css`: ^1.4.0 - Animações CSS para Tailwind.
- `typescript`: ~5.8.3 - Superset JavaScript com tipagem.
- `typescript-eslint`: ^8.44.0 - Regras ESLint para TypeScript.
- `vite`: ^7.1.7 - Ferramenta de build rápida.

## Instalação

Siga os passos abaixo para configurar o projeto localmente:

1. **Instale as dependências**:
   Execute o comando abaixo para instalar todas as dependências listadas no `package.json`:
   ```bash
   npm install
   ```
   Este comando baixará e instalará todas as bibliotecas necessárias no diretório `node_modules`.

3. **Configure as variáveis de ambiente**:
   Crie um arquivo `.env` na raiz do projeto (ou copie de `.env.example` se existir) e defina a URL da API backend:
   ```
   VITE_API_BASE_URL=http://127.0.0.1:8000
   ```
   - Substitua `http://127.0.0.1:8000` pela URL do seu servidor backend se estiver rodando em outro endereço/porta.

## Dependência da API Backend

Este front-end depende da API backend desenvolvida em FastAPI, disponível no repositório: [https://github.com/Gabriel-Ramon-R-Ramos/unificado](https://github.com/Gabriel-Ramon-R-Ramos/unificado).

### Como configurar a API backend:
1. Clone o repositório da API:
   ```bash
   git clone https://github.com/Gabriel-Ramon-R-Ramos/unificado.git
   cd unificado  # Ajuste para o diretório correto da API, provavelmente 'back' ou similar
   ```

2. Siga as instruções no README da API para instalar dependências.

3. Certifique-se de que a API esteja rodando na porta 8000 (ou ajuste a variável `VITE_API_BASE_URL` conforme necessário).

## Executando o Projeto

Após a instalação e configuração:

1. **Inicie o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```
   Isso iniciará o Vite em modo de desenvolvimento. Abra o navegador e acesse `http://localhost:5173` (porta padrão do Vite).

2. **Build para produção**:
   ```bash
   npm run build
   ```
   Isso criará uma versão otimizada em `dist/`.

3. **Preview da build**:
   ```bash
   npm run preview
   ```

4. **Linting**:
   ```bash
   npm run lint
   ```
   Para verificar e corrigir problemas de código.

## Estrutura do Projeto

- `src/`: Código fonte principal.
  - `components/`: Componentes reutilizáveis.
    - `ui/`: Componentes de interface baseados em Radix UI e Tailwind CSS (botões, abas, formulários, etc.).
    - `GraphView.tsx`: Componente de visualização interativa de grafos usando react-force-graph.
  - `pages/`: Páginas da aplicação.
    - `AdminDashboard/`: Dashboard administrativo com gerenciamento completo.
    - `ProfessorDashboard/`: Dashboard para professores.
    - `Dashboard/`: Dashboard geral para alunos.
    - `login/`: Página de autenticação.
  - `lib/`: Utilitários e configurações.
    - `api.ts`: Cliente para integração com a API FastAPI.
    - `utils.ts`: Funções utilitárias para manipulação de classes CSS.
  - `services/`: Serviços específicos.
    - `graphService.ts`: Serviço para obtenção e processamento de dados de grafos.
  - `hooks/`: Hooks customizados React.
    - `use-mobile.ts`: Hook para detecção de dispositivos móveis.
  - `home/`: Página inicial/landing page.
- `public/`: Assets estáticos (imagens, ícones).
- `vite.config.ts`: Configuração do Vite.
- `tsconfig.json`: Configuração TypeScript.
- `package.json`: Dependências e scripts do projeto.

## Contribuição

Para contribuir:
1. Faça um fork do repositório.
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`).
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`).
4. Push para a branch (`git push origin feature/nova-feature`).
5. Abra um Pull Request.

## Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## Suporte

Se encontrar problemas, abra uma issue no repositório ou entre em contato com a equipe de desenvolvimento.
```
 