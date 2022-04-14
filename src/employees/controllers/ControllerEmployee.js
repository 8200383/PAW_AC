class ControllerEmployee {
    constructor() {
    }

    CreateEmployee (req,res,next){
        res.json({'status': 'added'})
    }

    ViewEmployee (req,res,next){
        res.json({'status': 'viewed'})
    }

    DeleteEmployee (req,res,next){
        res.json({'status': 'deleted'})
    }

    UpdateEmployee (req,res,next){
        res.json({'status': 'updated'})
    }

    ViewAllEmployees (req,res,next){
        res.json({'status': 'viewed all'})
    }

}

module.exports = new ControllerEmployee()