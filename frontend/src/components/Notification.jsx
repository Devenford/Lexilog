const Notification = ({ notification }) => {
  if (notification === null) {
    return null
  }

  return (
    <p style={{ marginTop: 10, marginBottom: 10 }} severity={notification.type}>
      {notification.data}
    </p>
  )
}

export default Notification