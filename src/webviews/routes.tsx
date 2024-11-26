import { loadPresets, PresetView } from '@settings/preset-view';
import { TaskView } from '@task/view';
import App from 'app';
import { createMemoryRouter, useLocation, useNavigate } from 'react-router-dom';
import { View, Event } from '../model';
import { loadSettings, SettingsView } from '@settings/settings-view';
import * as React from 'react';

export const router = createMemoryRouter(
  [
    {
      path: '/',
      element: <App />,
      children: [
        {
          path: View.Welcome,
          element: <PresetView />,
        },
        {
          path: View.Task,
          element: <TaskView />,
        },
        // {
        //   path: View.History,
        //   element: <TaskView />,
        // },
        {
          path: View.Settings,
          loader: loadSettings,
          element: <SettingsView />,
        },
        {
          path: `${View.Preset}/:presetId?`,
          element: <PresetView />,
          loader: loadPresets,
        },
      ],
    },
  ],
  {
    initialEntries: ['/task'],
  }
);

export function useNavigationFromExtension() {
  const navigate = useNavigate();
  const routerLocation = useLocation();

  React.useEffect(() => {
    const handleMessage = (event: MessageEvent<Event>) => {
      if (event.data.type === 'open-view') {
        // temporary workaround to avoid navigating away to active tasks
        // handled in @task/view.tsx
        console.log(routerLocation.pathname);
        if (!routerLocation.pathname.startsWith('/task')) {
          navigate(event.data.view);
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [routerLocation]);
}
