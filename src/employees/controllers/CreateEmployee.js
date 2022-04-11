class CreateEmployee {
    constructor() {
    }

    handle (req,res,next){
        res.json({'status': 'added'})
    }
}

module.exports = new CreateEmployee().handle