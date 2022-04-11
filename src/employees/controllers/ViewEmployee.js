class ViewEmployee {
    constructor() {
    }

    handle (req,res,next){
        res.json({'status': 'viewed'})
    }
}

module.exports = new ViewEmployee().handle