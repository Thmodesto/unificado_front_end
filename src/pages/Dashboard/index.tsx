import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

export default function DashboardPage() {
  const [section, setSection] = useState<"resumo" | "requeridas" | "configuracoes">("resumo");
  const [tab, setTab] = useState<"concluidas" | "cursando" | "acursar">("concluidas");
  const [search, setSearch] = useState("");
  const [requiredSearch, setRequiredSearch] = useState("");
  const [profile, setProfile] = useState<{ nome: string; email: string; curso: string }>({ nome: "", email: "", curso: "" });

  // Load profile from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("profile");
      if (saved) {
        const parsed = JSON.parse(saved) as { nome?: string; email?: string; curso?: string };
        setProfile({
          nome: parsed.nome ?? "",
          email: parsed.email ?? "",
          curso: parsed.curso ?? "",
        });
      }
    } catch {
      // ignore corrupt data
    }
  }, []);

  const materiasConcluidas = [
    { nome: "Cálculo I", creditos: 60 },
    { nome: "Álgebra Linear", creditos: 60 },
    { nome: "Programação I", creditos: 80 },
  ];
  const materiasCursando = [
    { nome: "Estruturas de Dados", creditos: 80, progresso: 65 },
    { nome: "Banco de Dados", creditos: 60, progresso: 30 },
  ];
  const materiasACursar = [
    { nome: "Sistemas Operacionais", creditos: 60 },
    { nome: "Redes de Computadores", creditos: 60 },
    { nome: "Engenharia de Software", creditos: 80 },
  ];
  const counts = {
    concluidas: materiasConcluidas.length,
    cursando: materiasCursando.length,
    acursar: materiasACursar.length,
  } as const;

  const query = search.trim().toLowerCase();
  const filteredConcluidas = useMemo(
    () => (
      !query
        ? materiasConcluidas
        : materiasConcluidas.filter((m) => m.nome.toLowerCase().includes(query) || String(m.creditos).includes(query))
    ),
    [materiasConcluidas, query]
  );
  const filteredCursando = useMemo(
    () => (
      !query
        ? materiasCursando
        : materiasCursando.filter((m) => m.nome.toLowerCase().includes(query) || String(m.creditos).includes(query))
    ),
    [materiasCursando, query]
  );
  const filteredACursar = useMemo(
    () => (
      !query
        ? materiasACursar
        : materiasACursar.filter((m) => m.nome.toLowerCase().includes(query) || String(m.creditos).includes(query))
    ),
    [materiasACursar, query]
  );
  const requiredQuery = requiredSearch.trim().toLowerCase();
  const filteredRequired = useMemo(
    () => (
      !requiredQuery
        ? materiasACursar
        : materiasACursar.filter((m) => m.nome.toLowerCase().includes(requiredQuery) || String(m.creditos).includes(requiredQuery))
    ),
    [materiasACursar, requiredQuery]
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-800 text-zinc-100">
      {/* Top bar */}
      <header className="sticky top-0 z-10 bg-zinc-900/80 backdrop-blur border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <h1 className="text-lg sm:text-xl font-bold tracking-tight">Seu Dashboard</h1>
          <nav className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-zinc-300">
            <Link className="hover:text-white" to="/">Home</Link>
            <Link className="hover:text-white" to="/login">Sair</Link>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-4 sm:gap-6">
        {/* Sidebar */}
        <aside className="hidden lg:block rounded-2xl bg-zinc-900/60 border border-white/10 p-4 h-fit">
          <p className="text-xs uppercase tracking-wide text-zinc-400 mb-3">Menu</p>
          <ul className="space-y-1 text-sm">
            <li>
              <button
                className={`w-full text-left rounded-lg px-3 py-2 ${section === "resumo" ? "bg-zinc-800/60" : "hover:bg-zinc-800/40"}`}
                onClick={() => setSection("resumo")}
              >
                Resumo
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left rounded-lg px-3 py-2 ${section === "requeridas" ? "bg-zinc-800/60" : "hover:bg-zinc-800/40"}`}
                onClick={() => setSection("requeridas")}
              >
                Requeridas ({counts.acursar})
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left rounded-lg px-3 py-2 ${section === "configuracoes" ? "bg-zinc-800/60" : "hover:bg-zinc-800/40"}`}
                onClick={() => setSection("configuracoes")}
              >
                Configurações
              </button>
            </li>
          </ul>
        </aside>

        {/* Main content */}
        <section className="space-y-4 sm:space-y-6">
          {/* Mobile section switcher */}
          <div className="lg:hidden">
            <label className="sr-only" htmlFor="sectionSelect">Seção</label>
            <select
              id="sectionSelect"
              className="w-full rounded-lg bg-zinc-900/60 border border-white/10 px-3 py-2 text-sm"
              value={section}
              onChange={(e) => setSection(e.target.value as typeof section)}
            >
              <option value="resumo">Resumo</option>
              <option value="requeridas">Requeridas</option>
              <option value="configuracoes">Configurações</option>
            </select>
          </div>

          {section === "resumo" && (
            <>
          {/* Greeting */}
          <div className="rounded-2xl bg-gradient-to-r from-emerald-600/30 to-emerald-500/20 border border-emerald-400/30 p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold">Bem-vindo(a)!</h2>
            <p className="text-zinc-300 mt-1 text-sm sm:text-base">Aqui está um resumo da sua conta hoje.</p>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
            {[
              { label: "Projetos", value: "12" },
              { label: "Tarefas", value: "34" },
              { label: "Mensagens", value: "5" },
              { label: "Notificações", value: "3" },
            ].map((c) => (
              <div key={c.label} className="rounded-2xl bg-zinc-900/60 border border-white/10 p-4 sm:p-5">
                <p className="text-xs sm:text-sm text-zinc-400">{c.label}</p>
                <p className="text-2xl sm:text-3xl font-extrabold mt-1">{c.value}</p>
              </div>
            ))}
          </div>

          {/* Abas de matérias */}
          <div className="rounded-2xl bg-zinc-900/60 border border-white/10 overflow-hidden">
            {/* Tabs header */}
            <div className="flex flex-wrap items-center gap-2 p-2 sm:p-3 border-b border-white/10">
              {[
                { id: "concluidas", label: `Concluídas (${counts.concluidas})` },
                { id: "cursando", label: `Cursando (${counts.cursando})` },
                { id: "acursar", label: `A cursar (${counts.acursar})` },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id as typeof tab)}
                  className={
                    "px-3 py-1.5 rounded-lg text-xs sm:text-sm transition border " +
                    (tab === (t.id as typeof tab)
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/30"
                      : "bg-transparent text-zinc-300 hover:bg-white/5 border-white/10")
                  }
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tabs content */}
            <div className="p-4 sm:p-5">
              {/* Search/filter */}
              <div className="mb-3 sm:mb-4 flex items-center gap-2">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar matéria"
                  className="w-full max-w-sm rounded-md px-3 py-2 bg-black/40 text-white border border-white/10 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="text-xs px-3 py-2 rounded-md border border-white/10 hover:bg-white/5"
                  >
                    Limpar
                  </button>
                )}
              </div>
              {tab === "concluidas" && (
                <div>
                  <h3 className="font-semibold text-sm sm:text-base text-zinc-200">Matérias concluídas</h3>
                  <ul className="mt-3 divide-y divide-white/5 rounded-xl overflow-hidden border border-white/10">
                    {filteredConcluidas.map((m, i) => (
                      <li key={i} className="px-4 py-3 flex items-center justify-between bg-zinc-900/40">
                        <span className="text-zinc-100 text-sm sm:text-base">{m.nome}</span>
                        <span className="text-zinc-400 text-xs sm:text-sm">{m.creditos}h</span>
                      </li>
                    ))}
                    {filteredConcluidas.length === 0 && (
                      <li className="px-4 py-6 text-center text-zinc-400 text-sm">Nenhuma matéria encontrada.</li>
                    )}
                  </ul>
                </div>
              )}

              {tab === "cursando" && (
                <div>
                  <h3 className="font-semibold text-sm sm:text-base text-zinc-200">Matérias em andamento</h3>
                  <ul className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                    {filteredCursando.map((m, i) => {
                      const pct = Math.max(0, Math.min(100, Number(m.progresso ?? 0)));
                      return (
                        <li key={i} className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3">
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-100 text-sm sm:text-base">{m.nome}</span>
                            <span className="text-zinc-300 text-xs sm:text-sm">{m.creditos}h • {pct}%</span>
                          </div>
                          <div className="mt-2 h-2 rounded bg-white/10" aria-label={`Progresso em ${m.nome}: ${pct}%`}>
                            <div className="h-full rounded bg-emerald-400" style={{ width: `${pct}%` }}></div>
                          </div>
                        </li>
                      );
                    })}
                    {filteredCursando.length === 0 && (
                      <li className="rounded-xl border border-white/10 bg-black/20 px-4 py-6 text-center text-zinc-400 text-sm col-span-full">Nenhuma matéria encontrada.</li>
                    )}
                  </ul>
                </div>
              )}

              {tab === "acursar" && (
                <div>
                  <h3 className="font-semibold text-sm sm:text-base text-zinc-200">Matérias a cursar</h3>
                  <ul className="mt-3 divide-y divide-white/5 rounded-xl overflow-hidden border border-white/10">
                    {filteredACursar.map((m, i) => (
                      <li key={i} className="px-4 py-3 flex items-center justify-between bg-zinc-900/40">
                        <span className="text-zinc-100 text-sm sm:text-base">{m.nome}</span>
                        <span className="text-zinc-400 text-xs sm:text-sm">{m.creditos}h</span>
                      </li>
                    ))}
                    {filteredACursar.length === 0 && (
                      <li className="px-4 py-6 text-center text-zinc-400 text-sm">Nenhuma matéria encontrada.</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Recent activity */}
          <div className="rounded-2xl bg-zinc-900/60 border border-white/10 overflow-hidden">
            <div className="px-4 sm:px-5 py-2.5 sm:py-3 border-b border-white/10 flex items-center justify-between">
              <h3 className="font-semibold text-sm sm:text-base">Atividades Recentes</h3>
              <button className="text-[11px] sm:text-xs px-3 py-1 rounded-lg border border-white/10 hover:bg-white/5">Ver tudo</button>
            </div>
            <div className="divide-y divide-white/5">
              {["Atualização do perfil", "Nova tarefa criada", "Projeto arquivado"].map((item, idx) => (
                <div key={idx} className="px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm flex items-center justify-between">
                  <span className="text-zinc-300">{item}</span>
                  <span className="text-zinc-500">há {idx + 1}d</span>
                </div>
              ))}
            </div>
          </div>
            </>
          )}

          {section === "requeridas" && (
            <div className="space-y-4">
              <div className="rounded-2xl bg-zinc-900/60 border border-white/10 p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold">Pesquisar matérias requeridas</h2>
                <p className="text-zinc-300 mt-1 text-sm sm:text-base">Encontre rapidamente as matérias que ainda precisam ser cursadas.</p>
                <div className="mt-4 flex items-center gap-2">
                  <input
                    value={requiredSearch}
                    onChange={(e) => setRequiredSearch(e.target.value)}
                    placeholder="Buscar matéria requerida"
                    className="w-full max-w-lg rounded-md px-3 py-2 bg-black/40 text-white border border-white/10 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                  />
                  {requiredSearch && (
                    <button onClick={() => setRequiredSearch("")} className="text-xs px-3 py-2 rounded-md border border-white/10 hover:bg-white/5">Limpar</button>
                  )}
                </div>
              </div>

              <div className="rounded-2xl bg-zinc-900/60 border border-white/10 overflow-hidden">
                <div className="px-4 sm:px-5 py-2.5 sm:py-3 border-b border-white/10 flex items-center justify-between">
                  <h3 className="font-semibold text-sm sm:text-base">Resultados ({filteredRequired.length})</h3>
                </div>
                <ul className="divide-y divide-white/5">
                  {filteredRequired.map((m, i) => (
                    <li key={i} className="px-4 sm:px-5 py-3 flex items-center justify-between">
                      <span className="text-zinc-100 text-sm sm:text-base">{m.nome}</span>
                      <span className="text-zinc-400 text-xs sm:text-sm">{m.creditos}h</span>
                    </li>
                  ))}
                  {filteredRequired.length === 0 && (
                    <li className="px-4 sm:px-5 py-6 text-center text-zinc-400 text-sm">Nenhuma matéria encontrada.</li>
                  )}
                </ul>
              </div>
            </div>
          )}

          {section === "configuracoes" && (
            <div className="space-y-4">
              <div className="rounded-2xl bg-zinc-900/60 border border-white/10 p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold">Configurações</h2>
                <p className="text-zinc-300 mt-1 text-sm sm:text-base">Gerencie sua conta, preferências e segurança.</p>
              </div>

              {/* Perfil */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl bg-zinc-900/60 border border-white/10 p-4 sm:p-6">
                  <h3 className="font-semibold">Perfil</h3>
                  <div className="mt-4 space-y-3">
                    <input
                      className="w-full rounded-md px-3 py-2 bg-black/40 text-white border border-white/10 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                      placeholder="Nome"
                      value={profile.nome}
                      onChange={(e) => setProfile((p) => ({ ...p, nome: e.target.value }))}
                    />
                    <input
                      className="w-full rounded-md px-3 py-2 bg-black/40 text-white border border-white/10 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                      placeholder="E-mail"
                      value={profile.email}
                      onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                    />
                    <input
                      className="w-full rounded-md px-3 py-2 bg-black/40 text-white border border-white/10 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                      placeholder="Curso"
                      value={profile.curso}
                      onChange={(e) => setProfile((p) => ({ ...p, curso: e.target.value }))}
                    />
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      className="px-3 py-2 rounded-md bg-emerald-500 text-black font-semibold"
                      onClick={() => {
                        try {
                          localStorage.setItem("profile", JSON.stringify(profile));
                        } catch {}
                      }}
                    >
                      Salvar
                    </button>
                    <button className="px-3 py-2 rounded-md border border-white/10 hover:bg-white/5">Cancelar</button>
                  </div>
                </div>

                {/* Preferências */}
                <div className="rounded-2xl bg-zinc-900/60 border border-white/10 p-4 sm:p-6">
                  <h3 className="font-semibold">Preferências</h3>
                  <div className="mt-4 space-y-3 text-sm">
                    <label className="block">Tema</label>
                    <div className="flex items-center gap-3">
                      <button className="px-3 py-1.5 rounded-md border border-white/10 hover:bg-white/5" onClick={() => { localStorage.setItem("theme", "light"); document.documentElement.classList.remove("dark"); document.documentElement.classList.add("light"); }}>Claro</button>
                      <button className="px-3 py-1.5 rounded-md border border-white/10 hover:bg-white/5" onClick={() => { localStorage.setItem("theme", "dark"); document.documentElement.classList.remove("light"); document.documentElement.classList.add("dark"); }}>Escuro</button>
                    </div>

                    <label className="block mt-4">Notificações</label>
                    <div className="flex items-center gap-4">
                      <label className="inline-flex items-center gap-2 text-zinc-300">
                        <input type="checkbox" className="accent-emerald-500" defaultChecked /> E-mail
                      </label>
                      <label className="inline-flex items-center gap-2 text-zinc-300">
                        <input type="checkbox" className="accent-emerald-500" /> Push
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Segurança */}
              <div className="rounded-2xl bg-zinc-900/60 border border-white/10 p-4 sm:p-6">
                <h3 className="font-semibold">Segurança</h3>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input className="rounded-md px-3 py-2 bg-black/40 text-white border border-white/10 focus:ring-2 focus:ring-emerald-500 outline-none text-sm" placeholder="Senha atual" type="password" />
                  <input className="rounded-md px-3 py-2 bg-black/40 text-white border border-white/10 focus:ring-2 focus:ring-emerald-500 outline-none text-sm" placeholder="Nova senha" type="password" />
                  <input className="rounded-md px-3 py-2 bg-black/40 text-white border border-white/10 focus:ring-2 focus:ring-emerald-500 outline-none text-sm" placeholder="Confirmar nova senha" type="password" />
                </div>
                <div className="mt-4">
                  <button className="px-3 py-2 rounded-md bg-emerald-500 text-black font-semibold">Atualizar senha</button>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
