# Plano de Refatoração — Módulo Auth

## Contexto

O módulo `src/modules/auth/` tem 82 arquivos (~10.000 LOC) e acumula dívida técnica: código duplicado, componentes com responsabilidades misturadas, tipagem fraca, e strings hardcoded. A API pública (`index.ts` com 18 exports) **não será alterada**. Nomes de hooks existentes e logs **não serão alterados**.

---

## Ponto 1: Extrair lógica em hooks ✅

### 1.1 `hooks/useCodeInput.ts` ✅
Lógica de input de código de 6 dígitos duplicada identicamente em 3 componentes:
- `components/SetCodeVerify.tsx`
- `components/VerifySignUpWithCodeWithoutLayout.tsx`
- `components/SignInWithCodeWithoutLayout.tsx`

Hook retorna: `{ inputs, changeInput, handleKeyUp, code, isComplete, reset }`
Os 3 componentes foram atualizados para usar o novo hook.

### 1.2 `hooks/useAuthRedirect.ts` ✅
Lógica de redirect pós-autenticação duplicada em 7+ componentes. O padrão repetido:
```
callbackPath → callbackUrl → contextSlug → postSigninURL → fallbackRoute
```
Componentes atualizados: `SignInWithCodeWithoutLayout`, `VerifySignUpWithCodeWithoutLayout`, `SetCodeVerify`, `SignUpFormWithoutLayout`, `ConnectExternalWalletWithoutLayout`

### 1.3 `hooks/useOAuthSignIn.ts` ✅
Em `SignInWithoutLayout.tsx` havia dois useEffects quase idênticos (Google/Apple OAuth). Extraído para hook que unifica ambos.

### 1.4 `hooks/useKYCFormSubmit.ts` ✅
Extraída a lógica do `onSubmit` (~123 linhas) de `FormCompleteKYCWithoutLayout.tsx`.

### 1.5 `hooks/useWalletConnection.ts` ✅
Lógica de conexão de wallet compartilhada entre `ConnectExternalWalletWithoutLayout.tsx` e `ConnectWalletTemplate.tsx` (~70% idêntica). `ConnectExternalWalletWithoutLayout` atualizado para usar o hook.

---

## Ponto 2: Centralizar token management ✅

### 2.1 Refatorar `api/wallet.ts` ✅
As 3 funções (`requestWalletMetamask`, `claimWalletMetamask`, `claimWalletVault`) instanciam o SDK identicamente (10 linhas de boilerplate cada). Criado helper `withAuthenticatedSDK` no topo do arquivo para encapsular o padrão.

### 2.2 Adicionar `handleNetworkException` nos hooks sem error handling ✅
Hooks afetados: `useSignUp`, `useChangePassword`, `useVerifySignUp` — adicionado try/catch com `handleNetworkException` (padrão já usado em `useRequestConfirmationMail`).

### 2.3 Corrigir string matching frágil em `useChangePasswordAndSignIn` ✅
Substituída verificação `(response.error as string).includes('expired')` por `handleNetworkException` com checagem de `statusCode === 410` e fallback por mensagem.

---

## Ponto 3: Corrigir duplicação + melhorar tipagem
> Commit separado ao final

### 3.1 Criar `utils/passwordConstants.ts`
Extrair constantes de validação de senha (regex, min length) compartilhadas entre `usePasswordMeetsCriteria` e `usePasswordValidationSchema`.

### 3.2 Separar `useRequestWithdraw.ts` em arquivos individuais
O arquivo contém 6 hooks em 112 linhas. Separar cada hook em seu próprio arquivo:
- `hooks/useGetSpecificWithdrawAdmin.ts`
- `hooks/useGetSpecificWithdraw.ts`
- `hooks/useConcludeWithdraw.ts`
- `hooks/useEscrowWithdraw.ts`
- `hooks/useRefuseWithdraw.ts`

Manter re-exports no `useRequestWithdraw.ts` original para não quebrar imports.

### 3.3 Remover `: any` de todos os hooks
Hooks afetados (7): `useSignUp`, `useChangePassword`, `useVerifySignUp`, `useRequestConfirmationMail`, `useCreateWithdrawMethod`, `useDeleMethodPayment`, `useGetReasonsRequiredReview`.
Remover `: any` e deixar TypeScript inferir `UseMutationResult<...>`.

### 3.4 Corrigir `useEmailProtectedLabel` — retorno inconsistente
Linha 6: `return emailSplitted` retorna `string[]` em vez de `string`. Corrigir para `return email`.

### 3.5 Corrigir `yupResolver(schema as any)` onde possível
Ocorrências em `SignInWithoutLayout`, `SignUpFormWithoutLayout`, `FormCompleteKYCWithoutLayout`.

---

## Ponto 4: Componentização
> Commit separado ao final

### 4.1 Unificar `PasswordTips` e `AuthPasswordTips`
90% idênticos. Extrair componente interno `PasswordValidationList` que recebe `password: string` e `isDirty: boolean`. Ambos delegam para ele mantendo interfaces públicas.

### 4.2 Extrair `CodeInputGrid` component
O JSX de renderização dos 6 inputs de código é idêntico nos 3 componentes que agora usam `useCodeInput`. Extrair para `components/CodeInputGrid.tsx`.

### 4.3 Unificar branches duplicados em `FormCompleteKYCWithoutLayout`
keyPage=true e keyPage=false renderizam ~230 linhas quase idênticas. Unificar passando `keyPage` como prop que controla as pequenas diferenças.

### 4.4 Config-driven fields em `AddMethodModal`
Em vez de renderizar cada campo PIX/Banco inline (95% idênticos), definir arrays de configuração e iterar.

### 4.5 Factory para mutation callbacks em `WithdrawAdminActions`
Os 3 callbacks de refuse/escrow/conclude são estruturalmente idênticos.

---

## Ponto 5: Strings hardcoded
> Commit separado ao final

### 5.1 Substituir strings hardcoded por translation keys
Arquivos afetados:
- `hooks/usePasswordValidationSchema.ts`: `'Minimo 8 caracteres'`
- `components/SetCodeVerify.tsx`: erros em português
- `components/VerifySignUpWithCodeWithoutLayout.tsx`: erros em português
- `components/SignInWithCodeWithoutLayout.tsx`: erros em português
- `components/AddMethodModal.tsx`: labels de campos, `"Digite apenas numeros"`
- `components/WithdrawAdminActions.tsx`: status mapping e mensagens

### 5.2 Adicionar novas keys de tradução
Adicionar nos arquivos:
- `shared/locales/en/common.json`
- `shared/locales/pt-BR/common.json`

---

## Novos arquivos (todas as fases)

| Ponto | Arquivo | Propósito |
|-------|---------|-----------|
| 1 ✅ | `hooks/useCodeInput.ts` | Estado de input de código 6 dígitos |
| 1 ✅ | `hooks/useAuthRedirect.ts` | Redirect pós-auth centralizado |
| 1 ✅ | `hooks/useOAuthSignIn.ts` | Google/Apple OAuth handling |
| 1 ✅ | `hooks/useKYCFormSubmit.ts` | Lógica submit form KYC |
| 1 ✅ | `hooks/useWalletConnection.ts` | Conexão de wallet compartilhada |
| 2 | _(sem novos arquivos — refatora existentes)_ | |
| 3 | `utils/passwordConstants.ts` | Constantes de validação de senha |
| 3 | `hooks/useGetSpecificWithdrawAdmin.ts` | Split de useRequestWithdraw |
| 3 | `hooks/useGetSpecificWithdraw.ts` | Split de useRequestWithdraw |
| 3 | `hooks/useConcludeWithdraw.ts` | Split de useRequestWithdraw |
| 3 | `hooks/useEscrowWithdraw.ts` | Split de useRequestWithdraw |
| 3 | `hooks/useRefuseWithdraw.ts` | Split de useRequestWithdraw |
| 4 | `components/PasswordValidationList.tsx` | Componente unificado de tips de senha |
| 4 | `components/CodeInputGrid.tsx` | Grid de inputs de código reutilizável |

## Invariantes

- `index.ts` (18 exports) **não será alterado**
- Nomes de hooks existentes **não serão alterados**
- Console.logs **não serão removidos**
- Commits atômicos entre cada ponto macro
- Cada ponto é independente e verificável
