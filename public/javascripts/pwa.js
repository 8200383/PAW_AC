const loadModule = (module) => {
    loadJavascript(`/javascripts/${module}.js`, document.body).then(() => {
        console.log(`[!] ${module} has been loaded`)
        onLoad()
    })
}

/**
 * Load Javascript file dynamiclly
 *
 * @param {string} url
 * @param {HTMLElement} location
 * @returns {Promise<*>}
 */
var loadJavascript = (url, location) => {
    //url is URL of external file, implementationCode is the code
    //to be called from the file, location is the location to
    //insert the <script> element

    return new Promise((resolve, reject) => {
        const scriptTag = document.createElement('script')
        scriptTag.type = 'text/javascript'
        scriptTag.src = url

        scriptTag.onload = resolve
        scriptTag.onerror = reject
        location.appendChild(scriptTag)
    })
}