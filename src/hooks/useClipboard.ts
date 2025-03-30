import { useState, useCallback } from 'react';

interface ClipboardHook {
  copy: (text: string) => Promise<boolean>;
  copied: boolean;
  error: Error | null;
}

/**
 * 提供复制文本到剪贴板的功能
 */
const useClipboard = (): ClipboardHook => {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const copy = useCallback(async (text: string): Promise<boolean> => {
    try {
      if (!navigator?.clipboard) {
        throw new Error('Clipboard API not available');
      }

      await navigator.clipboard.writeText(text);
      setCopied(true);
      setError(null);
      return true;
    } catch (err) {
      setCopied(false);
      setError(err instanceof Error ? err : new Error('Failed to copy'));
      return false;
    }
  }, []);

  return { copy, copied, error };
};

export default useClipboard; 