const checkIsNavigationSupported = () => Boolean(document.startViewTransition)

const fetchPage = async (url) => {
    // vamos a cargar la pagina de destino
    // utilizando un fetch para obtener el HTML
    const response = await fetch(url) // /clean-code
    const text = await response.text()
    // quedarnos solo con el contenido del html dentro de la etiqueta body
    // usamos un regex para extrerlo
    const [, data] = text.match(/<body>([\s\S]*)<\/body>/i)
    return data
}
export const startViewTransition = () => {
    if (checkIsNavigationSupported) return

    window.navigation.addEventListener('navigate', (event) => {
        const toUrl = new URL(event.destination.url)
        // Es una pagina externa
        if (location.origin !== toUrl.origin) return

        // Si es una navegacion en el mismo dominio (origen)
        event.intercept({
            async handler () {
                const data = await fetchPage(toUrl.pathname)

                // Utilizar la api de Viwe Transition API
                document.startViewTransition(() => {
                    // el scroll hacia arriba del todo
                    document.body.innerHTML = data
                    document.documentElement.scrollTop = 0
                })
            }
        })
    })
}