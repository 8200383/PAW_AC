function hideDropdowns(id) {
    if (document.getElementById(id).classList.contains('hidden')) {
        document.getElementById(id).classList.remove('hidden')
    } else {
        document.getElementById(id).classList.add('hidden')
    }
}