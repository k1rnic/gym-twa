import { useTelegramData } from '@/shared/lib/telegram';

const App = () => {
  const { user } = useTelegramData();

  return <>Hello, {user?.firstName}</>;
};

export default App;
