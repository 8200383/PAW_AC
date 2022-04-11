class UpdateEmployee {
    constructor() {
    }

    handle (req,res,next){
        res.json({'status': 'updated'})
    }
}

module.exports = new UpdateEmployee().handle