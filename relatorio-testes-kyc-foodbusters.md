# Relatório de Testes — Fluxo Login + KYC (Foodbusters)

**Data:** 12/03/2026
**Ambiente:** localhost:3000
**Conta testada:** fernando.pascoal+food20@w3block.io

---

## Resumo Executivo

O fluxo de Login → KYC → Confirmação foi testado de ponta a ponta. Os **timers de redirect individuais são excelentes (sub-2ms)**, porém existe um **bug crítico** na rota `/auth/completeSignup/connectExternalWallet` que causa um **spinner infinito (+25 segundos)** após a confirmação do KYC, impedindo o usuário de completar o fluxo naturalmente.

---

## Bug 1 — 🔴 CRÍTICO: Spinner infinito em `connectExternalWallet`

### Descrição
Após confirmar o KYC em `/auth/complete-kyc/confirmation`, o usuário é redirecionado para `/auth/completeSignup/connectExternalWallet?callbackUrl=%2Fwallet`. Nessa página, um spinner de loading aparece e **nunca resolve**. Após +25 segundos:
- Apenas 1 request de rede é feita: `GET /api/auth/session` (200 OK)
- Nenhum log no console do navegador
- Nenhuma outra requisição de rede é disparada
- Ao forçar reload da rota, exibe **"Empresa não encontrada"** e logo quebrado

Apesar disso, o KYC **foi salvo com sucesso** — ao navegar manualmente para `/`, o sistema reconhece o usuário como logado e com KYC completo.

### Onde investigar
- Arquivo: procurar pelo componente que renderiza a rota `connectExternalWallet` (provavelmente em `src/modules/auth/` ou `pages/auth/completeSignup/connectExternalWallet`)
- O componente provavelmente espera uma condição (como dados de wallet ou tenant) que nunca é satisfeita em ambiente local
- A request para `https://pixwayid.w3block.io/public-tenant/by-hostname?hostname=foodbusters.com.br` fica pendente (pode ser CORS ou DNS issue em localhost)

### Solução sugerida
1. **Verificar se a rota `connectExternalWallet` é necessária para este tenant.** Se a funcionalidade de wallet externa não é usada pelo Foodbusters, o fluxo deveria pular esta etapa automaticamente.
2. **Adicionar timeout/fallback:** Se após X segundos a condição de wallet não for satisfeita, redirecionar automaticamente para o `callbackUrl` (`/wallet`).
3. **Verificar a lógica condicional** do componente — provavelmente há um `useEffect` que verifica se o usuário precisa conectar uma wallet externa. Se não precisa, deveria fazer o redirect imediato para o callbackUrl.
4. **Adicionar log de timer** nesta rota (como já existe no `SignInWithoutLayout` e `OnboardProvider`) para rastrear onde exatamente o fluxo trava.

Exemplo de código para investigar:
```typescript
// Procurar algo como:
useEffect(() => {
  // Se este check nunca resolve true, o redirect nunca acontece
  if (shouldConnectWallet === false) {
    router.push(callbackUrl || '/wallet');
  }
}, [shouldConnectWallet]);

// Possível fix — adicionar fallback com timeout:
useEffect(() => {
  const timeout = setTimeout(() => {
    if (!walletConnected) {
      console.warn('[AuthFlow] connectExternalWallet timeout - redirecting to callbackUrl');
      router.push(callbackUrl || '/wallet');
    }
  }, 5000); // 5s timeout
  return () => clearTimeout(timeout);
}, []);
```

---

## Bug 2 — 🟡 MÉDIO: Erro React Controlled/Uncontrolled Input

### Descrição
No formulário de KYC (`/auth/complete-kyc`), o console exibe:
```
A component is changing an uncontrolled input to be controlled. This is likely caused by the value changing from undefined to a defined value.
```

Isso ocorre no campo de telefone quando o componente `InputPhone` muda de uncontrolled para controlled.

### Onde investigar
- Componente: `InputPhone` (provavelmente em `src/modules/auth/components/` ou `src/shared/components/`)
- O `value` do input começa como `undefined` e depois recebe um valor string

### Solução sugerida
Garantir que o valor inicial do input nunca seja `undefined`. Inicializar com string vazia:

```typescript
// ❌ Errado — causa o warning
const [phone, setPhone] = useState(); // undefined inicial
// ou
<input value={formData.phone} /> // formData.phone pode ser undefined

// ✅ Correto
const [phone, setPhone] = useState(''); // string vazia inicial
// ou
<input value={formData.phone ?? ''} /> // fallback para string vazia
```

Se estiver usando React Hook Form, verificar o `defaultValues`:
```typescript
// ✅ Garantir que defaultValues nunca tenha undefined
useForm({
  defaultValues: {
    phone: '', // não deixar undefined
  }
});
```

---

## Bug 3 — 🟡 MÉDIO: HTML inválido — `<p>` aninhado dentro de `<p>`

### Descrição
O console exibe erro de hydration:
```
In HTML, <p> cannot be a descendant of <p>.
This will cause a hydration error.
```

O stack trace aponta para:
```
FormTemplate > SmartInputsController > InputPhone > LabelWithRequired > <p> > InputStatus > <p>
```

O componente `InputPhone` renderiza um `<p>` para o label/status, e dentro dele há outro `<p>` do `InputStatus`.

### Onde investigar
- Componente: `InputPhone` → renderiza `<p className="pw-mt-[5px] pw-h-[16px]">`
- Dentro dele: `InputStatus` → renderiza `<p className="pw-flex pw-items-center pw-gap-x-1">`

### Solução sugerida
Trocar um dos `<p>` por `<div>` ou `<span>`:

```tsx
// ❌ Errado — <p> dentro de <p>
<p className="pw-mt-[5px] pw-h-[16px]">
  <InputStatus invalid={false}>
    <p className="pw-flex pw-items-center pw-gap-x-1">Ok</p>  
  </InputStatus>
</p>

// ✅ Correto — usar <div> ou <span> no wrapper externo
<div className="pw-mt-[5px] pw-h-[16px]">
  <InputStatus invalid={false}>
    <p className="pw-flex pw-items-center pw-gap-x-1">Ok</p>
  </InputStatus>
</div>

// ✅ OU trocar o <p> interno do InputStatus por <span>
<p className="pw-mt-[5px] pw-h-[16px]">
  <InputStatus invalid={false}>
    <span className="pw-flex pw-items-center pw-gap-x-1">Ok</span>
  </InputStatus>
</p>
```

**Recomendação:** Trocar o `<p>` do `InputStatus` por `<span>` em todos os lugares, pois o InputStatus é reutilizável e pode ser renderizado dentro de qualquer contexto.

---

## Bug 4 — 🟢 BAIXO: Código de país não vem pré-selecionado

### Descrição
O campo de telefone celular no KYC exige que o usuário selecione o código de país antes de digitar o número. Se o número for digitado sem selecionar o país, a validação rejeita com "Insira um telefone válido", mesmo que o número seja válido.

O dropdown inicia vazio (sem país selecionado).

### Onde investigar
- Componente `InputPhone` ou o wrapper que configura o combobox de código de país
- Verificar se existe lógica de detecção de locale/país padrão

### Solução sugerida
Pré-selecionar "Brasil (+55)" como padrão, já que o tenant é brasileiro:

```typescript
// Opção 1: Usar o locale do tenant
const defaultCountryCode = tenantConfig?.defaultCountry || 'BR';

// Opção 2: Detectar pelo navegador
const browserLocale = navigator.language; // "pt-BR"
const defaultCountry = browserLocale.split('-')[1] || 'BR';

// Aplicar no combobox
<CountryCodeSelect 
  defaultValue={defaultCountryCode}
  // ...
/>
```

---

## Análise de Performance dos Redirects

### Timers coletados do console (`[AuthFlow]`)

| Operação | Timestamp | Duração | Avaliação |
|----------|-----------|---------|-----------|
| `SignInWithoutLayout.useEffect.redirect` (1ª) | 20:12:51.115Z | 2.50ms | ✅ Excelente |
| `SignInWithoutLayout.useEffect.redirect` (2ª) | 20:12:51.188Z | 2.20ms | ✅ Excelente |
| `SignInWithoutLayout.useEffect.redirect` (3ª) | 20:12:51.204Z | 2.30ms | ✅ Excelente |
| `OnboardProvider.useEffect.redirect` (1ª) | 20:17:52.890Z | 2.10ms | ✅ Excelente |
| `OnboardProvider.useEffect.redirect` (2ª) | 20:17:54.371Z | 0.90ms | ✅ Excelente |
| `OnboardProvider.checkWhite` | 20:17:54.373Z | 0.90ms | ✅ Excelente |
| `OnboardProvider.useEffect.redirect` (3ª) | 20:17:54.980Z | 1.10ms | ✅ Excelente |

### Observações de Performance

1. **Timers individuais de redirect: ✅ Todos sub-3ms** — Excelente performance. A lógica de decisão de redirect é muito rápida.

2. **Gap entre 1ª e 2ª execução do OnboardProvider: ~1.5s** (de 20:17:52 para 20:17:54) — Aceitável. Este intervalo provavelmente é causado pela espera dos dados do usuário/sessão via API.

3. **O `SignInWithoutLayout` executou 3 vezes em ~90ms** — Indica re-renders, mas são rápidos e não impactam UX. Pode ser otimizado com `useMemo` ou condições mais específicas no `useEffect`.

4. **Gargalo real: rota `connectExternalWallet`** — Não há timers nessa rota. O loading infinito (+25s) é o problema crítico. **Recomendação: adicionar `authFlowTimer` nessa rota** para rastrear onde trava.

### Sugestão de instrumentação para `connectExternalWallet`

```typescript
// Adicionar no componente da rota connectExternalWallet:
import { authFlowTimer } from '../utils/authFlowTimer';

useEffect(() => {
  const timer = authFlowTimer('ConnectExternalWallet.useEffect.init');
  
  // Log das condições
  console.log('[AuthFlow] connectExternalWallet conditions:', {
    hasUser: !!user,
    hasWallet: !!wallet,
    callbackUrl,
    shouldSkip: !tenantRequiresExternalWallet,
  });
  
  timer.end();
}, [user, wallet]);
```

---

## Checklist de Correções (Prioridade)

- [ ] 🔴 **Bug 1:** Corrigir spinner infinito em `connectExternalWallet` — adicionar skip/timeout quando wallet externa não é necessária
- [ ] 🟡 **Bug 2:** Corrigir controlled/uncontrolled input no `InputPhone` — inicializar valor com string vazia
- [ ] 🟡 **Bug 3:** Corrigir `<p>` aninhado — trocar para `<div>` ou `<span>` no `InputStatus`
- [ ] 🟢 **Bug 4:** Pré-selecionar Brasil (+55) no combobox de código de país
- [ ] 📊 **Instrumentação:** Adicionar `authFlowTimer` na rota `connectExternalWallet`
