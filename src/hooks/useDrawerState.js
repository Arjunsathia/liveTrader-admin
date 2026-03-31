import { useCallback, useState } from 'react';

export function useDrawerState(initialValue = null) {
  const [value, setValue] = useState(initialValue);

  const open = useCallback((nextValue = true) => {
    setValue(nextValue);
  }, []);

  const close = useCallback(() => {
    setValue(null);
  }, []);

  return {
    value,
    isOpen: Boolean(value),
    open,
    close,
    setValue,
  };
}
