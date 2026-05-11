export const validateEmail = (email: string) =>
  !!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);

export const validateUsername = (username: string) =>
  username.match(/^[a-zA-Z0-9]+$/);
