import { useNavigate } from 'react-router';

export const useNavigateBack = () => {
  const navigate = useNavigate();

  return () => {
    const idx = window.history.state?.idx;

    if (typeof idx === 'number' && idx > 0) {
      navigate(-1);
    } else {
      navigate('..', { relative: 'path' });
    }
  };
};
