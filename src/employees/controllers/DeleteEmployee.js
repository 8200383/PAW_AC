class DeleteEmployee {
    constructor() {
    }

    handle (req,res,next){
        res.json({'status': 'deleted'})
    }
}

module.exports = new DeleteEmployee().handle