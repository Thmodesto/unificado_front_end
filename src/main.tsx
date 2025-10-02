// Arquivo de entrada da aplicação (client). Responsável por inicializar o React,
// configurar o React Router e renderizar as páginas.
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./index.css";

// Páginas principais da aplicação
import HomePage from "./home/index.tsx";
import LoginPage from "@/pages/login/index.tsx";
import RegisterPage from "@/pages/register/index.tsx";
import DashboardPage from "@/pages/Dashboard/index.tsx";

// Busca o elemento root no HTML (index.html)
const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      {/*
        BrowserRouter fornece o contexto de rotas para toda a aplicação.
        Dentro de Routes definimos o mapeamento path -> componente.
      */}
      <BrowserRouter>
        <Routes>
          {/* Rota da Home (landing page) */}
          <Route path="/" element={<HomePage />} />
          {/* Rota de Login */}
          <Route path="/login" element={<LoginPage />} />
          {/* Rota de Registro */}
          <Route path="/register" element={<RegisterPage />} />
          {/* Rota do Dashboard (após o login) */}
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  );
}
