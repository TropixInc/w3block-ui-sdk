/** Dispara o download de um Blob no navegador. */
export const downloadBlob = (blob: Blob, filename: string) => {
  if (typeof window === 'undefined') return;
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/** Nome de arquivo seguro: "xlsx" quando veio do backend, "csv" quando é o mock. */
export const withdrawFileName = (prefix: string, id: string, blob: Blob) => {
  const ext = blob.type.includes('csv') ? 'csv' : 'xlsx';
  return `${prefix}-${id.slice(0, 8)}.${ext}`;
};
