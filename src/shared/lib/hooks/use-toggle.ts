import { useCallback, useState } from 'react';

type UseToggle = [isToggled: boolean, toggle: () => void];

export const useToggle = (defaultValue = false): UseToggle => {
  const [state, setState] = useState(defaultValue);

  const toggle = useCallback(() => setState((prevState) => !prevState), []);

  return [state, toggle];
};
