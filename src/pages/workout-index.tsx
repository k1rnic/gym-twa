import { viewerModel } from '@/entities/viewer';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export default function Page() {
  const navigate = useNavigate();
  const viewer = viewerModel.useViewer();

  useEffect(() => {
    navigate(`${viewer.master?.master_id}`);
  }, []);

  return null;
}
