if (navigator.userAgent.indexOf('Android') !== -1) {
  const manifestLink = document.head.querySelector('link[rel="manifest"]')
  if (manifestLink) {
    manifestLink.setAttribute('href', 'manifest.webmanifest?android=true')
  }
}
