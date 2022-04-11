class ViewAllEmployees {
    constructor() {
    }

    handle (req,res,next){
        res.json({'status': 'viewed all'})
    }
}

module.exports = new ViewAllEmployees().handle