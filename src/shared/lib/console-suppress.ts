if (process.env.NODE_ENV === 'production') {
  const noop = () => {}
  console.error = noop
  console.warn = noop
}
