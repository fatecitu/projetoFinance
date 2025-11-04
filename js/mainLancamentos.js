import { verificaAutenticacao } from "./modules/auth.js";
import { logoutUi } from "./ui/auth.js";
import { popularCategorias, carregarLancamentos } from "./ui/lancamentosUi.js"

document.addEventListener("DOMContentLoaded", () => {
  if (!verificaAutenticacao()) return;
  logoutUi()
  popularCategorias();
  carregarLancamentos();
});