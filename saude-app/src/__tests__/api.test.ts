import { api, ApiError } from '@/services/api';

describe('api (mock)', () => {
  it('lista hábitos', async () => {
    const habits = await api.getHabits();
    expect(habits.length).toBeGreaterThan(0);
    expect(habits[0]).toHaveProperty('goal');
  });

  it('incrementa o progresso', async () => {
    const before = (await api.getHabits()).find((h) => h.id === 'agua')!;
    const after = await api.updateHabitProgress('agua', 1);
    expect(after.progress).toBe(before.progress + 1);
  });

  it('não ultrapassa a meta nem fica negativo', async () => {
    const up = await api.updateHabitProgress('sono', 999);
    expect(up.progress).toBe(up.goal);
    const down = await api.updateHabitProgress('sono', -999);
    expect(down.progress).toBe(0);
  });

  it('hábito inexistente gera ApiError 404', async () => {
    await expect(api.updateHabitProgress('nao-existe', 1)).rejects.toMatchObject({
      status: 404,
    });
    await expect(api.updateHabitProgress('nao-existe', 1)).rejects.toBeInstanceOf(ApiError);
  });

  it('resumo da home reflete os hábitos concluídos', async () => {
    const home = await api.getHome();
    const habits = await api.getHabits();
    expect(home.totalToday).toBe(habits.length);
    expect(home.completedToday).toBe(habits.filter((h) => h.progress >= h.goal).length);
  });

  it('registra dispositivo e exclui conta sem erro', async () => {
    await expect(
      api.registerDevice({ token: 't', platform: 'android', appVersion: '1.0.0', locale: 'pt-BR' }),
    ).resolves.toBeUndefined();
    await expect(api.deleteAccount()).resolves.toBeUndefined();
  });
});

