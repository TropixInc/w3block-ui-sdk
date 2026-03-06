# Correções Pendentes — Auth & KYC Module

## Como usar este arquivo

Cada seção contém:
- **Arquivo** e **linha(s)** exatas
- **Antes**: o código atual
- **Depois**: o código corrigido
- **Notas** quando necessário

Marque com `[x]` conforme for concluindo cada item.

---

## A. Strings Hardcoded (Ponto 5 do REFACTOR_AUTH.md)

### A.1 — SignInTemplate.tsx — Validação do schema

**Arquivo:** `src/modules/auth/templates/SignInTemplate.tsx`
**Linha:** 75

**Antes:**
```tsx
const schema = object().shape({
  email: string().required('Campo obrigatório').email('Email inválido'),
  password: passwordSchema,
});
```

**Depois:**
```tsx
const schema = object().shape({
  email: string()
    .required(translate('components>form>requiredFieldValidation'))
    .email(translate('shared>invalidEmail')),
  password: passwordSchema,
});
```

**Nota:** As chaves `components>form>requiredFieldValidation` e `shared>invalidEmail` já existem nos arquivos de tradução.

- [ ] Concluído

---

### A.2 — SignUpForm.tsx — Labels dos checkboxes

**Arquivo:** `src/modules/auth/components/SignUpForm.tsx`
**Linhas:** 179-196

**Antes:**
```tsx
<SignCheckbox
  name="acceptsTermsOfUse"
  label="Aceito os"
  keyTrans="companyAuth>signUp>acceptTermsOfUse"
  linkText="Termos de uso"
  redirectLink={termsRedirect}
  onChangeValue={setAcceptsTermsOfUse}
  value={acceptsTermsOfUse}
/>
<SignCheckbox
  name="acceptsPolicyTerms"
  keyTrans="companyAuth>signUp>acceptPrivacyPolicy"
  linkText="Política de Privacidade"
  label="Aceito os"
  redirectLink={privacyRedirect}
  onChangeValue={setAcceptsPolicyTerms}
  value={acceptsPolicyTerms}
/>
```

**Depois:**
```tsx
<SignCheckbox
  name="acceptsTermsOfUse"
  label={translate('companyAuth>signUp>iAccept')}
  keyTrans="companyAuth>signUp>acceptTermsOfUse"
  linkText={translate('companyAuth>signUp>termsOfUse')}
  redirectLink={termsRedirect}
  onChangeValue={setAcceptsTermsOfUse}
  value={acceptsTermsOfUse}
/>
<SignCheckbox
  name="acceptsPolicyTerms"
  keyTrans="companyAuth>signUp>acceptPrivacyPolicy"
  linkText={translate('companyAuth>signUp>privacyPolicy')}
  label={translate('companyAuth>signUp>iAccept')}
  redirectLink={privacyRedirect}
  onChangeValue={setAcceptsPolicyTerms}
  value={acceptsPolicyTerms}
/>
```

**Nota:** Os props `label` e `linkText` do `SignCheckbox` são usados como conteúdo fallback dentro de um `<Trans>` component. O `keyTrans` já faz i18n, mas os fallbacks devem também ser traduzidos. Será necessário verificar/criar as chaves `companyAuth>signUp>iAccept`, `companyAuth>signUp>termsOfUse` e `companyAuth>signUp>privacyPolicy` nos arquivos de tradução se ainda não existirem.

- [ ] Concluído

---

### A.3 — ConfirmationKycWithoutLayout.tsx — Checkbox "Aceito"/"Não Aceito"

**Arquivo:** `src/modules/auth/components/ConfirmationKycWithoutLayout.tsx`
**Linha:** 240

**Antes:**
```tsx
} else if (res?.type === 'checkbox') {
  if (typeof complexValue === 'boolean') {
    return complexValue ? 'Aceito' : 'Não Aceito';
  }
  return value;
}
```

**Depois:**
```tsx
} else if (res?.type === 'checkbox') {
  if (typeof complexValue === 'boolean') {
    return complexValue
      ? translate('auth>confirmationKyc>accepted')
      : translate('auth>confirmationKyc>notAccepted');
  }
  return value;
}
```

**Nota:** Criar as chaves `auth>confirmationKyc>accepted` ("Aceito") e `auth>confirmationKyc>notAccepted` ("Não Aceito") nos arquivos de tradução.

- [ ] Concluído

---

### A.4 — ConfirmationKycWithoutLayout.tsx — Separador de steps " de "

**Arquivo:** `src/modules/auth/components/ConfirmationKycWithoutLayout.tsx`
**Linha:** 197

**Antes:**
```tsx
{Object.keys(groupedInputs).length > 1
  ? res + ' de ' + Object.keys(groupedInputs).length
  : null}
```

**Depois:**
```tsx
{Object.keys(groupedInputs).length > 1
  ? translate('auth>confirmationKyc>stepOf', {
      current: res,
      total: Object.keys(groupedInputs).length,
    })
  : null}
```

**Nota:** Criar a chave `auth>confirmationKyc>stepOf` com valor `"{{current}} de {{total}}"` nos arquivos de tradução.

- [ ] Concluído

---

### A.5 — ConfirmationKycWithoutLayout.tsx — Labels de documentos

**Arquivo:** `src/modules/auth/components/ConfirmationKycWithoutLayout.tsx`
**Linhas:** 220-224

**Antes:**
```tsx
return (complexValue as any)?.docType === 'cpf'
  ? `CPF - ${(complexValue as any)?.document}`
  : (complexValue as any)?.docType === 'rg'
  ? `RG - ${(complexValue as any)?.document}`
  : `Passaporte - ${(complexValue as any)?.document}`;
```

**Depois:**
```tsx
const docLabels: Record<string, string> = {
  cpf: translate('auth>confirmationKyc>docType>cpf'),
  rg: translate('auth>confirmationKyc>docType>rg'),
};
const docType = (complexValue as any)?.docType;
const docNumber = (complexValue as any)?.document;
const label = docLabels[docType] ?? translate('auth>confirmationKyc>docType>passport');
return `${label} - ${docNumber}`;
```

**Nota:** Criar as chaves:
- `auth>confirmationKyc>docType>cpf` → `"CPF"`
- `auth>confirmationKyc>docType>rg` → `"RG"`
- `auth>confirmationKyc>docType>passport` → `"Passaporte"`

- [ ] Concluído

---

## A.6-A.7 — Remover `as any` nos arquivos KYC

### A.6 — useKYCFormSubmit.ts

**Arquivo:** `src/modules/auth/hooks/useKYCFormSubmit.ts`

Os `as any` neste arquivo são consequência de interfaces tipadas como `any` nos parâmetros (`groupedInputs: Record<string, any>`, `tenantInputs: any`, `kycContext: any`, `dynamicMethods: any`). A correção completa requer criar interfaces tipadas para esses dados.

**Itens a corrigir:**

| Linha | Código | Correção sugerida |
|-------|--------|-------------------|
| 1 | `/* eslint-disable @typescript-eslint/no-explicit-any */` | Remover após corrigir os `any` |
| 15 | `groupedInputs: Record<string, any>` | Tipar com interface adequada dos tenant inputs |
| 16 | `tenantInputs: any` | Tipar com `TenantInputsResponse` ou tipo do SDK |
| 17 | `kycContext: any` | Tipar com `TenantContextResponse` ou tipo do SDK |
| 29 | `dynamicMethods: any` | Tipar com `UseFormReturn` do react-hook-form |
| 60 | `(kycContext?.data as any)?.data?.screenConfig` | Corrigir tipagem de `kycContext` |
| 65 | `(item: any) => item` | Tipar como `(item: unknown) => item` |
| 70 | `(val: any) => (val.type as any) === 'commerce_product'` | Usar tipo do input |
| 77 | `(val: any) => (val.type as any) === 'commerce_product'` | Idem |
| 89-90 | `(val: any) => (val?.data as any)?.approver` | Usar tipo do input |
| 93 | `(val: any) => val.inputId === inputApprover?.id` | Tipar corretamente |
| 97 | `(kycContext?.data as any)?.requireSpecificApprover` | Corrigir tipagem |
| 104 | `(approver as any)?.value?.userId` | Tipar corretamente |
| 131 | `(data: { data: any })` | Tipar com tipo de resposta correto |
| 142 | `(data.data as any).id` | Idem |

**Nota:** Este é o item de maior esforço. Requer investigar os tipos reais retornados pelo SDK (`@w3block/sdk-id`) para criar interfaces corretas. Considere tipar incrementalmente, removendo os `as any` mais simples primeiro.

- [ ] Concluído

---

### A.7 — ConfirmationKycWithoutLayout.tsx

**Arquivo:** `src/modules/auth/components/ConfirmationKycWithoutLayout.tsx`

| Linha | Código | Correção sugerida |
|-------|--------|-------------------|
| 1 | `/* eslint-disable @typescript-eslint/no-explicit-any */` | Remover após corrigir |
| 77 | `(data: { data: { id: any } })` | Tipar com tipo de resposta real |
| 94 | `(input: { type: DataTypesEnum; data: any })` | Usar tipo do SDK |
| 97 | `(input?.data as any)?.hidden` | Usar tipo correto de `InputDataDTO` |
| 104 | `(context?.data as any)?.data?.postKyc` | Tipar resposta do context |
| 109 | `(context?.data as any)?.data?.screenConfig?.postKycUrl` | Idem |
| 111 | `(context?.data as any)?.data?.screenConfig?.postKycUrl` | Idem |
| 118-119 | `(context?.data as any)?.data?.screenConfig?.postKycUrl` | Idem (duplicado no branch `skipWallet`) |
| 220-224 | `(complexValue as any)?.docType`, `?.document` | Criar interface `IdentificationDocValue` |
| 229-236 | `(complexValue as any)?.home`, `?.city`, etc. | Criar interface `LocationValue` |

- [ ] Concluído

---

### A.8 — SignInTemplate.tsx — yupResolver as any

**Arquivo:** `src/modules/auth/templates/SignInTemplate.tsx`
**Linha:** 87

**Antes:**
```tsx
resolver: yupResolver(schema as any),
```

**Depois:**
```tsx
resolver: yupResolver(schema),
```

**Nota:** Isso pode exigir ajustar a definição do `schema` para que os tipos do yup se alinhem com a interface `Form`. Se gerar erro de tipo, adicione o generic ao schema: `object<Form>().shape(...)` ou ajuste a versão do `@hookform/resolvers`.

- [ ] Concluído

---

## B. Melhorias Adicionais

### B.1 — Remover console.logs de debug

#### B.1.1 — useSignUp.ts

**Arquivo:** `src/modules/auth/hooks/useSignUp.ts`
**Linhas:** 32-37

**Antes:**
```tsx
const ut = utms;
if (ut) {
  console.log('utm found in signup:', ut);
} else {
  console.log('utm not found');
}
```

**Depois:**
```tsx
const ut = utms;
```

- [ ] Concluído

#### B.1.2 — CompleteKYCTemplateSDK.tsx

**Arquivo:** `src/modules/auth/templates/CompleteKYCTemplateSDK.tsx`
**Linha:** 78

**Antes:**
```tsx
useEffect(() => {
  if (router?.query?.callbackUrl === '/null') {
    console.log(router?.query, "query")
    router.pushConnect(PixwayAppRoutes.COMPLETE_KYC, {...router?.query, callbackUrl: '/wallet'})
  }
}, [router?.query])
```

**Depois:**
```tsx
useEffect(() => {
  if (router?.query?.callbackUrl === '/null') {
    router.pushConnect(PixwayAppRoutes.COMPLETE_KYC, {...router?.query, callbackUrl: '/wallet'})
  }
}, [router?.query])
```

- [ ] Concluído

#### B.1.3 — CompleteProfileCustomTemplate.tsx

**Arquivo:** `src/modules/auth/templates/CompleteProfileCustomTemplate.tsx`
**Linhas:** 114-117

**Antes:**
```tsx
.catch((e) => {
  // eslint-disable-next-line no-console
  console.log(e);
});
```

**Depois:**
```tsx
.catch(() => {
  // silently handled
});
```

- [ ] Concluído

#### B.1.4 — AddMethodModal.tsx

**Arquivo:** `src/modules/auth/components/AddMethodModal.tsx`
**Linhas:** 97-99

**Antes:**
```tsx
try {
  mutate(payload);
} catch (err) {
  console.log((err as any).message);
}
```

**Depois:**
```tsx
mutate(payload);
```

**Nota:** `mutate` de react-query não lança exceções síncronas; erros são tratados via `onError`. O try/catch inteiro é desnecessário.

- [ ] Concluído

#### B.1.5 — DeleteMethodModal.tsx

**Arquivo:** `src/modules/auth/components/DeleteMethodModal.tsx`
**Linhas:** 21-25

**Antes:**
```tsx
const onDeleteMethod = (id: string) => {
  try {
    mutate(id);
  } catch (err) {
    console.log((err as any).message);
  }
};
```

**Depois:**
```tsx
const onDeleteMethod = (id: string) => {
  mutate(id);
};
```

**Nota:** Mesma situação do B.1.4 — `mutate` não lança exceções síncronas.

- [ ] Concluído

#### B.1.6 — OnboardProvider.tsx

**Arquivo:** `src/modules/shared/providers/OnboardProvider.tsx`
**Linhas:** 201, 204, 237, 249, 253, 257, 282

Remover todos os `console.log` de debug:

| Linha | Código | Ação |
|-------|--------|------|
| 201 | `console.log('refetch');` | Remover |
| 204 | `console.log('setfalse');` | Remover |
| 237 | `console.log('redirect');` | Remover |
| 249 | `console.log('concluded');` | Remover |
| 253 | `console.log('check else');` | Remover |
| 257 | `console.log('error');` | Remover |
| 282 | `console.log('trigg checkwhitelists');` | Remover |

Após remover todos, remover também o `/* eslint-disable no-console */` da linha 2.

- [ ] Concluído

---

### B.2 — Console.error em português → inglês

#### B.2.1 — useChangePassword.ts

**Arquivo:** `src/modules/auth/hooks/useChangePassword.ts`
**Linha:** 17

**Antes:** `console.error('Erro ao alterar senha:', error);`
**Depois:** `console.error('Error changing password:', error);`

- [ ] Concluído

#### B.2.2 — useRequestConfirmationMail.ts

**Arquivo:** `src/modules/auth/hooks/useRequestConfirmationMail.ts`
**Linha:** 43

**Antes:** `console.error('Erro ao solicitar e-mail de confirmação:', error);`
**Depois:** `console.error('Error requesting confirmation email:', error);`

- [ ] Concluído

#### B.2.3 — useVerifySignUp.ts

**Arquivo:** `src/modules/auth/hooks/useVerifySignUp.ts`
**Linha:** 25

**Antes:** `console.error('Erro ao verificar signup:', error);`
**Depois:** `console.error('Error verifying signup:', error);`

- [ ] Concluído

#### B.2.4 — useSignUp.ts

**Arquivo:** `src/modules/auth/hooks/useSignUp.ts`
**Linha:** 45

**Antes:** `console.error('Erro ao realizar signup:', error);`
**Depois:** `console.error('Error during signup:', error);`

- [ ] Concluído

---

### B.3 — Variável duplicada em useKYCFormSubmit.ts

**Arquivo:** `src/modules/auth/hooks/useKYCFormSubmit.ts`
**Linhas:** 54-55

**Antes:**
```tsx
const context = useContext(OnboardContext);
const contextOnboard = useContext(OnboardContext);
```

**Depois:**
```tsx
const contextOnboard = useContext(OnboardContext);
```

E na linha 149, trocar `context.refetchDocs()` por `contextOnboard.refetchDocs()`.

- [ ] Concluído

---

### B.4 — Branches duplicados em useKYCFormSubmit.ts

**Arquivo:** `src/modules/auth/hooks/useKYCFormSubmit.ts`
**Linhas:** 95-121

**Antes:**
```tsx
const value = () => {
  if (
    (kycContext?.data as any)?.requireSpecificApprover &&
    inputApprover &&
    approver
  ) {
    return {
      documents: docsToUse(),
      currentStep: parseInt(step as string),
      approverUserId: (approver as any)?.value?.userId ?? undefined,
      utmParams: utms ? { ...utms } : undefined,
      userContextId:
        userContextId ??
        (router?.query?.userContextId as string) ??
        undefined,
    };
  } else {
    return {
      documents: docsToUse(),
      currentStep: parseInt(step as string),
      utmParams: utms ? { ...utms } : undefined,
      userContextId:
        userContextId ??
        (router?.query?.userContextId as string) ??
        undefined,
    };
  }
};
```

**Depois:**
```tsx
const value = () => {
  const shouldSetApprover =
    (kycContext?.data as any)?.requireSpecificApprover &&
    inputApprover &&
    approver;

  return {
    documents: docsToUse(),
    currentStep: parseInt(step as string),
    ...(shouldSetApprover && {
      approverUserId: (approver as any)?.value?.userId ?? undefined,
    }),
    utmParams: utms ? { ...utms } : undefined,
    userContextId:
      userContextId ??
      (router?.query?.userContextId as string) ??
      undefined,
  };
};
```

- [ ] Concluído

---

### B.5 — eslint-disable excessivos

Estes devem ser removidos **após** as correções de tipagem (A.6, A.7) estarem completas:

| Arquivo | Linha | Disable | Remover quando |
|---------|-------|---------|---------------|
| `hooks/useKYCFormSubmit.ts` | 1 | `no-explicit-any` | Após A.6 |
| `components/ConfirmationKycWithoutLayout.tsx` | 1 | `no-explicit-any` | Após A.7 |
| `providers/OnboardProvider.tsx` | 2 | `no-console` | Após B.1.6 |
| `providers/OnboardProvider.tsx` | 3 | `react-hooks/exhaustive-deps` | Avaliar caso a caso |
| `providers/OnboardProvider.tsx` | 4 | `no-explicit-any` | Após tipar `theme: any` e outros |

- [ ] Concluído

---

### B.6 — Double polling em ConfirmationKycWithoutLayout.tsx

**Arquivo:** `src/modules/auth/components/ConfirmationKycWithoutLayout.tsx`
**Linhas:** 64-90

**Problema:** `useInterval` chama `validateOrderStatus()` a cada 3s. Dentro de `validateOrderStatus()`, há **outro** `setInterval` de 3s — duplicando o polling.

**Antes:**
```tsx
const [poolStatus, setPoolStatus] = useState(false);
useInterval(() => {
  if (poolStatus) {
    validateOrderStatus();
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, 3000);
const { mutate: getStatus } = useGetOrderByKyc();
const validateOrderStatus = () => {
  if (poolStatus) {
    const interval = setInterval(() => {
      getStatus(
        { kycUserContextId: router?.query?.userContextId as string },
        {
          onSuccess: (data: { data: { id: any } }) => {
            clearInterval(interval);
            if (data?.data?.id) {
              router.pushConnect(`/checkout/pay/${data?.data?.id}`);
            }
          },
          onError: () => {
            clearInterval(interval);
          },
        }
      );
    }, 3000);
  }
};
```

**Depois:**
```tsx
const [poolStatus, setPoolStatus] = useState(false);
const { mutate: getStatus } = useGetOrderByKyc();

useInterval(
  () => {
    getStatus(
      { kycUserContextId: router?.query?.userContextId as string },
      {
        onSuccess: (data: { data: { id: string } }) => {
          if (data?.data?.id) {
            setPoolStatus(false);
            router.pushConnect(`/checkout/pay/${data?.data?.id}`);
          }
        },
      }
    );
  },
  poolStatus ? 3000 : null
);
```

**Nota:** O `useInterval` do `react-use` aceita `null` como delay para pausar o intervalo. Isso elimina a necessidade de checar `poolStatus` manualmente e remove o `setInterval` interno duplicado.

- [ ] Concluído

---

## C. Redirect KYC — Reestruturação

### C.3.1 — Criar `useKYCRedirect.ts`

**Novo arquivo:** `src/modules/auth/hooks/useKYCRedirect.ts`

```tsx
import { useCallback } from 'react';

import { PixwayAppRoutes } from '../../shared/enums/PixwayAppRoutes';
import { useRouterConnect } from '../../shared/hooks/useRouterConnect';

interface KYCRedirectOptions {
  skipWallet?: boolean;
  screenConfig?: {
    skipConfirmation?: boolean;
    postKycUrl?: string;
  };
  storagePostKycUrl?: string;
}

/**
 * Prioridade unificada de redirect pós-KYC:
 * 1. screenConfig.postKycUrl (tenant config)
 * 2. storageData.postKycUrl (session storage)
 * 3. callbackPath (query param)
 * 4. callbackUrl (query param)
 * 5. CONNECT_EXTERNAL_WALLET (se !skipWallet)
 * 6. '/' (fallback)
 */
export const useKYCRedirect = (options: KYCRedirectOptions = {}) => {
  const router = useRouterConnect();

  const redirect = useCallback(() => {
    const { screenConfig, storagePostKycUrl, skipWallet } = options;

    if (typeof screenConfig?.postKycUrl === 'string') {
      router.pushConnect(screenConfig.postKycUrl);
    } else if (typeof storagePostKycUrl === 'string') {
      router.pushConnect(storagePostKycUrl);
    } else if (router.query.callbackPath?.length) {
      router.pushConnect(router.query.callbackPath as string);
    } else if (router.query.callbackUrl?.length) {
      router.pushConnect(router.query.callbackUrl as string);
    } else if (!skipWallet) {
      router.pushConnect(PixwayAppRoutes.CONNECT_EXTERNAL_WALLET, router.query);
    } else {
      router.pushConnect('/');
    }
  }, [options, router]);

  return { redirect };
};
```

**Arquivos a atualizar após criar o hook:**

1. **`useKYCFormSubmit.ts`** (linhas 152-168) — Substituir a lógica de redirect no `onSuccess` (quando `screenConfig?.skipConfirmation`):
   ```tsx
   // Ao invés da lógica manual, usar:
   const { redirect: kycRedirect } = useKYCRedirect({
     skipWallet,
     screenConfig,
     storagePostKycUrl: undefined, // não aplicável aqui
   });
   // E no onSuccess, quando skipConfirmation:
   kycRedirect();
   ```

2. **`ConfirmationKycWithoutLayout.tsx`** (linhas 103-127) — Substituir a lógica do `onContinue`:
   ```tsx
   const { redirect: kycRedirect } = useKYCRedirect({
     skipWallet,
     screenConfig: (context?.data as any)?.data?.screenConfig,
     storagePostKycUrl: storageData?.postKycUrl,
   });

   const onContinue = () => {
     if ((context?.data as any)?.data?.postKyc === 'awaitProduct') {
       setPoolStatus(true);
       setAwaitProduct(true);
     } else {
       kycRedirect();
     }
   };
   ```

- [ ] Concluído

---

### C.3.2 — Criar `kycQueryParams.ts`

**Novo arquivo:** `src/modules/auth/utils/kycQueryParams.ts`

```tsx
export interface KYCQueryParams {
  contextSlug?: string;
  step?: string;
  userContextId?: string;
  callbackUrl?: string;
  callbackPath?: string;
  formState?: 'initial' | 'remain';
  sessionId?: string;
  skipWallet?: string;
}

export const parseKYCQuery = (
  query: Record<string, string | string[] | undefined>
): KYCQueryParams => ({
  contextSlug: typeof query.contextSlug === 'string' ? query.contextSlug : undefined,
  step: typeof query.step === 'string' ? query.step : undefined,
  userContextId: typeof query.userContextId === 'string' ? query.userContextId : undefined,
  callbackUrl: typeof query.callbackUrl === 'string' ? query.callbackUrl : undefined,
  callbackPath: typeof query.callbackPath === 'string' ? query.callbackPath : undefined,
  formState:
    query.formState === 'initial' || query.formState === 'remain'
      ? query.formState
      : undefined,
  sessionId: typeof query.sessionId === 'string' ? query.sessionId : undefined,
  skipWallet: typeof query.skipWallet === 'string' ? query.skipWallet : undefined,
});

export const buildKYCQuery = (
  params: KYCQueryParams
): Record<string, string> => {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      result[key] = value;
    }
  }
  return result;
};
```

**Nota:** Após criar este util, substituir gradativamente os `router.query.X as string` nos arquivos KYC por `parseKYCQuery(router.query).X`. Isso garante type safety e evita casts `as string`.

- [ ] Concluído

---

### C.3.3 — Substituir `window.location.pathname` por constantes

**Arquivo:** `src/modules/shared/providers/OnboardProvider.tsx`

| Linha | Antes | Depois |
|-------|-------|--------|
| 152 | `!window?.location?.pathname?.includes('/auth/verify-sign-up')` | `!pathname?.includes(PixwayAppRoutes.SIGN_UP_MAIL_CONFIRMATION)` |
| 159 | `!window?.location?.pathname?.includes('/auth/complete-kyc')` | `!pathname?.includes(PixwayAppRoutes.COMPLETE_KYC)` |
| 160 | `!window?.location?.pathname?.includes('/auth/verify-sign-up')` | `!pathname?.includes(PixwayAppRoutes.SIGN_UP_MAIL_CONFIRMATION)` |
| 161 | `!window?.location?.pathname?.includes('/auth/signUp')` | `!pathname?.includes(PixwayAppRoutes.SIGN_UP)` |
| 162 | `window?.location?.pathname !== PixwayAppRoutes.SIGN_IN` | `pathname !== PixwayAppRoutes.SIGN_IN` |
| 171 | `!window?.location?.pathname?.includes('/auth/complete-kyc')` | `!pathname?.includes(PixwayAppRoutes.COMPLETE_KYC)` |
| 172 | `!window?.location?.pathname?.includes('/auth/verify-sign-up')` | `!pathname?.includes(PixwayAppRoutes.SIGN_UP_MAIL_CONFIRMATION)` |
| 173-174 | `!window?.location?.pathname?.includes('/auth/completeSignup/connectExternalWallet')` | `!pathname?.includes(PixwayAppRoutes.CONNECT_EXTERNAL_WALLET)` |

**Nota:** O `pathname` já é obtido via `usePathname()` na linha 126 do mesmo arquivo. Basta usar essa variável em vez de `window?.location?.pathname`.

- [x] Concluído (aplicado em D.5)

---

### C.3.4 — Unificar ordem de prioridade dos redirects pós-auth

**Ordem canônica proposta:**

```
1. Email não verificado           → PixwayAppRoutes.VERIfY_WITH_CODE
2. KYC pendente + contexto ativo  → PixwayAppRoutes.COMPLETE_KYC
3. callbackPath (query param)     → usar diretamente
4. callbackUrl (query param)      → usar diretamente
5. postSigninURL (tema)           → usar diretamente
6. Sem wallet + !skipWallet       → PixwayAppRoutes.CONNECT_EXTERNAL_WALLET
7. redirectRoute / '/'            → fallback
```

**Arquivos a alinhar:**

#### SignInTemplate.tsx — `checkForCallbackUrl()` (linhas 106-120)

Atualmente: `verified → kycStatus → mainWallet → callbackPath → callbackUrl`
Ajustar para: `verified → kycStatus → callbackPath → callbackUrl → mainWallet`

**Antes:**
```tsx
const checkForCallbackUrl = () => {
  if (profile && !profile?.data.verified) {
    return appBaseUrl + PixwayAppRoutes.VERIfY_WITH_CODE;
  } else if (profile?.data?.kycStatus === KycStatus.Pending) {
    return appBaseUrl + routeToAttachKYC;
  } else if (!profile?.data?.mainWallet) {
    return routeToAttachWallet;
  } else if (router.query.callbackPath) {
    return router.query.callbackPath as string;
  } else if (callbackUrl) {
    const url = callbackUrl;
    setCallbackUrl('');
    return url;
  }
};
```

**Depois:**
```tsx
const checkForCallbackUrl = () => {
  if (profile && !profile?.data.verified) {
    return appBaseUrl + PixwayAppRoutes.VERIfY_WITH_CODE;
  } else if (profile?.data?.kycStatus === KycStatus.Pending) {
    return appBaseUrl + routeToAttachKYC;
  } else if (router.query.callbackPath) {
    return router.query.callbackPath as string;
  } else if (callbackUrl) {
    const url = callbackUrl;
    setCallbackUrl('');
    return url;
  } else if (!profile?.data?.mainWallet) {
    return routeToAttachWallet;
  }
};
```

#### useAuthRedirect.ts (linhas 21-47)

Atualmente: `callbackPath → callbackUrl → contextSlug → postSigninURL → wallet → redirectLink → redirectRoute`

Ajustar para mover `contextSlug` para antes (já é correto, pois é KYC) e manter consistência:

A ordem atual do `useAuthRedirect` já é razoável para o fluxo pós-signup/verify. A principal inconsistência é com `SignInTemplate`. Avaliar se faz sentido unificar ou manter separados por contexto de uso.

**Nota:** A mudança principal é no `SignInTemplate` — mover `callbackPath`/`callbackUrl` antes da checagem de `mainWallet`, para que query params tenham prioridade sobre o redirect de wallet.

- [x] Concluído (aplicado junto com fix de flash)

---

### C.3.5 — Corrigir double polling (já coberto em B.6.1)

Ver seção B.6 acima.

- [x] Concluído

---

## D. Fix Flash — Prevenção de Renderização Durante Redirects

Correções aplicadas para evitar que telas "pisquem" antes de redirects.

### D.1 — SignInTemplate.tsx

**Mudanças:**
- Adicionado `useRef(isRedirecting)` para evitar redirects duplicados
- Adicionado early-return com `<Spinner />` quando `session` existe (usuário já logado)
- Prioridade de redirect corrigida (C.3.4): `callbackPath`/`callbackUrl` agora têm prioridade sobre `mainWallet`

- [x] Concluído

### D.2 — SignInWithoutLayout.tsx

**Mudanças:**
- Adicionado `useRef(isRedirecting)` para evitar redirects duplicados
- Expandido o guard de `isProcessing` para incluir `session && profile && !isPasswordless` — mostra Spinner ao invés do form quando usuário já está logado

- [x] Concluído

### D.3 — CompleteKYCTemplateSDK.tsx

**Mudanças:**
- Condição de Spinner expandida: `isLoadingProfile || status !== 'authenticated'` — bloqueia render até confirmar que está autenticado
- Removido `console.log` do `useEffect` de callbackUrl (B.1.2)

- [x] Concluído

### D.4 — ConfirmationKycTemplateSDK.tsx

**Mudanças:**
- Condição de Spinner expandida: `isLoadingProfile || status !== 'authenticated'` — bloqueia render até confirmar que está autenticado

- [x] Concluído

### D.5 — OnboardProvider.tsx

**Mudanças:**
- Adicionado estado `isRedirecting` (`useState`) que é setado para `true` antes de cada `pushConnect` no guard principal
- Render bloqueado quando `isRedirecting` é `true` (mostra Spinner)
- `isRedirecting` resetado quando `path` inclui `/auth` (navegação completou)
- Substituídos todos os `window?.location?.pathname` por `pathname` (do `usePathname()`) com constantes `PixwayAppRoutes` (C.3.3)

- [x] Concluído

### D.6 — useProfile.ts

**Mudanças:**
- Removido redirect `onSuccess` que era redundante com `OnboardProvider` (ambos redirecionavam para `VERIfY_WITH_CODE` quando `!verified`)
- Removido import e uso de `useGetTenantInfoByHostname` (agora não utilizado)
- Mantido redirect `onError` (defensivo — token expirado → SIGN_IN)

- [x] Concluído

---

## Resumo de Novas Chaves i18n Necessárias

Adicionar aos arquivos de tradução (pt-BR e en):

```json
{
  "auth>confirmationKyc>accepted": "Aceito",
  "auth>confirmationKyc>notAccepted": "Não Aceito",
  "auth>confirmationKyc>stepOf": "{{current}} de {{total}}",
  "auth>confirmationKyc>docType>cpf": "CPF",
  "auth>confirmationKyc>docType>rg": "RG",
  "auth>confirmationKyc>docType>passport": "Passaporte",
  "companyAuth>signUp>iAccept": "Aceito os",
  "companyAuth>signUp>termsOfUse": "Termos de uso",
  "companyAuth>signUp>privacyPolicy": "Política de Privacidade"
}
```

**Nota:** Verificar se as chaves `companyAuth>signUp>iAccept`, `companyAuth>signUp>termsOfUse` e `companyAuth>signUp>privacyPolicy` já existem nos arquivos de tradução antes de criar.

---

## Novos Arquivos a Criar

| Arquivo | Seção |
|---------|-------|
| `src/modules/auth/hooks/useKYCRedirect.ts` | C.3.1 |
| `src/modules/auth/utils/kycQueryParams.ts` | C.3.2 |

---

## Ordem de Execução Recomendada

1. **B.6** — Double polling (bug fix, alta prioridade)
2. **A.1-A.5** — Strings hardcoded + criar chaves i18n
3. **B.1** — Remover console.logs
4. **B.2** — Console.error pt → en
5. **B.3-B.4** — Código duplicado em useKYCFormSubmit
6. **C.3.2** — Criar `kycQueryParams.ts`
7. **C.3.1** — Criar `useKYCRedirect.ts` e integrar
8. **C.3.3** — Substituir `window.location.pathname`
9. **C.3.4** — Unificar prioridade de redirects
10. **A.6-A.8** — Remover `as any` (maior esforço, menor urgência)
11. **B.5** — Remover eslint-disable (depende de A.6-A.8)
