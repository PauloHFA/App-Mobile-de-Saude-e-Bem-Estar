import { fireEvent, render, screen } from '@testing-library/react-native';

import { Button } from '@/components/ui/button';
import { ErrorState, ProgressBar } from '@/components/ui/primitives';
import { Character3D } from '@/components/health/Character3D';

jest.mock('@expo/vector-icons/Ionicons', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require('react');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Text } = require('react-native');
  return (props: any) => React.createElement(Text, props, props.name);
});

describe('Button', () => {
  it('chama onPress', async () => {
    const onPress = jest.fn();
    await render(<Button label="Entrar" onPress={onPress} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Entrar' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('nÃ£o dispara quando desabilitado', async () => {
    const onPress = jest.fn();
    await render(<Button label="Entrar" onPress={onPress} disabled />);
    await fireEvent.press(screen.getByRole('button', { name: 'Entrar' }));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('nÃ£o dispara enquanto carrega', async () => {
    const onPress = jest.fn();
    await render(<Button label="Entrar" onPress={onPress} loading />);
    await fireEvent.press(screen.getByRole('button', { name: 'Entrar' }));
    expect(onPress).not.toHaveBeenCalled();
  });
});

describe('ErrorState', () => {
  it('mostra a mensagem e permite tentar novamente', async () => {
    const onRetry = jest.fn();
    await render(<ErrorState message="Sem conexÃ£o" onRetry={onRetry} />);
    expect(screen.getByText('Sem conexÃ£o')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Tentar novamente' }));
    expect(onRetry).toHaveBeenCalled();
  });
});

describe('ProgressBar', () => {
  it('expõe o valor para leitores de tela', async () => {
    await render(<ProgressBar value={0.5} />);
    expect(screen.getByRole('progressbar').props.accessibilityValue.now).toBe(50);
  });
});

describe('Character3D', () => {
  it('renderiza o mascote 3D e responde ao clique', async () => {
    const onPress = jest.fn();
    await render(<Character3D gender="woman" mood="radiant" onPress={onPress} />);
    expect(screen.getByText('Energia Radiante!')).toBeTruthy();
    const btn = screen.getByRole('button', { name: /Companheiro 3D/i });
    await fireEvent.press(btn);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('exibe a fala correta para o humor calmo', async () => {
    await render(<Character3D gender="man" mood="calm" />);
    expect(screen.getByText('Mente Serena')).toBeTruthy();
  });
});
