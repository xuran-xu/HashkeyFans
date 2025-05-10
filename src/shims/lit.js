// Import what's available from lit
import * as lit from 'lit';

// Re-export everything
export * from 'lit';

// Add missing exports
export const html = lit.html || ((strings, ...values) => {
  return { strings, values, _$litType$: true };
}); 