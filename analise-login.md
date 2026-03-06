# Análise de Bugs - Food Busters (Login + KYC)

**Data da análise:** 03/05/2026  
**Aplicação:** Food Busters - localhost:3000  
**Framework:** Next.js (App Router) com React, react-hook-form + yup, @w3block/w3block-ui-sdk  

---

## Resumo Executivo

A aplicação apresenta diversos problemas nos fluxos de Login e KYC (Know Your Customer), incluindo telas em branco durante transições ("piscar"), loading infinito, erros no console do navegador, validação prematura de formulários e mensagens de erro exibidas antes de qualquer interação do usuário.

---

## 1. Tela "Piscando" / Loading Infinito nas Transições

### Sintoma
Ao submeter o formulário de login, a tela fica completamente **branca com apenas um spinner** no canto superior. O header, footer e toda a estrutura de layout desaparecem. Em alguns casos, essa tela branca persiste **indefinidamente** (loading infinito).

### Comportamento Observado
- **Login → KYC:** Ao clicar em "Fazer login", a tela inteira fica branca com um spinner circular azul. O layout (header com logo, navegação) desaparece completamente.
- **KYC → Próximo passo:** Ao submeter o formulário KYC, o mesmo "piscar" ocorre antes do redirecionamento para a próxima etapa.
- **Loading infinito:** Em múltiplas tentativas, a transição login → KYC ficou presa no spinner infinitamente (mais de 2 minutos de espera sem carregamento).

### Causa Raiz

#### 1.1. Erro HTTP 503 nas requisições RSC (React Server Components)
As requisições RSC do Next.js para a rota `/auth/complete-kyc` retornam intermitentemente **HTTP 503 (Service Unavailable)**:

```
GET /auth/complete-kyc?_rsc=134zc → 503
GET /auth/complete-kyc?_rsc=1qrkk → 200 (quando funciona)
```

Quando o servidor retorna 503, o client-side do Next.js não consegue completar a navegação e fica preso no estado de loading indefinidamente.

#### 1.2. Ausência de fallback/error boundary no loading
O componente de loading global da aplicação renderiza apenas um spinner sem:
- Timeout para exibir mensagem de erro
- Botão de "tentar novamente"
- Error boundary para capturar falhas de RSC

#### 1.3. Navegação client-side vs full page reload
A transição do login para o KYC usa `router.push()` do Next.js, que faz navegação client-side. Quando essa navegação falha (503), o usuário fica preso em uma tela branca sem feedback.

### Correção Sugerida
- Implementar **error boundary** ao redor do Spinner/loading que detecte falhas de carregamento
- Adicionar **timeout** (ex: 10s) no loading com opção de retry
- Verificar no servidor por que a rota `/auth/complete-kyc` retorna 503 intermitentemente (possível problema de compilação do dev server ou timeout de API externa)
- Considerar `router.refresh()` ou `window.location.href` como fallback quando a navegação client-side falha

---

## 2. Erros no Console do Navegador

### 2.1. MetamaskProvider - Missing Provider
```
Error: missing provider (argument="provider", value=undefined, code=INVALID_ARGUMENT, version=providers/5.8.0)
    at Logger.makeError (...)
    at new Web3Provider (...)
    at getProvider (MetamaskProviderUiSDK.tsx:97:35)
```

**Arquivo:** `src/modules/core/metamask/providers/MetamaskProviderUiSDK.tsx` (linha 97)

**Causa:** O `MetamaskProviderUiSDK` tenta instanciar um `Web3Provider` com `window.ethereum` que é `undefined` quando o Metamask não está instalado no navegador. O código não verifica a existência do provider antes de usá-lo.

**Correção sugerida:**
```typescript
// MetamaskProviderUiSDK.tsx - linha ~97
function getProvider() {
  if (typeof window === 'undefined' || !window.ethereum) {
    return null; // ou throw error controlado
  }
  return new Web3Provider(window.ethereum);
}
```

### 2.2. @emotion/react - Múltiplas Instâncias
```
Warning: You are loading @emotion/react when it is already loaded. 
Running multiple instances may cause problems.
```

**Causa:** A aplicação carrega duas versões/builds do `@emotion/react`, provavelmente uma do SDK (`@w3block/w3block-ui-sdk`) e outra da aplicação principal.

**Correção sugerida:**
- Verificar o `package.json` e garantir que `@emotion/react` seja uma `peerDependency` no SDK
- Usar `resolve.alias` no webpack/next.config para forçar uma única instância
- Verificar se o MUI (Material UI) e o SDK estão usando a mesma versão do @emotion

### 2.3. Múltiplas chamadas a `__nextjs_original-stack-frames`
Em cada carregamento de página, são feitas **8-10 chamadas POST** ao endpoint `/__nextjs_original-stack-frames`, indicando que múltiplos erros estão sendo lançados e o Next.js está tentando resolver os stack traces de cada um.

---

## 3. Validação Prematura nos Formulários

### 3.1. Formulário de Login (SignInWithoutLayout.tsx)

**Problema:** Os campos de e-mail e senha apresentam bordas vermelhas (estado de erro) assim que a página carrega, antes de qualquer interação do usuário.

**Causa no código:**
```typescript
// src/modules/auth/components/SignInWithoutLayout.tsx
useForm({
  defaultValues: { email: '', password: '', twoFactor: '', companyId },
  mode: 'onChange',  // ← PROBLEMA: valida imediatamente
  resolver: yupResolver(schema),
});
```

O `mode: 'onChange'` faz a validação rodar ao montar o componente. Como os campos começam vazios e são obrigatórios, o `formState.isValid` já inicia como `false`.

### 3.2. Formulário KYC (FormCompleteKYCWithoutLayout.tsx)

**Problema:** A mensagem **"Por favor, verifique os campos em vermelho."** aparece imediatamente ao carregar a página de KYC, antes de o usuário tocar em qualquer campo.

**Causa no código:**
```typescript
// src/modules/auth/components/FormCompleteKYCWithoutLayout.tsx
useForm({
  shouldUnregister: false,
  mode: 'onChange',  // ← PROBLEMA: valida imediatamente
  resolver: yupResolver(dynamicSchema),
});
```

**Condição que exibe a mensagem (FormTemplate.tsx):**
```typescript
// src/modules/shared/components/FormTemplate.tsx
// A mensagem aparece quando:
!keyPage && !dynamicMethods?.formState?.isValid
```

Como `formState.isValid` começa `false` (campos vazios) e `keyPage` é falsy, a mensagem é renderizada na montagem do componente.

### Correção sugerida para ambos:
```typescript
// Trocar mode para 'onTouched' ou 'onSubmit'
useForm({
  mode: 'onTouched',  // Valida só após o campo ser tocado
  resolver: yupResolver(schema),
});

// OU adicionar verificação de isSubmitted na condição de exibição do erro:
!keyPage && !dynamicMethods?.formState?.isValid && dynamicMethods?.formState?.isSubmitted
```

---

## 4. Botão de Login Habilitado Prematuramente

### Sintoma
O botão "Fazer login" fica habilitado quando o browser auto-preenche os campos, mas a validação do react-hook-form pode não reconhecer esses valores.

### Causa
O botão usa a condição:
```typescript
disabled: !methods.formState.isValid || isLoading
```

Porém, quando o browser faz autocomplete, o react-hook-form com `mode: 'onChange'` pode não detectar a mudança dos valores, causando inconsistência entre o estado visual e o estado do formulário.

### Correção sugerida
```typescript
disabled: !methods.formState.isValid || isLoading || !methods.formState.isDirty
```

---

## 5. Erros de Rede (Google Analytics 503)

As chamadas ao Google Analytics (`google-analytics.com/g/collect`) estão retornando **503**. Isso pode indicar:
- O tracking ID (G-J458DS0EV2) pode estar inválido ou desativado
- Bloqueio de rede no ambiente de desenvolvimento

Embora não afete a funcionalidade, gera ruído nos logs.

---

## Arquivos Afetados

| Arquivo | Problemas |
|---------|-----------|
| `src/modules/auth/components/SignInWithoutLayout.tsx` | mode:'onChange', validação prematura |
| `src/modules/auth/components/FormCompleteKYCWithoutLayout.tsx` | mode:'onChange', validação prematura |
| `src/modules/shared/components/FormTemplate.tsx` | Mensagem de erro sem checar isSubmitted |
| `src/modules/core/metamask/providers/MetamaskProviderUiSDK.tsx` | Erro "missing provider" sem Metamask |
| Loading/Spinner global | Sem timeout, sem error boundary, sem retry |

---

## Prioridade de Correção

1. **CRÍTICO:** Loading infinito / tela branca após login (503 + sem error boundary)
2. **ALTO:** Mensagem "verifique campos em vermelho" aparecendo ao carregar KYC
3. **ALTO:** Bordas vermelhas nos campos de login ao carregar a página
4. **MÉDIO:** Erro MetamaskProvider quando Metamask não está instalado
5. **BAIXO:** Warning de múltiplas instâncias do @emotion/react
6. **BAIXO:** Google Analytics retornando 503
