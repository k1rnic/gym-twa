import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export default function Page() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`/workouts`);
  }, []);

  return null;
}
