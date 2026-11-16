/**
 * Utilitário para logs de tempo no fluxo de Auth.
 * Use para investigar demora em redirecionamentos.
 * Remover após conclusão da investigação.
 */
const PREFIX = '[AuthFlow]';

export const authFlowLog = (label: string, extra?: Record<string, unknown>) => {
  const start = performance.now();
  const timestamp = new Date().toISOString();
  console.log(`${PREFIX} [${timestamp}] ${label} - início`, { ...extra });

  return {
    end: (suffix = '') => {
      const elapsed = (performance.now() - start).toFixed(2);
      console.log(`${PREFIX} [${timestamp}] ${label}${suffix} - fim em ${elapsed}ms`, {
        elapsedMs: parseFloat(elapsed),
        ...extra,
      });
    },
    log: (message: string, data?: unknown) => {
      const elapsed = (performance.now() - start).toFixed(2);
      console.log(`${PREFIX} [${timestamp}] ${label} - ${message} (+${elapsed}ms)`, data ?? {});
    },
  };
};
