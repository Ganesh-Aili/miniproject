router.delete(
    '/remove/:email',
    function(req, res) {
        if (req.params.email) {
            user.remove({ email: req.params.email }, function(error, result) {
                if (error) {
                    return res.json({
                        status: false,
                        message: 'Data is not found',
                        error: error
                    });
                }
                //ok
                return res.json({
                    status: true,
                    message: 'Success..',
                    result: result
                });
            });
        } else {
            //ok
            return res.json({
                status: false,
                message: 'Email is not found..'
            });
        }
    }
);