export function errorMessage(error: { error?: { detail?: string }; status?: number }): string {
  return error.error?.detail || (
    error.status === 404
      ? 'Payment not found. Demo data disappears after restart.'
      : 'Request failed. Check the file or try again.'
  );
}
