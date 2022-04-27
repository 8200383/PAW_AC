const loadModule = (module) => {
    const script = document.getElementById(module)

    if (script) {
        script.remove()
    }

    loadJavascript(module, `/javascripts/${module}.js`, document.body).then(() => {
        console.log(`[!] ${module} has been loaded`)
        onLoad()
    })
}

const unloadJavascript = () => {
    const scripts = document.body.getElementsByTagName('script')
    scripts.forEach((script) => script.remove())
}

/**
 * Load Javascript file dynamiclly
 *
 * @param {string} id
 * @param {string} url
 * @param {HTMLElement} location
 * @returns {Promise<*>}
 */
var loadJavascript = (id, url, location) => {
    //url is URL of external file, implementationCode is the code
    //to be called from the file, location is the location to
    //insert the <script> element

    return new Promise((resolve, reject) => {
        const scriptTag = document.createElement('script')
        scriptTag.id = id
        scriptTag.type = 'text/javascript'
        scriptTag.src = url

        scriptTag.onload = resolve
        scriptTag.onerror = reject
        location.appendChild(scriptTag)
    })
}