import { viewerModel } from '@/entities/viewer';
import { useLocalStorage } from '@/shared/lib/hooks';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';

type LayoutView = 'gymmer' | 'master';

export const useSwitchView = () => {
  const navigate = useNavigate();

  const viewer = viewerModel.useViewer();
  const [view, setView] = useLocalStorage<LayoutView>('view_mode', 'gymmer');

  const switchView = useCallback(() => {
    setView(view === 'gymmer' ? 'master' : 'gymmer');

    navigate(
      view === 'gymmer'
        ? `/master/${viewer.master?.master_id}`
        : `/gymmer/${viewer.gymer?.gymer_id}`,
    );
  }, [view]);

  return [view, switchView] as const;
};
