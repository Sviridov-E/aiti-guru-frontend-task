export const validation = {
  required: () => ({
    value: true,
    message: 'Обязательное поле',
  }),
  maxLength: (value: number) => ({
    value,
    message: `Максимальная длина: ${value}`,
  }),
  minLength: (value: number) => ({
    value,
    message: `Минимальная длина: ${value}`,
  }),
}
