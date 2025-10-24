import { viewerModel } from '@/entities/viewer';
import { TaskGroupStatus } from '@/shared/api';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export default function Page() {
  const navigate = useNavigate();
  const { master, gymer } = viewerModel.useViewer();

  useEffect(() => {
    navigate(
      `${master?.master_id}/${gymer?.gymer_id}/${TaskGroupStatus.Planned}`,
    );
  }, []);

  return null;
}
